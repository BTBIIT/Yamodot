package com.example.records.model;

//# 작성자 : 윤지훈
//# 작성일 : 2024-10-08
//# 기  능 : 투수vs타자 기록 기본 클래스
public class PitBatMatchup {
	private String pitcherTeam;
	private String pitcher;
	private String batterTeam;
	private String batter;
	private double avg;
	private int pa;
	private int ab;
	private int h;
	private int twoB;
	private int threeB;
	private int hr;
	private int rbi;
	private int bb;
	private int hbp;
	private int so;
	private double slo;
	private double obp;
	private double ops;
	public String getPitcherTeam() {
		return pitcherTeam;
	}
	public void setPitcherTeam(String pitcherTeam) {
		this.pitcherTeam = pitcherTeam;
	}
	public String getPitcher() {
		return pitcher;
	}
	public void setPitcher(String pitcher) {
		this.pitcher = pitcher;
	}
	public String getBatterTeam() {
		return batterTeam;
	}
	public void setBatterTeam(String batterTeam) {
		this.batterTeam = batterTeam;
	}
	public String getBatter() {
		return batter;
	}
	public void setBatter(String batter) {
		this.batter = batter;
	}
	public double getAvg() {
		return avg;
	}
	public void setAvg(double avg) {
		this.avg = avg;
	}
	public int getPa() {
		return pa;
	}
	public void setPa(int pa) {
		this.pa = pa;
	}
	public int getAb() {
		return ab;
	}
	public void setAb(int ab) {
		this.ab = ab;
	}
	public int getH() {
		return h;
	}
	public void setH(int h) {
		this.h = h;
	}
	public int getTwoB() {
		return twoB;
	}
	public void setTwoB(int twoB) {
		this.twoB = twoB;
	}
	public int getThreeB() {
		return threeB;
	}
	public void setThreeB(int threeB) {
		this.threeB = threeB;
	}
	public int getHr() {
		return hr;
	}
	public void setHr(int hr) {
		this.hr = hr;
	}
	public int getRbi() {
		return rbi;
	}
	public void setRbi(int rbi) {
		this.rbi = rbi;
	}
	public int getBb() {
		return bb;
	}
	public void setBb(int bb) {
		this.bb = bb;
	}
	public int getHbp() {
		return hbp;
	}
	public void setHbp(int hbp) {
		this.hbp = hbp;
	}
	public int getSo() {
		return so;
	}
	public void setSo(int so) {
		this.so = so;
	}
	public double getSlo() {
		return slo;
	}
	public void setSlo(double slo) {
		this.slo = slo;
	}
	public double getObp() {
		return obp;
	}
	public void setObp(double obp) {
		this.obp = obp;
	}
	public double getOps() {
		return ops;
	}
	public void setOps(double ops) {
		this.ops = ops;
	}
	
	
}
