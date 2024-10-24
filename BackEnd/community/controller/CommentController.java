package com.example.community.controller;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.community.dto.CommentReplyDTO;
import com.example.community.model.Comment;
import com.example.community.model.Reply;
import com.example.community.service.CommentService;
import jakarta.servlet.http.HttpServletRequest;

/**
 * # 작성자 : 이재훈
 * # 작성일 : 2024-10-08
 * # 목  적 : 댓글 및 대댓글에 대한 CRUD 처리 담당
 * # 기  능 : 댓글 및 대댓글 조회, 작성, 수정, 삭제 기능 제공
 */
@RestController
@RequestMapping("/api/comments")
public class CommentController {
	
	@Autowired
	private CommentService commentService;

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 모든 댓글과 대댓글을 조회
     * # 기  능 : 모든 댓글과 대댓글 목록을 조회하여 반환
     * # 매개변수 : HttpServletRequest request
     * # 반환값 : List<CommentReplyDTO> - 모든 댓글과 대댓글 정보
     */
	@GetMapping("/all")
	public List<CommentReplyDTO> getAllCommentsAndReplies(HttpServletRequest request) {

		return commentService.getAllCommentsAndReplies();
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 유저의 댓글을 조회
     * # 기  능 : 유저 닉네임을 기준으로 해당 유저가 작성한 모든 댓글을 조회
     * # 매개변수 : String nickname
     * # 반환값 : List<Comment> - 유저가 작성한 댓글 목록
     */
    @GetMapping("/user/comments")
    public List<Comment> getCommentsByUser(HttpServletRequest request) {
        return commentService.getCommentsByUser(request);
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 게시물에 대한 댓글을 조회
     * # 기  능 : 게시물 ID를 기준으로 해당 게시물에 대한 댓글 목록을 조회
     * # 매개변수 : int postId
     * # 반환값 : List<Comment> - 게시물에 달린 댓글 목록
     */
	@GetMapping("/post/{postId}")
	public List<Comment> getCommentsByPostId(@PathVariable int postId) {

		return commentService.getCommentsByPostId(postId);
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 댓글 조회
     * # 기  능 : 게시물 ID와 댓글 번호로 특정 댓글을 조회
     * # 매개변수 : int postId, int postCommentNum
     * # 반환값 : Comment - 조회된 댓글 정보
     */
	@GetMapping("/post/{postId}/comment/{postCommentNum}")
	public Comment getCommentById(@PathVariable int postId, @PathVariable int postCommentNum) {
		
		return commentService.getCommentById(postId, postCommentNum);
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 게시물에 댓글 작성
     * # 기  능 : 게시물에 새로운 댓글을 작성하고 저장
     * # 매개변수 : int postId, Comment comment
     * # 반환값 : String - 댓글 작성 성공 메시지
     */
    @PostMapping("/post/{postId}")
    
    public Comment createComment(HttpServletRequest request, @PathVariable int postId, @RequestBody Comment comment) {
        comment.setPostId(postId);
        comment.setCommentDate(LocalDateTime.now()); // 작성 시간을 LocalDateTime으로 설정
        commentService.createComment(comment, request);
        return comment;
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 게시물의 댓글 수정
     * # 기  능 : 게시물 ID와 댓글 번호를 기반으로 댓글을 수정
     * # 매개변수 : int postId, int postCommentNum, Comment comment
     * # 반환값 : String - 댓글 수정 성공 메시지
     */
    @PutMapping("/post/{postId}/comment/{postCommentNum}")
    public ResponseEntity<Comment> updateComment(
            HttpServletRequest request,
            @PathVariable int postId,
            @PathVariable int postCommentNum,
            @RequestBody Comment comment) {

        // 게시물 ID와 댓글 번호 설정
        comment.setPostId(postId);
        comment.setPostCommentNum(postCommentNum);

        // 수정된 시간 설정
        comment.setCommentChangeDate(LocalDateTime.now());

        // 댓글 업데이트 후 업데이트된 객체 반환
        Comment updatedComment = commentService.updateComment(comment, request);

        if (updatedComment != null) {
            // 200 OK와 함께 댓글 반환
            return ResponseEntity.ok(updatedComment);
        } else {
            // 404 Not Found 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 게시물의 댓글 삭제
     * # 기  능 : 게시물 ID와 댓글 번호를 기반으로 댓글을 삭제
     * # 매개변수 : int postId, int postCommentNum
     * # 반환값 : String - 댓글 삭제 성공 메시지
     */
	@DeleteMapping("/post/{postId}/comment/{postCommentNum}")
	public String deleteComment(HttpServletRequest request, @PathVariable int postId, @PathVariable int postCommentNum) {
		
		commentService.deleteComment(postId, postCommentNum, request);
		return "Comment Deleted!";
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 댓글에 대한 대댓글 조회
     * # 기  능 : 게시물 ID와 댓글 번호를 기반으로 해당 댓글에 달린 모든 대댓글 조회
     * # 매개변수 : int postId, int postCommentNum
     * # 반환값 : List<Reply> - 대댓글 목록
     */
	@GetMapping("/post/{postId}/comment/{postCommentNum}/replies")
 	public List<Reply> getRepliesByCommentId(@PathVariable int postId, @PathVariable int postCommentNum) {
	
		return commentService.getRepliesByCommentId(postId, postCommentNum);
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 대댓글 조회
     * # 기  능 : 게시물 ID, 댓글 번호, 대댓글 ID를 기반으로 특정 대댓글 조회
     * # 매개변수 : int postId, int postCommentNum, int replyId
     * # 반환값 : Reply - 조회된 대댓글 정보
     */
	@GetMapping("/post/{postId}/comment/{postCommentNum}/reply/{replyId}")
	public Reply getReplyById(@PathVariable int postId, @PathVariable int postCommentNum, @PathVariable int replyId) {
		
		return commentService.getReplyById(postId, postCommentNum, replyId);
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 댓글에 대댓글 작성
     * # 기  능 : 게시물 ID와 댓글 번호를 기반으로 대댓글을 작성하고 저장
     * # 매개변수 : int postId, int postCommentNum, Reply replyComment
     * # 반환값 : String - 대댓글 작성 성공 메시지
     */
	@PostMapping("/post/{postId}/comment/{postCommentNum}/reply")
	public String createReplyComment(HttpServletRequest request, @PathVariable int postId, @PathVariable int postCommentNum,
			@RequestBody Reply replyComment) {
		
		replyComment.setPostId(postId); // 게시물 ID 설정
		replyComment.setPostCommentNum(postCommentNum); // 댓글 번호 설정
		commentService.createReplyComment(request, replyComment, postId, postCommentNum);
		return "Reply Comment Created!";
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 대댓글 수정
     * # 기  능 : 게시물 ID, 댓글 번호, 대댓글 ID를 기반으로 대댓글을 수정
     * # 매개변수 : int postId, int postCommentNum, int replyId, Reply replyComment
     * # 반환값 : String - 대댓글 수정 성공 메시지
     */
	@PutMapping("/post/{postId}/comment/{postCommentNum}/reply/{replyId}")
	public String updateReplyComment(HttpServletRequest request,@PathVariable int postId, @PathVariable int postCommentNum,
			@PathVariable int replyId, @RequestBody Reply replyComment) {
		
		replyComment.setReplyId(replyId);
		replyComment.setPostId(postId);
		replyComment.setPostCommentNum(postCommentNum);
		commentService.updateReplyComment(request, replyComment);
		return "Reply Comment Updated!";
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 대댓글 삭제
     * # 기  능 : 게시물 ID, 댓글 번호, 대댓글 ID를 기반으로 대댓글 삭제
     * # 매개변수 : int postId, int postCommentNum, int replyId
     * # 반환값 : String - 대댓글 삭제 성공 메시지
     */
	@DeleteMapping("/post/{postId}/comment/{postCommentNum}/reply/{replyId}")
	public String deleteReplyComment(HttpServletRequest request,@PathVariable int postId, @PathVariable int postCommentNum,
			@PathVariable int replyId) {
		
		commentService.deleteReplyComment(request, postId, postCommentNum, replyId);
		return "Reply Comment Deleted!";
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 댓글 또는 대댓글 삭제 요청 처리	
     * # 기  능 : 댓글 관리 페이지에서 댓글 또는 대댓글 삭제 요청을 처리
     * # 매개변수 : int postId, String type, int postCommentNum, Integer replyId
     * # 반환값 : String - 삭제 성공 메시지 또는 오류 메시지
     */
    @DeleteMapping("/{postId}/delete")
    public String deleteCommentOrReply(HttpServletRequest request, @PathVariable("postId") int postId, @RequestParam("type") String type,
            @RequestParam(value = "postCommentNum") int postCommentNum,
            @RequestParam(value = "replyId", required = false) Integer replyId) {
    	
        if ("comment".equals(type)) {
            commentService.deleteComment(postId, postCommentNum, request);
        } else if ("reply".equals(type)) {
            commentService.deleteReplyComment(request, postId, postCommentNum, replyId);
        } else {
            return "Invalid type";
        }
        return "Deleted!";
    }
    /** 추가되었습니다.
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정게시물의 모든 댓글과 대댓글 수 
     * # 기  능 : 특정게시물의 모든 댓글과 대댓글 수 조회하여 반환
     * # 매개변수 : HttpServletRequest request
     * # 반환값 : List<CommentReplyDTO> - 모든 댓글과 대댓글 정보
     */
	@GetMapping("/commentscount")
	public Integer getPostCommentsAndReplies(HttpServletRequest request, @RequestParam int postId) {

		return commentService.getPostCommentsAndReplies(postId);
	}

}
