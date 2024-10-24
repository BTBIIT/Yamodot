package com.example.question.model;

import java.time.LocalDateTime;

public class Question {
	private int questionNum; // 문의글 넘버
	private String questionTitle; // 문의글 제목
	private String questionContent; // 문의글 내용
	private String privateQuestionPassworld; // 문의글 비밀번호
	private String userUniqueNumber; // 유저 고유 넘버
	private int questionPostView; // 문의글 조회수
	private LocalDateTime questionDate; // 문의글 작성 날짜
	private int privateOption; // 공개 비공개 여부 0(공개)/1(비공개)
	private String questionImgPath; // 이미지 저장 경로
	private String questionAnswer; // 문의글 답변
	private String questionId; // 문의글 작성자

	public String getQuestionID() {
		return questionId;
	}

	public void setQuestionID(String questionID) {
		this.questionId = questionID;
		
	}

	public String getQuestionAnswer() {
		return questionAnswer;
	}

	public void setQuestionAnswer(String questionAnswer) {
		this.questionAnswer = questionAnswer;
	}

	public int getPrivateOption() {
		return privateOption;
	}

	public void setPrivateOption(int privateOption) {
		this.privateOption = privateOption;
	}

	public String getQuestionImgPath() {
		return questionImgPath;
	}

	public void setQuestionImgPath(String questionImgPath) {
		this.questionImgPath = questionImgPath;
	}

	public String getPrivateQuestionPassworld() {
		return privateQuestionPassworld;
	}

	public void setPrivateQuestionPassworld(String privateQuestionPassworld) {
		this.privateQuestionPassworld = privateQuestionPassworld;
	}

	public LocalDateTime getQuestionDate() {
		return questionDate;
	}

	public void setQuestionDate(LocalDateTime questionDate) {
		this.questionDate = questionDate;
	}

	// Getters and Setters
	public int getQuestionNum() {
		return questionNum;
	}

	public void setQuestionNum(int questionNum) {
		this.questionNum = questionNum;
	}

	public String getQuestionTitle() {
		return questionTitle;
	}

	public void setQuestionTitle(String questionTitle) {
		this.questionTitle = questionTitle;
	}

	public String getQuestionContent() {
		return questionContent;
	}

	public void setQuestionContent(String questionContent) {
		this.questionContent = questionContent;
	}

	public String getUserUniqueNumber() {
		return userUniqueNumber;
	}

	public void setUserUniqueNumber(String userUniqueNumber) {
		this.userUniqueNumber = userUniqueNumber;
	}

	public int getQuestionPostView() {
		return questionPostView;
	}

	public void setQuestionPostView(int questionPostView) {
		this.questionPostView = questionPostView;
	}
}
