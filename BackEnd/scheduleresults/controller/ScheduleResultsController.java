package com.example.scheduleresults.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.scheduleresults.model.ScheduleResults;
import com.example.scheduleresults.model.ScoreBoard;
import com.example.scheduleresults.service.ResultsService;

//# 작성자 : 윤지훈
//# 작성일 : 2024-10-08
//# 기  능 : 일정/결과 출력 컨트롤러
@RestController
@RequestMapping("/api")
public class ScheduleResultsController {

    @Autowired
    private ResultsService resultsService;
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 정규시즌 일정/결과
	// # 매개변수 : 연도, 월 
    @GetMapping("/scheduleresults")
    public Map<String, Object> getResultsPage(@RequestParam(value = "year", defaultValue = "2024") int year,
                                  @RequestParam(value = "month", defaultValue = "08") int month) {
    	// 파라미터를 넣지 않으면 디폴트값 2024-08 일정/결과 출력
    	
        List<ScheduleResults> scheduleResults = resultsService.getAllResults(year, month);
        Map<String, Object> response = new HashMap<>();
        response.put("scheduleResults", scheduleResults);
        response.put("year", year);
        response.put("month", month);
        
        return response;
    }
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 포스트시즌 일정/결과
	// # 매개변수 : 연도, 월 
    @GetMapping("/postscheduleresults")
    public Map<String, Object> getPostResultsPage(@RequestParam(value = "year", defaultValue = "2024") int year,
                                  @RequestParam(value = "month", defaultValue = "10") int month) {
    	// 파라미터를 넣지 않으면 디폴트값 2024-10 일정/결과 출력
    	
        List<ScheduleResults> postScheduleResults = resultsService.getPostResults(year, month);
        Map<String, Object> response = new HashMap<>();
        response.put("postScheduleResults", postScheduleResults);
        response.put("year", year);
        response.put("month", month);
        
        return response;
    }

	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 스코어보드 조회
	// # 매개변수 : date yyyy-MM-dd
    @GetMapping("/scoreboard")
    public Map<String, Object> getScoreboardPage(@RequestParam(value = "date", required = false, defaultValue = "2024-08-13") String date) {
    	
        List<ScoreBoard> scoreBoard = resultsService.getSelectAllScoreBoard(date);
        Map<String, Object> response = new HashMap<>();
        response.put("scoreBoard", scoreBoard);
        response.put("date", date);
        
        return response;  // JSON 형식으로 반환
    }
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 선택된 날짜 기준 이전 경기 스코어보드 조회
	// # 매개변수 : date yyyy-MM-dd
    @GetMapping("/prevscoreboard")
    public Map<String, Object> getPrevScoreboardPage(@RequestParam(value = "date", required = false) String date) {
    	
        List<ScoreBoard> scoreBoard = resultsService.getSelectPrevScoreBoard(date);
        Map<String, Object> response = new HashMap<>();
        response.put("scoreBoard", scoreBoard);
        response.put("date", date);
        
        return response;  // JSON 형식으로 반환
    }
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 선택된 날짜 기준 다음 경기 스코어보드 조회
	// # 매개변수 : date yyyy-MM-dd
    @GetMapping("/nextscoreboard")
    public Map<String, Object> getNextScoreboardPage(@RequestParam(value = "date", required = false) String date) {
    	
        List<ScoreBoard> scoreBoard = resultsService.getSelectNextScoreBoard(date);
        Map<String, Object> response = new HashMap<>();
        response.put("scoreBoard", scoreBoard);
        response.put("date", date);
        
        return response;  // JSON 형식으로 반환
    }
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 홈화면 메인스케쥴
    @GetMapping("/mainschedule")
    public Map<String, Object> getMainSchedule(@RequestParam(value = "date") String date){
    	
    	List<ScheduleResults> mainSchedule = resultsService.getMainResults(date);
    	Map<String, Object> response = new HashMap<>();
    	response.put("mainSchedule", mainSchedule);
    	response.put("date", date);
    	
    	return response;
    }
}
