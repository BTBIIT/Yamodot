package com.example.login_signup_back.controller;

import com.example.login_signup_back.model.UserDTO;
import com.example.login_signup_back.service.UserUpdateService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/update")
public class UserUpdateController {

	@Autowired
	private UserUpdateService userUpdateService;  // UserUpdateService 주입
	
	private final Logger log = LoggerFactory.getLogger(getClass());
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 회원 정보 수정 메서드 (사용자 정보 수정 엔드포인트)
	// # 매개변수 : HttpServletRequest (현재 요청), UserDTO (사용자가 수정하고자 하는 정보)
	// # 반환값 : 회원 정보 수정 결과 메시지
	@PutMapping("/info")
	public ResponseEntity<?> updateUserInfo(HttpServletRequest request, @RequestBody UserDTO userInfo) {
		// 회원 정보 업데이트 시도
		String updateResult = userUpdateService.updateUserInfo(request, userInfo);
		
	// 구단 선택 예외처리
		if(userInfo.getUserFavoriteTeam() == "구단선택") {
			userInfo.setUserFavoriteTeam("%25");
		} 
		
		// 중복된 닉네임 또는 본인 닉네임일 경우 메시지 반환
		if (updateResult.equals("중복된 닉네임입니다.") || updateResult.equals("지금 사용 중인 닉네임입니다.")) {
			System.out.println("##########################################################################################################");
			System.out.println(updateResult);
			System.out.println("##########################################################################################################");
			
			return ResponseEntity.status(HttpStatus.CONFLICT).body(updateResult);
		}
		
		// 변경된 내용이 없으면 메시지 반환
		if (updateResult.equals("업데이트된 내용이 없습니다.")) {
			System.out.println("##########################################################################################################");
			System.out.println("업데이트된 내용이 없습니다.");
			System.out.println("##########################################################################################################");
			
			return ResponseEntity.ok(Map.of("message", "업데이트된 사항이 없습니다."));
		}
		
		// 회원 정보가 성공적으로 업데이트된 경우 메시지 반환
		System.out.println("##########################################################################################################");
		System.out.println("회원 정보가 성공적으로 업데이트되었습니다.");
		System.out.println("##########################################################################################################");
		
		return ResponseEntity.ok("회원 정보가 성공적으로 업데이트되었습니다.");
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 비밀번호 변경 메서드 (사용자 비밀번호 변경 엔드포인트)
	// # 매개변수 : HttpServletRequest (현재 요청), passwordData (현재 비밀번호와 새로운 비밀번호)
	// # 반환값 : 비밀번호 변경 결과 메시지
	@PutMapping("/password")
	public ResponseEntity<?> updatePassword(
													@RequestBody Map<String, String> passwordData,
													HttpServletRequest request) {
		String currentPassword = passwordData.get("currentPassword");
		String newPassword = passwordData.get("newPassword");
		System.out.println("사용자 비밀번호 변경 요청");
		
		// 비밀번호 업데이트 (user_unique_number 기준)
		System.out.println("##########################################################################################################");
		System.out.println("비밀번호 변경 요청 - 현재 비밀번호: " + currentPassword + ", 새로운 비밀번호: " + newPassword);
		System.out.println("##########################################################################################################");
		
		// 비밀번호 업데이트를 시도하고, 그에 대한 결과를 받음
		boolean isPasswordUpdated = userUpdateService.updatePassword(
				currentPassword, newPassword, request);
		
		if (!isPasswordUpdated) {
			// 비밀번호 업데이트 실패 시 적절한 메시지를 프론트엔드로 반환
			if (userUpdateService.isPreviousPasswordSame()) {
				// 이전 비밀번호와 동일한 경우
				System.out.println("##########################################################################################################");
				System.out.println("새로운 비밀번호가 이전 비밀번호와 동일합니다.");
				System.out.println("##########################################################################################################");
//				return ResponseEntity.ok(Map.of("message", "현재 사용중이거나 이전에 사용한 비밀번호입니다."));
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("현재 사용중이거나 이전에 사용한 비밀번호입니다.");
			}
			System.out.println("##########################################################################################################");
			System.out.println("비밀번호 변경 실패");
			System.out.println("##########################################################################################################");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호 변경에 실패했습니다.");
		}
		
		// 비밀번호가 성공적으로 변경된 경우
		System.out.println("##########################################################################################################");
		System.out.println("비밀번호가 성공적으로 변경되었습니다.");
		System.out.println("##########################################################################################################");
		return ResponseEntity.ok(Map.of("message", "비밀번호가 성공적으로 변경되었습니다."));
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 사용자 정보 조회 메서드 (사용자 정보 조회 엔드포인트)
	// # 매개변수 : HttpServletRequest (현재 요청)
	// # 반환값 : 사용자 정보 또는 오류 메시지
	@GetMapping("/get-user")
	public ResponseEntity<?> getUserInfo(HttpServletRequest request) {
		// userUniqueNumber로 사용자 정보 조회
		UserDTO userDTO = userUpdateService.getUserInfo(request);
		
		// 사용자 정보가 존재하는 경우 반환
		if (userDTO != null) {
			// 사용자 정보에 소셜 로그인 구분자를 포함하여 반환
			Map<String, Object> response = Map.of(
				"userId", Optional.ofNullable(userDTO.getUserId()).orElse(""),
				"userName", Optional.ofNullable(userDTO.getUserName()).orElse(""),
				"userEmail", Optional.ofNullable(userDTO.getUserEmail()).orElse(""),
				"userNickname", Optional.ofNullable(userDTO.getUserNickname()).orElse(""),
				"userBirthDay", Optional.ofNullable(userDTO.getUserBirthDay()).orElse(""),
				"userGender", Optional.ofNullable(userDTO.getUserGender()).orElse(3),
				"userFavoriteTeam", Optional.ofNullable(userDTO.getUserFavoriteTeam()).orElse("")
					);
			return ResponseEntity.ok(response);  // 사용자 정보 반환
		} else {
			// 사용자 정보를 찾을 수 없는 경우
			System.out.println("##########################################################################################################");
			System.out.println("유효하지 않은 사용자 정보");
			System.out.println("##########################################################################################################");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
		}
	}
	
	// 닉네임 중복 확인 (주석 처리된 기존 코드)
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 닉네임 중복 확인
	@GetMapping("/check-nickname")
	public ResponseEntity<Boolean> checkNicknameDuplicate(@RequestParam String nickname, String request) {
		// JWT 토큰에서 userUniqueNumber를 서비스에서 처리
		boolean isDuplicate = userUpdateService.isNicknameDuplicate(nickname, request);
		
		return ResponseEntity.ok(isDuplicate);
	}
	
	// 테스트용 (profile 페이지로 이동)
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 프로필 페이지로 이동
	@GetMapping("/profile")
	public String profilePage() {
		return "profile";  // profile.jsp로 연결됨
	}
}
