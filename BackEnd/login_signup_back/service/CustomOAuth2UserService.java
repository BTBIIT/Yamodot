package com.example.login_signup_back.service;

import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import com.example.login_signup_back.model.CustomOAuth2User;
import com.example.login_signup_back.model.User;
import com.example.service.JwtTokenProvider;
import com.example.mapper.Mappers;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

	@Autowired
	private Mappers mapper;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
				 OAuth2User oAuth2User;

		try {
			// 기본 OAuth2User 정보를 불러옵니다.
			oAuth2User = super.loadUser(userRequest);
		} catch (OAuth2AuthenticationException e) {
			// OAuth2 인증 오류 발생 시 처리
			throw new OAuth2AuthenticationException("OAuth2 인증 과정에서 오류가 발생했습니다: " + e.getMessage());
		}

		// OAuth2 제공자 ID를 가져옵니다. (google, naver, kakao 등)
		String clientRegistrationId = userRequest.getClientRegistration().getRegistrationId();

		// 사용자 정보 초기화
		String email = "";
		String name = "";
		String userType = "";
		String nickname = "";

		// OAuth2 제공자로부터 사용자 정보 추출
		Map<String, Object> attributes = oAuth2User.getAttributes();

		try {
			// 클라이언트 ID에 따라 사용자 정보 처리
			if ("google".equals(clientRegistrationId)) {
				email = (String) attributes.get("email");
				name = (String) attributes.get("name");
				userType = "G"; // 구글 사용자
			} else if ("naver".equals(clientRegistrationId)) {
				Map<String, Object> response = (Map<String, Object>) attributes.get("response");
				email = (String) response.get("email");
				name = (String) response.get("name");
				userType = "N"; // 네이버 사용자
			} else if ("kakao".equals(clientRegistrationId)) {
				Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
				Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
				email = (String) kakaoAccount.get("email");
				nickname = (String) profile.get("nickname");
				userType = "K"; // 카카오 사용자
			} else {
				throw new OAuth2AuthenticationException("지원되지 않는 소셜 로그인 제공자입니다: " + clientRegistrationId);
			}
		} catch (Exception e) {
			// 사용자 정보 추출 중 오류 발생 시 예외 처리
			throw new OAuth2AuthenticationException("사용자 정보를 처리하는 동안 오류가 발생했습니다: " + e.getMessage());
		}

		// 사용자 정보를 콘솔에 출력 (디버깅용)
		attributes.forEach((key, value) -> {
			System.out.println(key + ": " + value);
		});

		User user;
		try {
			// 데이터베이스에서 사용자 정보를 조회합니다.
			System.out.println("CustomAuthUserService findByEmnail");
			user = mapper.findByEmail(email);
		} catch (Exception e) {
			// 데이터베이스 조회 중 오류 처리
			throw new OAuth2AuthenticationException("사용자 정보를 데이터베이스에서 조회하는 동안 오류가 발생했습니다: " + e.getMessage());
		}

		// 사용자가 없으면 새로 생성합니다.
		if (user == null) {
			try {
				user = new User();
				user.setUserUniqueNumber(UUID.randomUUID().toString().replaceAll("-", ""));
				user.setUserName(name);

				// 닉네임이 없을 경우 기본값 설정
				if (nickname.isEmpty()) {
					user.setUserNickname("User_" + user.getUserUniqueNumber().substring(0, 8));
				} else {
					user.setUserNickname(nickname);
				}
				user.setUserGender(3);
				user.setUserFavoriteTeam("%25");
//			// 서비스 이용 동의 및 개인정보 처리 방침 동의 확인
//			if (!"Y".equals(user.isUserSvcUsePcyAgmtYn()) || !"Y".equals(user.isUserPsInfoProcAgmtYn())) {
//				throw new IllegalStateException("서비스 이용 동의와 개인정보 처리 방침 동의가 필요합니다.");
//			}
				// 테스트를 위해 동의 여부를 일시적으로 'Y'로 설정
				user.setUserSvcUsePcyAgmtYn("Y"); // 테스트 코드: 항상 'Y'로 설정
				user.setUserPsInfoProcAgmtYn("Y"); // 테스트 코드: 항상 'Y'로 설정
				
				user.setUserEmail(email);
				user.setUserCreateDate(new Date());
				user.setUserSocialLoginSep(userType);

				// 사용자 정보 데이터베이스에 저장
				mapper.socialSignupUser(user);

				// 클라이언트 별로 OAuth2User 반환
				if ("google".equals(clientRegistrationId)) {
					return new DefaultOAuth2User(
						Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
						oAuth2User.getAttributes(),
						"email" // 구글은 이메일을 기본 키로 사용
					);
				} else if ("naver".equals(clientRegistrationId)) {
					Map<String, Object> response = (Map<String, Object>) attributes.get("response");
					return new DefaultOAuth2User(
						Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
						response, // 네이버는 response 내부의 데이터를 사용
						"email"
					);
				} else if ("kakao".equals(clientRegistrationId)) {
					Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
					return new DefaultOAuth2User(
						Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
						kakaoAccount, // 카카오는 kakao_account 내부의 email을 사용
						"email"
					);
				}
			} catch (Exception e) {
				// 사용자 등록 중 오류 처리
				throw new OAuth2AuthenticationException("새로운 사용자를 등록하는 동안 오류가 발생했습니다: " + e.getMessage());
			}
		} else {
			// 이미 존재하는 사용자의 경우, 소셜 로그인 타입이 일치하는지 확인
			if (!userType.equals(user.getUserSocialLoginSep())) {
			    System.out.println("소셜로그인 유형 불일치");
			    // 커스텀 에러 메시지와 함께 OAuth2AuthenticationException 던지기
			    OAuth2Error oauth2Error = new OAuth2Error("invalid_social_login_type", "Email already in use", null);
			    throw new OAuth2AuthenticationException(oauth2Error);
			}

			try {
				// 클라이언트 별로 OAuth2User 반환
				if ("google".equals(clientRegistrationId)) {
					return new DefaultOAuth2User(
						Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
						oAuth2User.getAttributes(),
						"email" // 구글은 이메일을 기본 키로 사용
					);
				} else if ("naver".equals(clientRegistrationId)) {
					Map<String, Object> response = (Map<String, Object>) attributes.get("response");
					return new DefaultOAuth2User(
						Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
						response, // 네이버는 response 내부의 데이터를 사용
						"email"
					);
				} else if ("kakao".equals(clientRegistrationId)) {
					Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
					return new DefaultOAuth2User(
						Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
						kakaoAccount, // 카카오는 kakao_account 내부의 email을 사용
						"email"
					);
				}
			} catch (Exception e) {
				// OAuth2User 반환 중 오류 처리
				System.out.println("오류");
				throw new OAuth2AuthenticationException("OAuth2 사용자 정보를 반환하는 동안 오류가 발생했습니다: " + e.getMessage());
			}
		}

		// 최종 반환값이 없을 경우 null 반환
		System.out.println("마지막오류");
		throw new OAuth2AuthenticationException("OAuth2 인증이 실패했습니다. 사용자 정보를 반환할 수 없습니다.");
	}
}
