package com.example.scheduleresults.model;

import java.text.SimpleDateFormat;
import java.util.Date;

// # 작성자 : 윤지훈
// # 작성일 : 2024-10-08
// # 기  능 : 일정/결과 기본클래스
public class ScheduleResults {
	private Date gameDate;
	private String time;
	private String dayOfTheWeek;
	private String season;
	private String away;
	private String home;
	private String awayScore;
	private String homeScore;
	private String ground;
	private String etc;
	private String winningPitcher;
	private String losingPitcher;
	private String homeWinLose;
	private String awayWinLose;
	private String homePitcher;
	private String awayPitcher;
	
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

	public String getDayOfTheWeek() {
		return dayOfTheWeek;
	}

	public void setDayOfTheWeek(String dayOfTheWeek) {
		this.dayOfTheWeek = dayOfTheWeek;
	}

	public String getSeason() {
		return season;
	}

	public void setSeason(String season) {
		this.season = season;
	}

	public String getAway() {
		return away;
	}

	public void setAway(String away) {
		this.away = away;
	}

	public String getHome() {
		return home;
	}

	public void setHome(String home) {
		this.home = home;
	}

	public String getAwayScore() {
		if(this.homeScore == null) {
			return "-";
		} else {
			return awayScore;
		}
	}

	public void setAwayScore(String awayScore) {
		if(awayScore == null) {
			this.awayScore = "-";
		} else {
			this.awayScore = awayScore;
		}
	}

	public String getHomeScore() {
		if(this.homeScore == null) {
			return "-";
		} else {
			return homeScore;
		}
		
	}

	public void setHomeScore(String homeScore) {
		this.homeScore = homeScore;
	}

	public String getGround() {
		return ground;
	}

	public void setGround(String ground) {
		this.ground = ground;
	}

	public String getEtc() {
		return etc;
	}

	public void setEtc(String etc) {
		this.etc = etc;
	}

	public String getWinningPitcher() {
		return winningPitcher;
	}

	public void setWinningPitcher(String winningPitcher) {
		this.winningPitcher = winningPitcher;
	}

	public String getLosingPitcher() {
		return losingPitcher;
	}

	public void setLosingPitcher(String losingPitcher) {
		this.losingPitcher = losingPitcher;
	}

	
	
	
	public String getHomeWinLose() {
		return homeWinLose;
	}

	public void setHomeWinLose() {
		if(this.homeScore != null) {
			if(Integer.parseInt(this.homeScore) > Integer.parseInt(this.awayScore)) {
				this.homeWinLose = "승";
			} else if(Integer.parseInt(this.homeScore) < Integer.parseInt(this.awayScore)){
				this.homeWinLose = "패";
			} else {
				if(this.etc.equals("우천취소") || this.etc.equals("폭염취소") || this.etc.equals("구장취소")
						|| this.etc.equals("미세먼지취소") || homeScore == null || homeScore.equals("")) {
					this.homeWinLose = "";
				} else {
					this.homeWinLose = "무";
				}
			}
		} else {
			if(this.etc.equals("우천취소") || this.etc.equals("폭염취소") || this.etc.equals("구장취소")
					|| this.etc.equals("미세먼지취소") || homeScore == null || homeScore.equals("")) {
				this.homeWinLose = "";
				}
		}

	}

	public String getAwayWinLose() {
		return awayWinLose;
	}

	public void setAwayWinLose() {
		if(awayScore != null) {
			if(Integer.parseInt(this.awayScore) > Integer.parseInt(this.homeScore)) {
				this.awayWinLose = "승";
			} else if(Integer.parseInt(this.awayScore) < Integer.parseInt(this.homeScore)){
				this.awayWinLose = "패";
			} else {
				if(this.etc.equals("우천취소") || this.etc.equals("폭염취소") || this.etc.equals("구장취소") || this.etc.equals("미세먼지취소")
						 || homeScore == null || homeScore.equals("")) {
					this.awayWinLose = "";
				} else {
					this.awayWinLose = "무";
				}
			}
		} else {
			if(this.etc.equals("우천취소") || this.etc.equals("폭염취소") || this.etc.equals("구장취소") || this.etc.equals("미세먼지취소")
					 || homeScore == null || homeScore.equals("")) {
				this.awayWinLose = "";
			}
		}
	
	}

	public String getHomePitcher() {
		return homePitcher;
	}

	public void setHomePitcher() {
			if(this.homeWinLose == "승") {
				this.homePitcher = winningPitcher;
			} else if(this.homeWinLose == "무"){
				String[] winp = this.winningPitcher.split("_");
				String[] losep = this.losingPitcher.split("_");
				if(winp[2].equals(home)) {
					this.homePitcher = winp[1];
				} else {
					this.homePitcher = losep[1];
				}
			} else if(this.homeWinLose == "패") {
				this.homePitcher = losingPitcher;
			} else {
				this.homePitcher = "";
			}
		
		
	}

	public String getAwayPitcher() {
		return awayPitcher;
	}

	public void setAwayPitcher() {
			if(this.awayWinLose == "승") {
				this.awayPitcher = winningPitcher;
			} else if(this.awayWinLose == "무") {
				String[] winp = this.winningPitcher.split("_");
				String[] losep = this.losingPitcher.split("_");
				if(winp[2].equals(away)) {
					this.awayPitcher = winp[1];
				} else {
					this.awayPitcher = winp[1];
				}
			} else if(this.awayWinLose == "패"){
				this.awayPitcher = losingPitcher;	
			} else {
				this.awayPitcher = "";
			}
		}
	
	
}