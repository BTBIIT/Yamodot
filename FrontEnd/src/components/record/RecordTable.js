import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import TeamSelect, { TeamSelectStyled } from "../ui/TeamSelect";
import Button from "../ui/Button";
import PostPerPageSelector from "../ui/PostPerPageSelector";
import Pagination from "../ui/Pagination";
import RecordTableView from "./RecordTableView";
import RecordTableHeaders from "./RecordTableHeaders";
// import useRecordData from "./useRecordData";
import StatusMessage from "../ui/StatusMessage";
import { DateUtils } from "../../utils/DateUtils";
import {
  ContentContainer,
  ContentTitle,
  SubCategoryContainer,
  SubContentContainer,
  EM,
  Strong,
} from "../../styles/CommonStyles";
import "../../styles/RecordAnalysis.css";

const RecordTable = () => {
  const currentYear = dayjs().year(); // 현재 연도를 가져옵니다.
  const [year, setYear] = useState(currentYear); // 현재 연도 상태

  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [data, setData] = useState([]); // 데이터 상태

  const [selectedTeam, setSelectedTeam] = useState("%25"); // 팀 선택 상태 저장
  const [selectedCategory, setSelectedCategory] = useState(0); // 선택된 기록 카테고리(선수, 팀, 투수 대 타자) 상태
  const [selectedPlayerType, setSelectedPlayerType] = useState(0); // 현재 선택된 선수 유형(투수, 타자, 수비)

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [postsPerPage, setPostsPerPage] = useState(15); // 페이지당 표시할 기록 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호 추적
  const [allData, setAllData] = useState([]); // 전체 데이터 상태 추가

  const [pitcherTeam, setPitcherTeam] = useState([]); // 투수팀 목록
  const [batterTeam, setBatterTeam] = useState([]); // 타자팀 목록
  const [pitcher, setPitcher] = useState([]); // 투수 목록
  const [batter, setBatter] = useState([]); // 타자 목록

  const [filteredPitchers, setFilteredPitchers] = useState([]); // 선택된 투수팀에 따른 투수 목록
  const [filteredBatters, setFilteredBatters] = useState([]); // 선택된 타자팀에 따른 타자 목록

  const [selectedPitcherTeam, setSelectedPitcherTeam] = useState(""); // 선택된 투수팀
  const [selectedBatterTeam, setSelectedBatterTeam] = useState(""); // 선택된 타자팀
  const [selectedPitcher, setSelectedPitcher] = useState(""); // 선택된 투수
  const [selectedBatter, setSelectedBatter] = useState(""); // 선택된 타자

  const [searchTriggered, setSearchTriggered] = useState(false); // 검색이 트리거된 상태
  const now = dayjs();

  const getApiUrl = () => {
    if (selectedCategory === 0) {
      // 선수 기록
      return selectedPlayerType === 0
        ? `/api/pitchers?year=${year}&teamName=${selectedTeam}` // 투수 기록
        : selectedPlayerType === 1
        ? `/api/batters?year=${year}&teamName=${selectedTeam}` // 타자 기록
        : `/api/defence?year=${year}&teamName=${selectedTeam}`; // 수비 기록
    } else if (selectedCategory === 1) {
      // 팀 기록
      return selectedPlayerType === 0
        ? `/api/pitchersteam?year=${year}` // 투수 팀 기록
        : selectedPlayerType === 1
        ? `/api/battersteam?year=${year}` // 타자 팀 기록
        : `/api/defencesteam?year=${year}`; // 수비 팀 기록
    } else if (selectedCategory === 2) {
      // 투수 vs 타자 매치업
      return `/api/pitbatmatchup?pitcherTeam=${selectedPitcherTeam}&pitcher=${selectedPitcher}&batterTeam=${selectedBatterTeam}&batter=${selectedBatter}`;
    }
  };

  const processFetchedData = (data) => {
    if (selectedCategory === 0) {
      // 선수 기록 데이터 처리
      return selectedPlayerType === 0
        ? data.pitchers // 투수 데이터
        : selectedPlayerType === 1
        ? data.batters // 타자 데이터
        : data.defence; // 수비 데이터
    } else if (selectedCategory === 1) {
      // 팀 기록 데이터 처리
      return selectedPlayerType === 0
        ? data.pitchersteam // 투수 팀 데이터
        : selectedPlayerType === 1
        ? data.battersteam // 타자 팀 데이터
        : data.defencesteam; // 수비 팀 데이터
    } else if (selectedCategory === 2) {
      // 투수 vs 타자 매치업 데이터 처리
      return data.pitbatmatchup;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      handleSort(null);
      setLoading(true);
      setError(null);

      try {
        const apiUrl = getApiUrl(); // 적절한 API URL 생성

        // 투수 vs 타자 카테고리일 때는 검색할 때만 데이터를 가져오므로 여기서는 데이터를 비워둠
        if (selectedCategory === 2) {
          setData([]);
          setLoading(false);
          return;
        }

        const res = await axios.get(apiUrl); // API 호출
        const fetchedData = processFetchedData(res.data); // 데이터 처리
        setAllData(fetchedData);

        // 백엔드에서 sortField가 없을 경우 기본 필드를 설정 (선수 유형에 따라 다르게)
        let defaultSortField;
        if (selectedPlayerType === 0) {
          defaultSortField = "era"; // 투수일 경우 기본 정렬 필드
        } else if (selectedPlayerType === 1) {
          defaultSortField = "avg"; // 타자일 경우 기본 정렬 필드
        } else if (selectedPlayerType === 2) {
          defaultSortField = "po"; // 수비일 경우 기본 정렬 필드
        }

        if (selectedCategory !== 2) {
          // 초기 정렬 및 순위 계산 (매치업 데이터는 정렬하지 않음)
          const sortedData = sortData(fetchedData, sortField, sortOrder);
          setData(sortedData);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("데이터를 가져오는 데 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    year,
    selectedTeam,
    selectedPlayerType,
    selectedCategory,
    selectedPitcherTeam,
    selectedPitcher,
    selectedBatterTeam,
    selectedBatter,
  ]);
  /* 이용자가 투타수 버튼 클릭시 호출 */
  const handlePBDClick = async (playerType) => {
    handleSort(null);
    setSelectedPlayerType(playerType);
    setSelectedTeam("%25");
    setCurrentPage(1);
    setLoading(true);
    try {
      let apiUrl;

      if (selectedCategory === 0) {
        // 선수 기록
        apiUrl =
          playerType === 0
            ? `/api/pitchers?year=${year}&teamName=${selectedTeam}`
            : playerType === 1
            ? `/api/batters?year=${year}&teamName=${selectedTeam}`
            : `/api/defence?year=${year}&teamName=${selectedTeam}`;
      } else if (selectedCategory === 1) {
        // 팀 기록
        apiUrl =
          playerType === 0
            ? `/api/pitchersteam?year=${year}`
            : playerType === 1
            ? `/api/battersteam?year=${year}`
            : `/api/defencesteam?year=${year}`;
      }

      const res = await axios.get(apiUrl);
      let fetchedData;

      if (selectedCategory === 0) {
        fetchedData =
          playerType === 0
            ? res.data.pitchers
            : playerType === 1
            ? res.data.batters
            : res.data.defence;
      } else if (selectedCategory === 1) {
        fetchedData =
          playerType === 0
            ? res.data.pitchersteam
            : playerType === 1
            ? res.data.battersteam
            : res.data.defencesteam;
      }
      console.log(fetchedData);
      setAllData(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  /*
    handlePBDClick 는 선수기록 내에 투수/타자/수비 버튼을 클릭할때만 실행됩니다.
    백엔드에서 정렬 채로 넘어옵니다.
    해당버튼을 누르면 각컬럼 클릭정렬, 연도, 팀 모두 초기화 됩니다.
  */

  /* 데이터 정렬 및 순위 부여 */
  const sortData = (dataToSort, field, order) => {
    /* 정렬 할 데이터 배열, 정렬 기준 필드명, 정렬 순서 */
    const sortedData = [...dataToSort].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });

    return sortedData.map((item, index) => ({
      ...item,
      ranking: index + 1 /* 정렬된 데이터에 순위 추가 */,
    }));
  };

  /* 이용자가 선택하는 정렬 기준 */
  const handleSort = (field) => {
    if (!Array.isArray(allData)) return; // allData가 배열이 아니면 정렬하지 않음

    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    const sortedData = sortData(allData, field, order);

    setSortField(field);
    setSortOrder(order);
    setData(sortedData);
  };

  const handleCategoryClick = (index) => {
    setSelectedCategory(index);
    setSelectedPlayerType(0); // "선수 기록" 또는 "팀 기록" 선택 시, "투수"가 기본 선택되도록 설정
    setSelectedPitcherTeam(""); // 투수팀 초기화
    setSelectedBatterTeam(""); // 타자팀 초기화
    setSelectedPitcher(""); // 투수 초기화
    setSelectedBatter(""); // 타자 초기화
    setSearchTriggered(false); // 카테고리 변경 시 검색 상태 초기화
    setData([]); // 이전 데이터를 초기화
    setPostsPerPage(15); // 목록 개수 설정
    setCurrentPage(1); // 현재 페이지 설정
    console.log("Selected Category: ", index); // 클릭한 카테고리 출력
  };

  const handleYearChange = (newYear) => {
    setYear(newYear);
  };

  /// 투수팀 목록 불러오기 (초기 로드 시)
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setPitcherTeam([]);
      try {
        const pitcherTeamsResponse = await axios.get("/api/allpitchers");
        const batterTeamsResponse = await axios.get("/api/allbatters");
        setPitcherTeam(pitcherTeamsResponse.data.allpitchers);
        console.log("투수팀 목록: ", pitcherTeamsResponse.data);
        setBatterTeam(batterTeamsResponse.data.allbatters);
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // 투수팀 선택 시 해당 팀의 투수 목록 불러오기
  useEffect(() => {
    if (selectedPitcherTeam) {
      const fetchFilteredPitchers = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/api/allpitchers?pitcherTeam=${selectedPitcherTeam}`
          );
          setFilteredPitchers(response.data.allpitchers);
        } catch (err) {
          setError("투수 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      };
      fetchFilteredPitchers();
    }
  }, [selectedPitcherTeam]);

  // 타자팀 선택 시 해당 팀의 타자 목록
  useEffect(() => {
    if (selectedBatterTeam) {
      const fetchFilteredBatters = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/api/allbatters?batterTeam=${selectedBatterTeam}`
          );
          setFilteredBatters(response.data.allbatters);
        } catch (err) {
          setError("타자 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      };
      fetchFilteredBatters();
    }
  }, [selectedBatterTeam]);

  // 투타 상대 전적 검색
  // 검색 버튼 클릭 시에만 데이터를 가져옴
  const handleSearch = async () => {
    if (
      !selectedPitcherTeam ||
      !selectedPitcher ||
      !selectedBatterTeam ||
      !selectedBatter
    ) {
      alert("모든 값을 선택해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `/api/pitbatmatchup?pitcherTeam=${selectedPitcherTeam}&pitcher=${selectedPitcher}&batterTeam=${selectedBatterTeam}&batter=${selectedBatter}`
      );
      setData(response.data.pitBatMatchup); // 검색 결과를 테이블에 표시
      setSearchTriggered(true); // 검색이 실행됨을 표시
    } catch (err) {
      setError("검색 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  /* 페이지네이션을 위한 데이터 슬라이스 */
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentData = data.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <ContentContainer>
      <ContentTitle>기록</ContentTitle>

      {/* 선수 기록, 팀 기록, 투수, 타자 선택 */}
      <SubCategoryContainer>
        <Button
          children="선수 기록"
          id="player"
          $buttonType="subCategory"
          $selected={selectedCategory === 0}
          onClick={() => handleCategoryClick(0)}
        />
        <Button
          children="팀 기록"
          id="team"
          $buttonType="subCategory"
          $selected={selectedCategory === 1}
          onClick={() => handleCategoryClick(1)}
        />
        <Button
          children="투수 vs 타자"
          id="pitcher-batter"
          $buttonType="subCategory"
          $selected={selectedCategory === 2}
          onClick={() => handleCategoryClick(2)}
        />
      </SubCategoryContainer>

      <SubContentContainer>
        {selectedCategory === 0 ? (
          <PostPerPageSelector
            postsPerPage={postsPerPage}
            setPostsPerPage={setPostsPerPage}
          />
        ) : (
          <div style={{ height: "35px" }}></div> // PostPerPageSelector 높이에 맞춘 빈 div
        )}
        <div className="record-select-container">
          {selectedCategory !== 2 && (
            <>
              <div className="player-select-container">
                <Button
                  children="투수"
                  $buttonType="playerSelect2"
                  $selected={selectedPlayerType === 0}
                  onClick={() => handlePBDClick(0)}
                />
                <Button
                  children="타자"
                  $buttonType="playerSelect2"
                  $selected={selectedPlayerType === 1}
                  onClick={() => handlePBDClick(1)}
                />
                <Button
                  children="수비"
                  $buttonType="playerSelect2"
                  $selected={selectedPlayerType === 2}
                  onClick={() => handlePBDClick(2)}
                />
              </div>
              <div className="year-team-select-container">
                <div>
                  <DateUtils year={year} onYearMonthChange={handleYearChange} />
                </div>
                <div>
                  {selectedCategory === 0 && (
                    <TeamSelect
                      selectedTeam={selectedTeam}
                      setSelectedTeam={setSelectedTeam}
                      labelType="%25"
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {selectedCategory === 2 && (
            <>
              <div className="pitbatMatchUp-select-container">
                <div>
                  <TeamSelect
                    selectedTeam={selectedPitcherTeam} // selectedPitcherTeam을 selectedTeam으로 전달
                    setSelectedTeam={setSelectedPitcherTeam} // setSelectedPitcherTeam을 setSelectedTeam으로 전달
                    labelType="pitcher"
                  />
                </div>
                <div>
                  <TeamSelectStyled
                    value={selectedPitcher}
                    onChange={(e) => setSelectedPitcher(e.target.value)}
                    disabled={!selectedPitcherTeam}
                  >
                    <option value="">투수</option>
                    {filteredPitchers.map((pitcher, index) => (
                      <option key={index} value={pitcher.pitcher}>
                        {pitcher.pitcher}
                      </option>
                    ))}
                  </TeamSelectStyled>
                </div>
                <div className="matchup-vs">VS</div>
                <div>
                  <TeamSelect
                    selectedTeam={selectedBatterTeam} // selectedPitcherTeam을 selectedTeam으로 전달
                    setSelectedTeam={setSelectedBatterTeam} // setSelectedPitcherTeam을 setSelectedTeam으로 전달
                    labelType="batter"
                  />
                </div>
                <div>
                  <TeamSelectStyled
                    value={selectedBatter}
                    onChange={(e) => setSelectedBatter(e.target.value)}
                    disabled={!selectedBatterTeam}
                  >
                    <option value="">타자</option>
                    {filteredBatters.map((batter, index) => (
                      <option key={index} value={batter.batter}>
                        {batter.batter}
                      </option>
                    ))}
                  </TeamSelectStyled>
                </div>
              </div>
              <Button
                children="검색"
                $buttonType="search"
                onClick={handleSearch}
              />
            </>
          )}
        </div>
        {/* 투수 vs 타자 매치업 결과가 없으면 테이블을 표시하지 않음 */}

        <>
          {loading && <StatusMessage status="loading" />}
          {error && <StatusMessage status="error" message={error} />}

          {selectedCategory === 2 && (
            <div className="pitbatMatchUp-select-container">
              <div className="matchup-text">
                <Strong>{selectedPitcher || "투수"}</Strong>
                <div className="matchup-vs">vs</div>
                <Strong>{selectedBatter || "타자"}</Strong>
                <div>{now.format("YYYY")} 맞대결 전적</div>
              </div>
              <div>
                <EM>{now.format("YYYY.MM.DD")} 최종</EM>
              </div>
            </div>
          )}

          {/* 데이터 테이블 */}
          {!loading && !error && (
            <>
              {selectedCategory === 2 ? (
                <RecordTableView
                  headers={RecordTableHeaders({
                    selectedPlayerType,
                    selectedCategory,
                  })}
                  data={searchTriggered && data.length > 0 ? currentData : []} // 검색이 트리거되고 데이터가 있을 경우 표시
                  onSort={handleSort}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  selectedPlayerType={selectedPlayerType}
                  selectedCategory={selectedCategory}
                />
              ) : (
                Array.isArray(data) &&
                data.length > 0 && (
                  <RecordTableView
                    headers={RecordTableHeaders({
                      selectedPlayerType,
                      selectedCategory,
                    })}
                    data={currentData} // 투수 vs 타자가 아닌 경우 항상 데이터 표시
                    onSort={handleSort}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    selectedPlayerType={selectedPlayerType}
                    selectedCategory={selectedCategory}
                  />
                )
              )}
              {searchTriggered && data.length === 0 && (
                <StatusMessage status="no-data" message="데이터가 없습니다." /> // 데이터가 없을 경우 메시지 표시
              )}
            </>
          )}
        </>
      </SubContentContainer>

      {/* 페이지네이션 */}
      {selectedCategory === 0 &&
        Array.isArray(allData) &&
        allData.length > 0 && (
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={allData.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
    </ContentContainer>
  );
};

export default RecordTable;
