package com.example.login_signup_back.controller;

import com.example.login_signup_back.model.User;
import com.example.login_signup_back.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class SignupController {

	@Autowired
	private UserService userService;

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 회원가입 처리
	// # 매개변수 : user (회원 가입하려는 사용자 정보)
	// # 반환값 : 성공 여부에 따른 응답 메시지
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody User user) {
		try {
			

			
			// ID와 닉네임에 'admin' 문자열 포함 여부 확인
			if (user.getUserId().toLowerCase().contains("admin") || user.getUserNickname().toLowerCase().contains("admin")) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("아이디 또는 닉네임에 'admin'을 포함할 수 없습니다.");
			}

			// UserService에서 회원가입 로직 처리 (DB 저장 및 유효성 검사)
			userService.signupUser(user);

			// 성공적인 응답 반환
			return ResponseEntity.status(HttpStatus.CREATED).body("회원가입이 성공적으로 완료되었습니다.");
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입에 실패했습니다. 다시 시도해 주세요.");
		}
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : ID 중복 확인
	// # 매개변수 : request (userId를 포함하는 Map)
	// # 반환값 : ID 중복 여부를 boolean 값으로 반환
	@PostMapping("/check-userid")
	public ResponseEntity<Boolean> checkUserId(@RequestBody Map<String, String> request) {
		String userId = request.get("userId");
		
		// 'admin'이 포함되어 있는지 확인 (어느 위치에든 포함되면 안 됨)
		if (userId.toLowerCase().contains("admin")) {
			return ResponseEntity.ok(false);  // 'admin'이 포함된 경우 false 반환
		}
		
		List<String> userIds = userService.getAllUserIds();
		boolean isDuplicate = userIds.contains(userId);  // 중복 아니면 true
		return ResponseEntity.ok(!isDuplicate);
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 닉네임 중복 확인
	// # 매개변수 : request (nickname을 포함하는 Map)
	// # 반환값 : 닉네임 중복 여부를 boolean 값으로 반환
	@PostMapping("/check-nickname")
	public ResponseEntity<Boolean> checkUserNickname(@RequestBody Map<String, String> request) {
		String nickname = request.get("nickname");
		
		// 'admin'이 포함되어 있는지 확인 (어느 위치에든 포함되면 안 됨)
		if (nickname.toLowerCase().contains("admin")) {
			return ResponseEntity.ok(false);  // 'admin'이 포함된 경우 false 반환
		}
		
		List<String> nicknames = userService.getAllUserNicknames();
		boolean isDuplicate = nicknames.contains(nickname);  // 중복 아니면 true
		return ResponseEntity.ok(!isDuplicate);
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 이메일 인증번호 전송
	// # 매개변수 : request (email을 포함하는 Map)
	// # 반환값 : 인증번호 전송 성공 여부
	@PostMapping("/send-auth-code")
	public ResponseEntity<?> sendAuthCode(@RequestBody Map<String, String> request) {
		
		String email = request.get("email");
		String actionType = request.get("actionType"); // 추가된 부분
		
		// 요청이 회원가입인 경우에만 이메일 중복 확인 수행
		if ("signup".equals(actionType)) {
			// 이메일 중복 확인
			boolean isEmailDuplicate = userService.isEmailDuplicate(email);
			if (isEmailDuplicate) {
				return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(Map.of("success", false, "message", "이메일이 중복되었습니다."));
			}
		}
		
		boolean isSent = userService.sendAuthCode(email);
		
		if (isSent) {
			return ResponseEntity.ok(Map.of("success", true));
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("success", false, "message", "인증번호 발송에 실패했습니다."));
		}
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 기  능 : 이메일 인증번호 확인
	// # 매개변수 : request (email과 인증번호를 포함하는 Map)
	// # 반환값 : 인증 성공 여부
	@PostMapping("/verify-auth-code")
	public ResponseEntity<?> verifyAuthCode(@RequestBody Map<String, String> request) {
		String email = request.get("email");
		String inputCode = request.get("authCode");

		boolean isVerified = userService.verifyAuthCode(email, inputCode);

		if (isVerified) {
			return ResponseEntity.ok(Map.of("success", true));
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false));
		}
	}
}
