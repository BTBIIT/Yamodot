package com.example.community.dto;

import java.time.LocalDateTime;

public class PostWithCommentCountDTO {
	private Long postId;
	private String postTitle;
	private int categoryName;
	private int postView;
	private LocalDateTime communityDate;
	private int commentCount;
	private String communityId;
	private String postContent;

	public String getPostContent() {
		return postContent;
	}

	public void setPostContent(String postContent) {
		this.postContent = postContent;
	}

	public Long getPostId() {
		return postId;
	}

	public void setPostId(Long postId) {
		this.postId = postId;
	}

	public String getPostTitle() {
		return postTitle;
	}

	public void setPostTitle(String postTitle) {
		this.postTitle = postTitle;
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

	public LocalDateTime getCommunityDate() {
		return communityDate;
	}

	public void setCommunityDate(LocalDateTime communityDate) {
		this.communityDate = communityDate;
	}

	public int getCommentCount() {
		return commentCount;
	}

	public void setCommentCount(int commentCount) {
		this.commentCount = commentCount;
	}

	public String getCommunityId() {
		return communityId;
	}

	public void setCommunityId(String communityId) {
		this.communityId = communityId;
	}

	// Getters and Setters
}