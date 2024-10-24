package com.example.community.model;

import java.time.LocalDateTime;

public class Comment {
	private int postId;
	private String commentContent; // 총 댓글 수
	private String userUniqueNumber; // 유저 고유넘버
	private LocalDateTime commentDate;	// 댓글 작성 날짜
	private LocalDateTime commentChangeDate; // 댓글 수정 날짜
	private int postCommentNum; // 댓글 인덱스번호
	private int categoryName; // 카테고리 이름
	private String postTitle; // 게시글 제목 
	private String type; 	// 댓글과 답글 구분자
	private int replyId; // 답글 인덱스번호
	private String commentName; // 댓글 사용자 닉네임
	private String replyName; // 답글 작성자

	public String getReplyName() {
		return replyName;
	}

	public void setReplyName(String replyName) {
		this.replyName = replyName;
	}

	public String getCommentName() {
		return commentName;
	}

	public void setCommentName(String commentName) {
		this.commentName = commentName;
	}

	public int getReplyId() {
		return replyId;
	}

	public void setReplyId(int replyId) {
		this.replyId = replyId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(int categoryName) {
		this.categoryName = categoryName;
	}

	public String getPostTitle() {
		return postTitle;
	}

	public void setPostTitle(String postTitle) {
		this.postTitle = postTitle;
	}

	public int getPostCommentNum() {
		return postCommentNum;
	}

	public void setPostCommentNum(int postCommentNum) {
		this.postCommentNum = postCommentNum;
	}

	public LocalDateTime getCommentDate() {
		return commentDate;
	}

	public void setCommentDate(LocalDateTime commentDate) {
		this.commentDate = commentDate;
	}

	public LocalDateTime getCommentChangeDate() {
		return commentChangeDate;
	}

	public void setCommentChangeDate(LocalDateTime commentChangeDate) {
		this.commentChangeDate = commentChangeDate;
	}

	public int getPostId() {
		return postId;
	}

	public void setPostId(int postId) {
		this.postId = postId;
	}

	public String getCommentContent() {
		return commentContent;
	}

	public void setCommentContent(String commentContent) {
		this.commentContent = commentContent;
	}

	public String getUserUniqueNumber() {
		return userUniqueNumber;
	}

	public void setUserUniqueNumber(String userUniqueNumber) {
		this.userUniqueNumber = userUniqueNumber;
	}
}
