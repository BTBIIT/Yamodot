package com.example.community.model;

import java.time.LocalDateTime;

public class Reply {
	private int replyId; // 답글 인덱스 번호
	private int postId; // 게시글 번호
	private String replyContent; // 답글 내용
	private String userUniqueNumber; // 유저 고유 넘버
	private LocalDateTime repleDate; // 답글 작성 날짜
	private LocalDateTime repleChangeDate; // 답글 수정 날짜
	private int postCommentNum; // 댓글 인덱스 번호
	private String replyName; // 답글 작성자

	public String getReplyName() {
		return replyName;
	}

	public void setReplyName(String replyName) {
		this.replyName = replyName;
	}

	public int getPostId() {
		return postId;
	}

	public void setPostId(int postId) {
		this.postId = postId;
	}

	public int getPostCommentNum() {
		return postCommentNum;
	}

	public void setPostCommentNum(int postCommentNum) {
		this.postCommentNum = postCommentNum;
	}

	public LocalDateTime getRepleDate() {
		return repleDate;
	}

	public void setRepleDate(LocalDateTime repleDate) {
		this.repleDate = repleDate;
	}

	public LocalDateTime getRepleChangeDate() {
		return repleChangeDate;
	}

	public void setRepleChangeDate(LocalDateTime repleChangeDate) {
		this.repleChangeDate = repleChangeDate;
	}

	// Getters and Setters
	public int getReplyId() {
		return replyId;
	}

	public void setReplyId(int replyId) {
		this.replyId = replyId;
	}

	public String getReplyContent() {
		return replyContent;
	}

	public void setReplyContent(String replyContent) {
		this.replyContent = replyContent;
	}

	public String getUserUniqueNumber() {
		return userUniqueNumber;
	}

	public void setUserUniqueNumber(String userUniqueNumber) {
		this.userUniqueNumber = userUniqueNumber;
	}
}
