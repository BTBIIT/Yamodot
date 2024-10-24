package com.example.login_signup_back.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.login_signup_back.model.UserDTO;
import com.example.service.JwtTokenProvider;
import com.example.login_signup_back.model.User;
import com.example.mapper.Mappers;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;

//# 작성자 : 나기표
//# 작성일 : 2024-10-08
//# 목  적 : 사용자 정보 관리 및 인증, 회원가입, 로그인, 이메일 인증 기능 제공
//# 기  능 : 사용자 정보 조회, 회원가입, 이메일 인증, 비밀번호 관리 기능 제공
@Service
public class UserService {

	@Autowired
	private JwtTokenProvider jwtTokenProvider;  // JWT 토큰 제공자
	
	@Autowired
	private Mappers mapper;  // MyBatis 매퍼 주입

	private Map<String, VerificationInfo> authCodes = new HashMap<>();

	@Autowired
	private MailService mailService;
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : User 객체를 UserDTO로 변환
	// # 기  능 : User 객체의 정보를 DTO 형식으로 변환하여 반환
	// # 매개변수 : user - 변환할 User 객체
	// # 반환값 : 변환된 UserDTO 객체
	public UserDTO convertToDTO(User user) {
		
		return new UserDTO(
			user.getUserUniqueNumber(),
			user.getAdminUniqueNumber(),
			user.getAdminId(),
			user.getUserId(),
			user.getUserName(),
			user.getUserPassword(),
			user.getAdminPassword(),
			user.getUserNickname(),
			user.getUserEmail(),
			user.getUserCreateDate(),
			user.getUserEditInformationDate(),
			user.getUserStopCount(),
			user.getUserStopDate(),
			user.getUserState(),
			user.getUserBeforePassword(),
			user.getUserBirthDay(),
			user.getUserGender(),
			user.getUserFavoriteTeam() != null ? user.getUserFavoriteTeam() : "선택된 팀이 없음",
			user.getUserSvcUsePcyAgmtYn(),
			user.getUserPsInfoProcAgmtYn(),
			user.getUserSocialLoginSep(),
			user.getRole() != null ? user.getRole() : "USER"
		);
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 인증번호 및 발송 정보 관리
	// # 기  능 : 인증번호와 발송된 시간, 인증 여부를 저장하는 역할
	public static class VerificationInfo {
		private String authCode;
		private long timestamp;
		private boolean isVerified;

		public VerificationInfo(String authCode, long timestamp) {
			this.authCode = authCode;
			this.timestamp = timestamp;
			this.isVerified = false;
		}

		public String getAuthCode() {
			return authCode;
		}

		public long getTimestamp() {
			return timestamp;
		}

		public boolean isVerified() {
			return isVerified;
		}

		public void setVerified(boolean verified) {
			isVerified = verified;
		}
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 고유 번호로 사용자 정보 조회
	// # 기  능 : JWT 토큰을 사용하여 인증된 사용자의 고유 번호로 사용자 정보 조회
	// # 매개변수 : request - HttpServletRequest 객체
	// # 반환값 : 조회된 User 객체
	@Transactional
	public UserDTO findByUniqueNumber(HttpServletRequest request) {
		// JWT 토큰 토큰추출, 유효성검사 통합메서드
		Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
		
		// JWT 토큰에서 userUniqueNumber 추출
		String userUniqueNumber = authentication.getName();
		System.out.println("##########################################################################################################");
		System.out.println("이게 인증통과한 유저 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
		System.out.println("##########################################################################################################");
		System.out.println(userUniqueNumber);
		
		// 먼저 사용자를 조회
		User user = mapper.findByUniqueId(userUniqueNumber);

		// 사용자 정보가 없으면 관리자인지 확인
		if (user == null) {
			user = mapper.findbyAdminUniue(userUniqueNumber);
			
			// 관리자인 경우 역할을 설정
			if (user != null) {
				user.setRole("admin");
				System.out.println("관리자 계정입니다.");
			}
		} else {
			// 일반 사용자인 경우 역할을 설정
			user.setRole("user");
			System.out.println("일반 사용자 계정입니다.");
		}

		// 필요한 필드만 담은 UserDTO로 변환
		UserDTO userDTO = new UserDTO();
		userDTO.setUserNickname(user.getUserNickname());
		userDTO.setRole(user.getRole());
		userDTO.setUserFavoriteTeam(user.getUserFavoriteTeam());
		userDTO.setUserState(user.getUserState());

		return userDTO;  // 사용자가 null이 아닐 경우 반환  // MyBatis 쿼리 실행
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 이메일로 사용자 정보 조회
	// # 기  능 : 사용자의 이메일을 이용하여 사용자 정보 조회
	// # 매개변수 : email - 조회할 사용자의 이메일
	// # 반환값 : 조회된 User 객체
	@Transactional(readOnly = true)
	public User findByEmail(String email) {
		
		return mapper.findByEmail(email);  // MyBatis 쿼리 실행
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 사용자 로그인 처리
	// # 기  능 : 사용자의 ID와 비밀번호를 확인하여 로그인 처리
	// # 매개변수 : userId - 사용자 ID, userPassword - 사용자 비밀번호
	// # 반환값 : 로그인 성공 시 UserDTO 반환
	@Transactional(readOnly = true)
	public UserDTO loginUser(String userId, String userPassword) {
		User user = mapper.loginUser(userId, userPassword);

		// 관리자가 아닌 사용자를 먼저 처리
		if (user != null) {
			// 사용자 역할(Role) 기본 설정
			if (user.getRole() == null || user.getRole().isEmpty()) {
				user.setRole("user");  // 기본 값 USER로 설정
			}
			System.out.println("##########################################################################################################");
			System.out.println("계정 role: " + user.getRole());
			return convertToDTO(user);
		}

		// 관리자로 로그인 시도
		user = mapper.loginAdmin(userId, userPassword);
		if (user != null) {
			// 관리자는 'admin' 역할 설정
			user.setRole("admin");
			user.setUserUniqueNumber(user.getAdminUniqueNumber());  // 관리자의 고유 번호를 일반 사용자 필드로 설정
			System.out.println("##########################################################################################################");
			System.out.println("계정 role: " + user.getRole());
			return convertToDTO(user);
		}

		System.out.println("###############################################################");
		System.out.println("로그인 실패: 사용자 정보가 일치하지 않습니다.");
		return null;
	}
	
	
	
	//이메일 중복 확인 메서드 추가
	@Transactional(readOnly = true)
	public boolean isEmailDuplicate(String email) {
		User existingUser = mapper.findByEmail(email);
		
		return existingUser != null;  // 사용자가 존재하면 true 반환
	}
	

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 사용자 회원가입 처리
	// # 기  능 : 사용자 정보를 저장하고 회원가입을 처리
	// # 매개변수 : user - 저장할 사용자 정보
	@Transactional  // 트랜잭션 어노테이션 사용
	@SuppressWarnings("unlikely-arg-type")
	public void signupUser(User user) {
		
		// 이메일을 통해 사용자 정보 조회
		User existingUser = mapper.findByEmail(user.getUserEmail());  // 이메일로 사용자 조회

		// 사용자 존재 여부 및 소셜 로그인 구분자 확인
		if (existingUser != null) {
			// 이미 존재하는 사용자가 소셜 로그인 사용자라면 회원가입을 거부
			if ("Y".equals(existingUser.getUserSocialLoginSep())) {
				System.out.println("##########################################################################################################");
				System.out.println(user.getUserEmail() + "이미 소셜 로그인으로 가입된 이메일");
				throw new IllegalStateException("이미 소셜 로그인으로 가입된 이메일입니다. 다른 방법으로 로그인해 주세요.");
			} else {
				System.out.println("##########################################################################################################");
				System.out.println(user.getUserEmail() + "이미 해당 이메일로 가입된 계정이 있습니다.");
				throw new IllegalStateException("이미 해당 이메일로 가입된 계정이 있습니다.");
			}
		}

		// 이메일 인증 확인
		VerificationInfo verificationInfo = authCodes.get(user.getUserEmail());
		if (verificationInfo == null || !verificationInfo.isVerified()) {
			throw new IllegalStateException("이메일 인증이 완료되지 않았습니다.");
		}
		
		// UUID로 고유한 사용자 아이디 생성
		String uniqueId = generateUniqueId();
		user.setUserUniqueNumber(uniqueId);  // 생성된 고유 아이디를 User 객체에 설정

		user.setUserSocialLoginSep("Y");  // 자체 로그인 구분자 추가

//		// 서비스 이용 동의 및 개인정보 처리 방침 동의 확인
//		if (!"Y".equals(user.isUserSvcUsePcyAgmtYn()) || !"Y".equals(user.isUserPsInfoProcAgmtYn())) {
//			throw new IllegalStateException("서비스 이용 동의와 개인정보 처리 방침 동의가 필요합니다.");
//		}
	// 테스트를 위해 동의 여부를 일시적으로 'Y'로 설정
		user.setUserSvcUsePcyAgmtYn("Y"); // 테스트 코드: 항상 'Y'로 설정
		user.setUserPsInfoProcAgmtYn("Y"); // 테스트 코드: 항상 'Y'로 설정

		// **구단 선택 처리 로직 추가**
		if ("구단선택".equals(user.getUserFavoriteTeam())) {
			String encodedFavoriteTeam = user.getUserFavoriteTeam().replace(" ", "%25"); 
			user.setUserFavoriteTeam(encodedFavoriteTeam);
		}
		
		// 회원가입 정보 저장
		mapper.signupUser(user);
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 모든 사용자 ID 목록 조회
	// # 기  능 : DB에서 모든 사용자 ID 목록을 조회하여 반환
	// # 반환값 : 사용자 ID 목록 리스트
	@Transactional(readOnly = true)
	public List<String> getAllUserIds() {
		
		return mapper.getAllUserIds();  // DB에서 모든 user_id를 가져와서 반환
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 모든 사용자 닉네임 목록 조회
	// # 기  능 : DB에서 모든 사용자 닉네임 목록을 조회하여 반환
	// # 반환값 : 사용자 닉네임 목록 리스트
	@Transactional(readOnly = true)
	public List<String> getAllUserNicknames() {
		
		return mapper.getAllUserNicknames();  // DB에서 모든 user_nickname을 가져와서 반환
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 고유한 사용자 아이디 생성
	// # 기  능 : UUID를 이용해 고유한 사용자 아이디를 생성하여 반환
	// # 반환값 : 고유한 사용자 아이디
	public String generateUniqueId() {
		
		return UUID.randomUUID().toString().replaceAll("-", "");  // "-" 제거 후 UUID 반환
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 인증번호 생성
	// # 기  능 : 6자리 숫자 인증번호를 생성하여 반환
	// # 반환값 : 생성된 인증번호 문자열
	public String generateAuthCode() {
		Random random = new Random();
		int number = random.nextInt(900000) + 100000;  // 100000에서 999999 사이의 숫자 생성
		
		return String.valueOf(number);
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 이메일로 인증번호 전송
	// # 기  능 : 입력된 이메일로 인증번호를 생성하고 이메일 전송
	// # 매개변수 : email - 인증번호를 전송할 이메일
	// # 반환값 : 인증번호 전송 성공 여부 (true/false)
	public boolean sendAuthCode(String email) {
		String authCode = generateAuthCode();
//		authCodes.put(email, authCode);  // 이메일에 대한 인증번호 저장
		VerificationInfo verificationInfo = new VerificationInfo(authCode, System.currentTimeMillis());
		authCodes.put(email, verificationInfo);  // 새 인증번호 저장, 기존 번호는 무효화됨

		try {
			// 메일 전송 (MailService 사용)
			mailService.sendEmail(email, "인증번호", authCode);
			return true;
		} catch (MessagingException e) {
			return false;
		}
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 이메일 인증번호 확인
	// # 기  능 : 입력된 이메일과 인증번호가 일치하는지 확인하고, 인증 완료 처리
	// # 매개변수 : email - 입력된 이메일, inputCode - 입력된 인증번호
	// # 반환값 : 인증 성공 여부 (true/false)
	public boolean verifyAuthCode(String email, String inputCode) {
		VerificationInfo verificationInfo = authCodes.get(email);

		if (verificationInfo == null) {
			return false;  // 인증번호가 없음
		}

		// 인증번호가 일치하고 사용되지 않았을 경우
		if (verificationInfo.getAuthCode().equals(inputCode) && !verificationInfo.isVerified()) {
			verificationInfo.setVerified(true);  // 인증 완료 처리
			return true;
		}
		return false;  // 인증 실패
	}
}