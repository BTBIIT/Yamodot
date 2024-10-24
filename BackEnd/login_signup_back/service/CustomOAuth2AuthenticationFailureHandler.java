package com.example.login_signup_back.service;

import java.io.IOException;
import java.net.URLEncoder; 
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CustomOAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

 @Override
public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                    AuthenticationException exception) throws IOException {

    String errorMessage = "이미 가입된 이메일입니다."; 
    String redirectUrl = "http://localhost:3000/user/login?error=" + URLEncoder.encode(errorMessage, "UTF-8");
   
    response.sendRedirect(redirectUrl);
}

    // 에러 응답 구조를 위한 내부 클래스
    static class ErrorResponse {
        private String error;
        private String message;

        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }

        // Getter 및 Setter
        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
