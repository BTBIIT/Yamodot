package com.example.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;  // 로거 추가
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class AuthTokenController {

	private static final Logger logger = LoggerFactory.getLogger(AuthTokenController.class);  // 로거 추가
	
	private final JwtTokenProvider jwtTokenProvider;
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-17
	// # 목  적 : JwtTokenProvider 주입을 통한 토큰 관리 및 발급을 처리하기 위한 컨트롤러 생성자
	// # 기  능 : JwtTokenProvider를 사용하여 인증 및 토큰 발급 기능 제공
	public AuthTokenController(JwtTokenProvider jwtTokenProvider) {
		this.jwtTokenProvider = jwtTokenProvider;
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-17
	// # 목  적 : 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급
	// # 기  능 : 클라이언트에서 리프레시 토큰을 제공하면 해당 토큰의 유효성을 검증하고, 유효한 경우 새로운 액세스 토큰 발급
	// # 매개변수 : request - HttpServletRequest 객체 (클라이언트 요청 정보)
	//           response - HttpServletResponse 객체 (서버 응답 정보)
	// # 반환값 : 발급 성공 시 "새로운 액세스 토큰이 발급되었습니다." 메시지 반환, 실패 시 UNAUTHORIZED 응답
	@PostMapping("/refresh-token")
	public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
		logger.info("리프레시 토큰 발급 요청이 들어왔습니다.");  // 시작 로그
		
		// 쿠키에서 리프레시 토큰 추출
		String refreshToken = getTokenFromCookies(request, "refreshToken");
		
		// 리프레시 토큰이 유효한 경우 처리
		if (refreshToken != null && jwtTokenProvider.validateToken(refreshToken)) {
			logger.info("유효한 리프레시 토큰이 확인되었습니다.");
			
			// 리프레시 토큰에서 사용자 고유 번호 및 기타 사용자 정보 추출
			String userUniqueNumber = jwtTokenProvider.getUserUniqueNumber(refreshToken);
			String userState = jwtTokenProvider.getUserState(refreshToken);
			Map<String, String> roleAndFavoriteTeam = jwtTokenProvider.getRoleAndFavoriteTeam(refreshToken);
			
			logger.info("리프레시 토큰에서 사용자 정보 추출 완료: 유니크 넘버={}, 역할={}",
					userUniqueNumber, roleAndFavoriteTeam.get("role"));
			
			// 새로운 액세스 토큰 발급
			String newAccessToken = jwtTokenProvider.createToken(
					userUniqueNumber,
					roleAndFavoriteTeam.get("role"),
					roleAndFavoriteTeam.get("userFavoriteTeam"),
					userState
					);
			
			logger.info("새로운 액세스 토큰 발급 완료: {}", newAccessToken);
			
			// 새로 발급한 액세스 토큰을 HttpOnly 쿠키로 설정
			Cookie newAccessTokenCookie = new Cookie("jwtToken", newAccessToken);
			newAccessTokenCookie.setHttpOnly(true);  // HttpOnly 속성으로 설정 (클라이언트 스크립트에서 접근 불가)
			newAccessTokenCookie.setSecure(false);  // HTTPS에서만 사용하려면 true로 변경
			newAccessTokenCookie.setPath("/");  // 경로 설정 (전체 사이트에서 사용 가능)
			newAccessTokenCookie.setMaxAge(60 * 60);  // 1시간 (테스트 시 조정 가능)
			
			// 응답에 쿠키 추가
			response.addCookie(newAccessTokenCookie);
			
			logger.info("새로운 액세스 토큰이 쿠키에 추가되었습니다.");
			return ResponseEntity.ok("새로운 액세스 토큰이 발급되었습니다.");
		} else {
			logger.warn("유효하지 않거나 만료된 리프레시 토큰입니다.");  // 경고 로그
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("유효하지 않거나 만료된 리프레시 토큰입니다.");
		}
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-17
	// # 목  적 : 쿠키에서 특정 이름의 토큰을 추출하는 유틸리티 메서드
	// # 기  능 : HttpServletRequest 객체에서 지정된 이름의 쿠키를 찾아 토큰 값을 반환
	// # 매개변수 : request - HttpServletRequest 객체 (클라이언트 요청 정보)
	//           tokenName - 추출할 토큰의 이름
	// # 반환값 : 해당 이름의 토큰 값 (찾지 못한 경우 null)
	private String getTokenFromCookies(HttpServletRequest request, String tokenName) {
		if (request.getCookies() != null) {
			for (Cookie cookie : request.getCookies()) {
				if (tokenName.equals(cookie.getName())) {
					logger.info("쿠키에서 {} 토큰을 성공적으로 추출했습니다.", tokenName);
					return cookie.getValue();  // 쿠키에서 추출한 토큰 반환
				}
			}
		}
		logger.warn("{} 토큰을 쿠키에서 찾을 수 없습니다.", tokenName);  // 쿠키에서 토큰을 찾지 못한 경우 경고 로그
		return null;
	}
}
