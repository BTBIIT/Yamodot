package com.example.login_signup_back.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.login_signup_back.model.User;

public class CustomUserDetails implements UserDetails {
	private final User user;

	public CustomUserDetails(User user) {
		this.user = user;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// 사용자 권한 반환
		return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
	}

	@Override
	public String getPassword() {
		return user.getUserPassword(); // OAuth2 로그인 시에는 비밀번호가 없을 수 있음
	}

	@Override
	public String getUsername() {
		if(user == null) {
			return "이메일없음"; 
		} else {
			return user.getUserEmail();
		}
	}

	@Override
	public boolean isAccountNonExpired() {
		return true; // 계정이 만료되지 않았는지 여부를 반환
	}

	@Override
	public boolean isAccountNonLocked() {
		return true; // 계정이 잠기지 않았는지 여부를 반환
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true; // 자격 증명이 만료되지 않았는지 여부를 반환
	}

	@Override
	public boolean isEnabled() {
		return true; // 계정이 활성화되었는지 여부를 반환
	}

	public User getUser() {
		return user;
	}
}
