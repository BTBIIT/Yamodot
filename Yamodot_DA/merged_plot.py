from flask import Flask, jsonify, request
from flask_caching import Cache
import pymysql as pms
import pandas as pd
import plotly.graph_objs as go
import plotly.express as px
from plotly.utils import PlotlyJSONEncoder  # Plotly의 JSON 인코더 사용
from flask_cors import CORS
import json
from datetime import datetime
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report, confusion_matrix
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer  # 새로 추가된 항목



############################################### CORS ###############################################

# flask 셋팅 api 충돌나지 않도록
app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple', 'CACHE_DEFAULT_TIMEOUT': 0.1})
CORS(app)

############################################### DataBase ###############################################

# 작성자 : 박건혁
# 작성일 : 2024-09-24
# 목  적 : yamodot_db로 접속을 위한 함수 구현
# 메서드 : 라이브러리 pymysql (이하 pms)로 부터 pms.connect 기능을 사용하여 접속을 함
# 반환값 : 접속 정보를 가진 객체
def getDbConnection():
    connectionDb = pms.connect(
        host= '203.234.214.63',
        user='KH_PARK',
        password='1q2w3e4r!',
        db='yamodot_db',
        charset='utf8mb4',
        port= 1448
    )
    return connectionDb

# 작성자 : 박건혁
# 작성일 : 2024-09-24
# 목  적 : yamodot_db로부터 테이블을 불러와 라이브러리 pandas (이하 pd)를 사용해 dataframe 형태로 변형
# 매개변수 : query => query 문을 받아 연결 부터 정보를 불러오는 것 까지 실행
# 메서드 : 상단에 선언된 getDbConnection() 메서드를 사용해 연결 후 
#          cursor(입력문) 를 생성하고 execute(실행) 이후 모든 열 모든 행을 DataFrame으로 변환
# 반환값 : query문을 실행한 테이블을 변환한 df(DataFrame)
def getDataFromDb(query):
    connectionDb = getDbConnection()  # 연결 가져오기
    cursorDb = connectionDb.cursor()

    cursorDb.execute(query)

    columns = [col[0] for col in cursorDb.description]
    rows = cursorDb.fetchall()
    cursorDb.close()
    connectionDb.close()

    df = pd.DataFrame(rows, columns=columns)
    return df

# 데이터를 불러오는 query
scheduleQuery = "SELECT * FROM schedule"
battersQuery = "SELECT * FROM batters"
pitchersQuery = "SELECT * FROM pitchers"
defencesQuery = "SELECT * FROM defences"
colorsQuery = "SELECT * FROM team_color"
resultKboData = "SELECT * FROM analysis_kbo_data"  
analysisMergedData = "SELECT * FROM analysis_merged_data"  

# 데이터를 DataFrame 형태로 변환
teamData = getDataFromDb(scheduleQuery)
teamData['game_date'] = pd.to_datetime(teamData['game_date'])
battersData = getDataFromDb(battersQuery)
pitchersData = getDataFromDb(pitchersQuery)
defencesData = getDataFromDb(defencesQuery)
teamColor = getDataFromDb(colorsQuery)
resultData = getDataFromDb(resultKboData)  
resultData.rename(columns={'team': 'home_team'}, inplace=True)
analysisData = getDataFromDb(analysisMergedData)  

############################################### Filtering ###############################################

# 팀 데이터 승리 팀 열 추가
filteredData = teamData.dropna(subset=['home_score', 'away_score'])
filteredData = filteredData[(filteredData['home_score'] > filteredData['away_score']) |
                        (filteredData['away_score'] > filteredData['home_score'])].copy()
filteredData['winnerTeam'] = filteredData.apply(
    lambda row: row['home'] if row['home_score'] > row['away_score'] else row['away'], axis=1
)

# 구장별 팀간 Away 승
awayWinnerData = filteredData[filteredData['winnerTeam'] == filteredData['away']]
# 홈 일때 승
homeData = filteredData[filteredData['winnerTeam'] == filteredData['home']]

# 색상 데이터에서 필요한 열만 추출
filteredTeamColor = teamColor[['Team', 'Color1']]

# 타자 데이터에서 AVG가 0 인 값 제외
battersData = battersData[battersData['AVG'] != 0]
battersData['AVG'] = pd.to_numeric(battersData['AVG'])

# 투수 데이터에서 ERA가 0인 값 제외
pitchersData = pitchersData[pitchersData['ERA'] != 0]
pitchersData['ERA'] = pd.to_numeric(pitchersData['ERA'])

############################################### Method - Calculator ###############################################

# 작성자 : 박건혁
# 작성일 : 2024-10-05
# 목  적 : DB안의 schedule로 부터 오늘 일자의 경기를 호출
# 매개변수 : schedule DataFrame 객체인 teamData
# 메서드 : datetime 을 사용해서 오늘 일자의 datetime을 가져옴
# 반환값 : 오늘 일자의 away, home
# 오늘의 경기를 가져오는 함수
def getTodayMatches(teamData):
    todayDate = datetime.now().date()
    print(f"오늘 날짜: {todayDate}")

    # 날짜 형식이 datetime으로 인식되어 있는지 확인
    if not pd.api.types.is_datetime64_any_dtype(teamData['game_date']):
        teamData['game_date'] = pd.to_datetime(teamData['game_date'])  # datetime으로 변환

    todayMatches = teamData[teamData['game_date'].dt.date == todayDate]
    print(f"오늘 경기 수: {len(todayMatches)}")
    print(todayMatches[['game_date', 'away', 'home']])

    if todayMatches.empty:
        print("오늘 경기가 없습니다. 내일의 경기 정보를 가져옵니다.")
        
        # 내일 날짜
        tomorrowDate = todayDate + pd.Timedelta(days=1)

        # 내일의 경기만 가져옴
        tomorrowMatches = teamData[teamData['game_date'].dt.date == tomorrowDate]

        if not tomorrowMatches.empty:
            print(f"내일의 경기는 {len(tomorrowMatches)}개입니다.")
            return tomorrowMatches[['away', 'home', 'game_date']].values.tolist()
        else:
            print("내일 경기가 없습니다.")
            return []
    
    return todayMatches[['away', 'home', 'game_date']].values.tolist()

# 작성자 : 박건혁
# 작성일 : 2024-10-05
# 목  적 : 상대 전적, 득점 비교
# 매개변수 : team1, team2 (홈 어웨이 가 아님 둘의 순위를 확인하기 위한것이기 때문)
# 메서드 : team1, team2간의 home away 경기 둘다 화인하여 상대 전적 비교 -> 득점 비교
# 반환값 : 더 높은 순위
def calculateTiebreaker(team1, team2, yearData):
    matches = yearData[((yearData['home'] == team1) & (yearData['away'] == team2)) |
                       ((yearData['home'] == team2) & (yearData['away'] == team1))]

    team1Wins = sum(matches['winnerTeam'] == team1)
    team2Wins = sum(matches['winnerTeam'] == team2)

    if team1Wins > team2Wins:
        return team1
    elif team2Wins > team1Wins:
        return team2
    else:
        team1TotalScore = sum(matches[matches['home'] == team1]['home_score']) + sum(matches[matches['away'] == team1]['away_score'])
        team2TotalScore = sum(matches[matches['home'] == team2]['home_score']) + sum(matches[matches['away'] == team2]['away_score'])

        if team1TotalScore > team2TotalScore:
            return team1
        elif team2TotalScore > team1TotalScore:
            return team2
        else:
            return None

