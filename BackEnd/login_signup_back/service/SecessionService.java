package com.example.login_signup_back.service;

import com.example.login_signup_back.model.User;
import com.example.login_signup_back.model.UserDTO;
import com.example.service.JwtTokenProvider;
import com.example.mapper.Mappers;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;

//# 작성자 : 나기표
//# 작성일 : 2024-10-08
//# 목  적 : 회원 탈퇴 및 사용자 정보를 관리하는 서비스
//# 기  능 : 회원 탈퇴, 사용자 정보 조회 및 비밀번호 확인 후 탈퇴 기능 제공
@Service
public class SecessionService {
	
	@Autowired
	private JwtTokenProvider jwtTokenProvider;  // JWT 토큰 제공자

	@Autowired
	private Mappers mappers;
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : User 객체를 DTO로 변환
	// # 기  능 : User 객체를 UserDTO로 변환하여 사용자 정보를 전달
	// # 매개변수 : user - 변환할 User 객체
	// # 반환값 : UserDTO 객체 반환
	private UserDTO convertToDTO(User user) {
		UserDTO userDTO = new UserDTO();
		userDTO.setUserUniqueNumber(user.getUserUniqueNumber());
		userDTO.setUserId(user.getUserId());
		userDTO.setUserEmail(user.getUserEmail());
		userDTO.setUserNickname(user.getUserNickname());
		userDTO.setUserFavoriteTeam(user.getUserFavoriteTeam());
		userDTO.setUserSocialLoginSep(user.getUserSocialLoginSep());
		
		return userDTO;
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 사용자 정보 조회
	// # 기  능 : JWT 토큰을 통해 인증된 사용자의 정보를 조회하여 DTO로 반환
	// # 매개변수 : request - HttpServletRequest 객체 (JWT 토큰 포함)
	// # 반환값 : UserDTO - 조회된 사용자 정보를 담은 객체
	@Transactional(readOnly = true)
	public UserDTO getUserInfo(HttpServletRequest request) {
		// JWT 토큰 토큰추출, 유효성검사 통합메서드
		Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);

		// JWT 토큰에서 userUniqueNumber 추출
		String userUniqueNumber = authentication.getName();
		System.out.println("##########################################################################################################");
		System.out.println("이게 인증통과한 유저 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
		System.out.println("##########################################################################################################");
		System.out.println(userUniqueNumber);
		
		User user = mappers.findByUniqueId(userUniqueNumber);
		
		return user != null ? convertToDTO(user) : null;
	}

	// 비밀번호 확인 후 회원 탈퇴
	@Transactional
	public boolean deleteUserWithPassword(HttpServletRequest request, String userPassword, String userSocialLoginSep) {
		// JWT 토큰 토큰추출, 유효성검사 통합메서드
		Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);

		// JWT 토큰에서 userUniqueNumber 추출
		String userUniqueNumber = authentication.getName();
		System.out.println("##########################################################################################################");
		System.out.println("이게 인증통과한 유저 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
		System.out.println("##########################################################################################################");
		System.out.println(userUniqueNumber);
		
		// 이메일 대신 고유 아이디로 사용자 찾기
		User user = mappers.findByUniqueId(userUniqueNumber);
		if (user != null && "Y".equals(userSocialLoginSep)) {
			if (user.getUserPassword().equals(userPassword)) {
				Map<String, Object> params = new HashMap<>();
				params.put("userUniqueNumber", userUniqueNumber);
				params.put("userEmail", user.getUserEmail());  // 이메일은 찾은 유저의 이메일 사용
				params.put("userSocialLoginSep", userSocialLoginSep);
				mappers.deleteUser(params);  // 사용자 삭제
				return true;
			}
		}
		return false;  // 비밀번호 불일치 혹은 구분자 "Y"가 아닌 경우
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 비밀번호 확인 후 회원 탈퇴
	// # 기  능 : 사용자의 비밀번호 확인 후 회원 탈퇴를 처리
	// # 매개변수 : request - HttpServletRequest 객체 (JWT 토큰 포함), userPassword - 사용자 입력 비밀번호, userSocialLoginSep - 소셜 로그인 구분자
	// # 반환값 : 탈퇴 성공 여부 (true/false)
	@Transactional
	public boolean deleteUserWithoutPassword(HttpServletRequest request, String userSocialLoginSep) {
		// JWT 토큰 토큰추출, 유효성검사 통합메서드
		Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);

		// JWT 토큰에서 userUniqueNumber 추출
		String userUniqueNumber = authentication.getName();
		System.out.println("##########################################################################################################");
		System.out.println("이게 인증통과한 유저 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
		System.out.println("##########################################################################################################");
		System.out.println(userUniqueNumber);
		
		// 고유 아이디로 사용자 찾기
		User user = mappers.findByUniqueId(userUniqueNumber);
		if (user != null) {
			Map<String, Object> params = new HashMap<>();
			params.put("userUniqueNumber", userUniqueNumber);
			params.put("userEmail", user.getUserEmail());  // 이메일은 찾은 유저의 이메일 사용
			params.put("userSocialLoginSep", userSocialLoginSep);
			mappers.deleteUser(params);  // 사용자 삭제
			return true;
		}
		return false;
	}
	
}
