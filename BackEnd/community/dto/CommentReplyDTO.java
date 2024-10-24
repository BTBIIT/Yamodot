package com.example.community.dto;

import java.time.LocalDateTime;

public class CommentReplyDTO {
	private int categoryName;

	public int getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(int categoryName) {
		this.categoryName = categoryName;
	}

	private int postCommentNum; // 댓글 또는 대댓글의 고유 번호
	private int postId;
	private String content; // 댓글 또는 대댓글 내용
	private String author; // 작성자 이름
	private LocalDateTime date; // 작성 날짜
	private String type; // 'comment' 또는 'reply'로 구분
	private int replyId;


	public int getReplyId() {
		return replyId;
	}

	public void setReplyId(int replyId) {
		this.replyId = replyId;
	}

	public int getPostCommentNum() {
		return postCommentNum;
	}

	public void setPostCommentNum(int postCommentNum) {
		this.postCommentNum = postCommentNum;
	}

	public int getPostId() {
		return postId;
	}

	public void setPostId(int postId) {
		this.postId = postId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public LocalDateTime getDate() {
		return date;
	}

	public void setDate(LocalDateTime date) {
		this.date = date;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}