# 작성자 : 박건혁
# 작성일 : 2024-10-05
# 목  적 : 팀 순위 계산 함수
# 매개변수 : year, teamData
# 메서드 : 연도 필터링 -> 정규시즌 필터링 -> 팀별 승 집계 -> 팀별 패배 무승부 집계 -> 팀 통계 병합 
#          -> 데이터 정리 및 순위 정렬 ->  순위 계산 및 동일 승무패 처리 -? 동일한 승 무패를 가진 팀 상대 전적 및 득점 비교
#          -> 최종 순위리스트 반환
# 반환값 : 순위, 팀, 승, 무, 패
def getTeamRankingsByYear(year, teamData):
    yearData = teamData[teamData['game_date'].dt.year == year]
    yearData = yearData[yearData['season'] == '정규']

    yearData['winnerTeam'] = yearData.apply(
        lambda row: row['home'] if row['home_score'] > row['away_score'] 
        else (row['away'] if row['home_score'] < row['away_score'] else 'DRAW'), axis=1
    )
    teamWins = yearData[yearData['winnerTeam'] != 'DRAW']['winnerTeam'].value_counts().reset_index()
    teamWins.columns = ['Team', 'Wins']

    teamLosses = yearData.apply(
        lambda row: row['away'] if row['home_score'] > row['away_score']
        else (row['home'] if row['home_score'] < row['away_score'] else None), axis=1
    ).dropna().value_counts().reset_index()
    teamLosses.columns = ['Team', 'Losses']

    teamDraws = pd.concat([yearData[yearData['home_score'] == yearData['away_score']]['home'],
                           yearData[yearData['home_score'] == yearData['away_score']]['away']]).value_counts().reset_index()
    teamDraws.columns = ['Team', 'Draws']

    teamStats = pd.merge(teamWins, teamLosses, on='Team', how='outer').fillna(0)
    teamStats = pd.merge(teamStats, teamDraws, on='Team', how='outer').fillna(0)

    teamStats['Wins'] = teamStats['Wins'].astype(int)
    teamStats['Losses'] = teamStats['Losses'].astype(int)
    teamStats['Draws'] = teamStats['Draws'].astype(int)
    
    teamStats = teamStats.sort_values(by=['Wins', 'Draws', 'Losses'], ascending=[False, False, True])
    teamStats['Rank'] = range(1, len(teamStats) + 1)

    sameStatsTeams = teamStats[teamStats.duplicated(subset=['Wins', 'Draws', 'Losses'], keep=False)]

    for _, group in sameStatsTeams.groupby(['Wins', 'Draws', 'Losses']):
        for i in range(len(group) - 1):
            for j in range(i + 1, len(group)):
                team1 = group.iloc[i]['Team']
                team2 = group.iloc[j]['Team']
                betterTeam = calculateTiebreaker(team1, team2, yearData)

                if betterTeam == team2:
                    teamStats.loc[teamStats['Team'] == team2, 'Rank'] = teamStats.loc[teamStats['Team'] == team1, 'Rank']
                    teamStats.loc[teamStats['Team'] == team1, 'Rank'] = teamStats.loc[teamStats['Team'] == team1, 'Rank'] + 1

    return teamStats[['Rank', 'Team', 'Wins', 'Draws', 'Losses']]

# 작성자 : 박건혁
# 작성일 : 2024-09-24
# 목  적 : DB로부터 받아온 팀 데이터로부터 상대 승률을 계산해주는 함수를 구현
# 매개변수 : away : 입력 팀 1, home : 입력 팀 2
# 메서드 : away, home가 서로 겨뤄 => 이긴 수 / 토탈 매치 수 로 승률을 계산함
# 반환값 : team 열과 winrate로 이루어진 2행 2열의 DataFrame으로 반환
def calculateWinrate(away, home):
    relevantMatches = filteredData[((filteredData['home'] == away) & (filteredData['away'] == home)) |
                                   ((filteredData['home'] == home) & (filteredData['away'] == away))]
    totalMatches = len(relevantMatches)
    
    print(f"총 매치 수: {totalMatches}, {away} vs {home}")

    if totalMatches == 0:
        return jsonify({"error": "둘의 전적이 없습니다."}), 404

    awayWins = sum(relevantMatches['winnerTeam'] == away)
    homeWins = sum(relevantMatches['winnerTeam'] == home)

    awayWinrate = round(awayWins / totalMatches, 3)
    homeWinrate = round(homeWins / totalMatches, 3)

    return pd.DataFrame({'team': [away, home], 'winrate': [awayWinrate, homeWinrate]})

# 작성자 : 박건혁
# 작성일 : 2024-10-06
# 목  적 : 각 팀의 상위 3명 타자를 구하여 필요한 정보를 빼냄
# 매개변수 : away, home
# 메서드 : 필요한 열을 선택하고 그 열을 빼냄 -> 우리가 필요한건 수치, 이름, 팀이기때문에 그 외적으로 필요한 열만 추출(타석 = 필터링, year = 연도)
#          이후 필터링과 상위 타율을 구해 이름과 함께 추출
# 반환값 : 상위 3명의 타율과 이름
def calculateHigherBatter(matches):
    results = []
    for away, home, game_date in matches:  # game_date 추가
        selectedColumns = ['team_name', 'batters_name', 'PA', 'AVG', 'year']
        filteredBatter = battersData[selectedColumns]
        filteredBatter = filteredBatter[(filteredBatter['year'] == 2024) & 
                                        (filteredBatter['team_name'].isin([away, home]))]
        trimmedBatter = filteredBatter[filteredBatter['PA'] > filteredBatter['PA'].median()]
        homeHigherBatter = trimmedBatter[trimmedBatter['team_name'] == home].sort_values(by='AVG', ascending=False).head(3)
        awayHigherBatter = trimmedBatter[trimmedBatter['team_name'] == away].sort_values(by='AVG', ascending=False).head(3)
        result = {
            'awayTeam': away,
            'homeTeam': home,
            'awayTop3Batters': awayHigherBatter['batters_name'].values.tolist(),
            'homeTop3Batters': homeHigherBatter['batters_name'].values.tolist(),
            'awayAVG': awayHigherBatter['AVG'].values.tolist(),
            'homeAVG': homeHigherBatter['AVG'].values.tolist()
        }
        results.append(result)
    return results

# 작성자 : 박건혁
# 작성일 : 2024-10-06
# 목  적 : 각 팀의 상위 3명 투수를 구하여 필요한 정보를 빼냄
# 매개변수 : away, home
# 메서드 : 필요한 열을 선택하고 그 열을 빼냄 -> 우리가 필요한건 수치, 이름, 팀이기때문에 그 외적으로 필요한 열만 추출(이닝 = 필터링, year = 연도)
#          이후 필터링과 하위 자책순으로 구해서 이름과 함께 추출
# 반환값 : 상위 3명의 자책과 이름
def calculateHigherPitcher(matches):
    results = []
    for away, home, game_date in matches:  # game_date 추가
        selectedColumns = ['team_name', 'pitchers_name', 'ERA', 'IP', 'year']
        filteredPitcher = pitchersData[selectedColumns]
        filteredPitcher = filteredPitcher[(filteredPitcher['year'] == 2024) & 
                                          (filteredPitcher['team_name'].isin([away, home]))]
        trimmedPitcher = filteredPitcher[filteredPitcher['IP'] > filteredPitcher['IP'].median()]
        homeHigherPitcher = trimmedPitcher[trimmedPitcher['team_name'] == home].sort_values(by='ERA', ascending=True).head(3)
        awayHigherPitcher = trimmedPitcher[trimmedPitcher['team_name'] == away].sort_values(by='ERA', ascending=True).head(3)
        result = {
            'awayTeam': away,
            'homeTeam': home,
            'awayTop3Pitchers': awayHigherPitcher['pitchers_name'].values.tolist(),
            'homeTop3Pitchers': homeHigherPitcher['pitchers_name'].values.tolist(),
            'awayERA': awayHigherPitcher['ERA'].values.tolist(),
            'homeERA': homeHigherPitcher['ERA'].values.tolist()
        }
        results.append(result)
    return results

