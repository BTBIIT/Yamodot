package com.example.login_signup_back.controller;

import com.example.login_signup_back.model.UserDTO;
import com.example.login_signup_back.service.SecessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/secession")  // 회원 탈퇴와 관련된 API
public class SecessionController {

	@Autowired
	private SecessionService secessionService;
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 비밀번호 확인 후 회원 탈퇴 (구분자가 "Y"일 때)
	// # 매개변수 : request (비밀번호와 소셜 로그인 여부), httpRequest (HTTP 요청)
	// # 반환값 : 회원 탈퇴 성공 또는 실패 메시지
	@PostMapping("/delete")	// 회원 탈퇴와 관련된 API
	public ResponseEntity<?> deleteUserWithPassword(
				 @RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
		String userPassword = request.get("userPassword");
		String userSocialLoginSep = request.get("userSocialLoginSep");

		if ("Y".equals(userSocialLoginSep)) {
			boolean isDeleted = secessionService.deleteUserWithPassword(httpRequest, userPassword, userSocialLoginSep);
			System.out.println("##########################################################################################################");
			System.out.println("소셜 구분자 : " + userSocialLoginSep);
			System.out.println("##########################################################################################################");
			if (isDeleted) {
				return ResponseEntity.ok("회원 탈퇴가 성공적으로 완료되었습니다.");
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
			}
		} else {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("소셜 로그인 사용자는 비밀번호가 필요하지 않습니다.");
		}
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 구분자가 "Y"가 아닌 경우 비밀번호 없이 회원 탈퇴 처리
	// # 매개변수 : request (소셜 로그인 여부), httpRequest (HTTP 요청)
	// # 반환값 : 회원 탈퇴 성공 또는 실패 메시지, UserDTO 정보 반환
	@PostMapping("/delete-confirm")
	public ResponseEntity<?> deleteUserWithoutPassword(
				 @RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
		String userSocialLoginSep = request.get("userSocialLoginSep");

		// 실제 탈퇴 처리
		boolean isDeleted = secessionService.deleteUserWithoutPassword(httpRequest, userSocialLoginSep);
		if (isDeleted) {
			
			// 탈퇴 성공 후 UserDTO로 응답 반환
			UserDTO userDTO = secessionService.getUserInfo(httpRequest);
			System.out.println("##########################################################################################################");
			System.out.println("소셜 로그인 :" + userSocialLoginSep + "탈퇴");
			System.out.println("##########################################################################################################");
			
			return ResponseEntity.ok(userDTO + "회원 탈퇴가 성공적으로 완료되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴 처리 중 오류가 발생했습니다.");
		}
	}
}
