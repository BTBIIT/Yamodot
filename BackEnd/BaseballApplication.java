package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;

import jakarta.ws.rs.core.Application;

@SpringBootApplication
@EnableScheduling
public class BaseballApplication extends SpringBootServletInitializer{
	
//	//외장 WAS 사용시
//	@Override
//	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
//		return application.sources(Application.class);
//	}
	
	public static void main(String[] args) {
		SpringApplication.run(BaseballApplication.class, args);
	}

}
