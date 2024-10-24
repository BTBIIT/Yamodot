package com.example.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

//# 작성자 : 나기표
//# 작성일 : 2024-10-10
//# 목  적 : JWT 토큰 생성 및 인증 관련 기능 제공
//# 기  능 : JWT 토큰을 생성하고, 토큰에서 인증 정보 (유니크 넘버, 역할, 선호 구단 등)를 추출하여 인증을 수행함
@Component
public class JwtTokenProvider {

	private Key secretKey;
//	private final long validityInMilliseconds = 3600000; // 1시간
	private final long validityInMilliseconds = 3600000; // 1분 테스트
	private final long refreshTokenValidityInMilliseconds = 604800000;  //7일

	 // # 작성자 : 나기표
	// # 작성일 : 2024-10-10
	// # 목  적 : secretKey 문자열을 Base64로 디코딩하여 Key 객체로 변환
	// # 매개변수 : secretKey - Base64로 인코딩된 JWT 서명용 비밀키
	@Value("${jwt.secret}")
	public void setSecretKey(String secretKey) {
		byte[] keyBytes = Base64.getDecoder().decode(secretKey);  // Base64 디코딩
		this.secretKey = Keys.hmacShaKeyFor(keyBytes);  // HMAC-SHA 알고리즘용 키 생성
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-10
	// # 목  적 : JWT 토큰을 생성
	// # 기  능 : 사용자 고유번호, 역할, 선호 구단 정보를 토대로 JWT 토큰을 생성
	// # 매개변수 : userUniqueNumber - 사용자 고유번호
	//					 role - 사용자 역할 (admin, user 등)
	//					 userFavoriteTeam - 선호 구단 (일반 유저일 경우)
	// # 반환값 : 생성된 JWT 토큰
	public String createToken(String userUniqueNumber, String role, String userFavoriteTeam, String userState) {
		Claims claims = Jwts.claims().setSubject(userUniqueNumber);
		claims.put("role", role);       // role 정보 추가(관리자 테이블 오류방지용)
		claims.put("userState", userState);
		
		// admin인 경우 선호구단을 null로 설정
		if ("admin".equals(role)) {
			userFavoriteTeam = null;  // admin의 경우 userFavoriteTeam을 null로 설정
		} else {
			claims.put("userFavoriteTeam", userFavoriteTeam);  // 일반 유저의 경우 좋아하는 팀 정보 추가
		}
		
		Date now = new Date();
		Date validity = new Date(now.getTime() + validityInMilliseconds);
		System.out.println("JwtTokenProvider : createToken 토큰생성");
		System.out.println("토큰안에 선호구단 추가!!!!" + userFavoriteTeam);
		return Jwts.builder()
							 .setClaims(claims) // 데이터
							 .setIssuedAt(now) // 토큰 발행일자
							 .setExpiration(validity) // 토큰 만료일자
							 .signWith(secretKey) // 서명
							 .compact();
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-16
	// # 목  적 : JWT 토큰을 생성
	// # 기  능 : 리프레쉬토큰 생성
	// # 매개변수 : userUniqueNumber - 사용자 고유번호
	//					 
	// # 반환값 : 생성된 JWT 토큰
	public String createRefreshToken(String userUniqueNumber) {
		Claims claims = Jwts.claims().setSubject(userUniqueNumber);
		Date now = new Date();
		Date validity = new Date(now.getTime() + refreshTokenValidityInMilliseconds);
		return Jwts.builder()
							 .setClaims(claims)
							 .setIssuedAt(now)
							 .setExpiration(validity)
							 .signWith(secretKey)
							 .compact();
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-10
	// # 목  적 : JWT 토큰에서 인증 정보 (userUniqueNumber, role, favoriteTeam) 추출
	// # 기  능 : 토큰에서 인증 정보를 추출하여 Authentication 객체를 생성
	// # 매개변수 : token - JWT 토큰
	// # 반환값 : 인증 정보를 포함한 Authentication 객체
	public Authentication getAuthentication(String token) {
		String userUniqueNumber = getUserUniqueNumber(token); // userUniqueNumber 추출
		Map<String, String> roleAndFavoriteTeam = getRoleAndFavoriteTeam(token); // role과 favoriteTeam 추출
		
		// 사용자 정보로 UserDetails 객체 생성
		UserDetails userDetails = new User(userUniqueNumber, "", Collections.emptyList());
		
		// 추출한 정보 로그 출력 (디버그용)
		System.out.println("#####################################################################333");
		System.out.println("JwtTokenProvider : getAuthentication 토큰인증정보조회");
		System.out.println("유저 유니크 넘버: " + userUniqueNumber);
		System.out.println("유저 role: " + roleAndFavoriteTeam.get("role"));
		System.out.println("유저 favoriteTeam: " + roleAndFavoriteTeam.get("userFavoriteTeam"));
		
		return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-10
	// # 목  적 : 토큰에서 유니크 넘버 추출
	// # 기  능 : JWT 토큰에서 사용자 고유번호(userUniqueNumber)를 추출함
	// # 매개변수 : token - JWT 토큰
	// # 반환값 : 사용자 고유번호 (userUniqueNumber)
	public String getUserUniqueNumber(String token) {
		System.out.println("JwtTokenProvider : getUserUniqueNumber 토큰에서 유저유니크넘버추출");
		return Jwts.parserBuilder().setSigningKey(secretKey).build()
															 .parseClaimsJws(token)
															 .getBody()
															 .getSubject();  // 'sub'에서 userUniqueNumber 추출
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-17
	// # 목  적 : 토큰에서 userState 추출
	// # 기  능 : JWT 토큰에서 사용자 유저 상태(userState)를 추출함
	// # 매개변수 : token - JWT 토큰
	// # 반환값 : 사용자 유저 상태 (userState)
  public String getUserState(String token) {
    Claims claims = Jwts.parserBuilder()
                        .setSigningKey(secretKey)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
    
    // 'userState' 클레임에서 값 추출
    return claims.get("userState", String.class);  
}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-10
	// # 목  적 : 토큰에서 role과 userFavoriteTeam 추출
	// # 기  능 : JWT 토큰에서 역할과 선호 구단 정보를 추출하여 반환
	// # 매개변수 : token - JWT 토큰
	// # 반환값 : role과 userFavoriteTeam 정보를 담은 Map 객체
	public Map<String, String> getRoleAndFavoriteTeam(String token) {
		Claims claims = Jwts.parserBuilder().setSigningKey(secretKey).build()
												.parseClaimsJws(token)
												.getBody();
		
		// **role과 userFavoriteTeam 추출**
		String role = claims.get("role", String.class); // role 정보 추출
		String userFavoriteTeam = claims.get("userFavoriteTeam", String.class); // 선호 구단 정보 추출
		
		// **결과를 Map으로 반환**
		Map<String, String> roleAndTeamInfo = new HashMap<>();
		roleAndTeamInfo.put("role", role);
		roleAndTeamInfo.put("userFavoriteTeam", userFavoriteTeam);
		
		return roleAndTeamInfo;
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-10
	// # 목  적 : HttpServletRequest에서 JWT 토큰을 추출
	// # 기  능 : 요청 헤더 또는 쿠키에서 JWT 토큰을 추출
	// # 매개변수 : request - HttpServletRequest 객체
	// # 반환값 : 추출된 JWT 토큰 (없을 경우 null)
	public String resolveToken(HttpServletRequest request) {
//		// 요청 메서드 (GET, POST 등)
//		System.out.println("요청 메서드: " + request.getMethod());
//		// 요청 URI (예: /api/auth/user)
//		System.out.println("요청 URI: " + request.getRequestURI());
//		// 전체 URL (예: http://localhost:8090/api/auth/user)
//		System.out.println("전체 URL: " + request.getRequestURL());
//		// 쿼리 파라미터 (예: ?token=123)
//		System.out.println("쿼리 문자열: " + request.getQueryString());
		// 쿠키에서 토큰 추출
		if (request.getCookies() != null) {
			for (Cookie cookie : request.getCookies()) {
				if ("jwtToken".equals(cookie.getName())) {
					System.out.println("JwtTokenProvider : resolveToken 쿠키에서 토큰 추출: 성공");
					return cookie.getValue();  // 쿠키에서 추출한 토큰 반환
				}
			}
		}
		
		// 토큰이 없을 경우 null 반환
//		System.out.println("JwtTokenProvider : Authorization 헤더, 쿼리 파라미터, 쿠키에서 토큰 없음");
		return null;
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-10
	// # 목  적 : JWT 토큰의 유효성 및 만료일자 확인
	// # 기  능 : JWT 토큰이 유효한지, 만료되지 않았는지 확인함
	// # 매개변수 : token - JWT 토큰
	// # 반환값 : 토큰이 유효하면 true, 그렇지 않으면 false
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(secretKey).build()
			.parseClaimsJws(token);
			System.out.println("JwtTokenProvider : validateToken 토큰유효성검사");
			return true;
		} catch (JwtException | IllegalArgumentException e) {
			// 유효하지 않은 토큰
			return false;
		}
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-10
	// # 목  적 : JWT 토큰을 통한 인증 및 역할 정보 추출
	// # 기  능 : HttpServletRequest에서 JWT 토큰을 추출하고, 인증을 수행하여 역할과 선호 구단 정보를 함께 조회
	// # 매개변수 : request - HttpServletRequest 객체
	// # 반환값 : 인증 정보 (Authentication 객체)
	public Authentication resolveAndAuthenticateToken(HttpServletRequest request) {
		// 1. 요청에서 토큰 추출
		String token = resolveToken(request);

		// 2. 토큰이 존재하지 않거나 유효하지 않은 경우 처리
		if (token == null || !validateToken(token)) {
			System.out.println("유효하지 않은 토큰입니다.");
			return null;  // 유효하지 않으면 null 반환 또는 예외 발생 처리 가능
		}

		// 3. 유효한 토큰에서 인증 정보 및 role, favoriteTeam, userState 추출
		Authentication authentication = getAuthentication(token);
		
		// 추가로 role과 favoriteTeam 정보 로그 출력
		Map<String, String> roleAndFavoriteTeam = getRoleAndFavoriteTeam(token);
		String userState = Jwts.parserBuilder().setSigningKey(secretKey).build()
											.parseClaimsJws(token)
											.getBody()
											.get("userState", String.class);

		System.out.println("ResolveAndAuthenticateToken - role: " + roleAndFavoriteTeam.get("role"));
		System.out.println("ResolveAndAuthenticateToken - userFavoriteTeam: " + roleAndFavoriteTeam.get("userFavoriteTeam"));
		System.out.println("ResolveAndAuthenticateToken - userState: " + userState);
		
		// Null 검사 추가
		if (authentication == null) {
			System.out.println("Authentication 객체가 null입니다. 인증 실패.");
			return null;
		}
		
		return authentication;
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-10
	// # 목  적 : JWT 토큰에서 사용자 이메일 추출
	// # 기  능 : JWT 토큰에서 사용자 이메일을 추출하여 반환
	// # 매개변수 : token - JWT 토큰
	// # 반환값 : 사용자 이메일 (JWT의 'sub' 클레임에 저장된 값)
	public String getEmailFromToken(String token) {
		Claims claims = Jwts.parserBuilder()
												.setSigningKey(secretKey)  // 서명 검증에 사용할 키 설정
												.build()
												.parseClaimsJws(token)
												.getBody();
		
		return claims.getSubject();  // 'sub' 클레임에 저장된 사용자 이메일 반환
	}
}
