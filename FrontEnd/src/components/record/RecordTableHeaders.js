// 헤더 데이터를 정의하는 상수들
const RecordheadersData = {
  pitcher: [
    { key: "pitchersName", value: "선수명" }, // 팀 기록 사용 x
    { key: "teamName", value: "팀명" },
    { key: "era", value: "ERA", arialabel: "평균자책점" },
    { key: "g", value: "G", arialabel: "경기" },
    { key: "w", value: "W", arialabel: "승" },
    { key: "l", value: "L", arialabel: "패" },
    { key: "sv", value: "SV", arialabel: "세이브" },
    { key: "hld", value: "HLD", arialabel: "홀드" },
    { key: "wpct", value: "WPCT", arialabel: "승률" },
    { key: "ip", value: "IP", arialabel: "이닝" },
    { key: "h", value: "H", arialabel: "피안타" },
    { key: "hr", value: "HR", arialabel: "홈런" },
    { key: "bb", value: "BB", arialabel: "볼넷" },
    { key: "hbp", value: "HBP", arialabel: "사구" },
    { key: "so", value: "SO", arialabel: "삼진" },
    { key: "r", value: "R", arialabel: "실점" },
    { key: "er", value: "ER", arialabel: "자책점" },
    { key: "whip", value: "WHIP", arialabel: "이닝당 출루허용률" },
    { key: "cg", value: "CG", arialabel: "완투" },
    { key: "sho", value: "SHO", arialabel: "완봉" },
    { key: "qs", value: "QS", arialabel: "퀄리티스타트" },
    { key: "bsv", value: "BSV", arialabel: "블론세이브" },
    { key: "tbf", value: "TBF", arialabel: "타자수" },
    { key: "np", value: "NP", arialabel: "투구수" },
    { key: "avg", value: "AVG", arialabel: "피안타율" },
    { key: "twoB", value: "2B", arialabel: "2루타" },
    { key: "threeB", value: "3B", arialabel: "3루타" },
    { key: "sac", value: "SAC", arialabel: "희생번트" },
    { key: "sf", value: "SF", arialabel: "희생플라이" },
    { key: "ibb", value: "IBB", arialabel: "고의4구" },
    { key: "wp", value: "WP", arialabel: "폭투" },
    { key: "bk", value: "BK", arialabel: "보크" },
  ],
  batter: [
    { key: "battersName", value: "선수명" }, // 팀 기록 사용 x
    { key: "teamName", value: "팀명" },
    { key: "avg", value: "AVG", arialabel: "타율" },
    { key: "g", value: "G", arialabel: "경기" },
    { key: "pa", value: "PA", arialabel: "타석" },
    { key: "ab", value: "AB", arialabel: "타수" },
    { key: "r", value: "R", arialabel: "득점" },
    { key: "h", value: "H", arialabel: "안타" },
    { key: "twoB", value: "2B", arialabel: "2루타" },
    { key: "threeB", value: "3B", arialabel: "3루타" },
    { key: "hr", value: "HR", arialabel: "홈런" },
    { key: "tb", value: "TB", arialabel: "루타" },
    { key: "rbi", value: "RBI", arialabel: "타점" },
    { key: "sac", value: "SAC", arialabel: "희생번트" },
    { key: "sf", value: "SF", arialabel: "희생플라이" },
    { key: "bb", value: "BB", arialabel: "볼넷" },
    { key: "ibb", value: "IBB", arialabel: "고의4구" },
    { key: "hbp", value: "HBP", arialabel: "사구" },
    { key: "so", value: "SO", arialabel: "삼진" },
    { key: "gdp", value: "GDP", arialabel: "병살타" },
    { key: "slg", value: "SLG", arialabel: "장타율" },
    { key: "obp", value: "OBP", arialabel: "출루율" },
    { key: "ops", value: "OPS", arialabel: "출루율+장타율" },
    { key: "mh", value: "MH", arialabel: "멀티히트" },
    { key: "risp", value: "RISP", arialabel: "득점권타율" },
    { key: "phba", value: "PHBA", arialabel: "대타타율" },
  ],
  defence: [
    { key: "defencesName", value: "선수명" }, // 팀 기록 사용 x
    { key: "teamName", value: "팀명" },
    { key: "pos", value: "POS", arialabel: "포지션" }, // 팀 기록 사용 x
    { key: "g", value: "G", arialabel: "경기" },
    { key: "gs", value: "GS", arialabel: "선발경기" }, // 팀 기록 사용 x
    { key: "ip", value: "IP", arialabel: "수비이닝" }, // 팀 기록 사용 x
    { key: "e", value: "E", arialabel: "실책" },
    { key: "pko", value: "PKO", arialabel: "견제사" },
    { key: "po", value: "PO", arialabel: "풋아웃" },
    { key: "a", value: "A", arialabel: "어시스트" },
    { key: "dp", value: "DP", arialabel: "병살" },
    { key: "fpct", value: "FPCT", arialabel: "수비율" },
    { key: "pb", value: "PB", arialabel: "포일" },
    { key: "sb", value: "SB", arialabel: "도루허용" },
    { key: "cs", value: "CS", arialabel: "도루저지" },
    { key: "csp", value: "CSP", arialabel: "도루저지율" },
  ],
  pitBatMatch: [
    { key: "avg", value: "AVG", arialabel: "타율" },
    { key: "pa", value: "PA", arialabel: "타석" },
    { key: "ab", value: "AB", arialabel: "타수" },
    { key: "h", value: "H", arialabel: "안타" },
    { key: "twoB", value: "2B", arialabel: "2루타" },
    { key: "threeB", value: "3B", arialabel: "3루타" },
    { key: "hr", value: "HR", arialabel: "홈런" },
    { key: "rbi", value: "RBI", arialabel: "타점" },
    { key: "bb", value: "BB", arialabel: "볼넷" },
    { key: "hbp", value: "HBP", arialabel: "사구" },
    { key: "so", value: "SO", arialabel: "삼진" },
    { key: "slo", value: "SLG", arialabel: "장타율" },
    { key: "obp", value: "OBP", arialabel: "출루율" },
    { key: "ops", value: "OPS", arialabel: "출루율+장타율" },
  ],
};

// 공통 필터링 함수
const filterHeaders = (headers, selectedCategory, selectedPlayerType) => {
  if (selectedCategory === 0) {
    return headers; // 선수 기록
  } else if (selectedCategory === 1) {
    if (selectedPlayerType === 0) {
      return headers.filter(({ key }) => key !== "pitchersName");
    } else if (selectedPlayerType === 1) {
      return headers.filter(({ key }) => key !== "battersName");
    } else {
      return headers.filter(
        ({ key }) => !["defencesName", "pos", "gs", "ip"].includes(key)
      );
    }
  } else if (selectedCategory === 2) {
    return RecordheadersData.pitBatMatch; // 투수 vs 타자
  }
  return [];
};

const RecordTableHeaders = ({ selectedPlayerType, selectedCategory }) => {
  let headers;

  if (selectedPlayerType === 0) {
    headers = RecordheadersData.pitcher;
  } else if (selectedPlayerType === 1) {
    headers = RecordheadersData.batter;
  } else {
    headers = RecordheadersData.defence;
  }

  return filterHeaders(headers, selectedCategory, selectedPlayerType);
};

export default RecordTableHeaders;
