package com.example.community.dto;

import java.time.LocalDateTime;

public class QuestionDTO {

	private String questionTitle;
	private String questionId;
	private LocalDateTime questionDate;
	private String questionAnswer;
	private int questionNum;

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

	public String getQuestionId() {
		return questionId;
	}

	public void setQuestionId(String questionId) {
		this.questionId = questionId;
	}

	public LocalDateTime getQuestionDate() {
		return questionDate;
	}

	public void setQuestionDate(LocalDateTime questionDate) {
		this.questionDate = questionDate;
	}

	public String getQuestionAnswer() {
		return questionAnswer;
	}

	public void setQuestionAnswer(String questionAnswer) {
		this.questionAnswer = questionAnswer;
	}

}
