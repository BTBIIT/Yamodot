package com.example.records.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.records.model.Batters;
import com.example.records.model.BattersTeamRecord;
import com.example.records.model.Defence;
import com.example.records.model.DefencesTeamRecord;
import com.example.records.model.PitBatMatchup;
import com.example.records.model.Pitchers;
import com.example.records.model.PitchersTeamRecord;
import com.example.records.service.RecordsService;

// # 작성자 : 윤지훈
// # 작성일 : 2024-10-08
// # 기  능 : 기록 출력 컨트롤러
@RestController
@RequestMapping("/api") // API 경로를 '/api'로 시작하게 변경
public class RecordsController {

    @Autowired
    private RecordsService recordsService;

	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 선수별 타자기록
	// # 매개변수 : 연도, 팀이름 
    @GetMapping("/batters")
    public Map<String, Object> getBattersRecords(int year, String teamName){
    	
    	List<Batters> batters = recordsService.getSelectAllBatters(year, teamName);
    	Map<String, Object> response = new HashMap<>();
    	response.put("batters", batters);
    	
    	return response;
    	
    }
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 선수별 수비기록
	// # 매개변수 : 연도, 팀이름 
    @GetMapping("/defence")
    public Map<String, Object> getDefenceRecords(int year, String teamName){
    	
    	List<Defence> defence = recordsService.getSelectAllDefence(year, teamName);
    	Map<String, Object> response = new HashMap<>();
    	response.put("defence", defence);
    	
    	return response;
    }
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 선수별 타자기록
	// # 매개변수 : 연도, 팀이름 
    @GetMapping("/pitchers")
    public Map<String, Object> getPitchersRecords(int year, String teamName){
    	
    	List<Pitchers> pitchers = recordsService.getselectAllPitchers(year, teamName);
    	Map<String, Object> response = new HashMap<>();
    	response.put("pitchers", pitchers);

    	return response;
    }
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 투수 vs 타자 기록
	// # 매개변수 : 투수팀, 투수, 타자팀, 타자
    // # 반환값 : 선택한 투수와 타자의 경기기록
    @GetMapping("/pitbatmatchup")
    public Map<String, Object> getPitBatMatchup(String pitcherTeam, String pitcher, String batterTeam, String batter){
    	
    	List<PitBatMatchup> pitBatMatchup = recordsService.getPitBatMatchup(pitcherTeam, pitcher, batterTeam, batter);
    	Map<String, Object> response = new HashMap<>();
    	response.put("pitBatMatchup", pitBatMatchup);
    	
    	return response;
    }
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 투수 vs 타자 기록을 위한 팀별 투수 리스트
    @GetMapping("/allpitchers")
    public Map<String, Object> getPitchersList(String pitcherTeam){
    	
    	List<PitBatMatchup> allpitchers = recordsService.getPitchersList(pitcherTeam);
    	Map<String, Object> response = new HashMap<>();
    	response.put("allpitchers", allpitchers);
    	
    	return response;
    }
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 투수 vs 타자 기록을 위한 팀별 타자 리스트
    @GetMapping("/allbatters")
    public Map<String, Object> getBattersList(String batterTeam){
    	
    	List<PitBatMatchup> allbatters = recordsService.getBattersList(batterTeam);
    	Map<String, Object> response = new HashMap<>();
    	response.put("allbatters", allbatters);
    	
    	return response;
    }
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 팀별 수비기록
    @GetMapping("/defencesteam")
    public Map<String, Object> getDefencesTeamRecord(int year){
    	
    	List<DefencesTeamRecord> defencesteam = recordsService.getselectDefencesTeamRecords(year);
    	Map<String, Object> response = new HashMap<>();
    	response.put("defencesteam", defencesteam);

    	return response;
    }
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 팀별 투수기록
    @GetMapping("/pitchersteam")
    public Map<String, Object> getPitchersTeamRecord(int year){
    	
    	List<PitchersTeamRecord> pitchersteam = recordsService.getselectPitchersTeamRecords(year);
    	Map<String, Object> response = new HashMap<>();
    	response.put("pitchersteam", pitchersteam);

    	return response;
    }
    
	// # 작성자 : 윤지훈
	// # 작성일 : 2024-10-08
	// # 기  능 : 팀별 타자기록
    @GetMapping("/battersteam")
    public Map<String, Object> getBattersTeamRecord(int year){
    	
    	List<BattersTeamRecord> battersteam = recordsService.getselectBattersTeamRecords(year);
    	Map<String, Object> response = new HashMap<>();
    	response.put("battersteam", battersteam);

    	return response;
    }
}
