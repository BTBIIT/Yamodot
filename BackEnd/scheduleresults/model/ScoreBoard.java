package com.example.scheduleresults.model;

import java.text.SimpleDateFormat;
import java.util.Date;

// # 작성자 : 윤지훈
// # 작성일 : 2024-10-08
// # 기  능 : 스코어보드 기본 클래스
public class ScoreBoard {
	 private Date gameDate;
	 private String time;
	 private String ground;
	 private String status;
	 private String awayTeam;
	 private String awayWinOrLose;
	 private String awayInning1;
	 private String awayInning2;
	 private String awayInning3;
	 private String awayInning4;
	 private String awayInning5;
	 private String awayInning6;
	 private String awayInning7;
	 private String awayInning8;
	 private String awayInning9;
	 private String awayInning10;
	 private String awayInning11;
	 private String awayInning12;
	 private String awayInning13;
	 private String awayInning14;
	 private String awayInning15;
	 private String awayRuns;
	 private String awayHits;
	 private String awayErrors;
	 private String awayBalls;
	 private String awayPitcher;
	 private String homeTeam;
	 private String homeWinOrLose;
	 private String homeInning1;
	 private String homeInning2;
	 private String homeInning3;
	 private String homeInning4;
	 private String homeInning5;
	 private String homeInning6;
	 private String homeInning7;
	 private String homeInning8;
	 private String homeInning9;
	 private String homeInning10;
	 private String homeInning11;
	 private String homeInning12;
	 private String homeInning13;
	 private String homeInning14;
	 private String homeInning15;
	 private String homeRuns;
	 private String homeHits;
	 private String homeErrors;
	 private String homeBalls;
	 private String homePitcher;
	 private String season;
	 

