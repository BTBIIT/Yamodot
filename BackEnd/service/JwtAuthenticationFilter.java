package com.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

public class JwtAuthenticationFilter extends GenericFilterBean {

	private final JwtTokenProvider jwtTokenProvider;
	private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);  // 로거 추가

	//# 작성자 : 나기표
	//# 작성일 : 2024-10-10
	//# 목  적 : JWT 토큰을 기반으로 인증 필터링을 수행하는 필터 클래스
	//# 기  능 : 요청에서 JWT 토큰을 추출하여 유효성을 검증하고, 인증 정보를 설정함
	//# 매개변수 : request - 클라이언트로부터 받은 요청
	//					response - 클라이언트에게 전달할 응답
	//					chain - 필터 체인
	//# 반환값 : 없음 (필터링 과정에서 필요한 인증 정보를 설정함)
	public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
		this.jwtTokenProvider = jwtTokenProvider;
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-10
	// # 목  적 : HTTP 요청에서 JWT 토큰을 추출하여 인증을 수행
	// # 기  능 : JWT 토큰의 유효성을 확인하고, 유효한 경우 SecurityContextHolder에 인증 정보를 설정
	// # 매개변수 : request - 클라이언트로부터 받은 요청
	//					 response - 클라이언트에게 전달할 응답
	//					 chain - 필터 체인
	// # 반환값 : 없음 (필터 체인에 따라 응답이 처리됨)
	@Override
	public void doFilter(ServletRequest request,
											 ServletResponse response,
											 FilterChain chain)
											 throws IOException, ServletException {

		HttpServletRequest httpRequest = (HttpServletRequest) request;
		String token = jwtTokenProvider.resolveToken(httpRequest);



		if (token != null && jwtTokenProvider.validateToken(token)) {

			SecurityContextHolder.getContext()
			.setAuthentication(jwtTokenProvider.getAuthentication(token));
		} else if (token != null) {
			logger.warn("토큰이 유효하지 않음: {}", token);
		} else {
			logger.info("토큰이 존재하지 않음.");
		}

		chain.doFilter(request, response);
	}
}