# 작성자 : 박건혁
# 작성일 : 2024-10-06
# 목  적 : 각 팀의 상위 3명 수비수를 구하여 필요한 정보를 빼냄
# 매개변수 : away, home
# 메서드 : 필요한 열을 선택하고 그 열을 빼냄 -> 우리가 필요한건 수치, 이름, 팀이기때문에 그 외적으로 필요한 열만 추출(게임수 = 필터링, year = 연도, PO = 풋아웃 )
#          이후 필터링과 상위 PO을 구해 이름과 함께 추출
# 반환값 : 상위 3명의 타율과 이름
def calculateHigherDefences(matches):
    results = []
    for away, home, game_date in matches:  # game_date 추가
        selectedColumns = ['team_name', 'defences_name', 'G', 'PO', 'year']
        filteredDefences = defencesData[selectedColumns]
        filteredDefences = filteredDefences[(filteredDefences['year'] == 2024) & 
                                            filteredDefences['team_name'].isin([away, home])]
        trimmedDefences = filteredDefences[filteredDefences['G'] > filteredDefences['G'].median()]
        homeHigherDefences = trimmedDefences[trimmedDefences['team_name'] == home].sort_values(by='PO', ascending=False).head(3)
        awayHigherDefences = trimmedDefences[trimmedDefences['team_name'] == away].sort_values(by='PO', ascending=False).head(3)
        result = {
            'awayTeam': away,
            'homeTeam': home,
            'awayTop3Defences': awayHigherDefences['defences_name'].values.tolist(),
            'homeTop3Defences': homeHigherDefences['defences_name'].values.tolist(),
            'awayPO': awayHigherDefences['PO'].values.tolist(),
            'homePO': homeHigherDefences['PO'].values.tolist()
        }
        results.append(result)
    return results

# 타자이름반환
def getBatterNames(result):
    awayBatters = result['awayTop3Batters']  # 이미 리스트이므로 .tolist()가 필요 없음
    homeBatters = result['homeTop3Batters']  # 이미 리스트이므로 .tolist()가 필요 없음
    
    return {
        'awayBatters': awayBatters,
        'homeBatters': homeBatters
    }

# 투수이름반환
def getPitcherNames(result):
    awayPitchers = result['awayTop3Pitchers']  # 이미 리스트이므로 .tolist()가 필요 없음
    homePitchers = result['homeTop3Pitchers']  # 이미 리스트이므로 .tolist()가 필요 없음

    return {
        'awayPitchers': awayPitchers,
        'homePitchers': homePitchers
    }

# 수비수 이름 반환
def getDefencesName(result):
    awayDefences = result['awayTop3Defences']  # 이미 리스트이므로 .tolist()가 필요 없음
    homeDefences = result['homeTop3Defences']  # 이미 리스트이므로 .tolist()가 필요 없음

    return {
        'awayDefences': awayDefences,
        'homeDefences': homeDefences
    }

# 작성자 : 박건혁
# 작성일 : 2024-09-24
# 목  적 : 각 팀의 타자로부터 AVG 타율의 평균을 구함
# 매개변수 : away : 입력 팀1, home : 입력 팀2 
# 메서드 : away, home 일치하는 선수들을 선택하여 AVG의 mean 값을 구함
# 반환값 : team 열과 averageAvg(평균타율)로 이루어진 2행 2열의 DataFrame으로 반환
def calculateAverage(away, home):
    filteredData = battersData[(battersData['team_name'] == away) | (battersData['team_name'] == home)]
    awayAvg = filteredData[filteredData['team_name'] == away]['AVG'].mean()
    homeAvg = filteredData[filteredData['team_name'] == home]['AVG'].mean()
  
    return pd.DataFrame({
        'team': [away, home],
        'averageAvg': [awayAvg, homeAvg]
    })


# 작성자 : 박건혁
# 작성일 : 2024-09-24
# 목  적 : 각 팀의 투수로부터 ERA 타율의 평균을 구함
# 매개변수 : away : 입력 팀1, home : 입력 팀2
# 메서드 : away, home와 일치하는 선수들의 선택하여 ERA의 mean 값을 구함
# 반환값 : team 열과 averageEra(자책평균)로 이루어진 2행 2열의 DataFrame으로 반환
def calculateEra(away, home):
    filteredData = pitchersData[(pitchersData['team_name'] == away) | (pitchersData['team_name'] == home)]
    awayEra = filteredData[filteredData['team_name'] == away]['ERA'].mean()
    homeEra = filteredData[filteredData['team_name'] == home]['ERA'].mean()
  
    return pd.DataFrame({
        'team': [away, home],
        'averageEra': [awayEra, homeEra]
    })

############################################### Method - Analysis (별도로 관리합니다)###############################################
# 팀명을 숫자로 변환하기 위한 매핑
teamMapping = {'한화': 0, '삼성': 1, 'KIA': 2, 'KT': 3, '두산': 4, 'SSG': 5, 'LG': 6, 'NC': 7, '롯데': 8, '키움': 9}
reverseTeamMapping = {v: k for k, v in teamMapping.items()}  # 숫자를 다시 팀명으로 변환
# 팀명을 숫자로 변환하기 위한 함수

def mapTeamNames(data, columnName, mapping):
    data[columnName] = data[columnName].map(mapping)
    return data

# 작성자 : 장희재
# 작성일 : 2024-10-02
# 목  적 : kbo data에서 회귀 분석 모델 학습을 위해 데이터 타입에 맞게 결측치 제거 및 전처리를 하여  독립변수 종속변수를 반환함
# 매개변수 : kbo data
# 메서드 : 결측치 등과 같은 부분을 제거하고, 분석이 수월하게 이뤄지기 위해 팀명사전 팀명복원 사전을 이용하여 팀명을 반환 및 사용
# 반환값 : kbo data에 대한 종속변수와 독립변수 (게임의 결과 = 종속변수, 그 외 나머지 독립변수)
def preprocessResultData(data):
    print(f"Result data initial shape: {data.shape}")

    # 팀명을 숫자로 변환
    data.loc[:, 'home_team'] = data['home_team'].map(teamMapping)
    data.loc[:, 'away_team'] = data['away_team'].map(teamMapping)

    # 날짜 또는 시간 열 제거 (datetime type 열 제거)
    for col in data.columns:
        if pd.api.types.is_datetime64_any_dtype(data[col]):
            print(f"Dropping column: {col} (datetime type)")
            data = data.drop(columns=[col])

    # 결측값 처리 (수치형 변수와 범주형 변수 구분)
    numericCols = data.select_dtypes(include=['float64', 'int64']).columns
    categoricalCols = data.select_dtypes(include=['object', 'category']).columns

    # 수치형 변수는 평균으로 결측값 대체
    data.loc[:, numericCols] = data[numericCols].fillna(data[numericCols].mean())

    # 범주형 변수는 최빈값으로 결측값 대체
    data.loc[:, categoricalCols] = data[categoricalCols].fillna(data[categoricalCols].mode().iloc[0])

    # 팀명이 결측값인 경우 최빈값으로 대체 (특히 home_team과 away_team)
    if data['home_team'].isnull().any():
        print("Filling missing home_team values with mode")
        data['home_team'] = data['home_team'].fillna(data['home_team'].mode()[0])

    if data['away_team'].isnull().any():
        print("Filling missing away_team values with mode")
        data['away_team'] = data['away_team'].fillna(data['away_team'].mode()[0])

    # 결측값 확인 (결측값이 있으면 에러 메시지 출력)
    if data.isnull().values.any():
        print("Warning: There are still missing values in the dataset.")
        print(data.isnull().sum())

    # 타겟 변수를 이산형으로 변환 (예: 0.5를 기준으로 0 또는 1로 변환)
    data['result'] = data['result'].apply(lambda x: 1 if x >= 0.5 else 0)

    # 독립변수와 종속변수 설정
    X = data.drop(columns=['result'])
    y = data['result']

    return X, y


