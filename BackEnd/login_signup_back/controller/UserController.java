package com.example.login_signup_back.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.login_signup_back.model.User;
import com.example.login_signup_back.model.UserDTO;
import com.example.login_signup_back.service.UserService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class UserController {

	@Autowired
	private UserService userService;  // UserService 주입
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 현재 로그인한 사용자의 정보를 반환하는 메서드
	// # 매개변수 : HttpServletRequest (현재 요청을 처리하기 위한 객체)
	// # 반환값 : 로그인한 사용자 정보 (User 객체)
	// 현재 로그인한 사용자의 정보를 반환하는 엔드포인트
	@GetMapping("/user")
	public ResponseEntity<?> getUserInfo(HttpServletRequest request) {

		// 데이터베이스에서 사용자 정보 조회
		try {
			UserDTO user = userService.findByUniqueNumber(request);  // userService에서 사용자 정보 조회
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("유저를 찾을수 없음");
			}
			
		// 필요한 필드만을 담은 Map으로 사용자 정보 반환
      Map<String, Object> responseBody = Map.of(
          "userFavoriteTeam", user.getUserFavoriteTeam() != null ? user.getUserFavoriteTeam() : "선택된 팀이 없음",
          "role", user.getRole() != null ? user.getRole() : "USER",
          "userNickname", user.getUserNickname() != null ? user.getUserNickname() : "닉네임 없음"
      );


			// 사용자 정보를 반환
			return ResponseEntity.ok(user);
		} catch (Exception e) {
			System.out.println("##########################################################################################################");
			System.out.println("데이터베이스 조회 중 오류 발생: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch user info");
		}
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 로그인한 사용자의 선호 구단 정보를 반환하는 메서드
	// # 매개변수 : HttpServletRequest (현재 요청을 처리하기 위한 객체)
	// # 반환값 : 로그인한 사용자의 선호 구단 정보
	// 로그인한 사용자의 선호 구단을 반환
	@GetMapping("/user/favorite-team")
	public ResponseEntity<?> getFavoriteTeam(HttpServletRequest request) {
		// 데이터베이스에서 사용자 정보 조회
		try {
			UserDTO user = userService.findByUniqueNumber(request);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
		}

			// 선호 구단 정보 반환
			return ResponseEntity.ok().body(Map.of("userFavoriteTeam", user.getUserFavoriteTeam()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("사용자 정보를 가져오는 데 실패했습니다.");
		}
	}
}
