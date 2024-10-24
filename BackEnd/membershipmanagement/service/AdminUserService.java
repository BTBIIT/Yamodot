package com.example.membershipmanagement.service;

import com.example.community.dto.PostCommentStatsDto;
import com.example.login_signup_back.model.User;
import com.example.login_signup_back.model.UserDTO;
import com.example.service.JwtTokenProvider;
import com.example.mapper.Mappers;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

//# 작성자 : 나기표
//# 작성일 : 2024-10-08
//# 목  적 : 관리자가 사용자 정보를 조회 및 관리하는 기능 제공
//# 기  능 : 사용자 정보 조회, 정지 처리, 정지 해제 등의 기능을 제공
@Service
public class AdminUserService {

	@Autowired
	private JwtTokenProvider jwtTokenProvider;  // JWT 토큰 제공자
	
	@Autowired
	private Mappers mapper;

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : User 객체를 UserDTO로 변환
	// # 기  능 : User 객체를 UserDTO로 변환하여 관리자에게 사용자 정보를 제공
	// # 매개변수 : user - 변환할 User 객체
	// # 반환값 : 변환된 UserDTO 객체
	private UserDTO convertToDTO(User user) {
		UserDTO userDTO = new UserDTO();
		userDTO.setUserUniqueNumber(user.getUserUniqueNumber());
		userDTO.setUserId(user.getUserId());
		userDTO.setUserName(user.getUserName());
		userDTO.setUserNickname(user.getUserNickname());
		userDTO.setUserEmail(user.getUserEmail());
		userDTO.setUserBirthDay(user.getUserBirthDay());
		userDTO.setUserCreateDate(user.getUserCreateDate());
		userDTO.setUserEditInformationDate(user.getUserEditInformationDate());
		userDTO.setUserStopCount(user.getUserStopCount());
		userDTO.setUserStopDate(user.getUserStopDate());
		userDTO.setUserState(user.getUserState());
		userDTO.setUserFavoriteTeam(user.getUserFavoriteTeam());
		userDTO.setUserSocialLoginSep(user.getUserSocialLoginSep());
		userDTO.setUserSvcUsePcyAgmtYn(user.getUserSvcUsePcyAgmtYn());
		userDTO.setUserPsInfoProcAgmtYn(user.getUserPsInfoProcAgmtYn());
		userDTO.setRole(user.getRole());

		return userDTO;
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 모든 사용자 정보를 조회
	// # 기  능 : 데이터베이스에서 모든 사용자를 조회하고 DTO로 변환하여 반환
	// # 매개변수 : request - HttpServletRequest 객체
	// # 반환값 : 모든 사용자 정보가 담긴 UserDTO 리스트
	@Transactional
	public List<UserDTO> getAllUsers(HttpServletRequest request) {

		// JWT 토큰 토큰추출, 유효성검사 통합메서드
		Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
		System.out.println(request + "아앙아아아아아아아아아아아아아아아아아아아아아아아아ㅏ앙아");
		
		if (authentication == null) {
			// 로그인되지 않은 사용자의 요청
			System.out.println("#########################################################");
			System.out.println("비회원 요청이 발생했습니다.");
			return List.of();  // 빈 리스트 반환
		}

		// JWT 토큰에서 userUniqueNumber 추출
		String userUniqueNumber = authentication.getName();
		System.out.println("##########################################################################################################");
		System.out.println("이게 인증통과한 유저 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
		System.out.println("##########################################################################################################");
		System.out.println(userUniqueNumber);

		// 사용자 정보 조회
		User currentUser = mapper.findbyAdminUniue(userUniqueNumber);

		// 관리자 권한 체크
		if (!"admin".equals(currentUser.getRole())) {
			// 권한이 없으면 빈 리스트 반환 (또는 예외를 던져도 됩니다)
			System.out.println("관리자 권한이 없는 사용자가 목록 조회 요청: " + currentUser.getUserId());
			return List.of(); // 빈 리스트 반환
		}

		List<User> users = mapper.findAllUsers();
		System.out.println("##########################################################################################################");
		System.out.println("조회된 사용자 리스트: " + users);
		
		return users.stream()
						.map(this::convertToDTO)  // User 객체를 DTO로 변환
						.collect(Collectors.toList());
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 관리자에 의한 사용자 정보 업데이트
	// # 기  능 : 관리자가 사용자를 정지하고, 정지 기간과 횟수를 업데이트
	// # 매개변수 : request - HttpServletRequest 객체
	//					 updateUserInfoByAdmin - 업데이트할 사용자 정보
	// # 반환값 : 업데이트 성공 여부 (true/false)
	@Transactional
	public boolean updateUser(HttpServletRequest request, User updateUserInfoByAdmin) {

		// JWT 토큰 토큰추출, 유효성검사 통합메서드
		Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);

		// JWT 토큰에서 userUniqueNumber 추출
		String userUniqueNumber = authentication.getName();
		System.out.println("##########################################################################################################");
		System.out.println("이게 인증통과한 유저 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
		System.out.println("##########################################################################################################");
		System.out.println(userUniqueNumber);
		
		// 사용자 정보 조회
		User currentUser = mapper.findbyAdminUniue(userUniqueNumber);
		
		// 조회된 관리자가 없을 경우 (null일 경우) 처리
		if (currentUser == null || !"admin".equals(currentUser.getRole())) {
			System.out.println("관리자 계정이 아닙니다: 유니크 넘버 - " + userUniqueNumber);
			return false;  // 업데이트 실패 처리
		}
		
		try {
			System.out.println("정지할 유저 정보: " + updateUserInfoByAdmin + "   ########################################################################################3");
			
			User userToUpdate = mapper.findByUniqueId(updateUserInfoByAdmin.getUserUniqueNumber());
			
			
			// 정지 시작일을 오늘로 설정
			Date today = new Date();
			updateUserInfoByAdmin.setUserStopDate(today);

			// 정지 기간을 1개월로 설정 (오늘부터 한 달 뒤)
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(today);
			calendar.add(Calendar.MONTH, 1); // 1개월 추가
			Date stopEndDate = calendar.getTime();

			// 정지 기간 설정 (여기서는 stopEndDate 변수를 활용해 프런트에서 설정된 정지 기간으로 처리 가능)
			updateUserInfoByAdmin.setUserStopDate(stopEndDate);

			// 정지 횟수를 1 증가시킴
			int currentStopCount = userToUpdate.getUserStopCount();
			System.out.println("현재 정지 횟수: " + currentStopCount);
			updateUserInfoByAdmin.setUserStopCount(currentStopCount + 1);
			System.out.println("정지 횟수 업데이트 후: " + updateUserInfoByAdmin.getUserStopCount());

			// 사용자 상태를 'S' (정지)로 설정
			updateUserInfoByAdmin.setUserState("S");

			int updateCount = mapper.updateUserInfoByAdmin(updateUserInfoByAdmin);
			System.out.println("업데이트된 행의 수: " + updateCount); // 관리자용 사용자 정보 업데이트 쿼리 실행
			
			// 정지된 사용자 정보 출력
			System.out.println("사용자 ID " + updateUserInfoByAdmin + "가 정지되었습니다. 정지 시작일: " 
					+ today + ", 정지 종료일: " + stopEndDate + ", 정지 횟수: " + (currentStopCount + 1));
			
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-09
	// # 목  적 : 관리자에 의한 사용자 정보 업데이트
	// # 기  능 : 관리자가 사용자를 정지해제하고, 정지 기간과 횟수를 업데이트
	// # 매개변수 : request - HttpServletRequest 객체
	//					 updateUserInfoByAdmin - 업데이트할 사용자 정보
	// # 반환값 : 업데이트 성공 여부 (true/false)
	@Transactional
	public boolean releaseUser(HttpServletRequest request, User userToRelease) {
		// JWT 토큰 추출 및 유효성 검사
		Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);

		// JWT 토큰에서 userUniqueNumber 추출
		String userUniqueNumber = authentication.getName();
		System.out.println("##########################################################################################################");
		System.out.println("이게 인증통과한 유저 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
		System.out.println("##########################################################################################################");
		System.out.println(userUniqueNumber);
		
		// 관리자 계정 조회
		User currentUser = mapper.findbyAdminUniue(userUniqueNumber);
		
		// 관리자가 아니면 실패 처리
		if (currentUser == null || !"admin".equals(currentUser.getRole())) {
			System.out.println("관리자 계정이 아닙니다: 유니크 넘버 - " + userUniqueNumber);
			return false;
		}
		
		try {
			System.out.println("정지 해제할 유저 정보: " + userToRelease.getUserId() + "    #############################################################################3##################");
			// 정지 횟수를 1 감소시킴
			int currentStopCount = userToRelease.getUserStopCount();
			if (currentStopCount > 0) {
				userToRelease.setUserStopCount(currentStopCount - 1);
			}
			
			// 정지 날짜를 null로 설정
			userToRelease.setUserStopDate(null);
			
			// 사용자 상태를 정상('R')으로 변경
			userToRelease.setUserState("R");
			
			// 사용자 정보 업데이트
			mapper.updateUserInfoByAdmin(userToRelease);  // MyBatis 쿼리 실행
			
			// 정지 해제된 사용자 정보 출력
			System.out.println("사용자 ID " + userToRelease.getUserId() + "의 정지가 해제되었습니다. 현재 정지 횟수: " + userToRelease.getUserStopCount());

			return true;
		} catch (Exception e) {
			e.printStackTrace();
			
			return false;
		}
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 정지된 사용자를 자동으로 해제하는 기능
	// # 기  능 : 매일 자정마다 정지 기간이 만료된 사용자의 상태를 변경하고, 상태를 정상으로 복구
	// # 반환값 : 없음
	@Scheduled(cron = "0 0 0 * * *")
//	@Scheduled(cron = "*/5 * * * * *") // 매 5초마다 실행
	//cron 표현식  7개의 필드 (초 분 시 일 월 요일 연도)   (cron = "*/5 * * * * *") // 매 5초마다 실행  (cron = "0 0 0 * * *") // 자정마다 실행
	public void releaseSuspendedUsers() {
		System.out.println("스케쥴 작동 (자정마다 실행)");

		// 정지된 사용자 목록 조회
		List<User> suspendedUsers = mapper.findSuspendedUsers();
		System.out.println("##########################################################################################################");
		System.out.println("정지된 사용자 목록:");

		// 정지된 사용자 ID 출력
		for (User user : suspendedUsers) {
			System.out.println("##########################################################################################################");
			System.out.println("User ID: " + user.getUserId());
		}

		// 현재 날짜 (날짜만 비교하기 위해 포맷 변경)
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String currentDate = dateFormat.format(new Date());

		// 정지 해제된 사용자 수를 추적하기 위한 변수
		int releasedUserCount = 0;

		// 정지 해제할 사용자를 찾고, 상태를 변경
		for (User user : suspendedUsers) {
			if ("S".equals(user.getUserState()) && user.getUserStopDate() != null) {
				String stopDate = dateFormat.format(user.getUserStopDate());

				// 정지 해제 조건: 오늘 날짜와 정지 날짜가 동일하거나, 정지 날짜가 이미 지났으며, 정지 횟수가 3 미만일 경우
				if ((stopDate.equals(currentDate) || stopDate.compareTo(currentDate) < 0) && user.getUserStopCount() < 3) {
					user.setUserStopDate(null); // 정지 해제 (정지 날짜를 null로 설정)
					user.setUserState("R"); // 상태를 정상('R')으로 변경
					mapper.updateUserInfoByAdmin(user); // 관리자용 사용자 정보 업데이트 쿼리 실행
					releasedUserCount++; // 해제된 사용자 수 증가
					System.out.println("##########################################################################################################");
					System.out.println("정지 해제된 사용자: " + user.getUserId());
					System.out.println("##########################################################################################################");
				} else if (user.getUserStopCount() >= 3) {
					System.out.println("##########################################################################################################");
					System.out.println("정지 해제 불가 - 3회 이상 정지된 사용자: " + user.getUserId());
					System.out.println("##########################################################################################################");
				}
			}
		}

		// 해제된 사용자가 있는 경우 해제된 사용자 수 출력
		if (releasedUserCount > 0) {
			System.out.println("##########################################################################################################");
			System.out.println("총 " + releasedUserCount + "명의 사용자가 정지 해제되었습니다.");
			System.out.println("##########################################################################################################");
		} else {
			System.out.println("##########################################################################################################");
			System.out.println("정지 해제된 사용자가 없습니다.");
			System.out.println("##########################################################################################################");
		}
	}
	
    // # 작성자 : 이재훈
    // # 작성일 : 2024-10-10
    // # 목 적 : 회원의 총 게시글 수 및 댓글 수 조회
    // # 기 능 : 관리자가 사용자의 게시글 수와 댓글 수를 파악
    // # 매개변수 : userUniqueNumber - 사용자 고유번호 (String 형식)
    // # 반환값 : 사용자의 게시글 수 및 댓글 수를 포함한 PostCommentStatsDto 객체 반환
    public PostCommentStatsDto getUserPostAndCommentStats(String userUniqueNumber) {
           
        // 쿼리 호출 후 PostCommentStatsDto 객체 반환
        return mapper.getUserPostAndCommentStats(userUniqueNumber);
    }
}