# 작성자 : 장희재
# 작성일 : 2024-10-02
# 목  적 : 시계열 분석이 된 데이터에서 회귀 분석 모델 학습을 위해 데이터 타입에 맞게 결측치 제거 및 전처리를 하여  독립변수 종속변수를 반환함
# 매개변수 : 시계열 분석이 된 데이터
# 메서드 : 결측치 등과 같은 부분을 제거하고, 분석이 수월하게 이뤄지기 위해 팀명사전 팀명복원 사전을 이용하여 팀명을 반환 및 사용
# 반환값 : 시계열 분석을 진행된 데이터로 스케일링을 적용하여 모델에 적용할 수 있도록 전처리함
def preprocessData(data, numericStrategy='mean', scale=True):
    # 결측값 처리
    numericImputer = SimpleImputer(strategy=numericStrategy)
    categoricalImputer = SimpleImputer(strategy='most_frequent')

    numericCols = data.select_dtypes(include=['float64', 'int64']).columns
    categoricalCols = data.select_dtypes(include=['object', 'category']).columns

    data[numericCols] = numericImputer.fit_transform(data[numericCols])
    data[categoricalCols] = categoricalImputer.fit_transform(data[categoricalCols])

    # 날짜 또는 시간 열 제거
    dateCols = [col for col in data.columns if pd.api.types.is_datetime64_any_dtype(data[col])]
    data = data.drop(columns=dateCols)

    # 팀명을 숫자로 변환
    data = mapTeamNames(data, 'home_team', teamMapping)
    data = mapTeamNames(data, 'away_team', teamMapping)

    # 스케일링 적용
    if scale:
        numericFeatures = data.select_dtypes(include=['float64', 'int64']).columns
        scaler = StandardScaler()
        data[numericFeatures] = scaler.fit_transform(data[numericFeatures])

    return data



# 작성자 : 장희재
# 작성일 : 2024-10-02
# 목  적 : hometeam과 awayteam의 학습을 진행하는 모델을 만듬 preprocessResultData 된 kbo 데이터를 이용함
# 매개변수 : homeTeamNum(팀명사전을 통해 변경) awayTeamNum(팀명사전을 통해 변경)된 값
# 메서드 : 결측치 및 전처리는 상위 메서드에서 선언되었기 때문에 아래에서는 호출하여 사용함
#          팀명을 숫자로 변환시킨 후 전처리 메서드 호출 및 핛습데이터 설정 -> 종속과 독립변수에 대해서 추후 로지스틱 회귀모델 학습 및 정규화
# 반환값 : 모델과 학습데이터 테스트데이터, AUC, AUC score를 반환
def trainAndPredict(homeTeamNum, awayTeamNum):
    try:
        homeTeamName = reverseTeamMapping[homeTeamNum]
        awayTeamName = reverseTeamMapping[awayTeamNum]
        print(f"Training with teams: {homeTeamName} vs {awayTeamName}")

        filteredData = resultData[(resultData['home_team'] == homeTeamName) & (resultData['away_team'] == awayTeamName)]
        print(f"Filtered data shape: {filteredData.shape}")

        if filteredData.empty:
            raise ValueError(f"필터링된 데이터가 없습니다. 홈팀: {homeTeamName}, 원정팀: {awayTeamName}")

        XResult, yResult = preprocessData(filteredData), filteredData['result']
        yResult = yResult.apply(lambda x: 1 if x >= 0.5 else 0)

        if XResult.isnull().values.any() or yResult.isnull().values.any():
            raise ValueError("Training data contains NaN values.")

        XTrain, XTest, yTrain, yTest = train_test_split(XResult, yResult, test_size=0.3, random_state=42, stratify=yResult)

        model = LogisticRegression(penalty='l2', C=0.001, class_weight='balanced')
        model.fit(XTrain, yTrain)

        cvScores = cross_val_score(model, XResult, yResult, cv=5)
        print(f"Cross-validation scores: {cvScores}")
        print(f"Mean CV accuracy: {cvScores.mean():.4f}")

        yPred = model.predict(XTest)
        auc = roc_auc_score(yTest, model.predict_proba(XTest)[:, 1]) if len(set(yTest)) > 1 else None
        accuracy = accuracy_score(yTest, yPred)

        print(f"Accuracy: {accuracy}, AUC: {auc if auc is not None else 'N/A'}")
        print(f"F1 Score: {classification_report(yTest, yPred, output_dict=True)['weighted avg']['f1-score']}")
        print(f"Precision: {classification_report(yTest, yPred, output_dict=True)['weighted avg']['precision']}")
        print(f"Recall: {classification_report(yTest, yPred, output_dict=True)['weighted avg']['recall']}")

        return model, accuracy, auc, yPred, yTest, XResult

    except Exception as e:
        print(f"Error during trainAndPredict: {e}")
        raise e


# 작성자 : 장희재
# 작성일 : 2024-10-02
# 목  적 : 시계열 분석이 끝난 데이터로 부터 전처리 및 예측 진행 (모델은 trainAndPredict(homeTeamNum, awayTeamNum)로부터 학습된 모델을 전달받아서 사용)
# 매개변수 : homeTeamNum(팀명사전을 통해 변경) awayTeamNum(팀명사전을 통해 변경)된 값
# 메서드 : 결측치 및 전처리는 상위 메서드에서 선언되었기 때문에 아래에서는 호출하여 사용함
#          팀명을 숫자로 변환시킨 후 전처리 메서드 호출 및 모델을 통한 승률 예측
# 반환값 : 각 팀의 평균 승률을 반환
def predictNewData(model, newData, trainData):
    try:
        expectedFeatures = model.feature_names_in_

        for feature in expectedFeatures:
            if feature not in newData.columns:
                featureMean = trainData[feature].mean()
                newData[feature] = featureMean

        newData = newData[expectedFeatures]
        newData = preprocessData(newData, scale=False)

        prediction = model.predict(newData)
        probabilities = model.predict_proba(newData)

        homeTeamProb = probabilities[:, 0].mean()
        awayTeamProb = probabilities[:, 1].mean()

        print(f"New prediction: {prediction}")
        print(f"New probabilities: {probabilities}")

        return prediction, [homeTeamProb, awayTeamProb]

    except Exception as e:
        print(f"Error during predictNewData: {e}")
        raise e

# 수정 중    
def displayFeatureImportance(model, XTrain):
    # 로지스틱 회귀에서 각 특성의 회귀 계수
    feature_names = XTrain.columns  # XTrain은 학습에 사용된 데이터의 특성들
    coefficients = model.coef_[0]   # 로지스틱 회귀에서 각 특성의 계수

    # 계수를 특성 이름과 함께 출력
    feature_importance = pd.DataFrame({
        'Feature': feature_names,
        'Importance': coefficients
    })

    # 계수를 절대값 기준으로 정렬
    feature_importance = feature_importance.sort_values(by='Importance', key=abs, ascending=False)
    
    print("Feature importance:")
    print(feature_importance)

    return feature_importance
############################################### Method - Visualization ###############################################

# 작성자 : 박건혁
# 작성일 : 2024-09-27
# 목  적 : 홈일때 승리 수를 파이 그래프로 보기 위해 팀 컬러를 적용해서 나타냄
# 매개변수 : 홈팀 데이터(homeData), 팀 색상데이터(teamColors)
# 메서드 : 홈팀 데이터를 ground와 WINNER_TEAM으로 그룹화를 진행 후 Wins를 counting 함
#          이후 이 데이터를 plotly library를 이용하여 piegraph를 그리고 내보냄
# 반환값 : plotly를 통해 계산된 팀별(홈) 승리 plot
def drawPieChart(homeData, teamColors):
    homeWinsCount = homeData['winnerTeam'].value_counts().reset_index()
    homeWinsCount.columns = ['Team', 'Wins']
    mergedData = pd.merge(homeWinsCount, teamColors, on='Team', how='left')
    
    fig = px.pie(
        mergedData, 
        names='Team', 
        values='Wins', 
        color='Team',
        color_discrete_map={team: color for team, color in zip(mergedData['Team'], mergedData['Color1'])},  
        hole=0.35
    )
    fig.update_traces(textposition='inside', 
                      texttemplate='%{label}  %{percent}',
                      insidetextorientation='radial', 
                      textfont=dict(size=13, color='white' , family='NanumSquareRound'),
                      hoverinfo = 'label+value+percent',
                      hovertemplate = 'Win : %{value}')

    config = {'displaylogo': False}
    return {
       'data': fig.to_json(),
       'config': config
    }

