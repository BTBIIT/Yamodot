package com.example.login_signup_back.model;

import java.util.Map;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class CustomOAuth2User extends CustomUserDetails implements OAuth2User {
    private Map<String, Object> attributes;
    private String errorMessage; // 에러 메시지 필드 추가

    // 기존 생성자 (성공적인 경우)
    public CustomOAuth2User(User user, Map<String, Object> attributes) {
        super(user); // CustomUserDetails의 생성자 호출
        this.attributes = attributes;
        this.errorMessage = null; // 성공적인 경우, 에러 메시지는 null
    }

    // 추가된 생성자 (실패한 경우)
    public CustomOAuth2User(String errorMessage) {
        super(null); // 실패 시 User 객체가 없으므로 null 전달
        this.attributes = null; // 실패 시 속성도 없으므로 null
        this.errorMessage = errorMessage; // 실패 시 에러 메시지 저장
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return getUsername(); // OAuth2User의 이름으로 이메일 반환
    }

    // 에러 메시지 반환하는 메서드 추가
    public String getErrorMessage() {
        return errorMessage;
    }

    // 에러 여부를 확인하는 헬퍼 메서드 추가 (필요시)
    public boolean hasError() {
        return errorMessage != null;
    }
}
