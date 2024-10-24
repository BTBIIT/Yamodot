package com.example.login_signup_back.controller;

import com.example.service.JwtTokenProvider;
import com.example.login_signup_back.model.UserDTO;
import com.example.login_signup_back.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")  // 기본 URL 경로 변경
public class LoginController {

	@Autowired
	private UserService userService;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 사용자 로그인 처리 (ID와 비밀번호로 로그인 후 JWT 토큰 생성)
	// # 매개변수 : credentials (사용자 ID 및 비밀번호)
	// # 반환값 : JWT 토큰 및 사용자 정보 (관리자 여부 포함)
	// 자체 로그인 엔드포인트
//	@PostMapping("/login")
//	public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials,
//																						 HttpServletRequest request, HttpServletResponse response) {
//		try {
//			String userId = credentials.get("userId");
//			String userPassword = credentials.get("userPassword");
//			UserDTO userDTO = userService.loginUser(userId, userPassword);
//
//			if (userDTO != null) {
//				// JWT 토큰 생성
//				String token = jwtTokenProvider.createToken(userDTO.getUserUniqueNumber(), userDTO.getRole(), userDTO.getUserFavoriteTeam(), userDTO.getUserState());
//
//				System.out.println("###################################################################");
//				System.out.println("유니크넘버 : " + userDTO.getUserUniqueNumber());
//				System.out.println("유저 role : " + userDTO.getRole());
//				System.out.println("선호 구단 : " + userDTO.getUserFavoriteTeam());
//				
//				// JWT 토큰을 HttpOnly 쿠키로 설정
//				Cookie jwt = new Cookie("jwtToken", token);
//				jwt.setHttpOnly(true); 										// 자바스크립트에서 접근 불가
//				jwt.setSecure(false); 										// HTTPS에서만 전송 (테스트 시 false로 설정 가능)
//				jwt.setPath("/");													// 쿠키의 경로 설정
//				jwt.setMaxAge(60 * 60 * 24);							// 쿠키의 유효 기간 설정 (1일)
//
//				// 쿠키를 응답에 추가
//				response.addCookie(jwt);
//				System.out.println("일반로그인컨트롤러##############################################################");
//				System.out.println("JWT 토큰 발급됨: " + URLEncoder.encode(token, "UTF-8"));
//				System.out.println("###################################################################");
//
//				// 응답에 role을 포함
//				Map<String, String> responseBody = Map.of(
//					"message", "로그인 성공",
//					"role", userDTO.getRole(),   // role 정보 추가
//					"userFavoriteTeam", userDTO.getUserFavoriteTeam() != null ? userDTO.getUserFavoriteTeam() : "선택된 팀이 없음",	// favoriteTeam에 기본 값 적용
//					"userSocialLoginSep", userDTO.getRole().equals("admin") ? "Y" : userDTO.getUserSocialLoginSep(),				// 관리자는 "Y"
//					"userNickname", userDTO.getRole().equals("admin") ? "관리자" : userDTO.getUserNickname()									// 관리자는 "관리자"
//				);
//
//				return ResponseEntity.ok(responseBody);
//			} else {
//				return ResponseEntity.status(401).body(Map.of("message", "로그인 실패! 아이디 또는 비밀번호를 확인하세요."));
//			}
//		} catch (Exception e) {
//			// 오류 발생 시 로깅
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "서버 내부 오류 발생"));
//		}
//	}
	
	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials,
																									 HttpServletRequest request, HttpServletResponse response) {
		try {
			String userId = credentials.get("userId");
			String userPassword = credentials.get("userPassword");
			UserDTO userDTO = userService.loginUser(userId, userPassword);
			
			if (userDTO != null) {
				// JWT 액세스 토큰 생성
				String accessToken = jwtTokenProvider.createToken(
					userDTO.getUserUniqueNumber(),
					userDTO.getRole(),
					userDTO.getUserFavoriteTeam(),
					userDTO.getUserState()
				);
				
				// 리프레시 토큰 생성
				String refreshToken = jwtTokenProvider.createRefreshToken(userDTO.getUserUniqueNumber());
				
				System.out.println("###################################################################");
				System.out.println("유니크넘버 : " + userDTO.getUserUniqueNumber());
				System.out.println("유저 role : " + userDTO.getRole());
				System.out.println("선호 구단 : " + userDTO.getUserFavoriteTeam());
				
				// 액세스 토큰을 HttpOnly 쿠키로 설정
				Cookie accessTokenCookie = new Cookie("jwtToken", accessToken);
				accessTokenCookie.setHttpOnly(true);
				accessTokenCookie.setSecure(false);  // 테스트용으로 HTTPS가 아닌 경우 false로 설정
				accessTokenCookie.setPath("/");
				accessTokenCookie.setMaxAge(60 * 60); // 액세스 토큰 유효 기간 설정 (1시간)
				
				// 리프레시 토큰을 HttpOnly 쿠키로 설정
				Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
				refreshTokenCookie.setHttpOnly(true);
				refreshTokenCookie.setSecure(false);
				refreshTokenCookie.setPath("/");
				refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);  // 리프레시 토큰 유효 기간 설정 (7일)
				
				// 쿠키를 응답에 추가
				response.addCookie(accessTokenCookie);
				response.addCookie(refreshTokenCookie);
				
				System.out.println("일반로그인컨트롤러##############################################################");
				System.out.println("JWT 토큰 발급됨: " + URLEncoder.encode(accessToken, "UTF-8"));
				System.out.println("###################################################################");
				
				// 응답에 사용자 정보를 포함
				Map<String, String> responseBody = Map.of(
					"message", "로그인 성공",
					"role", userDTO.getRole(),   // role 정보 추가
					"userFavoriteTeam", userDTO.getUserFavoriteTeam() != null ? userDTO.getUserFavoriteTeam() : "선택된 팀이 없음",
					"userSocialLoginSep", userDTO.getRole().equals("admin") ? "Y" : userDTO.getUserSocialLoginSep(),
					"userNickname", userDTO.getRole().equals("admin") ? "관리자" : userDTO.getUserNickname()
				);
				
				return ResponseEntity.ok(responseBody);
			} else {
				return ResponseEntity.status(401).body(Map.of("message", "로그인 실패! 아이디 또는 비밀번호를 확인하세요."));
			}
		} catch (Exception e) {
			// 오류 발생 시 로깅
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "서버 내부 오류 발생"));
		}
	}

	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 사용자 로그아웃 처리 (쿠키에 저장된 JWT 토큰 삭제)
	// # 매개변수 : HttpServletResponse (응답 객체)
	// # 반환값 : 로그아웃 성공 메시지
	@PostMapping("/auth/logout")
	public ResponseEntity<?> logout(HttpServletResponse response) {
		Cookie jwtCookie = new Cookie("jwtToken", null);
		jwtCookie.setHttpOnly(true);
		jwtCookie.setSecure(false);
		jwtCookie.setPath("/");
		jwtCookie.setMaxAge(0);	// 쿠키 제거
		System.out.println("로그아웃성공");
		response.addCookie(jwtCookie);
		return ResponseEntity.ok("로그아웃 성공");
	}
}