# 작성자 : 박건혁
# 작성일 : 2024-09-26
# 목  적 : 원정경기 구장별 Winner Team을 확인하기 위해
# 메서드 : 데이터를 ground와 WINNER_TEAM으로 그룹화를 진행 후 Wins를 Counting함
#         이후 이 데이터를 plotly library를 이용하여 sunburstplot을 그리고 내보냄
# 반환값 : plotly를 통해 계산된 구장별 승리 plot
def drawYearlyData(data):
    result = data.groupby(['ground', 'winnerTeam']).size().reset_index(name='Wins')
    groundColor = [
        '#8DD3C7', '#FFFFB3', '#BEBADA', '#FB8072', '#80B1D3', '#FDB462',
        '#B3DE69', '#FCCDE5', '#D9D9D9', '#BC80BD', '#CCEBC5', '#FFED6F', '#E41A1C'
    ]
    
    fig = px.sunburst(result, 
                      path=['ground', 'winnerTeam'], 
                      values='Wins',
                      color='ground',
                      color_discrete_sequence=groundColor)
    
    fig.update_traces(texttemplate = '%{label}',
                      textfont=dict(size=13 , family='NanumSquareRound'),
                      hoverinfo = 'label+value',
                      hovertemplate = '%{label}: %{value}')
    
    config = {'displaylogo': False}
    return {
       'data': fig.to_json(),
       'config': config
    }


# 작성자 : 박건혁
# 작성일 : 2024-09-24
# 목  적 : 상단에서 계산된 승률과 타율을 바탕으로 horizontal Bar Graph 를 시각화
# 매개변수 : team : 입력 팀, value : 승률 or 타율, teamColor : 팀 색상(hexcode 값),
#           direction : 그래프의 방향(away과 home의 그래프의 방향이 다름), metricName : 팀 명
# 메서드 : 매개변수로부터 입력받아 라이브러리 plotly를 사용해 그래프의 방향 나타낼 수치 등을 html 형태로 반환
def drawBarChart(team, value, teamColor, direction, metricName):
    if direction == "left":
        x = [-value]
        xRange = [-max(value, 1), 0]
    else:
        x = [value]
        xRange = [0, max(value, 1)]

    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=x,
        y=[team],
        orientation='h',
        marker=dict(color=teamColor),
        hovertemplate=f'<b>{team}</b><br>{metricName}: {abs(value):.3f}<extra></extra>'
    ))
    fig.update_layout(
        xaxis=dict(
            range=xRange,
            dtick=0.5,
            showticklabels=False,
            showgrid = False
        ),
        yaxis=dict(showticklabels=False, showgrid = False),
        title='',
        showlegend=False,
        width=400,
        height=200,
        hovermode = False
    )

    config = {
        "displayModeBar": False
    }
    return fig.to_json(), config

# 작성자 : 박건혁
# 작성일 : 2024-09-24
# 목  적 : 위에서 계산된 자책평균을 바탕으로 horizontal Bar Graph 를 시각화
# 매개변수 : team : 입력 팀, value : 평균 자책, teamColor : 팀 색상(hexcode 값)
#           direction : 그래프의 방향(away과 home의 그래프의 방향이 다름), metricName : 팀 명
# 메서드 : 매개변수로부터 입력받아 라이브러리 plotly를 사용해 그래프의 방향 나타낼 수치 등을 html 형태로 반환
def drawBarChartEra(team, value, teamColor, direction, metricName):
    if direction == "left":
        x = [-value]
        xRange = [-max(value, 10), 0]
    else:
        x = [value]
        xRange = [0, max(value, 10)]

    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=x,
        y=[team],
        orientation='h',
        marker=dict(color=teamColor),
        hovertemplate=f'<b>{team}</b><br>{metricName}: {abs(value):.3f}<extra></extra>'
    ))

    fig.update_layout(
        xaxis=dict(
            range=xRange,
            dtick=0.5,
            showticklabels=False,
            showgrid = False
        ),
        yaxis=dict(showticklabels=False, showgrid = False),
        title='',
        showlegend=False,
        width=400,
        height=200,
        hovermode = False
    )

    config = {
        "displayModeBar": False
    }
    return fig.to_json(), config

# 타자 그리는 함수
def generatePlotlyChart(df):
    # 딕셔너리 구조를 출력해 확인
    print(df)

    fig = go.Figure()
    # teamColor 데이터를 사용하는 부분은 여전히 남겨두었습니다.
    filteredTeamColor = teamColor[['Team', 'Color1']]
    
    # 딕셔너리에서 'awayTop3Batters', 'awayAVG', 'homeAVG' 데이터를 추출해 사용
    fig.add_trace(go.Bar(
        y=df['awayTop3Batters'],  # away 팀 타자 이름
        x=df['awayAVG'],  # away 팀 타율
        name="Away Team AVG",
        orientation='h',
        marker=dict(color='red'),
        hovertemplate='%{x}<extra></extra>'
    ))

    fig.add_trace(go.Bar(
        y=df['awayTop3Batters'],  # 동일한 타자 이름 사용 (x축 데이터만 변경)
        x=df['homeAVG'],  # home 팀 타율
        name="Home Team AVG",
        orientation='h',
        marker=dict(color='gray'),
        hovertemplate='%{x}<extra></extra>'
    ))

    fig.update_layout(
        barmode='stack',
        xaxis=dict(showticklabels=True),
        yaxis=dict(showticklabels=False),
        showlegend=True,
        plot_bgcolor='white',
        width=800,
        height=400
    )

    chartJson = json.dumps(fig, cls=PlotlyJSONEncoder)
    return chartJson

# 투수 그리는 함수
def generatePlotlyPitcher(df):
    fig = go.Figure()
    filteredTeamColor = teamColor[['Team', 'Color1']]
    
    fig.add_trace(go.Bar(
        y = df['awayTop3Pitchers'],
        x = df['awayERA'],
        name = 'Away Team ERA',
        orientation='h',
        marker=dict(color='red'),
        hovertemplate='%{x}<extra></extra>'
    ))

    fig.add_trace(go.Bar(
        y = df['awayTop3Pitchers'],
        x = df['homeERA'],
        name = 'Home Team ERA',
        orientation='h',
        marker=dict(color = 'gray'),
        hovertemplate='%{x}<extra></extra>'
    ))

    fig.update_layout(
        barmode = 'stack',
        xaxis=dict(showticklabels=True),
        yaxis=dict(showticklabels=False),
        showlegend=True,
        plot_bgcolor='white',
        width=800,
        height=400
    )
    chartJson = json.dumps(fig, cls = PlotlyJSONEncoder)
    return chartJson

# 수비수 그리는 함수 
def generatePlotlyDefences(df):
    fig = go.Figure()
    filteredTeamColor = teamColor[['Team', 'Color1']]
    
    fig.add_trace(go.Bar(
        y = df['awayTop3Defences'],
        x = df['awayPO'],
        name = 'Away Team PO',
        orientation='h',
        marker=dict(color='red'),
        hovertemplate='%{x}<extra></extra>'
    ))

    fig.add_trace(go.Bar(
        y = df['awayTop3Defences'],
        x = df['homePO'],
        name = 'Home Team PO',
        orientation='h',
        marker=dict(color='gray'),
        hovertemplate='%{x}<extra></extra>'
    ))

    fig.update_layout(
        barmode = 'stack',
        xaxis=dict(showticklabels=True),
        yaxis=dict(showticklabels=False),
        showlegend=True,
        plot_bgcolor='white',
        width=800,
        height=400
    )
    chartJson = json.dumps(fig, cls = PlotlyJSONEncoder)
    return chartJson

############################################### API Return ###############################################

