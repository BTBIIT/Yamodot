-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        11.4.3-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- yamodot_db 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `yamodot_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `yamodot_db`;

-- 테이블 yamodot_db.admin 구조 내보내기
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_unique_number` varchar(100) NOT NULL COMMENT '관리자 고유번호',
  `admin_id` varchar(50) NOT NULL COMMENT '관리자 아이디',
  `admin_password` varchar(100) NOT NULL COMMENT '관리자 비밀번호',
  `role` varchar(10) DEFAULT NULL COMMENT 'user : 유저 / admin : 관리자',
  PRIMARY KEY (`admin_unique_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.analysis_data_2022_batter 구조 내보내기
CREATE TABLE IF NOT EXISTS `analysis_data_2022_batter` (
  `date` datetime DEFAULT NULL COMMENT '날짜',
  `team` varchar(10) DEFAULT NULL COMMENT '팀이름',
  `home` varchar(10) DEFAULT NULL COMMENT '홈/원정구분',
  `name` varchar(10) DEFAULT NULL COMMENT '선수명',
  `1st` varchar(10) DEFAULT NULL,
  `2nd` varchar(10) DEFAULT NULL,
  `3rd` varchar(10) DEFAULT NULL,
  `4th` varchar(10) DEFAULT NULL,
  `5th` varchar(10) DEFAULT NULL,
  `6th` varchar(10) DEFAULT NULL,
  `7th` varchar(10) DEFAULT NULL,
  `8th` varchar(10) DEFAULT NULL,
  `9th` varchar(10) DEFAULT NULL,
  `10th` varchar(10) DEFAULT NULL,
  `11th` varchar(10) DEFAULT NULL,
  `12th` varchar(10) DEFAULT NULL,
  `타수` int(11) DEFAULT NULL,
  `안타` int(11) DEFAULT NULL,
  `타점` int(11) DEFAULT NULL,
  `득점` int(11) DEFAULT NULL,
  `타율` decimal(20,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='[중요!] 분석에 사용하는 2022년 타자데이터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.analysis_data_2022_pitcher 구조 내보내기
CREATE TABLE IF NOT EXISTS `analysis_data_2022_pitcher` (
  `date` datetime DEFAULT NULL,
  `team` varchar(10) DEFAULT NULL,
  `home` varchar(10) DEFAULT NULL,
  `name` varchar(10) DEFAULT NULL,
  `등판` varchar(10) DEFAULT NULL,
  `결과` varchar(10) DEFAULT NULL,
  `승` int(11) DEFAULT NULL,
  `패` int(11) DEFAULT NULL,
  `세` int(11) DEFAULT NULL,
  `이닝` varchar(10) DEFAULT NULL,
  `타자` int(11) DEFAULT NULL,
  `투구수` int(11) DEFAULT NULL,
  `타수` int(11) DEFAULT NULL,
  `피안타` int(11) DEFAULT NULL,
  `홈런` int(11) DEFAULT NULL,
  `4사구` int(11) DEFAULT NULL,
  `삼진` int(11) DEFAULT NULL,
  `실점` int(11) DEFAULT NULL,
  `자책` int(11) DEFAULT NULL,
  `평균자책점` decimal(20,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.analysis_data_2023_batter 구조 내보내기
CREATE TABLE IF NOT EXISTS `analysis_data_2023_batter` (
  `date` datetime DEFAULT NULL COMMENT '날짜',
  `team` varchar(10) DEFAULT NULL COMMENT '팀이름',
  `home` varchar(10) DEFAULT NULL COMMENT '홈/원정구분',
  `name` varchar(10) DEFAULT NULL COMMENT '선수명',
  `1st` varchar(10) DEFAULT NULL,
  `2nd` varchar(10) DEFAULT NULL,
  `3rd` varchar(10) DEFAULT NULL,
  `4th` varchar(10) DEFAULT NULL,
  `5th` varchar(10) DEFAULT NULL,
  `6th` varchar(10) DEFAULT NULL,
  `7th` varchar(10) DEFAULT NULL,
  `8th` varchar(10) DEFAULT NULL,
  `9th` varchar(10) DEFAULT NULL,
  `10th` varchar(10) DEFAULT NULL,
  `11th` varchar(10) DEFAULT NULL,
  `12th` varchar(10) DEFAULT NULL,
  `타수` int(11) DEFAULT NULL,
  `안타` int(11) DEFAULT NULL,
  `타점` int(11) DEFAULT NULL,
  `득점` int(11) DEFAULT NULL,
  `타율` decimal(20,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC COMMENT='[중요!] 분석에 사용하는 2022년 타자데이터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.analysis_data_2023_pitcher 구조 내보내기
CREATE TABLE IF NOT EXISTS `analysis_data_2023_pitcher` (
  `date` datetime DEFAULT NULL,
  `team` varchar(10) DEFAULT NULL,
  `home` varchar(10) DEFAULT NULL,
  `name` varchar(10) DEFAULT NULL,
  `등판` varchar(10) DEFAULT NULL,
  `결과` varchar(10) DEFAULT NULL,
  `승` int(11) DEFAULT NULL,
  `패` int(11) DEFAULT NULL,
  `세` int(11) DEFAULT NULL,
  `이닝` varchar(10) DEFAULT NULL,
  `타자` int(11) DEFAULT NULL,
  `투구수` int(11) DEFAULT NULL,
  `타수` int(11) DEFAULT NULL,
  `피안타` int(11) DEFAULT NULL,
  `홈런` int(11) DEFAULT NULL,
  `4사구` int(11) DEFAULT NULL,
  `삼진` int(11) DEFAULT NULL,
  `실점` int(11) DEFAULT NULL,
  `자책` int(11) DEFAULT NULL,
  `평균자책점` decimal(20,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.analysis_data_2024_batter 구조 내보내기
CREATE TABLE IF NOT EXISTS `analysis_data_2024_batter` (
  `date` datetime DEFAULT NULL COMMENT '날짜',
  `team` varchar(10) DEFAULT NULL COMMENT '팀이름',
  `home` varchar(10) DEFAULT NULL COMMENT '홈/원정구분',
  `name` varchar(10) DEFAULT NULL COMMENT '선수명',
  `1st` varchar(10) DEFAULT NULL,
  `2nd` varchar(10) DEFAULT NULL,
  `3rd` varchar(10) DEFAULT NULL,
  `4th` varchar(10) DEFAULT NULL,
  `5th` varchar(10) DEFAULT NULL,
  `6th` varchar(10) DEFAULT NULL,
  `7th` varchar(10) DEFAULT NULL,
  `8th` varchar(10) DEFAULT NULL,
  `9th` varchar(10) DEFAULT NULL,
  `10th` varchar(10) DEFAULT NULL,
  `11th` varchar(10) DEFAULT NULL,
  `12th` varchar(10) DEFAULT NULL,
  `타수` int(11) DEFAULT NULL,
  `안타` int(11) DEFAULT NULL,
  `타점` int(11) DEFAULT NULL,
  `득점` int(11) DEFAULT NULL,
  `타율` decimal(20,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC COMMENT='[중요!] 분석에 사용하는 2022년 타자데이터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.analysis_data_2024_pitcher 구조 내보내기
CREATE TABLE IF NOT EXISTS `analysis_data_2024_pitcher` (
  `date` datetime DEFAULT NULL,
  `team` varchar(10) DEFAULT NULL,
  `home` varchar(10) DEFAULT NULL,
  `name` varchar(10) DEFAULT NULL,
  `등판` varchar(10) DEFAULT NULL,
  `결과` varchar(10) DEFAULT NULL,
  `승` int(11) DEFAULT NULL,
  `패` int(11) DEFAULT NULL,
  `세` int(11) DEFAULT NULL,
  `이닝` varchar(10) DEFAULT NULL,
  `타자` int(11) DEFAULT NULL,
  `투구수` int(11) DEFAULT NULL,
  `타수` int(11) DEFAULT NULL,
  `피안타` int(11) DEFAULT NULL,
  `홈런` int(11) DEFAULT NULL,
  `4사구` int(11) DEFAULT NULL,
  `삼진` int(11) DEFAULT NULL,
  `실점` int(11) DEFAULT NULL,
  `자책` int(11) DEFAULT NULL,
  `평균자책점` decimal(20,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC COMMENT='[중요!!!] 분석에 사용하는 시계열 데이터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.analysis_kbo_data 구조 내보내기
CREATE TABLE IF NOT EXISTS `analysis_kbo_data` (
  `date` datetime DEFAULT NULL,
  `team` varchar(10) DEFAULT NULL,
  `home` int(11) DEFAULT NULL,
  `game` int(11) DEFAULT NULL,
  `match` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `result` int(11) DEFAULT NULL,
  `투구수` int(11) DEFAULT NULL,
  `4사구` int(11) DEFAULT NULL,
  `삼진` int(11) DEFAULT NULL,
  `이닝` int(11) DEFAULT NULL,
  `실점` int(11) DEFAULT NULL,
  `자책` int(11) DEFAULT NULL,
  `whip` decimal(20,6) DEFAULT NULL,
  `피안타율` decimal(20,6) DEFAULT NULL,
  `평균자책점` decimal(20,6) DEFAULT NULL,
  `안타` int(11) DEFAULT NULL,
  `타점` int(11) DEFAULT NULL,
  `득점` int(11) DEFAULT NULL,
  `타율` decimal(20,6) DEFAULT NULL,
  `병살타` int(11) DEFAULT NULL,
  `1루타` int(11) DEFAULT NULL,
  `2루타` int(11) DEFAULT NULL,
  `3루타` int(11) DEFAULT NULL,
  `홈런` int(11) DEFAULT NULL,
  `희생번트` int(11) DEFAULT NULL,
  `희생플라이` int(11) DEFAULT NULL,
  `볼넷` int(11) DEFAULT NULL,
  `고의4구` int(11) DEFAULT NULL,
  `사구` int(11) DEFAULT NULL,
  `실책출루` int(11) DEFAULT NULL,
  `출루율` decimal(20,6) DEFAULT NULL,
  `루타` int(11) DEFAULT NULL,
  `장타율` decimal(20,6) DEFAULT NULL,
  `ops` decimal(20,6) DEFAULT NULL,
  `woba` decimal(20,6) DEFAULT NULL,
  `away_team` varchar(10) DEFAULT NULL,
  `away_투구수` int(11) DEFAULT NULL,
  `away_4사구` int(11) DEFAULT NULL,
  `away_삼진` int(11) DEFAULT NULL,
  `away_자책` int(11) DEFAULT NULL,
  `away_whip` decimal(20,6) DEFAULT NULL,
  `away_피안타율` decimal(20,6) DEFAULT NULL,
  `away_평균자책점` decimal(20,6) DEFAULT NULL,
  `away_안타` int(11) DEFAULT NULL,
  `away_타율` decimal(20,6) DEFAULT NULL,
  `away_병살타` int(11) DEFAULT NULL,
  `away_1루타` int(11) DEFAULT NULL,
  `away_2루타` int(11) DEFAULT NULL,
  `away_3루타` int(11) DEFAULT NULL,
  `away_홈런` int(11) DEFAULT NULL,
  `away_희생번트` int(11) DEFAULT NULL,
  `away_희생플라이` int(11) DEFAULT NULL,
  `away_볼넷` int(11) DEFAULT NULL,
  `away_고의4구` int(11) DEFAULT NULL,
  `away_사구` int(11) DEFAULT NULL,
  `away_실책출루` int(11) DEFAULT NULL,
  `away_출루율` decimal(20,6) DEFAULT NULL,
  `away_루타` int(11) DEFAULT NULL,
  `away_장타율` decimal(20,6) DEFAULT NULL,
  `away_ops` decimal(20,6) DEFAULT NULL,
  `away_woba` decimal(20,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='[중요!!!] 분석에 사용하는 KBO 데이터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.analysis_kbo_data_2 구조 내보내기
CREATE TABLE IF NOT EXISTS `analysis_kbo_data_2` (
  `date` datetime DEFAULT NULL,
  `team` varchar(10) DEFAULT NULL,
  `home` int(11) DEFAULT NULL,
  `game` int(11) DEFAULT NULL,
  `match` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `result` int(11) DEFAULT NULL,
  `투구수` int(11) DEFAULT NULL,
  `4사구` int(11) DEFAULT NULL,
  `삼진` int(11) DEFAULT NULL,
  `이닝` int(11) DEFAULT NULL,
  `실점` int(11) DEFAULT NULL,
  `자책` int(11) DEFAULT NULL,
  `whip` decimal(20,6) DEFAULT NULL,
  `피안타율` decimal(20,6) DEFAULT NULL,
  `평균자책점` decimal(20,6) DEFAULT NULL,
  `안타` int(11) DEFAULT NULL,
  `타점` int(11) DEFAULT NULL,
  `득점` int(11) DEFAULT NULL,
  `타율` decimal(20,6) DEFAULT NULL,
  `병살타` int(11) DEFAULT NULL,
  `1루타` int(11) DEFAULT NULL,
  `2루타` int(11) DEFAULT NULL,
  `3루타` int(11) DEFAULT NULL,
  `홈런` int(11) DEFAULT NULL,
  `희생번트` int(11) DEFAULT NULL,
  `희생플라이` int(11) DEFAULT NULL,
  `볼넷` int(11) DEFAULT NULL,
  `고의4구` int(11) DEFAULT NULL,
  `사구` int(11) DEFAULT NULL,
  `실책출루` int(11) DEFAULT NULL,
  `출루율` decimal(20,6) DEFAULT NULL,
  `루타` int(11) DEFAULT NULL,
  `장타율` decimal(20,6) DEFAULT NULL,
  `ops` decimal(20,6) DEFAULT NULL,
  `woba` decimal(20,6) DEFAULT NULL,
  `away_team` varchar(10) DEFAULT NULL,
  `away_투구수` int(11) DEFAULT NULL,
  `away_4사구` int(11) DEFAULT NULL,
  `away_삼진` int(11) DEFAULT NULL,
  `away_자책` int(11) DEFAULT NULL,
  `away_whip` decimal(20,6) DEFAULT NULL,
  `away_피안타율` decimal(20,6) DEFAULT NULL,
  `away_평균자책점` decimal(20,6) DEFAULT NULL,
  `away_안타` int(11) DEFAULT NULL,
  `away_타율` decimal(20,6) DEFAULT NULL,
  `away_병살타` int(11) DEFAULT NULL,
  `away_1루타` int(11) DEFAULT NULL,
  `away_2루타` int(11) DEFAULT NULL,
  `away_3루타` int(11) DEFAULT NULL,
  `away_홈런` int(11) DEFAULT NULL,
  `away_희생번트` int(11) DEFAULT NULL,
  `away_희생플라이` int(11) DEFAULT NULL,
  `away_볼넷` int(11) DEFAULT NULL,
  `away_고의4구` int(11) DEFAULT NULL,
  `away_사구` int(11) DEFAULT NULL,
  `away_실책출루` int(11) DEFAULT NULL,
  `away_출루율` decimal(20,6) DEFAULT NULL,
  `away_루타` int(11) DEFAULT NULL,
  `away_장타율` decimal(20,6) DEFAULT NULL,
  `away_ops` decimal(20,6) DEFAULT NULL,
  `away_woba` decimal(20,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC COMMENT='[중요!!!] 분석에 사용하는 KBO 데이터2';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.analysis_merged_data 구조 내보내기
CREATE TABLE IF NOT EXISTS `analysis_merged_data` (
  `home_team` varchar(10) DEFAULT NULL,
  `away_team` varchar(10) DEFAULT NULL,
  `home` int(11) DEFAULT NULL,
  `away` int(11) DEFAULT NULL,
  `투구수` decimal(20,6) DEFAULT NULL,
  `4사구` decimal(20,6) DEFAULT NULL,
  `삼진` decimal(20,6) DEFAULT NULL,
  `자책` decimal(20,6) DEFAULT NULL,
  `whip` decimal(20,6) DEFAULT NULL,
  `피안타율` decimal(20,6) DEFAULT NULL,
  `평균자책점` decimal(20,6) DEFAULT NULL,
  `안타` decimal(20,6) DEFAULT NULL,
  `타율` decimal(20,6) DEFAULT NULL,
  `병살타` decimal(20,6) DEFAULT NULL,
  `1루타` decimal(20,6) DEFAULT NULL,
  `2루타` decimal(20,6) DEFAULT NULL,
  `3루타` decimal(20,6) DEFAULT NULL,
  `홈런` decimal(20,6) DEFAULT NULL,
  `희생번트` decimal(20,6) DEFAULT NULL,
  `희생플라이` decimal(20,6) DEFAULT NULL,
  `볼넷` decimal(20,6) DEFAULT NULL,
  `고의4구` decimal(20,6) DEFAULT NULL,
  `사구` decimal(20,6) DEFAULT NULL,
  `실책출루` decimal(20,6) DEFAULT NULL,
  `출루율` decimal(20,6) DEFAULT NULL,
  `루타` decimal(20,6) DEFAULT NULL,
  `장타율` decimal(20,6) DEFAULT NULL,
  `ops` decimal(20,6) DEFAULT NULL,
  `woba` decimal(20,6) DEFAULT NULL,
  `away_투구수` decimal(20,6) DEFAULT NULL,
  `away_4사구` decimal(20,6) DEFAULT NULL,
  `away_삼진` decimal(20,6) DEFAULT NULL,
  `away_자책` decimal(20,6) DEFAULT NULL,
  `away_whip` decimal(20,6) DEFAULT NULL,
  `away_피안타율` decimal(20,6) DEFAULT NULL,
  `away_평균자책점` decimal(20,6) DEFAULT NULL,
  `away_안타` decimal(20,6) DEFAULT NULL,
  `away_타율` decimal(20,6) DEFAULT NULL,
  `away_병살타` decimal(20,6) DEFAULT NULL,
  `away_1루타` decimal(20,6) DEFAULT NULL,
  `away_2루타` decimal(20,6) DEFAULT NULL,
  `away_3루타` decimal(20,6) DEFAULT NULL,
  `away_홈런` decimal(20,6) DEFAULT NULL,
  `away_희생번트` decimal(20,6) DEFAULT NULL,
  `away_희생플라이` decimal(20,6) DEFAULT NULL,
  `away_볼넷` decimal(20,6) DEFAULT NULL,
  `away_고의4구` decimal(20,6) DEFAULT NULL,
  `away_사구` decimal(20,6) DEFAULT NULL,
  `away_실책출루` decimal(20,6) DEFAULT NULL,
  `away_출루율` decimal(20,6) DEFAULT NULL,
  `away_루타` decimal(20,6) DEFAULT NULL,
  `away_장타율` decimal(20,6) DEFAULT NULL,
  `away_ops` decimal(20,6) DEFAULT NULL,
  `away_woba` decimal(20,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='시계열 분석 끝난 데이터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.analysis_merged_data_2 구조 내보내기
CREATE TABLE IF NOT EXISTS `analysis_merged_data_2` (
  `home_team` varchar(10) DEFAULT NULL,
  `away_team` varchar(10) DEFAULT NULL,
  `home` int(11) DEFAULT NULL,
  `away` int(11) DEFAULT NULL,
  `투구수` decimal(20,6) DEFAULT NULL,
  `4사구` decimal(20,6) DEFAULT NULL,
  `삼진` decimal(20,6) DEFAULT NULL,
  `자책` decimal(20,6) DEFAULT NULL,
  `whip` decimal(20,6) DEFAULT NULL,
  `피안타율` decimal(20,6) DEFAULT NULL,
  `평균자책점` decimal(20,6) DEFAULT NULL,
  `안타` decimal(20,6) DEFAULT NULL,
  `타율` decimal(20,6) DEFAULT NULL,
  `병살타` decimal(20,6) DEFAULT NULL,
  `1루타` decimal(20,6) DEFAULT NULL,
  `2루타` decimal(20,6) DEFAULT NULL,
  `3루타` decimal(20,6) DEFAULT NULL,
  `홈런` decimal(20,6) DEFAULT NULL,
  `희생번트` decimal(20,6) DEFAULT NULL,
  `희생플라이` decimal(20,6) DEFAULT NULL,
  `볼넷` decimal(20,6) DEFAULT NULL,
  `고의4구` decimal(20,6) DEFAULT NULL,
  `사구` decimal(20,6) DEFAULT NULL,
  `실책출루` decimal(20,6) DEFAULT NULL,
  `출루율` decimal(20,6) DEFAULT NULL,
  `루타` decimal(20,6) DEFAULT NULL,
  `장타율` decimal(20,6) DEFAULT NULL,
  `ops` decimal(20,6) DEFAULT NULL,
  `woba` decimal(20,6) DEFAULT NULL,
  `away_투구수` decimal(20,6) DEFAULT NULL,
  `away_4사구` decimal(20,6) DEFAULT NULL,
  `away_삼진` decimal(20,6) DEFAULT NULL,
  `away_자책` decimal(20,6) DEFAULT NULL,
  `away_whip` decimal(20,6) DEFAULT NULL,
  `away_피안타율` decimal(20,6) DEFAULT NULL,
  `away_평균자책점` decimal(20,6) DEFAULT NULL,
  `away_안타` decimal(20,6) DEFAULT NULL,
  `away_타율` decimal(20,6) DEFAULT NULL,
  `away_병살타` decimal(20,6) DEFAULT NULL,
  `away_1루타` decimal(20,6) DEFAULT NULL,
  `away_2루타` decimal(20,6) DEFAULT NULL,
  `away_3루타` decimal(20,6) DEFAULT NULL,
  `away_홈런` decimal(20,6) DEFAULT NULL,
  `away_희생번트` decimal(20,6) DEFAULT NULL,
  `away_희생플라이` decimal(20,6) DEFAULT NULL,
  `away_볼넷` decimal(20,6) DEFAULT NULL,
  `away_고의4구` decimal(20,6) DEFAULT NULL,
  `away_사구` decimal(20,6) DEFAULT NULL,
  `away_실책출루` decimal(20,6) DEFAULT NULL,
  `away_출루율` decimal(20,6) DEFAULT NULL,
  `away_루타` decimal(20,6) DEFAULT NULL,
  `away_장타율` decimal(20,6) DEFAULT NULL,
  `away_ops` decimal(20,6) DEFAULT NULL,
  `away_woba` decimal(20,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC COMMENT='시계열 분석 끝난 데이터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.batters 구조 내보내기
CREATE TABLE IF NOT EXISTS `batters` (
  `ranking` int(11) NOT NULL COMMENT '타자 순위',
  `year` int(11) NOT NULL COMMENT '연도',
  `batters_name` varchar(30) NOT NULL COMMENT '타자 이름',
  `team_name` varchar(20) NOT NULL COMMENT '팀 이름',
  `AVG` decimal(20,6) DEFAULT NULL COMMENT '타율',
  `G` int(11) DEFAULT NULL COMMENT '참여 경기 수',
  `PA` int(11) DEFAULT NULL COMMENT '타석 수',
  `AB` int(11) DEFAULT NULL COMMENT '타격 수',
  `R` int(11) DEFAULT NULL COMMENT '득점',
  `H` int(11) DEFAULT NULL COMMENT '안타',
  `2B` int(11) DEFAULT NULL COMMENT '2루타',
  `3B` int(11) DEFAULT NULL COMMENT '3루타',
  `HR` int(11) DEFAULT NULL COMMENT '홈런',
  `TB` int(11) DEFAULT NULL COMMENT '총루타',
  `RBI` int(11) DEFAULT NULL COMMENT '타점',
  `SAC` int(11) DEFAULT NULL COMMENT '희생타',
  `SF` int(11) DEFAULT NULL COMMENT '희생 플라이',
  `BB` int(11) DEFAULT NULL COMMENT '볼넷',
  `IBB` int(11) DEFAULT NULL COMMENT '고의사구',
  `HBP` int(11) DEFAULT NULL COMMENT '몸에 맞는 공',
  `SO` int(11) DEFAULT NULL COMMENT '삼진',
  `GDP` int(11) DEFAULT NULL COMMENT '병살타, 땅볼',
  `SLG` int(11) DEFAULT NULL COMMENT '장타율',
  `OBP` decimal(20,6) DEFAULT NULL COMMENT '출루율',
  `OPS` decimal(20,6) DEFAULT NULL COMMENT '장타율 + 출루율',
  `MH` int(11) DEFAULT NULL COMMENT '멀티 히트',
  `RISP` decimal(20,6) DEFAULT NULL COMMENT '득점권 타율',
  `PH_BA` decimal(20,6) DEFAULT NULL COMMENT '대타타율'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='merge된 타자 데이터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.batter_team_record 구조 내보내기
CREATE TABLE IF NOT EXISTS `batter_team_record` (
  `year` int(11) DEFAULT NULL,
  `ranking` int(11) DEFAULT NULL,
  `team_name` varchar(30) DEFAULT NULL,
  `AVG` decimal(20,6) DEFAULT NULL COMMENT '타율',
  `G` int(11) DEFAULT NULL COMMENT '게임 수',
  `PA` int(11) DEFAULT NULL COMMENT '타석 수',
  `AB` int(11) DEFAULT NULL COMMENT '타수',
  `R` int(11) DEFAULT NULL COMMENT '득점 수',
  `H` int(11) DEFAULT NULL COMMENT '안타 수',
  `2B` int(11) DEFAULT NULL COMMENT '2루타',
  `3B` int(11) DEFAULT NULL COMMENT '3루타',
  `HR` int(11) DEFAULT NULL COMMENT '홈런',
  `TB` int(11) DEFAULT NULL COMMENT '총 루타',
  `RBI` int(11) DEFAULT NULL COMMENT '타점',
  `SAC` int(11) DEFAULT NULL COMMENT '희생타',
  `SF` int(11) DEFAULT NULL COMMENT '희생 플라이',
  `BB` int(11) DEFAULT NULL COMMENT '볼넷 수',
  `IBB` int(11) DEFAULT NULL COMMENT '고의사구',
  `HBP` int(11) DEFAULT NULL COMMENT '몸에 맞는 볼',
  `SO` int(11) DEFAULT NULL COMMENT '삼진',
  `GDP` int(11) DEFAULT NULL COMMENT '병살타, 땅볼',
  `SLG` decimal(20,6) DEFAULT NULL COMMENT '장타율',
  `OBP` decimal(20,6) DEFAULT NULL COMMENT '출루율',
  `OPS` decimal(20,6) DEFAULT NULL COMMENT '장타율 + 출루율',
  `MH` int(11) DEFAULT NULL COMMENT '멀티 히트',
  `RISP` decimal(20,6) DEFAULT NULL COMMENT '득점권 타율',
  `PH_BA` decimal(20,6) DEFAULT NULL COMMENT '대타 타율'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='실제 타자 데이터\r\n';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.comment 구조 내보내기
CREATE TABLE IF NOT EXISTS `comment` (
  `user_unique_number` varchar(100) DEFAULT NULL COMMENT '사용자 고유번호',
  `admin_unique_number` varchar(100) DEFAULT NULL COMMENT '관리자 고유번호',
  `post_comment_num` int(11) NOT NULL COMMENT '댓글 인덱스번호 (예 1번 게시물의 몇번째 댓글)',
  `post_id` int(11) DEFAULT NULL COMMENT '게시물ID',
  `comment_content` text DEFAULT NULL COMMENT '게시글 댓글',
  `comment_name` varchar(60) DEFAULT NULL COMMENT '댓글 작성자',
  `comment_date` datetime DEFAULT NULL COMMENT '댓글 작성날짜 시간',
  `comment_change_name` varchar(60) DEFAULT NULL COMMENT '댓글 수정자',
  `comment_change_date` datetime DEFAULT NULL COMMENT '댓글 수정시간',
  KEY `post_commnet_num` (`post_comment_num`) USING BTREE,
  KEY `FK_comment_admin` (`admin_unique_number`),
  KEY `FK_comment_community` (`post_id`),
  KEY `FK_comment_users` (`user_unique_number`),
  CONSTRAINT `FK_comment_admin` FOREIGN KEY (`admin_unique_number`) REFERENCES `admin` (`admin_unique_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_comment_community` FOREIGN KEY (`post_id`) REFERENCES `community` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_comment_users` FOREIGN KEY (`user_unique_number`) REFERENCES `users` (`user_unique_number`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='댓글 테이블';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.community 구조 내보내기
CREATE TABLE IF NOT EXISTS `community` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '게시물 ID (auto increment)',
  `user_unique_number` varchar(100) NOT NULL COMMENT '고유번호',
  `admin_unique_number` varchar(100) NOT NULL COMMENT '관리자 고유번호',
  `post_title` varchar(100) DEFAULT NULL COMMENT '게시글 제목',
  `post_content` text DEFAULT NULL COMMENT '게시글 내용',
  `post_img_path` varchar(255) DEFAULT NULL COMMENT '게시글 이미지 원본 파일명',
  `post_view` int(11) DEFAULT NULL COMMENT '게시글 조회수',
  `category_name` int(11) NOT NULL DEFAULT 0 COMMENT '전체 = 0, 기아 = 1, 삼성 = 2, LG = 3, 두산 = 4, KT =5, 한화 = 6, 롯데 = 7, SSG = 8, NC = 9, 키움 = 10',
  `community_id` varchar(60) DEFAULT NULL COMMENT '게시글 작성한 사람',
  `community_date` datetime DEFAULT NULL COMMENT '게시글 작성 날짜 시간',
  `comm_change_id` varchar(60) DEFAULT NULL COMMENT '게시글 수정한 사람',
  `comm_change_date` datetime DEFAULT NULL COMMENT '게시글 수정 날짜 시간',
  PRIMARY KEY (`post_id`),
  KEY `FK_community_admin` (`admin_unique_number`),
  KEY `FK_community_users` (`user_unique_number`),
  CONSTRAINT `FK_community_admin` FOREIGN KEY (`admin_unique_number`) REFERENCES `admin` (`admin_unique_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_community_users` FOREIGN KEY (`user_unique_number`) REFERENCES `users` (`user_unique_number`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=411 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.crawling_scoreboard 구조 내보내기
CREATE TABLE IF NOT EXISTS `crawling_scoreboard` (
  `date` varchar(50) DEFAULT NULL,
  `ground_time` varchar(50) DEFAULT NULL,
  `pitcher` varchar(50) DEFAULT NULL,
  `awayteam` varchar(50) DEFAULT NULL,
  `home_pitcher` varchar(20) DEFAULT NULL,
  `away_pitcher` varchar(20) DEFAULT NULL,
  `winning_pitcher` varchar(20) DEFAULT NULL,
  `lose_pitcher` varchar(20) DEFAULT NULL,
  `a1` varchar(5) DEFAULT NULL,
  `a2` varchar(5) DEFAULT NULL,
  `a3` varchar(5) DEFAULT NULL,
  `a4` varchar(5) DEFAULT NULL,
  `a5` varchar(5) DEFAULT NULL,
  `a6` varchar(5) DEFAULT NULL,
  `a7` varchar(5) DEFAULT NULL,
  `a8` varchar(5) DEFAULT NULL,
  `a9` varchar(5) DEFAULT NULL,
  `a10` varchar(5) DEFAULT NULL,
  `a11` varchar(5) DEFAULT NULL,
  `a12` varchar(5) DEFAULT NULL,
  `a13` varchar(5) DEFAULT NULL,
  `a14` varchar(5) DEFAULT NULL,
  `a15` varchar(5) DEFAULT NULL,
  `ar` varchar(5) DEFAULT NULL,
  `ah` varchar(5) DEFAULT NULL,
  `ae` varchar(5) DEFAULT NULL,
  `ab` varchar(5) DEFAULT NULL,
  `hometeam` varchar(50) DEFAULT NULL,
  `h1` varchar(5) DEFAULT NULL,
  `h2` varchar(5) DEFAULT NULL,
  `h3` varchar(5) DEFAULT NULL,
  `h4` varchar(5) DEFAULT NULL,
  `h5` varchar(5) DEFAULT NULL,
  `h6` varchar(5) DEFAULT NULL,
  `h7` varchar(5) DEFAULT NULL,
  `h8` varchar(5) DEFAULT NULL,
  `h9` varchar(5) DEFAULT NULL,
  `h10` varchar(5) DEFAULT NULL,
  `h11` varchar(5) DEFAULT NULL,
  `h12` varchar(5) DEFAULT NULL,
  `h13` varchar(5) DEFAULT NULL,
  `h14` varchar(5) DEFAULT NULL,
  `h15` varchar(5) DEFAULT NULL,
  `hr` varchar(5) DEFAULT NULL,
  `hh` varchar(5) DEFAULT NULL,
  `he` varchar(5) DEFAULT NULL,
  `hb` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.crawling_scoreboard_sum 구조 내보내기
CREATE TABLE IF NOT EXISTS `crawling_scoreboard_sum` (
  `date` varchar(50) DEFAULT NULL,
  `ground_time` varchar(50) DEFAULT NULL,
  `pitcher` varchar(50) DEFAULT NULL,
  `awayteam` varchar(50) DEFAULT NULL,
  `home_pitcher` varchar(20) DEFAULT NULL,
  `away_pitcher` varchar(20) DEFAULT NULL,
  `winning_pitcher` varchar(20) DEFAULT NULL,
  `lose_pitcher` varchar(20) DEFAULT NULL,
  `a1` varchar(5) DEFAULT NULL,
  `a2` varchar(5) DEFAULT NULL,
  `a3` varchar(5) DEFAULT NULL,
  `a4` varchar(5) DEFAULT NULL,
  `a5` varchar(5) DEFAULT NULL,
  `a6` varchar(5) DEFAULT NULL,
  `a7` varchar(5) DEFAULT NULL,
  `a8` varchar(5) DEFAULT NULL,
  `a9` varchar(5) DEFAULT NULL,
  `a10` varchar(5) DEFAULT NULL,
  `a11` varchar(5) DEFAULT NULL,
  `a12` varchar(5) DEFAULT NULL,
  `a13` varchar(5) DEFAULT NULL,
  `a14` varchar(5) DEFAULT NULL,
  `a15` varchar(5) DEFAULT NULL,
  `ar` varchar(5) DEFAULT NULL,
  `ah` varchar(5) DEFAULT NULL,
  `ae` varchar(5) DEFAULT NULL,
  `ab` varchar(5) DEFAULT NULL,
  `hometeam` varchar(50) DEFAULT NULL,
  `h1` varchar(5) DEFAULT NULL,
  `h2` varchar(5) DEFAULT NULL,
  `h3` varchar(5) DEFAULT NULL,
  `h4` varchar(5) DEFAULT NULL,
  `h5` varchar(5) DEFAULT NULL,
  `h6` varchar(5) DEFAULT NULL,
  `h7` varchar(5) DEFAULT NULL,
  `h8` varchar(5) DEFAULT NULL,
  `h9` varchar(5) DEFAULT NULL,
  `h10` varchar(5) DEFAULT NULL,
  `h11` varchar(5) DEFAULT NULL,
  `h12` varchar(5) DEFAULT NULL,
  `h13` varchar(5) DEFAULT NULL,
  `h14` varchar(5) DEFAULT NULL,
  `h15` varchar(5) DEFAULT NULL,
  `hr` varchar(5) DEFAULT NULL,
  `hh` varchar(5) DEFAULT NULL,
  `he` varchar(5) DEFAULT NULL,
  `hb` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.defences 구조 내보내기
CREATE TABLE IF NOT EXISTS `defences` (
  `ranking` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `defences_name` varchar(30) DEFAULT NULL,
  `team_name` varchar(20) DEFAULT NULL,
  `POS` varchar(50) DEFAULT NULL COMMENT '포지션',
  `G` int(11) DEFAULT NULL COMMENT '경기 수',
  `GS` int(11) DEFAULT NULL COMMENT '선발 경기 수',
  `IP` decimal(20,6) DEFAULT NULL COMMENT '수비이닝 수',
  `E` int(11) DEFAULT NULL COMMENT '실책 수',
  `PKO` int(11) DEFAULT NULL COMMENT '견제사 수',
  `PO` int(11) DEFAULT NULL COMMENT '풋 아웃 수',
  `A` int(11) DEFAULT NULL COMMENT '어시스트 수',
  `DP` int(11) DEFAULT NULL COMMENT '병살 수',
  `FPCT` decimal(20,6) DEFAULT NULL COMMENT '수비율',
  `PB` int(11) DEFAULT NULL COMMENT '포일 수',
  `SB` int(11) DEFAULT NULL COMMENT '도루 허용 수',
  `CS` int(11) DEFAULT NULL COMMENT '도루 저지 수(도루 실패)',
  `CS%` decimal(20,6) DEFAULT NULL COMMENT '도루 저지 율'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='merged 수비수';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.defences_team_record 구조 내보내기
CREATE TABLE IF NOT EXISTS `defences_team_record` (
  `year` int(11) DEFAULT NULL,
  `ranking` int(11) DEFAULT NULL,
  `team_name` varchar(20) DEFAULT NULL,
  `G` int(11) DEFAULT NULL COMMENT '경기 수',
  `E` int(11) DEFAULT NULL COMMENT '실책 수',
  `PKO` int(11) DEFAULT NULL COMMENT '견제사 수',
  `PO` int(11) DEFAULT NULL COMMENT '풋 아웃 수',
  `A` int(11) DEFAULT NULL COMMENT '어시스트 수',
  `DP` int(11) DEFAULT NULL COMMENT '병살 수',
  `FPCT` decimal(20,6) DEFAULT NULL COMMENT '수비율',
  `PB` int(11) DEFAULT NULL COMMENT '포일 수',
  `SB` int(11) DEFAULT NULL COMMENT '도루 허용 수',
  `CS` int(11) DEFAULT NULL COMMENT '도루 저지 수(도루 실패)',
  `CS%` decimal(20,6) DEFAULT NULL COMMENT '도루 저지 율'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC COMMENT='수비수 팀 데이터 ';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.pitchers 구조 내보내기
CREATE TABLE IF NOT EXISTS `pitchers` (
  `ranking` int(11) NOT NULL COMMENT '순위',
  `year` int(11) NOT NULL COMMENT '연도',
  `pitchers_name` varchar(30) NOT NULL COMMENT '선수이름',
  `team_name` varchar(20) DEFAULT NULL COMMENT '팀명',
  `ERA` decimal(20,6) DEFAULT NULL COMMENT '평균 자책점',
  `G` int(11) DEFAULT NULL COMMENT '참여 경기 수',
  `W` int(11) DEFAULT NULL COMMENT '승리 경기 수',
  `L` int(11) DEFAULT NULL COMMENT '패배 경기 수',
  `SV` int(11) DEFAULT NULL COMMENT '세이브 경기 수',
  `HLD` int(11) DEFAULT NULL COMMENT '홀드 경기 수',
  `WPCT` decimal(20,6) DEFAULT NULL COMMENT '승률',
  `IP` int(11) DEFAULT NULL COMMENT '이닝 수',
  `H` int(11) DEFAULT NULL COMMENT '피안타 수',
  `HR` int(11) DEFAULT NULL COMMENT '피홈런 수',
  `BB` int(11) DEFAULT NULL COMMENT '볼넷 수',
  `HBP` int(11) DEFAULT NULL COMMENT '몸에 맞는 볼 수',
  `SO` int(11) DEFAULT NULL COMMENT '삼진 수',
  `R` int(11) DEFAULT NULL COMMENT '실점 수',
  `ER` int(11) DEFAULT NULL COMMENT '자책점',
  `WHIP` decimal(20,6) DEFAULT NULL COMMENT '이닝당 출루 허용률',
  `CG` int(11) DEFAULT NULL COMMENT '완투 수',
  `SHO` int(11) DEFAULT NULL COMMENT '완봉(실점 없이 완투)',
  `QS` int(11) DEFAULT NULL COMMENT '퀄리티 스타트 (6이닝 이상 자책3점이하)',
  `BSV` int(11) DEFAULT NULL COMMENT '세이브 홀드 상황에서 동점이나 역전을 허용',
  `TBF` int(11) DEFAULT NULL COMMENT '상대 타자 수',
  `NP` int(11) DEFAULT NULL COMMENT '투구 수',
  `AVG` decimal(20,6) DEFAULT NULL COMMENT '피안타율',
  `2B` int(11) DEFAULT NULL COMMENT '피 2루타',
  `3B` int(11) DEFAULT NULL COMMENT '피 3루타',
  `SAC` int(11) DEFAULT NULL COMMENT '피 희생번트',
  `SF` int(11) DEFAULT NULL COMMENT '희생플라이',
  `IBB` int(11) DEFAULT NULL COMMENT '고의사구',
  `WP` int(11) DEFAULT NULL COMMENT '폭투',
  `BK` int(11) DEFAULT NULL COMMENT '보크 (투수 부정행위)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='merge된 투수 데이터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.pitchers_team_record 구조 내보내기
CREATE TABLE IF NOT EXISTS `pitchers_team_record` (
  `year` int(11) NOT NULL COMMENT '연도',
  `ranking` int(11) NOT NULL COMMENT '순위',
  `team_name` varchar(20) DEFAULT NULL COMMENT '팀명',
  `ERA` decimal(20,6) DEFAULT NULL COMMENT '평균 자책점',
  `G` int(11) DEFAULT NULL COMMENT '참여 경기 수',
  `W` int(11) DEFAULT NULL COMMENT '승리 경기 수',
  `L` int(11) DEFAULT NULL COMMENT '패배 경기 수',
  `SV` int(11) DEFAULT NULL COMMENT '세이브 경기 수',
  `HLD` int(11) DEFAULT NULL COMMENT '홀드 경기 수',
  `WPCT` decimal(20,6) DEFAULT NULL COMMENT '승률',
  `IP` int(11) DEFAULT NULL COMMENT '이닝 수',
  `H` int(11) DEFAULT NULL COMMENT '피안타 수',
  `HR` int(11) DEFAULT NULL COMMENT '피홈런 수',
  `BB` int(11) DEFAULT NULL COMMENT '볼넷 수',
  `HBP` int(11) DEFAULT NULL COMMENT '몸에 맞는 볼 수',
  `SO` int(11) DEFAULT NULL COMMENT '삼진 수',
  `R` int(11) DEFAULT NULL COMMENT '실점 수',
  `ER` int(11) DEFAULT NULL COMMENT '자책점',
  `WHIP` decimal(20,6) DEFAULT NULL COMMENT '이닝당 출루 허용률',
  `CG` int(11) DEFAULT NULL COMMENT '완투 수',
  `SHO` int(11) DEFAULT NULL COMMENT '완봉(실점 없이 완투)',
  `QS` int(11) DEFAULT NULL COMMENT '퀄리티 스타트 (6이닝 이상 자책3점이하)',
  `BSV` int(11) DEFAULT NULL COMMENT '세이브 홀드 상황에서 동점이나 역전을 허용',
  `TBF` int(11) DEFAULT NULL COMMENT '상대 타자 수',
  `NP` int(11) DEFAULT NULL COMMENT '투구 수',
  `AVG` decimal(20,6) DEFAULT NULL COMMENT '피안타율',
  `2B` int(11) DEFAULT NULL COMMENT '피 2루타',
  `3B` int(11) DEFAULT NULL COMMENT '피 3루타',
  `SAC` int(11) DEFAULT NULL COMMENT '피 희생번트',
  `SF` int(11) DEFAULT NULL COMMENT '희생플라이',
  `IBB` int(11) DEFAULT NULL COMMENT '고의사구',
  `WP` int(11) DEFAULT NULL COMMENT '폭투',
  `BK` int(11) DEFAULT NULL COMMENT '보크 (투수 부정행위)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC COMMENT='투수 팀 데이터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.pit_bat_matchup 구조 내보내기
CREATE TABLE IF NOT EXISTS `pit_bat_matchup` (
  `pitcher_team` varchar(20) DEFAULT NULL,
  `pitcher` varchar(30) DEFAULT NULL,
  `batter_team` varchar(20) DEFAULT NULL,
  `batter` varchar(30) DEFAULT NULL,
  `AVG` decimal(20,6) DEFAULT NULL COMMENT '타율',
  `PA` int(11) DEFAULT NULL COMMENT '타석 수',
  `AB` int(11) DEFAULT NULL COMMENT '타수',
  `H` int(11) DEFAULT NULL COMMENT '안타',
  `2B` int(11) DEFAULT NULL COMMENT '2루타',
  `3B` int(11) DEFAULT NULL COMMENT '3루타',
  `HR` int(11) DEFAULT NULL COMMENT '홈런',
  `RBI` int(11) DEFAULT NULL COMMENT '타점',
  `BB` int(11) DEFAULT NULL COMMENT '볼넷',
  `HBP` int(11) DEFAULT NULL COMMENT '사구',
  `SO` int(11) DEFAULT NULL COMMENT '삼진',
  `SLO` decimal(20,6) DEFAULT NULL COMMENT '장타율',
  `OBP` decimal(20,6) DEFAULT NULL COMMENT '출루율',
  `OPS` decimal(20,6) DEFAULT NULL COMMENT '장타율 + 출루율'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='투 타 대결 테이블';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.question 구조 내보내기
CREATE TABLE IF NOT EXISTS `question` (
  `question_num` int(11) NOT NULL AUTO_INCREMENT COMMENT '질문 번호',
  `user_unique_number` varchar(100) NOT NULL COMMENT '고유번호',
  `admin_unique_number` varchar(100) NOT NULL COMMENT '관리자 고유번호',
  `question_title` varchar(255) DEFAULT NULL COMMENT '문의 제목',
  `question_content` text DEFAULT NULL COMMENT '문의 내용',
  `question_img_path` varchar(255) DEFAULT NULL COMMENT '이미지 파일 원본 파일명',
  `private_option` tinyint(4) NOT NULL COMMENT '비공개 옵션 (tinyint 사용)',
  `private_question_passworld` varchar(50) DEFAULT NULL COMMENT '비공개 비밀번호',
  `question_post_view` int(11) DEFAULT NULL COMMENT '문의글 조회수',
  `question_id` varchar(255) DEFAULT NULL COMMENT '질문자',
  `question_date` datetime DEFAULT NULL COMMENT '질문 날짜',
  `question_change_id` varchar(255) DEFAULT NULL COMMENT '질문 수정자',
  `question_change_date` datetime DEFAULT NULL COMMENT '질문 수정 날짜',
  `question_answer` text DEFAULT NULL COMMENT '답변',
  `answer_date` datetime DEFAULT NULL COMMENT '답변날짜',
  PRIMARY KEY (`question_num`),
  KEY `FK_question_admin` (`admin_unique_number`),
  KEY `FK_question_users` (`user_unique_number`),
  CONSTRAINT `FK_question_admin` FOREIGN KEY (`admin_unique_number`) REFERENCES `admin` (`admin_unique_number`) ON UPDATE CASCADE,
  CONSTRAINT `FK_question_users` FOREIGN KEY (`user_unique_number`) REFERENCES `users` (`user_unique_number`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=275 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.reply 구조 내보내기
CREATE TABLE IF NOT EXISTS `reply` (
  `user_unique_number` varchar(100) DEFAULT NULL COMMENT '사용자 고유번호',
  `admin_unique_number` varchar(100) DEFAULT NULL COMMENT '관리자 고유번호',
  `post_comment_num` int(11) NOT NULL COMMENT '댓글 인덱스번호',
  `post_id` int(11) DEFAULT NULL COMMENT '게시물ID',
  `reply_id` int(11) DEFAULT NULL COMMENT '답글 번호 (예 1번게시물 1번 댓글의 몇번째 답글)',
  `reply_content` text DEFAULT NULL COMMENT '답글',
  `reply_name` varchar(60) DEFAULT NULL COMMENT '답글 작성자',
  `reply_date` datetime DEFAULT NULL COMMENT '답글 작성날짜 시간',
  `reply_change_name` varchar(60) DEFAULT NULL COMMENT '답글 수정자',
  `reply_change_date` datetime DEFAULT NULL COMMENT '답글 수정시간',
  KEY `FK_comment_users` (`user_unique_number`) USING BTREE,
  KEY `FK_comment_admin` (`admin_unique_number`) USING BTREE,
  KEY `FK_comment_community` (`post_id`) USING BTREE,
  KEY `post_commnet_num` (`post_comment_num`) USING BTREE,
  KEY `reple_id` (`reply_id`) USING BTREE,
  CONSTRAINT `reply_ibfk_1` FOREIGN KEY (`admin_unique_number`) REFERENCES `admin` (`admin_unique_number`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `reply_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `community` (`post_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `reply_ibfk_3` FOREIGN KEY (`user_unique_number`) REFERENCES `users` (`user_unique_number`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC COMMENT='답글 테이블';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.schedule 구조 내보내기
CREATE TABLE IF NOT EXISTS `schedule` (
  `game_date` datetime DEFAULT NULL COMMENT '실제 3년 일정',
  `day_of_the_week` varchar(20) DEFAULT NULL COMMENT '요일',
  `season` varchar(30) DEFAULT NULL COMMENT '시즌데이터',
  `away` varchar(30) DEFAULT NULL COMMENT '원정 팀',
  `home` varchar(30) DEFAULT NULL COMMENT '홈 팀',
  `away_score` int(11) DEFAULT NULL COMMENT '원정 스코어',
  `home_score` int(11) DEFAULT NULL COMMENT '홈 스코어',
  `ground` varchar(30) DEFAULT NULL COMMENT '구장',
  `etc` varchar(30) DEFAULT NULL COMMENT '경기결과 / 취소 등',
  `winning_pitcher` varchar(50) DEFAULT NULL COMMENT '승리투수 / 무승부 예외',
  `losing_pitcher` varchar(50) DEFAULT NULL COMMENT '패배투수 / 무승부 예외'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='실제 데이터\r\n';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.schedule_test 구조 내보내기
CREATE TABLE IF NOT EXISTS `schedule_test` (
  `game_date` datetime DEFAULT NULL COMMENT '실제 3년 일정',
  `day_of_the_week` varchar(20) DEFAULT NULL COMMENT '요일',
  `season` varchar(30) DEFAULT NULL COMMENT '시즌데이터',
  `away` varchar(30) DEFAULT NULL COMMENT '원정 팀',
  `home` varchar(30) DEFAULT NULL COMMENT '홈 팀',
  `away_score` int(11) DEFAULT NULL COMMENT '원정 스코어',
  `home_score` int(11) DEFAULT NULL COMMENT '홈 스코어',
  `ground` varchar(30) DEFAULT NULL COMMENT '구장',
  `etc` varchar(30) DEFAULT NULL COMMENT '경기결과 / 취소 등',
  `winning_pitcher` varchar(50) DEFAULT NULL COMMENT '승리투수 / 무승부 예외',
  `losing_pitcher` varchar(50) DEFAULT NULL COMMENT '패배투수 / 무승부 예외'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC COMMENT='일정 백업 테이블 (기존 테이블 정렬 잘못 시 사용)\r\n\r\n';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.scoreboard 구조 내보내기
CREATE TABLE IF NOT EXISTS `scoreboard` (
  `game_date` datetime DEFAULT NULL COMMENT '경기 날짜 및 시간',
  `season` varchar(10) DEFAULT NULL COMMENT '시즌',
  `ground` varchar(10) DEFAULT NULL COMMENT '구장',
  `away_team` varchar(10) DEFAULT NULL COMMENT '원정팀',
  `away_inning1` varchar(5) DEFAULT NULL,
  `away_inning2` varchar(5) DEFAULT NULL,
  `away_inning3` varchar(5) DEFAULT NULL,
  `away_inning4` varchar(5) DEFAULT NULL,
  `away_inning5` varchar(5) DEFAULT NULL,
  `away_inning6` varchar(5) DEFAULT NULL,
  `away_inning7` varchar(5) DEFAULT NULL,
  `away_inning8` varchar(5) DEFAULT NULL,
  `away_inning9` varchar(5) DEFAULT NULL,
  `away_inning10` varchar(5) DEFAULT NULL,
  `away_inning11` varchar(5) DEFAULT NULL,
  `away_inning12` varchar(5) DEFAULT NULL,
  `away_inning13` varchar(5) DEFAULT NULL,
  `away_inning14` varchar(5) DEFAULT NULL,
  `away_inning15` varchar(5) DEFAULT NULL,
  `away_runs` varchar(6) DEFAULT NULL COMMENT '원정득점',
  `away_hits` varchar(6) DEFAULT NULL COMMENT '원정타격',
  `away_errors` varchar(6) DEFAULT NULL COMMENT '원정자책',
  `away_balls` varchar(6) DEFAULT NULL COMMENT '원정볼',
  `away_pitcher` varchar(10) DEFAULT NULL COMMENT '원정투수',
  `home_team` varchar(10) DEFAULT NULL,
  `home_inning1` varchar(5) DEFAULT NULL,
  `home_inning2` varchar(5) DEFAULT NULL,
  `home_inning3` varchar(5) DEFAULT NULL,
  `home_inning4` varchar(5) DEFAULT NULL,
  `home_inning5` varchar(5) DEFAULT NULL,
  `home_inning6` varchar(5) DEFAULT NULL,
  `home_inning7` varchar(5) DEFAULT NULL,
  `home_inning8` varchar(5) DEFAULT NULL,
  `home_inning9` varchar(5) DEFAULT NULL,
  `home_inning10` varchar(5) DEFAULT NULL,
  `home_inning11` varchar(5) DEFAULT NULL,
  `home_inning12` varchar(5) DEFAULT NULL,
  `home_inning13` varchar(5) DEFAULT NULL,
  `home_inning14` varchar(5) DEFAULT NULL,
  `home_inning15` varchar(5) DEFAULT NULL,
  `home_runs` varchar(6) DEFAULT NULL COMMENT '홈득점',
  `home_hits` varchar(6) DEFAULT NULL COMMENT '홈타격',
  `home_errors` varchar(6) DEFAULT NULL COMMENT '홈자책',
  `home_balls` varchar(6) DEFAULT NULL COMMENT '홈볼',
  `home_pitcher` varchar(10) DEFAULT NULL COMMENT '홈투수'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='이닝별 스코어보드\r\n';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.team_color 구조 내보내기
CREATE TABLE IF NOT EXISTS `team_color` (
  `Team` varchar(30) DEFAULT NULL COMMENT '팀명',
  `Color1` varchar(30) DEFAULT NULL COMMENT '팀 메인색상 1',
  `Color2` varchar(30) DEFAULT NULL COMMENT '팀 메인색상 2',
  `Home` varchar(30) DEFAULT NULL COMMENT '홈구장',
  `SubHome` varchar(30) DEFAULT NULL COMMENT '서브홈구장'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Team명, 메인색상, 보조색상, 홈구장, 보조홈구장으로 이뤄진 데이터로 시각화에 사용합니다 (박건혁)';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 yamodot_db.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `user_unique_number` varchar(100) NOT NULL COMMENT '고유번호',
  `user_id` varchar(50) DEFAULT NULL COMMENT '회원가입 아이디',
  `user_name` varchar(20) DEFAULT NULL COMMENT '사용자이름',
  `user_password` varchar(100) DEFAULT NULL COMMENT '특수문자, 영어, 숫자 허용',
  `user_nickname` varchar(50) DEFAULT NULL COMMENT '사용자의 닉네임',
  `user_email` varchar(100) DEFAULT NULL COMMENT '사용자 이메일',
  `user_create_date` datetime DEFAULT NULL COMMENT '회원가입날짜',
  `user_edit_information_date` datetime DEFAULT NULL COMMENT '회원정보 수정날짜 / 초기 = 회원가입날짜',
  `user_stop_count` int(11) DEFAULT 0 COMMENT '유저정지횟수',
  `user_stop_date` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '유저정지기간',
  `user_state` varchar(10) DEFAULT 'R' COMMENT '유저상태 : R = 정상, S = 정지',
  `user_before_password` varchar(100) DEFAULT NULL COMMENT '이전 비밀번호',
  `user_birth_day` varchar(20) DEFAULT NULL COMMENT '생년월일',
  `user_gender` int(11) DEFAULT NULL COMMENT '성별 (선택사항) 남자 1 / 여자 2 / 선택안함 3',
  `user_favorite_team` varchar(20) DEFAULT NULL COMMENT '좋아하는 팀',
  `user_svc_use_pcy_agmt_yn` enum('Y','N') DEFAULT NULL COMMENT '서비스 이용 동의',
  `user_ps_info_proc_agmt_yn` enum('Y','N') DEFAULT NULL COMMENT '개인정보 처리 방침 동의',
  `user_social_login_sep` varchar(10) DEFAULT NULL COMMENT '자체: Y, 카카오: K, 네이버: N, 지메일: G',
  `role` varchar(10) DEFAULT NULL COMMENT 'user : 유저 / admin : 관리자',
  PRIMARY KEY (`user_unique_number`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
