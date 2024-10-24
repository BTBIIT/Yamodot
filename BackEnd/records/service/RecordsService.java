package com.example.records.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.mapper.Mappers;
import com.example.records.model.Batters;
import com.example.records.model.BattersTeamRecord;
import com.example.records.model.Defence;
import com.example.records.model.DefencesTeamRecord;
import com.example.records.model.PitBatMatchup;
import com.example.records.model.Pitchers;
import com.example.records.model.PitchersTeamRecord;

// # 작성자 : 윤지훈
// # 작성일 : 2024-10-08
// # 기  능 : 모든 기록관련 출력을 위한 비지니스로직 
@Service
public class RecordsService {
	
	@Autowired
	private Mappers mapper;
    
	// # 기  능 : 선수별 수비기록
	@Transactional(readOnly = true)
    public List<Defence> getSelectAllDefence(int year, String teamName){
    	return mapper.selectAllDefence(year, teamName);
    }
    
	// # 기  능 : 선수별 타자기록
	@Transactional(readOnly = true)
    public List<Batters> getSelectAllBatters(int year, String teamName){
    	return mapper.selectAllBatters(year, teamName);
    }
    
	// # 기  능 : 선수별 투수기록
	@Transactional(readOnly = true)
    public List<Pitchers> getselectAllPitchers(int year, String teamName){
    	return mapper.selectAllPitchers(year, teamName);
    }
    
	// # 기  능 : 투수vs타자기록
	@Transactional(readOnly = true)
    public List<PitBatMatchup> getPitBatMatchup(String pitcherTeam, String pitcher, String batterTeam, String batter){
		return mapper.selectPitBatMatchup(pitcherTeam, pitcher, batterTeam, batter);
    }
    
	// # 기  능 : 투수vs타자기록을 위한 투수리스트
	@Transactional(readOnly = true)
    public List<PitBatMatchup> getPitchersList(String pitcherTeam){
    	return mapper.selectPitchersList(pitcherTeam);
    }
    
    // # 기  능 : 투수vs타자기록을 위한 투수리스트
	@Transactional(readOnly = true)
    public List<PitBatMatchup> getBattersList(String batterTeam){
    	return mapper.selectBattersList(batterTeam);
    }
    
    // # 기  능 : 팀별 수비기록
	@Transactional(readOnly = true)
    public List<DefencesTeamRecord> getselectDefencesTeamRecords(int year){
    	return mapper.selectDefencesTeamRecord(year);
    }
    
    // # 기  능 : 팀별 타자기록
	@Transactional(readOnly = true)
    public List<BattersTeamRecord> getselectBattersTeamRecords(int year){
    	return mapper.selectBattersTeamRecord(year);
    }
    
    // # 기  능 : 팀별 투수기록
	@Transactional(readOnly = true)
    public List<PitchersTeamRecord> getselectPitchersTeamRecords(int year){
    	return mapper.selectPitchersTeamRecord(year);
    }
}
