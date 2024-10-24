package com.example.login_signup_back.controller;


import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.login_signup_back.service.FindMyInfoService;
import com.example.login_signup_back.service.MailService;


@RestController
@RequestMapping("/api") //본인 아이디 비밀번호 찾기 API
public class FindMyInfoController {

	@Autowired
	private FindMyInfoService findMyInfoService;

	@Autowired
	private MailService mailService;

	// 아이디 찾기 처리
	@GetMapping("/findmyid")
	public ResponseEntity<?> findMyId(@RequestParam("userName") String userName, 
																		@RequestParam("userEmail") String userEmail) {
		try {
			// 이름과 이메일을 기반으로 아이디 찾기 서비스 호출
			String userId = findMyInfoService.findUserId(userName, userEmail);

			if (userId != null) {
				// 아이디 조회 성공 시 JSON으로 아이디 반환
				Map<String, String> response = new HashMap<>();
				response.put("userId", userId);
				return ResponseEntity.status(HttpStatus.OK).body(response);
			} else {
				// 아이디 조회 실패 시
				Map<String, String> errorResponse = new HashMap<>();
				errorResponse.put("message", "입력한 정보로 일치하는 회원이 없습니다.");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
			}
		} catch (Exception e) {
			e.printStackTrace();
			// 예외 발생 시 오류 메시지 반환
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "아이디 조회에 실패했습니다. 다시 시도해 주세요.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	// 인증번호 발송
	@GetMapping("/sendVerificationCode")
	public ResponseEntity<?> sendVerificationCode(@RequestParam("userEmail") String userEmail) {
		try {
			String code = findMyInfoService.generateVerificationCode(userEmail);
			mailService.sendEmail(userEmail, "본인 인증번호 발송", code);
			return ResponseEntity.ok("인증번호가 이메일로 발송되었습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("인증번호 발송에 실패했습니다.");
		}
	}

	// 인증번호 확인
	@PostMapping("/verifyCode")
	public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
		String userEmail = request.get("userEmail");
		String code = request.get("code");

		boolean isVerified = findMyInfoService.verifyCode(userEmail, code);
		if (isVerified) {
			return ResponseEntity.ok("인증이 완료되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증번호가 일치하지 않습니다.");
		}
	}

	// 비밀번호 찾기 처리
	@GetMapping("/findmypassword")
	public ResponseEntity<?> findMyPassword(@RequestParam("userId") String userId, 
																					@RequestParam("userEmail") String userEmail) {
		try {
			// 인증번호 생성 및 발송
			String temporaryPassword = findMyInfoService.generateTemporaryPassword();

			// 비밀번호를 DB에 업데이트
			boolean isUpdated = findMyInfoService.resetPassword(userId, userEmail, temporaryPassword);
			if (isUpdated) {
				// 임시 비밀번호 이메일 전송
				mailService.sendTemporaryPasswordEmail(userEmail, "임시 비밀번호 발송", temporaryPassword);

				// 성공 메시지 반환
				Map<String, String> response = new HashMap<>();
				response.put("message", "임시 비밀번호가 이메일로 발송되었습니다.");
				System.out.println("임시비밀번호 : " + temporaryPassword);
				
				return ResponseEntity.status(HttpStatus.OK).body(response);
			} else {
				// 실패 메시지 반환
				Map<String, String> errorResponse = new HashMap<>();
				errorResponse.put("message", "일치하는 사용자가 없습니다.");
				System.out.println("일치하는 사용자가 없습니다.");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
			}
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "비밀번호 재설정에 실패했습니다. 다시 시도해 주세요.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
}