package com.example.community.model;

import java.time.LocalDateTime;

public class Community {
	private int postId; // 게시글 번호
	private String postTitle; // 게시글 제목
	private String postContent; // 게시글 내용
	private int categoryName; // 카테고리 이름
	private int postView; // 조회수
	private String userUniqueNumber; // 유저 고유넘버
	private String postImgPath; // 파일 경로를 저장할 필드 추가
	private LocalDateTime communityDate;
	private LocalDateTime commChangeDate; // 수정된 시간
	private int commentCount; // 댓글 수 필드
	private String communityId; // 닉네임 

	public String getCommunityId() {
		return communityId;
	}

	public void setCommunityId(String communityId) {
		this.communityId = communityId;
	}

	public int getCommentCount() {
		return commentCount;
	}

	public void setCommentCount(int commentCount) {
		this.commentCount = commentCount;
	}

	public LocalDateTime getCommChangeDate() {
		return commChangeDate;
	}

	public void setCommChangeDate(LocalDateTime commChangeDate) {
		this.commChangeDate = commChangeDate;
	}

	// Getters and Setters
	public int getPostId() {
		return postId;
	}

	public void setPostId(int postId) {
		this.postId = postId;
	}

	public String getPostTitle() {
		return postTitle;
	}

	public void setPostTitle(String postTitle) {
		this.postTitle = postTitle;
	}

	public LocalDateTime getCommunityDate() {
		return communityDate;
	}

	public void setCommunityDate(LocalDateTime communityDate) {
		this.communityDate = communityDate;
	}

	public String getPostContent() {
		return postContent;
	}

	public void setPostContent(String postContent) {
		this.postContent = postContent;
	}

	public int getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(int categoryName) {
		this.categoryName = categoryName;
	}

	public int getPostView() {
		return postView;
	}

	public void setPostView(int postView) {
		this.postView = postView;
	}

	public String getUserUniqueNumber() {
		return userUniqueNumber;
	}

	public void setUserUniqueNumber(String userUniqueNumber) {
		this.userUniqueNumber = userUniqueNumber;
	}

	public String getPostImgPath() {
		return postImgPath;
	}

	public void setPostImgPath(String postImgPath) {
		this.postImgPath = postImgPath;
	}
}
