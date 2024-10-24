package com.example.login_signup_back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.File;

//# 작성자 : 나기표
//# 작성일 : 2024-10-08
//# 목  적 : 이메일 전송 서비스
//# 기  능 : 인증번호와 임시 비밀번호를 HTML 형식으로 이메일 전송하는 기능 제공
@Service
public class MailService {

	@Autowired
	private JavaMailSender mailSender;

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 인증번호 전송
	// # 기  능 : 사용자의 이메일로 인증번호를 HTML 형식으로 전송
	// # 매개변수 : to - 수신 이메일 주소, subject - 메일 제목, verificationCode - 인증번호
	// # 반환값 : 없음
	@Async // 비동기적으로 메일 전송
	public void sendEmail(String to, String subject, String verificationCode) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

		helper.setTo(to);
		helper.setSubject(subject);

		// HTML 내용 작성
		String htmlMsg = 
			"<div style='text-align: center;'>" +
			"<img src='cid:yamodotLogo' style='width: 150px;' alt='yamodot Logo'/>" +  // 로고 경로
			"<h2>yamodot 이메일 본인 인증</h2>" +
			"<p style='font-size: 18px;'>인증번호</p>" +
			"<div style='padding: 10px; background-color: #f3f4f6; display: inline-block; border-radius: 5px; font-size: 24px; font-weight: bold; color: red;'>"
			+ verificationCode + "</div>" +
			"<p style='font-size: 14px; color: #555;'>해당 인증번호를 인증번호 확인란에 기입하여 주세요.<br> yamodot을 이용해 주셔서 감사합니다.</p>" +
			"</div>";
			
		helper.setText(htmlMsg, true);  // true는 HTML 형식임을 명시
		
		// 첨부 이미지 설정 (이미지 경로: 로컬 파일 경로)
//		helper.addInline("yamodotLogo", new File("C:/Users/MSI/OneDrive/바탕 화면/baseball-web/frontend/src/assets/images/Main_Logo1.png")); 
		
		// 메일 전송
		mailSender.send(message);
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 임시 비밀번호 전송
	// # 기  능 : 사용자의 이메일로 임시 비밀번호를 HTML 형식으로 전송
	// # 매개변수 : to - 수신 이메일 주소, subject - 메일 제목, temporaryPassword - 임시 비밀번호
	// # 반환값 : 없음
	@Async
	public void sendTemporaryPasswordEmail(String to, String subject, String temporaryPassword) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
		
		helper.setTo(to);
		helper.setSubject(subject);
		
		// HTML 내용 작성
		String htmlMsg = 
			"<div style='text-align: center;'>" +
				"<img src='cid:yamodotLogo' style='width: 150px;' alt='yamodot Logo'/>" +  // 로고 경로
				"<h2>yamodot 임시 비밀번호 안내</h2>" +
				"<p style='font-size: 18px;'>임시 비밀번호</p>" +
				"<div style='padding: 10px; background-color: #f3f4f6; display: inline-block; border-radius: 5px; font-size: 24px; font-weight: bold; color: red;'>"
				+ temporaryPassword + "</div>" +
				"<p style='font-size: 14px; color: #555;'>로그인 후 비밀번호를 변경해 주세요.<br> yamodot을 이용해 주셔서 감사합니다.</p>" +
				"</div>";
		
		helper.setText(htmlMsg, true);  // true는 HTML 형식임을 명시
		
		// 첨부 이미지 설정 (이미지 경로: 로컬 파일 경로)
//		helper.addInline("yamodotLogo", new File("C:/Users/MSI/OneDrive/바탕 화면/baseball-web/frontend/src/assets/images/Main_Logo1.png")); 
		
		// 메일 전송
		mailSender.send(message);
	}
}
