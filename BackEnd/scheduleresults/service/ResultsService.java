package com.example.scheduleresults.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.mapper.Mappers;
import com.example.scheduleresults.model.ScheduleResults;
import com.example.scheduleresults.model.ScoreBoard;

//# 작성자 : 윤지훈
//# 작성일 : 2024-10-08
//# 기  능 : 일정/결과 관련 출력을 위한 비지니스로직 
@Service
public class ResultsService {
	
	@Autowired
	private Mappers mapper;
	
	// # 기  능 : 정규시즌 경기/일정
	@Transactional(readOnly = true)
	public List<ScheduleResults> getAllResults(int year, int month) {
		
		List<ScheduleResults> results;
		results = mapper.selectAllResults(year, month);
		for(int i=0; i<results.size(); i++) {
			results.get(i).setHomeWinLose();
			results.get(i).setAwayWinLose();
			results.get(i).setHomePitcher();
			results.get(i).setAwayPitcher();
		}
		
		return results;
	}
	
	// # 기  능 : 포스트시즌 경기/일정
	@Transactional(readOnly = true)
	public List<ScheduleResults> getPostResults(int year, int month) {
		
		List<ScheduleResults> results;
		results = mapper.selectPostResults(year, month);
		for(int i=0; i<results.size(); i++) {
			results.get(i).setHomeWinLose();
			results.get(i).setAwayWinLose();
			results.get(i).setHomePitcher();
			results.get(i).setAwayPitcher();
		}
		return results;
	}

	// # 기  능 : 스코어보드 조회
	@Transactional(readOnly = true)
	public List<ScoreBoard> getSelectAllScoreBoard(String date) {
		
			List<ScoreBoard> results;
			results = mapper.selectAllScoreBoard(date); 
			for(int i=0; i<results.size(); i++) {
				results.get(i).setStatus();
				results.get(i).setAwayWinOrLose();
				results.get(i).setHomeWinOrLose();
			}
			
			return results;
	}
	
	// # 기  능 : 선택한 날짜 이전경기 스코어보드 조회
	@Transactional(readOnly = true)
	public List<ScoreBoard> getSelectPrevScoreBoard(String date) {
		
			return mapper.selectPrevScoreBoard(date);
	}
	
	// # 기  능 : 선택한 날짜 다음경기 스코어보드 조회
	@Transactional(readOnly = true)
	public List<ScoreBoard> getSelectNextScoreBoard(String date) {
		
			return mapper.selectNextScoreBoard(date);
	}

	// # 기  능 : 홈화면 일정/결과
	@Transactional(readOnly = true)
	public List<ScheduleResults> getMainResults(String date) {
		List<ScheduleResults> results;
		results = mapper.selectMainSchedule(date);
		for(int i=0; i<results.size(); i++) {
			results.get(i).setHomeWinLose();
			results.get(i).setAwayWinLose();
			results.get(i).setHomePitcher();
			results.get(i).setAwayPitcher();
			if(results.get(i).getEtc().equals("-")) {
				LocalDate datethis = LocalDate.parse(results.get(i).getGameDate().substring(0,10));
				if(datethis.isBefore(LocalDate.now())) {
					results.get(i).setEtc("경기종료");
				} else if(results.get(i).getAwayScore().equals("-") || results.get(i).getAwayScore() == null){
					results.get(i).setEtc("경기예정");
				} else {
					results.get(i).setEtc("경기종료");
				}
			}
		}
		
		return results;
	}
}