# app.route 부분이 받아오는 부분 
# ex : /api/data-by-year 이런 식이면 받는 쪽에서는 아래와 같은 경로로 받아올 수 있음
#           http://localhost:5000/api/data-by-year?year=${year} 
# 실제 사용 "http://localhost:5000/api/data-by-year?year=2024"
# 작성자 : 박건혁 
# 작성일 : 2024-09-26
# 목  적 : 입력한 연도로부터 홈 포함 pie plot과 홈 제외 sunburst plot을 그림
# 메서드 : drawPieChart 함수와 drawFilteredYearly를 바탕으로 두 가지 버전의 sunburst plot을 그리고
#          api를 통해 json 형태로 데이터를 내보냄
# 반환값 : drawPieChart(homeYearData, filteredTeamColor)의 결과와 drawFilteredYearlyData(yearData)의 결과를 담은 json파일
@app.route('/api/data-by-year', methods=['GET'])
@cache.cached(timeout=1)
def dataByYearAll():
    year = request.args.get('year', type=int)
    if not year:
        return jsonify({'error': '연도가 입력되지 않았습니다.'}), 400
    
    homeYearData = homeData[homeData['game_date'].dt.year == year]
    awayYearData = awayWinnerData[awayWinnerData['game_date'].dt.year == year]
    
    if awayYearData.empty or homeYearData.empty:
        return jsonify({'error': '해당 데이터가 없습니다.'}), 404

    return jsonify({
        'homeWin': drawPieChart(homeYearData, filteredTeamColor),
        'filtered': drawYearlyData(awayYearData)
    })

# 작성자 : 박건혁
# 작성일 : 2024-10-06
# 목  적 : 팀 순위, 팀 이름 승 무패 반환
# 매서드 : 오늘의 경기 팀 순위 가져오기 -> 오늘 날짜를 teamData(schedule에 등록된 일정)를 받아ㅗ고 -> 비어져 있으면 오늘 경기가 없습니다 반환
# 반환값 : result에 팀명 순위 승 무 패 기록을 저장한 json
@app.route('/api/today-matches', methods=['GET'])
@cache.cached(timeout=0.1)
# winnerTeam 열이 있는지 확인하고 없으면 생성
def getTodayMatchRankings():
    todayMatches = getTodayMatches(teamData)
    if not todayMatches:
        return jsonify({"error": "오늘 경기가 없습니다."}), 404

    # 올해의 경기를 필터링 (오늘 날짜 기준으로 연도를 필터링)
    currentYear = datetime.now().year
    filteredTeamData = teamData[(teamData["etc"] == "-") & (teamData['game_date'].dt.year == currentYear)]

    # 현재 yearData로부터 winnerTeam 계산
    filteredTeamData['winnerTeam'] = filteredTeamData.apply(
        lambda row: row['home'] if row['home_score'] > row['away_score']
        else (row['away'] if row['home_score'] < row['away_score'] else 'DRAW'), axis=1
    )
    
    results = []
    for match in todayMatches:
        awayTeam = match[0]
        homeTeam = match[1]
        matchDate = match[2]

        # 오늘의 경기 데이터 필터링 (연도와 팀을 기준으로 필터링)
        relevantMatches = filteredTeamData[((filteredTeamData['away'] == awayTeam) & (filteredTeamData['home'] == homeTeam)) |
                                           ((filteredTeamData['away'] == homeTeam) & (filteredTeamData['home'] == awayTeam))]
        print(relevantMatches)
        # winnerTeam을 기준으로 승리, 패배, 무승부 계산
        awayWin = sum((relevantMatches['winnerTeam'] == awayTeam))
        homeWin = sum((relevantMatches['winnerTeam'] == homeTeam))
        draws = sum(relevantMatches['winnerTeam'] == 'DRAW')
        awayLose = homeWin  # away 패배는 home 승리와 같음
        homeLose = awayWin  # home 패배는 away 승리와 같음
        print("###",awayWin)
        print("###",awayLose)
        print("###",homeWin)
        print("###",homeLose)
        # 팀 순위 계산
        awayRank = getTeamRankingsByYear(matchDate.year, teamData).loc[lambda df: df['Team'] == awayTeam].to_dict(orient='records')
        homeRank = getTeamRankingsByYear(matchDate.year, teamData).loc[lambda df: df['Team'] == homeTeam].to_dict(orient='records')

        results.append({
            "awayTeam": awayTeam,
            "homeTeam": homeTeam,
            "awayRank": awayRank[0] if awayRank else None,
            "homeRank": homeRank[0] if homeRank else None,
            "headToHead": {
                "awayWin": awayWin,
                "homeWin": homeWin,
                "draw": draws,
                "awayLose": awayLose,
                "homeLose": homeLose
            }
        })
    
    responseJson = json.dumps(results, ensure_ascii=False)
    return app.response_class(response=responseJson, status=200, mimetype='application/json')


# 작성자 : 박건혁
# 작성일 : 2024-09-24
# 목  적 : 승률을 flask를 통해 output으로 내보냄
# 메서드 : localhost/api/winrate?away=[팀명1]&home=[팀명2]형태로 GET방식을 통해 주소 값으로 결과를 도출하여 전송
# 반환값 : away의 승률 chart, home의 승률 chart, away의 config(로고 및 캡쳐기능 삭제), home의 config, 비교하는 승률 수치
@app.route('/api/winrate', methods=['GET'])
@cache.cached(timeout=0.1)
def getWinrate():
    away = request.args.get('away')
    home = request.args.get('home')

    if not away or not home:
        todayMatches = getTodayMatches(teamData)
        if not todayMatches:
            return jsonify({"error": "오늘 경기가 없습니다."}), 404

        results = []
        for match in todayMatches:  # 여러 경기 반복
            away, home, matchDate = match

            winrateData = calculateWinrate(away, home)
            if isinstance(winrateData, pd.DataFrame):
                awayWinrate = winrateData['winrate'].iloc[0]
                homeWinrate = winrateData['winrate'].iloc[1]

                awayColor = filteredTeamColor[filteredTeamColor['Team'] == away]['Color1'].values[0]
                homeColor = filteredTeamColor[filteredTeamColor['Team'] == home]['Color1'].values[0]

                # 각각의 경기에 대해 그래프 그리기
                awayChart, awayConfig = drawBarChart(away, awayWinrate, awayColor, "left", "승률")
                homeChart, homeConfig = drawBarChart(home, homeWinrate, homeColor, "right", "승률")

                # 각 경기의 결과를 리스트에 추가
                results.append({
                    'awayTeam': away,
                    'homeTeam': home,
                    'awayChart': awayChart,
                    'homeChart': homeChart,
                    'awayConfig': awayConfig,
                    'homeConfig': homeConfig,
                    'awayWinrate': awayWinrate,
                    'homeWinrate': homeWinrate
                })

        if not results:
            return jsonify({"error": "오늘 경기에 대한 결과가 없습니다."}), 404

        return jsonify(results)

    # away와 home이 특정된 경우 기존 로직 사용
    winrateData = calculateWinrate(away, home)
    if isinstance(winrateData, pd.DataFrame):
        awayWinrate = winrateData['winrate'].iloc[0]
        homeWinrate = winrateData['winrate'].iloc[1]

        awayColor = filteredTeamColor[filteredTeamColor['Team'] == away]['Color1'].values[0]
        homeColor = filteredTeamColor[filteredTeamColor['Team'] == home]['Color1'].values[0]

        awayChart, awayConfig = drawBarChart(away, awayWinrate, awayColor, "left", "승률")
        homeChart, homeConfig = drawBarChart(home, homeWinrate, homeColor, "right", "승률")

        return jsonify({
            'awayTeam': away,
            'homeTeam': home,
            'awayChart': awayChart,
            'homeChart': homeChart,
            'awayConfig': awayConfig,
            'homeConfig': homeConfig,
            'awayWinrate': awayWinrate,
            'homeWinrate': homeWinrate
        })

    return jsonify({"error": "데이터를 처리할 수 없습니다."}), 500