	public String getSeason() {
		return season;
	}
	public void setSeason(String season) {
		this.season = season;
	}
	public String getGameDate() {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String gamedate = df.format(gameDate);
		return gamedate;
	}
	public void setGameDate(Date gameDate) {
		this.gameDate = gameDate;
	}
	public String getTime() {
		SimpleDateFormat df = new SimpleDateFormat("HH:mm");
		String time = df.format(gameDate);
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getGround() {
		return ground;
	}
	public void setGround(String ground) {
		this.ground = ground;
	}
	public String getAwayTeam() {
		return awayTeam;
	}
	public void setAwayTeam(String awayTeam) {
		this.awayTeam = awayTeam;
	}
	public String getAwayInning1() {
		return awayInning1;
	}
	public void setAwayInning1(String awayInning1) {
		this.awayInning1 = awayInning1;
	}
	public String getAwayInning2() {
		return awayInning2;
	}
	public void setAwayInning2(String awayInning2) {
		this.awayInning2 = awayInning2;
	}
	public String getAwayInning3() {
		return awayInning3;
	}
	public void setAwayInning3(String awayInning3) {
		this.awayInning3 = awayInning3;
	}
	public String getAwayInning4() {
		return awayInning4;
	}
	public void setAwayInning4(String awayInning4) {
		this.awayInning4 = awayInning4;
	}
	public String getAwayInning5() {
		return awayInning5;
	}
	public void setAwayInning5(String awayInning5) {
		this.awayInning5 = awayInning5;
	}
	public String getAwayInning6() {
		return awayInning6;
	}
	public void setAwayInning6(String awayInning6) {
		this.awayInning6 = awayInning6;
	}
	public String getAwayInning7() {
		return awayInning7;
	}
	public void setAwayInning7(String awayInning7) {
		this.awayInning7 = awayInning7;
	}
	public String getAwayInning8() {
		return awayInning8;
	}
	public void setAwayInning8(String awayInning8) {
		this.awayInning8 = awayInning8;
	}
	public String getAwayInning9() {
		return awayInning9;
	}
	public void setAwayInning9(String awayInning9) {
		this.awayInning9 = awayInning9;
	}
	public String getAwayInning10() {
		return awayInning10;
	}
	public void setAwayInning10(String awayInning10) {
		this.awayInning10 = awayInning10;
	}
	public String getAwayInning11() {
		return awayInning11;
	}
	public void setAwayInning11(String awayInning11) {
		this.awayInning11 = awayInning11;
	}
	public String getAwayInning12() {
		return awayInning12;
	}
	public void setAwayInning12(String awayInning12) {
		this.awayInning12 = awayInning12;
	}
	public String getAwayInning13() {
		return awayInning13;
	}
	public void setAwayInning13(String awayInning13) {
		this.awayInning13 = awayInning13;
	}
	public String getAwayInning14() {
		return awayInning14;
	}
	public void setAwayInning14(String awayInning14) {
		this.awayInning14 = awayInning14;
	}
	public String getAwayInning15() {
		return awayInning15;
	}
	public void setAwayInning15(String awayInning15) {
		this.awayInning15 = awayInning15;
	}
	public String getAwayRuns() {
		return awayRuns;
	}
	public void setAwayRuns(String awayRuns) {
		this.awayRuns = awayRuns;
	}
	public String getAwayHits() {
		return awayHits;
	}
	public void setAwayHits(String awayHits) {
		this.awayHits = awayHits;
	}
	public String getAwayErrors() {
		return awayErrors;
	}
	public void setAwayErrors(String awayErrors) {
		this.awayErrors = awayErrors;
	}
	public String getAwayBalls() {
		return awayBalls;
	}
	public void setAwayBalls(String awayBalls) {
		this.awayBalls = awayBalls;
	}

	public String getHomeTeam() {
		return homeTeam;
	}
	public void setHomeTeam(String homeTeam) {
		this.homeTeam = homeTeam;
	}
	public String getHomeInning1() {
		return homeInning1;
	}
	public void setHomeInning1(String homeInning1) {
		this.homeInning1 = homeInning1;
	}
	public String getHomeInning2() {
		return homeInning2;
	}
	public void setHomeInning2(String homeInning2) {
		this.homeInning2 = homeInning2;
	}
	public String getHomeInning3() {
		return homeInning3;
	}
	public void setHomeInning3(String homeInning3) {
		this.homeInning3 = homeInning3;
	}
	public String getHomeInning4() {
		return homeInning4;
	}
	public void setHomeInning4(String homeInning4) {
		this.homeInning4 = homeInning4;
	}
	public String getHomeInning5() {
		return homeInning5;
	}
	public void setHomeInning5(String homeInning5) {
		this.homeInning5 = homeInning5;
	}
	public String getHomeInning6() {
		return homeInning6;
	}
	public void setHomeInning6(String homeInning6) {
		this.homeInning6 = homeInning6;
	}
	public String getHomeInning7() {
		return homeInning7;
	}
	public void setHomeInning7(String homeInning7) {
		this.homeInning7 = homeInning7;
	}
	public String getHomeInning8() {
		return homeInning8;
	}
	public void setHomeInning8(String homeInning8) {
		this.homeInning8 = homeInning8;
	}
	public String getHomeInning9() {
		return homeInning9;
	}
	public void setHomeInning9(String homeInning9) {
		this.homeInning9 = homeInning9;
	}
	public String getHomeInning10() {
		return homeInning10;
	}
	public void setHomeInning10(String homeInning10) {
		this.homeInning10 = homeInning10;
	}
	public String getHomeInning11() {
		return homeInning11;
	}
	public void setHomeInning11(String homeInning11) {
		this.homeInning11 = homeInning11;
	}
	public String getHomeInning12() {
		return homeInning12;
	}
	public void setHomeInning12(String homeInning12) {
		this.homeInning12 = homeInning12;
	}
	public String getHomeInning13() {
		return homeInning13;
	}
	public void setHomeInning13(String homeInning13) {
		this.homeInning13 = homeInning13;
	}
	public String getHomeInning14() {
		return homeInning14;
	}
	public void setHomeInning14(String homeInning14) {
		this.homeInning14 = homeInning14;
	}
	public String getHomeInning15() {
		return homeInning15;
	}
	public void setHomeInning15(String homeInning15) {
		this.homeInning15 = homeInning15;
	}
	public String getHomeRuns() {
		return homeRuns;
	}
	public void setHomeRuns(String homeRuns) {
		this.homeRuns = homeRuns;
	}
	public String getHomeHits() {
		return homeHits;
	}
	public void setHomeHits(String homeHits) {
		this.homeHits = homeHits;
	}
	public String getHomeErrors() {
		return homeErrors;
	}
	public void setHomeErrors(String homeErrors) {
		this.homeErrors = homeErrors;
	}
	public String getHomeBalls() {
		return homeBalls;
	}
	public void setHomeBalls(String homeBalls) {
		this.homeBalls = homeBalls;
	}
	public String getAwayPitcher() {
		return awayPitcher;
	}
	public void setAwayPitcher(String awayPitcher) {
		this.awayPitcher = awayPitcher;
	}
	public String getHomePitcher() {
		return homePitcher;
	}
	public void setHomePitcher(String homePitcher) {
		this.homePitcher = homePitcher;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus() {
		Date now = new Date();
		if(this.gameDate.before(now)) {
			this.status = "경기종료";
		} else {
			this.status = "경기예정";
		}
	}
	public String getAwayWinOrLose() {
		return awayWinOrLose;
	}
	public void setAwayWinOrLose() {
		if(Integer.parseInt(this.awayRuns) > Integer.parseInt(this.homeRuns)){
			this.awayWinOrLose = "승";
		} else if(Integer.parseInt(this.awayRuns) < Integer.parseInt(this.homeRuns)) {
			this.awayWinOrLose = "패";
		} else {
			this.awayWinOrLose = "무";
		}
	}
	public String getHomeWinOrLose() {
		return homeWinOrLose;
	}
	public void setHomeWinOrLose() {
		if(Integer.parseInt(this.homeRuns) > Integer.parseInt(this.awayRuns)){
			this.homeWinOrLose = "승";
		} else if(Integer.parseInt(this.homeRuns) < Integer.parseInt(this.awayRuns)) {
			this.homeWinOrLose = "패";
		} else {
			this.homeWinOrLose = "무";
		}
	}
}
