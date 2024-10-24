package com.example.login_signup_back.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import com.example.login_signup_back.model.CustomOAuth2User;
import com.example.login_signup_back.model.User;
import com.example.service.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.Map;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Autowired
	private UserService userService;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
																			Authentication authentication) throws IOException {

		// OAuth2User로 캐스팅
		OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

	    // CustomOAuth2User로 캐스팅하여 실패 여부 확인
	    if (oAuth2User instanceof CustomOAuth2User) {
	        CustomOAuth2User customUser = (CustomOAuth2User) oAuth2User;
	        if (customUser.hasError()) {
	            // 실패 상황이므로 실패 처리 로직 수행
	            String redirectUrl = "http://localhost:3000/login?error=" + URLEncoder.encode(customUser.getErrorMessage(), "UTF-8");
	            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
	            return;  // 성공 로직을 건너뛰기 위해 return
	        }
	    }
	    
		// 사용자 정보에서 이메일을 추출
		Map<String, Object> attributes = oAuth2User.getAttributes();
		String email = (String) attributes.get("email");  // Google 또는 기타 제공자에서 email 추출

		// DB에서 이메일을 통해 사용자 정보 가져옥
		User user = userService.findByEmail(email);
		if(user == null) {
			throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
		}

		String userUniqueNumber = user.getUserUniqueNumber();
		String userFavoriteTeam = user.getUserFavoriteTeam();		//선호구단 추가됨
		String role = user.getRole();														//role 추가됨
		String userState = user.getUserState();
		// JWT 토큰 생성
		String token = jwtTokenProvider.createToken(userUniqueNumber, userFavoriteTeam, role, userState);  // 이메일 기반으로 JWT 토큰 생성

		// JWT 토큰을 HttpOnly 쿠키로 설정
		Cookie jwt = new Cookie("jwtToken", token);
		jwt.setHttpOnly(true);  // 자바스크립트에서 접근 불가
		jwt.setSecure(false);    // HTTPS에서만 전송 (테스트 시 false로 설정 가능)
		jwt.setPath("/");       // 쿠키의 경로 설정
		jwt.setMaxAge(60 * 60);  // 쿠키의 유효 기간 설정 (1시간)

		// 쿠키를 응답에 추가
		response.addCookie(jwt);
		System.out.println("핸들러##############################################################");
		System.out.println(URLEncoder.encode(token, "UTF-8"));
		System.out.println("###################################################################");

		// 성공 메시지 반환
//        response.setContentType("application/json");
//        response.setCharacterEncoding("UTF-8");
//        response.getWriter().write("{\"message\": \"이건 핸들러다 로그인 성공\", \"token\": \"" + token + "\"}");
//        response.getWriter().flush();

		String redirectUrl = "http://localhost:3000";
		getRedirectStrategy().sendRedirect(request, response, redirectUrl);
	}
}
