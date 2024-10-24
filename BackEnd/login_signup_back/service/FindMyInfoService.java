package com.example.login_signup_back.service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.login_signup_back.model.User;
import com.example.login_signup_back.model.UserDTO;
import com.example.mapper.Mappers;

//# 작성자 : 나기표
//# 작성일 : 2024-10-08
//# 목  적 : 사용자 정보 찾기 및 비밀번호 재설정 서비스
//# 기  능 : 사용자 아이디 찾기, 인증번호 생성 및 확인, 임시 비밀번호 생성 및 비밀번호 재설정 기능 제공
@Service
public class FindMyInfoService {
	
	private Map<String, String> verificationCodes = new HashMap<>(); // 인증번호 저장용 (임시로 메모리에 저장)
	
	@Autowired
	private Mappers mapper;  // MyBatis 매퍼 주입

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : User 객체를 DTO 객체로 변환
	// # 기  능 : User 엔티티를 UserDTO로 변환하여 반환
	// # 매개변수 : user - 변환할 User 객체
	// # 반환값 : UserDTO - 변환된 DTO 객체
	public UserDTO convertToDTO(User user) {
		UserDTO userDTO = new UserDTO();
		userDTO.setUserUniqueNumber(user.getUserUniqueNumber());
		userDTO.setUserId(user.getUserId());
		userDTO.setUserName(user.getUserName());
		userDTO.setUserNickname(user.getUserNickname());
		userDTO.setUserEmail(user.getUserEmail());
		userDTO.setRole(user.getRole());
		
		return userDTO;
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 사용자의 아이디 찾기
	// # 기  능 : 사용자의 이름과 이메일을 기반으로 아이디를 조회하여 반환
	// # 매개변수 : name - 사용자 이름, email - 사용자 이메일
	// # 반환값 : 사용자 아이디 (조회 성공 시), null (조회 실패 시)
	@Transactional(readOnly = true)
	public String findUserId(String name, String email) {
		
		return mapper.findUserId(name, email);  // MyBatis 쿼리 실행
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 인증번호 생성 및 저장
	// # 기  능 : 6자리 인증번호를 생성하고 저장소에 저장
	// # 매개변수 : userEmail - 인증번호를 발송할 이메일
	// # 반환값 : 생성된 인증번호
	public String generateVerificationCode(String userEmail) {
		String code = String.format("%06d", new Random().nextInt(999999));  // 6자리 숫자 인증번호 생성
		verificationCodes.put(userEmail, code);  // 이메일과 인증번호를 저장
		
		return code;
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 인증번호 확인
	// # 기  능 : 입력된 인증번호가 저장된 인증번호와 일치하는지 확인
	// # 매개변수 : userEmail - 이메일 주소, code - 입력된 인증번호
	// # 반환값 : 인증번호 일치 여부 (true/false)
	public boolean verifyCode(String userEmail, String code) {
		String savedCode = verificationCodes.get(userEmail);
		if (savedCode != null && savedCode.equals(code)) {
			verificationCodes.remove(userEmail);  // 인증이 완료되면 삭제
			return true;
		}
		return false;
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 임시 비밀번호 생성
	// # 기  능 : 랜덤한 임시 비밀번호를 생성하여 반환
	// # 매개변수 : 없음
	// # 반환값 : 생성된 임시 비밀번호
	public String generateTemporaryPassword() {
		// 비밀번호를 생성할 수 있는 문자 집합 정의
		String upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		String lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
		String numbers = "0123456789";
		String specialChars = "!@#$%^&*()-_+=<>?";

		// 모든 문자 집합을 하나로 합침
		String combinedChars = upperCaseLetters + lowerCaseLetters + numbers + specialChars;

		// SecureRandom 객체 생성
		SecureRandom random = new SecureRandom();
		StringBuilder password = new StringBuilder(10);

		// 각 종류에서 하나씩 임시 비밀번호에 추가 (최소 하나씩 포함하도록 강제)
		password.append(upperCaseLetters.charAt(random.nextInt(upperCaseLetters.length())));
		password.append(lowerCaseLetters.charAt(random.nextInt(lowerCaseLetters.length())));
		password.append(numbers.charAt(random.nextInt(numbers.length())));
		password.append(specialChars.charAt(random.nextInt(specialChars.length())));

		// 나머지 자리수는 랜덤하게 채움
		for (int i = 4; i < 10; i++) {
			password.append(combinedChars.charAt(random.nextInt(combinedChars.length())));
		}

		return password.toString();
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 비밀번호 재설정
	// # 기  능 : 사용자의 아이디와 이메일을 확인한 후, 임시 비밀번호로 비밀번호를 재설정
	// # 매개변수 : userId - 사용자 아이디, userEmail - 사용자 이메일, temporaryPassword - 임시 비밀번호
	// # 반환값 : 비밀번호 재설정 성공 여부 (true/false)
	@Transactional
	public boolean resetPassword(String userId, String userEmail, String temporaryPassword) {
		// 사용자 정보를 DB에서 조회
		User user = mapper.findByUserIdAndEmail(userId, userEmail);
		if (user == null) {
			return false;  // 사용자가 존재하지 않으면 false 반환
		}
		// 기존 비밀번호를 userBeforePassword로 이동
		user.setUserBeforePassword(user.getUserPassword());
		// 새로운 임시 비밀번호를 userPassword로 설정
		user.setUserPassword(temporaryPassword);
		// 사용자 비밀번호 업데이트
		int updatedRows = mapper.updateUserPassword(user);

		return updatedRows > 0;	// 업데이트 성공 여부 반환
	}
}