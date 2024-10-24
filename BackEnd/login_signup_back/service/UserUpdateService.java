package com.example.login_signup_back.service;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.login_signup_back.model.User;
import com.example.login_signup_back.model.UserDTO;
import com.example.service.JwtTokenProvider;
import com.example.mapper.Mappers;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserUpdateService {

	@Autowired
	private JwtTokenProvider jwtTokenProvider;  // JWT 토큰 제공자
	
	@Autowired
	private Mappers mappers;
	
	private boolean previousPasswordSame = false;
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 사용자 정보 업데이트
	// # 기  능 : 사용자의 닉네임, 생년월일, 성별, 좋아하는 팀 정보를 업데이트
	// # 매개변수 : userUniqueNumber - 사용자 고유번호,
	//           userSocialLoginSep - 소셜 로그인 구분자,
	//           userNickname - 닉네임,
	//           userBirthDay - 생년월일,
	//           userGender - 성별,
	//           userFavoriteTeam - 좋아하는 팀
	// # 반환값 : 업데이트 성공 여부 (true/false)
	@Transactional
	public String updateUserInfo(HttpServletRequest request, UserDTO userInfo) {
		// JWT 토큰에서 사용자 고유번호 추출
		Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
		String userUniqueNumber = authentication.getName();
		User existingUser = mappers.findByUniqueId(userUniqueNumber);  // DB에서 사용자 정보 가져오기
		
		if (existingUser == null) {
			return "사용자를 찾을 수 없습니다.";
		}
		
		// 닉네임 중복 여부 확인
		// 본인 닉네임이 아닌 경우 중복 체크 (본인 닉네임은 제외)
		if (userInfo.getUserNickname() != null && !userInfo.getUserNickname().isEmpty()) {
			if (!existingUser.getUserNickname().equals(userInfo.getUserNickname())) {
				// 닉네임 중복 여부 확인 (본인 제외)
				if (isNicknameDuplicate(userInfo.getUserNickname(), userUniqueNumber)) {
					return "중복된 닉네임입니다.";
				}
			}
		}
		
		if ("구단선택".equals(userInfo.getUserFavoriteTeam())) {
			String encodedFavoriteTeam = userInfo.getUserFavoriteTeam().replace(" ", "%25"); 
			userInfo.setUserFavoriteTeam(encodedFavoriteTeam);
		}
		
		// 필드별로 변경 사항 확인 및 업데이트 (수정된 항목만 업데이트)
		boolean isUpdated = false;
		
		// 닉네임 변경 확인 및 업데이트
		if (userInfo.getUserNickname() != null && !userInfo.getUserNickname().equals(existingUser.getUserNickname())) {
			existingUser.setUserNickname(userInfo.getUserNickname());
			isUpdated = true;
		}
		
		// 생년월일 변경 확인 및 업데이트
		if (userInfo.getUserBirthDay() != null && !userInfo.getUserBirthDay().equals(existingUser.getUserBirthDay())) {
			existingUser.setUserBirthDay(userInfo.getUserBirthDay());
			isUpdated = true;
		}
		
		// 성별 변경 확인 및 업데이트
		if (userInfo.getUserGender() != 0 && userInfo.getUserGender() != existingUser.getUserGender()) {
			existingUser.setUserGender(userInfo.getUserGender());
			isUpdated = true;
		}
		
		// 좋아하는 팀 변경 확인 및 업데이트
		if (userInfo.getUserFavoriteTeam() != null && !userInfo.getUserFavoriteTeam().equals(existingUser.getUserFavoriteTeam())) {
			existingUser.setUserFavoriteTeam(userInfo.getUserFavoriteTeam());
			isUpdated = true;
		}
		
		// 하나라도 업데이트된 항목이 있으면 수정 날짜를 업데이트
		if (isUpdated) {
			existingUser.setUserEditInformationDate(new Date());
			mappers.updateUserInfo(existingUser);
			return "회원 정보가 성공적으로 업데이트되었습니다.";
		} else {
			return "업데이트된 내용이 없습니다.";
		}
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 닉네임 중복 확인
	// # 기  능 : 사용자가 입력한 닉네임이 이미 존재하는지 확인(본인 닉네임 제외)
	// # 매개변수 : userNickname - 중복 확인할 닉네임
	// # 반환값 : 중복 여부 (true/false)
	@Transactional(readOnly = true)
	public boolean isNicknameDuplicate(String userNickname, String userUniqueNumber) {
		List<String> nicknames = mappers.getAllUserNicknamesExcept(userUniqueNumber);  // 본인 제외한 다른 사용자 닉네임 조회
		return nicknames.contains(userNickname);  // 중복된 닉네임 여부 반환
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 비밀번호 변경
	// # 기  능 : 현재 비밀번호 확인 후 새로운 비밀번호로 업데이트
	// # 매개변수 : currentPassword - 현재 비밀번호
	//           newPassword - 새 비밀번호
	//           request - HttpServletRequest 객체
	// # 반환값 : 비밀번호 변경 성공 여부 (true/false)
	@Transactional
	public boolean updatePassword(String currentPassword, String newPassword, HttpServletRequest request) {
		// JWT 토큰에서 인증 정보 추출
		Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
		
		// JWT 토큰에서 userUniqueNumber 추출
		String userUniqueNumber = authentication.getName();
		System.out.println("##########################################################################################################");
		System.out.println("이게 인증 통과한 유저의 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
		System.out.println("##########################################################################################################");
		System.out.println(userUniqueNumber);
		
		// 기존 사용자 정보 조회 (user_unique_number로 조회)
		User existingUser = mappers.getUserPassword(userUniqueNumber);
		
		// 현재 비밀번호가 일치하는지 확인
		if (existingUser == null || !currentPassword.equals(existingUser.getUserPassword())) {
			System.out.println("현재 비밀번호가 일치하지 않거나 사용자를 찾을 수 없습니다.");
			return false;  // 현재 비밀번호가 일치하지 않으면 실패 처리
		}
		
		// 새 비밀번호가 기존 비밀번호와 동일한지 확인
		if (newPassword.equals(existingUser.getUserPassword()) ||
				(existingUser.getUserBeforePassword() != null && newPassword.equals(existingUser.getUserBeforePassword()))) {
			System.out.println("##########################################################################################################");
			System.out.println("새 비밀번호가 기존 비밀번호와 중복됩니다.");
			previousPasswordSame = true;
			return false;  // 새 비밀번호가 기존 또는 이전 비밀번호와 중복되면 실패 처리
		}
		
		// 비밀번호 업데이트: 기존 비밀번호를 이전 비밀번호로 설정
		existingUser.setUserBeforePassword(existingUser.getUserPassword());
		existingUser.setUserPassword(newPassword);  // 새 비밀번호로 업데이트
		existingUser.setUserUniqueNumber(userUniqueNumber);  // userUniqueNumber 명시적으로 설정
		existingUser.setUserEditInformationDate(new Date());  // 수정 날짜 업데이트
		
		// 업데이트된 비밀번호를 DB에 저장
		System.out.println("##########################################################################################################");
		System.out.println("비밀번호 업데이트 쿼리 실행 - userUniqueNumber: " + existingUser.getUserUniqueNumber());
		int rowsAffected = mappers.updateUserPassword(existingUser);
		
		return rowsAffected > 0;  // 비밀번호 업데이트 성공 여부 반환
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-09
	// # 목  적 : 이전 비밀번호와 동일한지 여부 확인
	// # 반환값 : 동일 여부 (true/false)
	@Transactional(readOnly = true)
	public boolean isPreviousPasswordSame() {
		return previousPasswordSame;
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 사용자 정보 조회
	// # 기  능 : JWT 토큰에서 추출한 사용자 고유번호로 사용자 정보 조회
	// # 매개변수 : request - HttpServletRequest 객체
	// # 반환값 : 조회된 사용자 정보 (UserDTO)
	@Transactional(readOnly = true)
	public UserDTO getUserInfo(HttpServletRequest request) {
		// JWT 토큰 토큰 추출 및 인증
		Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
		
		// JWT 토큰에서 userUniqueNumber 추출
		String userUniqueNumber = authentication.getName();
		System.out.println("##########################################################################################################");
		System.out.println("이게 인증 통과한 유저의 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
		System.out.println("##########################################################################################################");
		System.out.println(userUniqueNumber);
		
		User user = mappers.findByUniqueId(userUniqueNumber);
		if (user == null) {
			return null;
		}
		return convertToDTO(user);  // User 객체를 DTO로 변환하여 반환
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : User 객체를 UserDTO로 변환
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
		userDTO.setUserGender(user.getUserGender());
		userDTO.setUserFavoriteTeam(user.getUserFavoriteTeam());
		userDTO.setUserSocialLoginSep(user.getUserSocialLoginSep());
		
		return userDTO;
	}
}