# 작성자 : 박건혁
# 작성일 : 2024-09-24
# 목  적 : 타자의 타율을 flask를 통해 output으로 내보냄
# 메서드 : localhost/api/average_avg?away=[팀명1]&home=[팀명2]형태로 GET방식을 통해 주소 값으로 결과를 도출하여 전송
# 반환값 : away의 타율 chart, home의 타율 chart, away의 config(로고 및 캡쳐기능 삭제), home의 config
@app.route('/api/average_avg', methods=['GET'])
@cache.cached(timeout=0.1)
def getAverageAvg():
    away = request.args.get('away')
    home = request.args.get('home')

    if not away or not home:
        todayMatches = getTodayMatches(teamData)
        if not todayMatches:
            return jsonify({"error": "오늘 경기가 없습니다."}), 404
    
        results = []
        for match in todayMatches:
            away, home, matchDate = match

            averageData = calculateAverage(away, home)
            if isinstance(averageData, pd.DataFrame):
                awayAvg = averageData['averageAvg'].iloc[0]
                homeAvg = averageData['averageAvg'].iloc[1]

                awayColor = filteredTeamColor[filteredTeamColor['Team'] == away]['Color1'].iloc[0]
                homeColor = filteredTeamColor[filteredTeamColor['Team'] == home]['Color1'].iloc[0]

                # 각각의 경기에 대해 차트 그리기
                awayChart, awayConfig = drawBarChart(away, awayAvg, awayColor, "left", "타율")
                homeChart, homeConfig = drawBarChart(home, homeAvg, homeColor, "right", "타율")

                results.append({
                    'awayTeam': away,
                    'homeTeam': home,
                    'awayChart': awayChart,
                    'homeChart': homeChart,
                    'awayConfig': awayConfig,
                    'homeConfig': homeConfig,
                    'awayAvg': awayAvg,
                    'homeAvg': homeAvg
                })
        if not results:
            return jsonify({"error": "오늘 경기에 대한 결과가 없습니다."}), 404

        return jsonify(results)

    averageData = calculateAverage(away, home)
    if isinstance(averageData, pd.DataFrame):
        awayAvg = averageData['averageAvg'].iloc[0]
        homeAvg = averageData['averageAvg'].iloc[1]

        awayColor = filteredTeamColor[filteredTeamColor['Team'] == away]['Color1'].values[0]
        homeColor = filteredTeamColor[filteredTeamColor['Team'] == home]['Color1'].values[0]

        awayChart, awayConfig = drawBarChart(away, awayAvg, awayColor, "left", "타율")
        homeChart, homeConfig = drawBarChart(home, homeAvg, homeColor, "right", "타율")

        return jsonify({
            'awayTeam': away,
            'homeTeam': home,
            'awayChart': awayChart,
            'homeChart': homeChart,
            'awayConfig': awayConfig,
            'homeConfig': homeConfig,
            'awayAvg': awayAvg,
            'homeAvg': homeAvg
        })

    return jsonify({"error": "데이터를 처리할 수 없습니다."}), 500


# 작성자 : 박건혁
# 작성일 : 2024-09-24
# 목  적 : 자책평균을 flask를 통해 output으로 내보냄
# 메서드 : localhost/api/average_era?away=[팀명1]&home=[팀명2]형태로 GET방식을 통해 주소 값으로 결과를 도출하여 전송
# 반환값 : away의 ERA chart, home의 ERA chart, away의 config(로고 및 캡쳐기능 삭제), home의 config, ERA 값
# 자책점 API
@app.route('/api/average_era', methods=['GET'])  # 여기에 @app.route 데코레이터 추가
@cache.cached(timeout=0.1)
def getAverageEra():
    away = request.args.get('away')
    home = request.args.get('home')

    if not away or not home:
        todayMatches = getTodayMatches(teamData)
        if not todayMatches:
            return jsonify({"error": "오늘 경기가 없습니다."}), 404
    
        results = []
        for match in todayMatches:
            away, home, matchDate = match

            eraData = calculateEra(away, home)
            if isinstance(eraData, pd.DataFrame):
                awayEra = eraData['averageEra'].iloc[0]
                homeEra = eraData['averageEra'].iloc[1]

                awayColor = filteredTeamColor[filteredTeamColor['Team'] == away]['Color1'].iloc[0]
                homeColor = filteredTeamColor[filteredTeamColor['Team'] == home]['Color1'].iloc[0]

                awayChart, awayConfig = drawBarChartEra(away, awayEra, awayColor, "left", "자책")
                homeChart, homeConfig = drawBarChartEra(home, homeEra, homeColor, "right", "자책")

                results.append({
                    'awayTeam': away,
                    'homeTeam': home,
                    'awayChart': awayChart,
                    'homeChart': homeChart,
                    'awayConfig': awayConfig,
                    'homeConfig': homeConfig,
                    'awayEra': awayEra,
                    'homeEra': homeEra
                })
        if not results:
            return jsonify({"error": "오늘 경기에 대한 결과가 없습니다."}), 404

        return jsonify(results)

    eraData = calculateEra(away, home)
    if isinstance(eraData, pd.DataFrame):
        awayEra = eraData['averageEra'].iloc[0]
        homeEra = eraData['averageEra'].iloc[1]

        awayColor = filteredTeamColor[filteredTeamColor['Team'] == away]['Color1'].values[0]
        homeColor = filteredTeamColor[filteredTeamColor['Team'] == home]['Color1'].values[0]

        awayChart, awayConfig = drawBarChartEra(away, awayEra, awayColor, "left", "자책")
        homeChart, homeConfig = drawBarChartEra(home, homeEra, homeColor, "right", "자책")

        return jsonify({
            'awayTeam': away,
            'homeTeam': home,
            'awayChart': awayChart,
            'homeChart': homeChart,
            'awayConfig': awayConfig,
            'homeConfig': homeConfig,
            'awayEra': awayEra,
            'homeEra': homeEra
        })

    return jsonify({"error": "데이터를 처리할 수 없습니다."}), 500


# 타자 상위 API
@app.route('/api/batter-comparisons', methods=['GET'])
@cache.cached()
def batterComparisons():
    todayMatches = getTodayMatches(teamData)
    if not todayMatches:
        return jsonify({"error": "오늘 경기가 없습니다."}), 404

    results = []
    batterResults = calculateHigherBatter(todayMatches)
    for result in batterResults:
        # 팀 색상 추가
        awayTeamColor = filteredTeamColor[filteredTeamColor['Team'] == result['awayTeam']]['Color1'].values[0]
        homeTeamColor = filteredTeamColor[filteredTeamColor['Team'] == result['homeTeam']]['Color1'].values[0]

        # 그래프 생성
        chartJson = generatePlotlyChart(result)
        batterNames = getBatterNames(result)

        results.append({
            'chart': chartJson,
            'names': batterNames,
            'awayTeamColor': awayTeamColor,  # away 팀 색상 추가
            'homeTeamColor': homeTeamColor   # home 팀 색상 추가
        })
    
    return jsonify(results)

# 투수 상위 API
@app.route('/api/pitcher-comparisons', methods=['GET'])
@cache.cached()
def pitcherComparisons():
    todayMatches = getTodayMatches(teamData)
    if not todayMatches:
        return jsonify({"error": "오늘 경기가 없습니다."}), 404

    results = []
    pitcherResults = calculateHigherPitcher(todayMatches)
    for result in pitcherResults:
        # 팀 색상 추가
        awayTeamColor = filteredTeamColor[filteredTeamColor['Team'] == result['awayTeam']]['Color1'].values[0]
        homeTeamColor = filteredTeamColor[filteredTeamColor['Team'] == result['homeTeam']]['Color1'].values[0]

        # 그래프 생성
        chartJson = generatePlotlyPitcher(result)
        pitcherNames = getPitcherNames(result)

        results.append({
            'chart': chartJson,
            'names': pitcherNames,
            'awayTeamColor': awayTeamColor,  # away 팀 색상 추가
            'homeTeamColor': homeTeamColor   # home 팀 색상 추가
        })

    return jsonify(results)

# 수비수 상위 API
@app.route('/api/defences-comparisons', methods=['GET'])
@cache.cached()
def defencesComparisons():
    todayMatches = getTodayMatches(teamData)
    if not todayMatches:
        return jsonify({"error": "오늘 경기가 없습니다."}), 404

    results = []
    defencesResults = calculateHigherDefences(todayMatches)
    for result in defencesResults:
        # 팀 색상 추가
        awayTeamColor = filteredTeamColor[filteredTeamColor['Team'] == result['awayTeam']]['Color1'].values[0]
        homeTeamColor = filteredTeamColor[filteredTeamColor['Team'] == result['homeTeam']]['Color1'].values[0]

        # 그래프 생성
        chartJson = generatePlotlyDefences(result)
        defencesName = getDefencesName(result)

        results.append({
            'chart': chartJson,
            'names': defencesName,
            'awayTeamColor': awayTeamColor,  # away 팀 색상 추가
            'homeTeamColor': homeTeamColor   # home 팀 색상 추가
        })

    return jsonify(results)



############################################### 분석 결과 API(중요해서 따로) ###############################################

# 작성자 : 박건혁
# 작성일 : 2024-10-09
# 목  적 : 오늘의 경기를 불러와서 자동으로 승률을 계산하여 승률, 팀을 프론트로 넘김 추후 프론트에서는 예측 수치를 통해 Plotly.js를 통해 시각화함
# 메서드 : POST 방식을 통함 (데이터의 보안을 위해) 오늘의 경기를 schedule table로부터불러와서 awayTeamName하고 homeTeamName을 뽑아냄
#         이후 팀명 사전을 통해 팀명을 변환 -> 
# 반환값 : 
# 승률 예측한 predict API
@app.route('/api/predict', methods=['POST'])
@cache.cached()
def predict():
    try:
        # 오늘의 경기 불러오기
        todayMatches = getTodayMatches(teamData)

        if len(todayMatches) == 0:
            return jsonify({'error': '오늘 경기가 없습니다.'}), 400

        results = []  # 모든 경기에 대한 결과를 저장할 리스트

        # 오늘의 모든 경기를 처리
        for match in todayMatches:
            awayTeamName = match[0]
            homeTeamName = match[1]
            gameDate = match[2].date()
            print(f"Today away team: {awayTeamName}, home team: {homeTeamName}")

            # 팀명을 숫자로 변환
            awayTeam = teamMapping.get(awayTeamName)
            homeTeam = teamMapping.get(homeTeamName)

            print(f"Mapping for teams: {awayTeam}, {homeTeam}")

            if awayTeam is None or homeTeam is None:
                print(f"Mapping not found for away team: {awayTeamName}, home team: {homeTeamName}")
                return jsonify({'error': f'팀 매핑에 실패했습니다: {awayTeamName}, {homeTeamName}'}), 400

            # 모델 학습 및 예측 수행
            model, accuracy, auc, yPred, yTest, XResult = trainAndPredict(homeTeam, awayTeam)
            newPrediction, newProbabilities = predictNewData(model, analysisData, XResult)

            # 경기 결과를 딕셔너리로 저장
            match_result = {
                'gameDate': gameDate,
                'home_team': homeTeamName,
                'away_team': awayTeamName,
                'accuracy': f"{accuracy:.4f}",
                'auc': f"{auc:.4f}" if auc is not None else 'N/A',
                'prediction': yPred.tolist(),
                'new_prediction': newPrediction.tolist(),
                'new_probabilities': newProbabilities,  # 두 팀의 승률
                'classification_report': classification_report(yTest, yPred, output_dict=True),
                'confusion_matrix': confusion_matrix(yTest, yPred).tolist()
                
            }

            results.append(match_result)

        # 모든 경기 결과 반환
        return jsonify(results)

    except ValueError as e:
        print(f"ValueError: {str(e)}")
        return jsonify({'error': str(e)}), 400  
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': '예상치 못한 오류가 발생했습니다.'}), 500

############ 박건혁 수정완###############################

@app.route('/api/update-predict', methods=['POST'])
@cache.cached()
def updatePredict():
    try:
        data = request.json
        print(f"Received Data: {data}")

        homeTeam = data.get('homeTeam')
        awayTeam = data.get('awayTeam')
        homeData = data.get('homeData', {})
        awayData = data.get('awayData', {})

        print(f"Received homeData: {homeData}")
        print(f"Received awayData: {awayData}")

        # 오늘의 경기 불러오기
        todayMatches = getTodayMatches(teamData)
        print(f"Today Matches: {todayMatches}")

        if len(todayMatches) == 0:
            return jsonify({'error': '오늘 경기가 없습니다.'}), 400

        # 사용자가 선택한 경기 찾기
        selectedMatch = next(
            (match for match in todayMatches if match[0] == awayTeam and match[1] == homeTeam),
            None
        )

        if not selectedMatch:
            return jsonify({'error': f'{awayTeam} vs {homeTeam} 경기를 찾을 수 없습니다.'}), 400

        print(f"Selected match teams: {awayTeam} vs {homeTeam}")

        # 팀명을 숫자로 변환 (teamMapping 사용)
        awayTeamNumber = teamMapping.get(awayTeam)
        homeTeamNumber = teamMapping.get(homeTeam)

        if awayTeamNumber is None or homeTeamNumber is None:
            return jsonify({'error': f'팀 매핑에 실패했습니다: {awayTeam}, {homeTeam}'}), 400

        # 분석 데이터에서 해당 팀의 데이터 필터링
        filteredAnalysisData = analysisData[
            (analysisData['away_team'] == awayTeam) &
            (analysisData['home_team'] == homeTeam)
        ].copy()  # 복사본 명시적 생성

        print(f"Filtered Analysis Data: {filteredAnalysisData}")

        if filteredAnalysisData.empty:
            return jsonify({'error': f'{awayTeam}와 {homeTeam}에 대한 데이터가 없습니다.'}), 400

        # 홈팀 및 원정팀 데이터 업데이트 (빈 문자열 또는 None인 경우 기본값 유지)
        updateColumns = {
            '홈런': 'homeData',
            '안타': 'homeData',
            '병살타': 'homeData',
            '삼진': 'homeData',
            '볼넷': 'homeData',
            '자책': 'homeData',
            'away_홈런': 'awayData',
            'away_안타': 'awayData',
            'away_병살타': 'awayData',
            'away_삼진': 'awayData',
            'away_볼넷': 'awayData',
            'away_자책': 'awayData'
        }

        for col, dataType in updateColumns.items():
            if dataType == 'homeData' and col in homeData:
                if homeData[col] not in [None, '']:  # None 또는 빈 문자열이 아닐 때만 업데이트
                    filteredAnalysisData.loc[filteredAnalysisData.index[0], col] = float(homeData[col])
                else:
                    print(f"Retaining original value for {col} in homeData")
            elif dataType == 'awayData' and col in awayData:
                if awayData[col] not in [None, '']:  # None 또는 빈 문자열이 아닐 때만 업데이트
                    filteredAnalysisData.loc[filteredAnalysisData.index[0], col] = float(awayData[col])
                else:
                    print(f"Retaining original value for {col} in awayData")

        # 모델 학습 및 예측
        model, accuracy, auc, yPred, yTest, XResult = trainAndPredict(homeTeamNumber, awayTeamNumber)
        newPrediction, newProbabilities = predictNewData(model, filteredAnalysisData, XResult)

        # 예측 결과 출력 로그
        print(f"Prediction for {homeTeam} vs {awayTeam}:")
        print(f"New Probabilities: {newProbabilities}")

        matchResult = {
            'home_team': homeTeam,
            'away_team': awayTeam,
            'accuracy': f"{accuracy:.4f}",
            'auc': f"{auc:.4f}" if auc is not None else 'N/A',
            'prediction': yPred.tolist(),
            'new_prediction': newPrediction.tolist(),
            'new_probabilities': newProbabilities,
            'classification_report': classification_report(yTest, yPred, output_dict=True),
            'confusion_matrix': confusion_matrix(yTest, yPred).tolist()
        }

        print(f"Match Result: {matchResult}")
        return jsonify([matchResult])

    except ValueError as e:
        print(f"ValueError: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': '서버 내부 오류가 발생했습니다.'}), 500

############################################### Distribution ###############################################

# 작성자 : 박건혁
# 작성일 : 2024-09-19
# 목  적 : flask 실행
# 메서드 : app.run은 Flask 웹 애플리케이션을 실행하는 메서드로 debug = True옵션은 디버깅을 추적하는 내용 (코드 내용 변경 시 서버 자동 재시작 등도 제공)
#         파이썬 파일이 직접 실행될 때 python 파일명.py 형태로 실행 시 debug 모드에서 flask 앱을 실행
# 반환값 : 위에 선언된 모든 메서드 및 변수로부터 app.route를 통해 return된 json형태의 데이터를 반환
if __name__ == '__main__':
    app.run(debug=True)
