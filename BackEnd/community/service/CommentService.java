package com.example.community.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.community.dto.CommentReplyDTO;
import com.example.community.model.Comment;
import com.example.community.model.Reply;
import com.example.service.JwtTokenProvider;
import com.example.mapper.Mappers;
import jakarta.servlet.http.HttpServletRequest;

/**
 * # 작성자 : 이재훈
 * # 작성일 : 2024-10-08
 * # 목  적 : 댓글 및 대댓글에 대한 CRUD 기능을 제공하는 서비스
 * # 기  능 : 댓글 및 대댓글 생성, 수정, 삭제, 조회 등의 비즈니스 로직 처리
 */
@Service
public class CommentService {

	@Autowired
	private JwtTokenProvider jwtTokenProvider;  // JWT 토큰 제공자
	
	@Autowired
	private Mappers mappers;
	

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 게시물의 모든 댓글 조회
     * # 기  능 : 게시물 ID로 해당 게시물에 달린 모든 댓글을 조회
     * # 매개변수 : int postId - 게시물 ID
     * # 반환값 : List<Comment> - 게시물의 모든 댓글 목록
     */
	@Transactional(readOnly = true)
	public List<Comment> getCommentsByPostId(int postId) {
	    // 1. 게시물 ID로 모든 댓글 조회
	    List<Comment> comments = mappers.getCommentsByPostId(postId);

	    // 2. 사용자 고유번호를 null로 설정하여 반환
	    return comments.stream()
	            .map(comment -> {
	                comment.setUserUniqueNumber(null);  // 유저 고유번호 null 처리
	                return comment;
	            })
	            .collect(Collectors.toList());
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 사용자 고유번호로 해당 사용자의 모든 댓글 조회
     * # 기  능 : 사용자 고유번호로 사용자가 작성한 모든 댓글을 조회
     * # 매개변수 : HttpServletRequest request - 요청 객체
     * # 반환값 : List<Comment> - 사용자가 작성한 댓글 목록
     */
	@Transactional(readOnly = true)
    public List<Comment> getCommentsByUser(HttpServletRequest request) {
        // JWT에서 사용자 정보 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        String userUniqueNumber = authentication.getName();

        // 사용자에 맞는 댓글을 조회하여 반환
        return mappers.getCommentsByUser(userUniqueNumber);
    }

	/**
	 * # 작성자 : 이재훈
	 * # 작성일 : 2024-10-08
	 * # 목  적 : 특정 게시물의 특정 댓글 조회
	 * # 기  능 : 게시물 ID와 댓글 번호로 해당 댓글을 조회
	 * # 매개변수 : int postId, int postCommentNum - 게시물 ID와 댓글 번호
	 * # 반환값 : Comment - 조회된 댓글 객체
	 */
	@Transactional(readOnly = true)
	public Comment getCommentById(int postId, int postCommentNum) {

	    // 1. 댓글 조회
	    Comment comment = mappers.getCommentById(postId, postCommentNum);

	    // 2. 사용자 고유번호(userUniqueNumber)를 null로 설정
	    comment.setUserUniqueNumber(null);  // 클라이언트로 보낼 때 유저 고유번호를 null로 설정

	    return comment;
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 댓글 생성
     * # 기  능 : 게시물에 새로운 댓글을 생성하며 JWT 토큰을 통해 사용자 인증 처리
     * # 매개변수 : Comment comment, HttpServletRequest request - 댓글 객체와 요청 객체
     * # 반환값 : 없음
     */
    @Transactional
    public void createComment(Comment comment, HttpServletRequest request) {
        
        // JWT 토큰에서 인증 정보 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        String userUniqueNumber = authentication.getName();

        // 유저의 닉네임을 데이터베이스에서 조회
        String userNickname = mappers.findNicknameByUserUniqueNumber(userUniqueNumber);
        
        // 댓글 객체에 유저 정보 설정
        comment.setUserUniqueNumber(userUniqueNumber);
        comment.setCommentName(userNickname); // 닉네임 설정
        
        // 해당 게시물의 댓글 번호 계산
        Integer maxCommentNum = mappers.getMaxCommentNumByPostId(comment.getPostId());
        if (maxCommentNum == null) {
            maxCommentNum = 1; // 해당 게시물의 첫 번째 댓글일 경우
        } else {
            maxCommentNum += 1;
        }
        comment.setPostCommentNum(maxCommentNum);

        // 댓글 저장
        mappers.createComment(comment);
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 댓글 수정
     * # 기  능 : 댓글을 수정하며 JWT 토큰을 통해 사용자 인증 처리
     * # 매개변수 : Comment comment, HttpServletRequest request - 댓글 객체와 요청 객체
     * # 반환값 : 없음
     * @return 
     */
	@Transactional 
	public Comment updateComment(Comment comment, HttpServletRequest request) {

        // JWT 토큰에서 인증 정보 및 role 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        if (authentication == null) {
            throw new SecurityException("인증되지 않은 사용자입니다.");
        }

        String userUniqueNumber = authentication.getName();
        String token = jwtTokenProvider.resolveToken(request);
        Map<String, String> roleAndFavoriteTeam = jwtTokenProvider.getRoleAndFavoriteTeam(token);
        String role = roleAndFavoriteTeam.get("role");

        // 수정하려는 댓글 존재 여부 확인
        Comment existingComment = mappers.getCommentById(comment.getPostId(), comment.getPostCommentNum());

        // 관리자 권한 확인 (role이 'admin'인 경우 작성자 확인 없이 수정 가능)
        if (!"admin".equals(role)) {
            // 일반 사용자는 자신의 댓글만 수정 가능
            if (!existingComment.getUserUniqueNumber().equals(userUniqueNumber)) {
                throw new SecurityException("댓글을 수정할 권한이 없습니다.");
            }
        }
		
		// 댓글 수정
		mappers.updateComment(comment);
		
	    return mappers.getCommentById(comment.getPostId(), comment.getPostCommentNum());
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 댓글 삭제
     * # 기  능 : 게시물의 특정 댓글을 삭제하며, 관리자는 모든 댓글 삭제 가능
     *            일반 사용자는 자신이 작성한 댓글만 삭제 가능
     * # 매개변수 : int postId, int postCommentNum, HttpServletRequest request - 게시물 ID, 댓글 번호, 요청 객체
     * # 반환값 : 없음
     */
	@Transactional
	public void deleteComment(int postId, int postCommentNum, HttpServletRequest request) {

        // JWT 토큰에서 인증 정보 및 role 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        if (authentication == null) {
            throw new SecurityException("인증되지 않은 사용자입니다.");
        }

        String userUniqueNumber = authentication.getName();
        String token = jwtTokenProvider.resolveToken(request);
        Map<String, String> roleAndFavoriteTeam = jwtTokenProvider.getRoleAndFavoriteTeam(token);
        String role = roleAndFavoriteTeam.get("role");

        // 삭제하려는 댓글 존재 여부 확인
        Comment comment = mappers.getCommentById(postId, postCommentNum);

        // 관리자 권한 확인 (role이 'admin'인 경우 작성자 확인 없이 삭제 가능)
        if (!"admin".equals(role)) {
            // 일반 사용자는 자신의 댓글만 삭제 가능
            if (!comment.getUserUniqueNumber().equals(userUniqueNumber)) {
                throw new SecurityException("댓글을 삭제할 권한이 없습니다.");
            }
        }
		
		// 댓글 삭제
		mappers.deleteComment(postId, postCommentNum);

		// 삭제된 댓글 번호 이후의 댓글 조회 및 번호 업데이트
		List<Comment> comments = mappers.getCommentsByPostIdAndGreaterThanCommentNum(postId, postCommentNum);
		for (Comment commentItem : comments) {
			int newPostCommentNum = commentItem.getPostCommentNum() - 1;
			mappers.updateCommentNumber(newPostCommentNum, commentItem.getPostCommentNum(), postId);
			commentItem.setPostCommentNum(newPostCommentNum); // 로컬 객체 업데이트
		}
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 대댓글 조회
     * # 기  능 : 특정 게시물의 특정 댓글에 달린 대댓글 조회
     * # 매개변수 : int postId, int postCommentNum - 게시물 ID와 댓글 번호
     * # 반환값 : List<Reply> - 대댓글 목록
     */
	@Transactional(readOnly = true)
	public List<Reply> getRepliesByCommentId(int postId, int postCommentNum) {
	    // 1. 댓글 ID로 대댓글 조회
	    List<Reply> replies = mappers.getRepliesByCommentId(postId, postCommentNum);

	    // 2. 유저 고유번호를 null로 설정하여 반환
	    return replies.stream()
	            .map(reply -> {
	                reply.setUserUniqueNumber(null);  // 유저 고유번호 null 처리
	                return reply;
	            })
	            .collect(Collectors.toList());
	}


	/**
	 * # 작성자 : 이재훈
	 * # 작성일 : 2024-10-08
	 * # 목  적 : 특정 대댓글 조회
	 * # 기  능 : 게시물 ID, 댓글 번호, 대댓글 번호로 대댓글 조회
	 * # 매개변수 : int postId, int postCommentNum, int replyId - 게시물 ID, 댓글 번호, 대댓글 번호
	 * # 반환값 : Reply - 조회된 대댓글 객체
	 */
	@Transactional(readOnly = true)
	public Reply getReplyById(int postId, int postCommentNum, int replyId) {

	    // 1. 대댓글 조회
	    Reply reply = mappers.getReplyById(postId, postCommentNum, replyId);

	    // 2. 사용자 고유번호(userUniqueNumber)를 null로 설정
	    reply.setUserUniqueNumber(null);  // 클라이언트로 보낼 때 유저 고유번호를 null로 설정

	    return reply;
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 대댓글 생성
     * # 기  능 : 특정 게시물의 댓글에 대한 새로운 대댓글 생성
     * # 매개변수 : HttpServletRequest request, Reply replyComment, int postId, int postCommentNum - 요청 객체, 대댓글 객체, 게시물 ID, 댓글 번호
     * # 반환값 : 없음
     */
	@Transactional
	public void createReplyComment(HttpServletRequest request, Reply replyComment, int postId, int postCommentNum) {
	    
	    // JWT 토큰에서 인증 정보 추출
	    Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
	    String userUniqueNumber = authentication.getName();

	    // 유저의 닉네임을 데이터베이스에서 조회
	    String userNickname = mappers.findNicknameByUserUniqueNumber(userUniqueNumber);

	    // 대댓글 객체에 유저 정보 설정
	    replyComment.setUserUniqueNumber(userUniqueNumber);
	    replyComment.setReplyName(userNickname); // 닉네임 설정

	    // 해당 댓글의 최대 reply_id 값을 가져와서 +1로 설정
	    int maxReplyId = mappers.getMaxReplyIdByPostIdAndCommentNum(postId, postCommentNum);
	    replyComment.setReplyId(maxReplyId + 1);

	    // 대댓글 생성
	    mappers.createReply(replyComment);
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 대댓글 수정
     * # 기  능 : 특정 대댓글 수정
     * # 매개변수 : HttpServletRequest request, Reply replyComment - 요청 객체와 대댓글 객체
     * # 반환값 : 없음
     */
	@Transactional
	public void updateReplyComment(HttpServletRequest request, Reply replyComment) {

        // JWT 토큰에서 인증 정보 및 role 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        if (authentication == null) {
            throw new SecurityException("인증되지 않은 사용자입니다.");
        }

        String userUniqueNumber = authentication.getName();
        String token = jwtTokenProvider.resolveToken(request);
        Map<String, String> roleAndFavoriteTeam = jwtTokenProvider.getRoleAndFavoriteTeam(token);
        String role = roleAndFavoriteTeam.get("role");

        // 수정하려는 대댓글 존재 여부 확인
        Reply existingReply = mappers.getReplyById(replyComment.getPostId(), replyComment.getPostCommentNum(), replyComment.getReplyId());

        // 관리자 권한 확인 (role이 'admin'인 경우 작성자 확인 없이 수정 가능)
        if (!"admin".equals(role)) {
            // 일반 사용자는 자신의 대댓글만 수정 가능
            if (!existingReply.getUserUniqueNumber().equals(userUniqueNumber)) {
                throw new SecurityException("대댓글을 수정할 권한이 없습니다.");
            }
        }
		
		// 대댓글 수정
		mappers.updateReply(replyComment);
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 대댓글 삭제
     * # 기  능 : 특정 대댓글 삭제하며, 관리자는 모든 대댓글 삭제 가능
     *            일반 사용자는 자신이 작성한 대댓글만 삭제 가능
     * # 매개변수 : HttpServletRequest request, int postId, int postCommentNum, int replyId - 요청 객체, 게시물 ID, 댓글 번호, 대댓글 번호
     * # 반환값 : 없음
     */
	@Transactional
	public void deleteReplyComment(HttpServletRequest request, int postId, int postCommentNum, int replyId) {

        // JWT 토큰에서 인증 정보 및 role 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        if (authentication == null) {
            throw new SecurityException("인증되지 않은 사용자입니다.");
        }

        String userUniqueNumber = authentication.getName();
        String token = jwtTokenProvider.resolveToken(request);
        Map<String, String> roleAndFavoriteTeam = jwtTokenProvider.getRoleAndFavoriteTeam(token);
        String role = roleAndFavoriteTeam.get("role");

        // 삭제하려는 대댓글 존재 여부 확인
        Reply reply = mappers.getReplyById(postId, postCommentNum, replyId);

        // 관리자 권한 확인 (role이 'admin'인 경우 작성자 확인 없이 삭제 가능)
        if (!"admin".equals(role)) {
            // 일반 사용자는 자신의 대댓글만 삭제 가능
            if (!reply.getUserUniqueNumber().equals(userUniqueNumber)) {
                throw new SecurityException("대댓글을 삭제할 권한이 없습니다.");
            }
        }
		
		// 대댓글 삭제
		mappers.deleteReply(postId, postCommentNum, replyId);

        List<Reply> replies = mappers.getRepliesByPostIdAndCommentNumAndGreaterThanReplyId(postId, postCommentNum, replyId);
        for (Reply replyItem : replies) {
            int newReplyId = replyItem.getReplyId() - 1;
            mappers.updateReplyNumber(newReplyId, replyItem.getReplyId(), postId, postCommentNum);
            replyItem.setReplyId(newReplyId);
		}
	}

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 모든 댓글 및 대댓글 조회
     * # 기  능 : 모든 게시물에 달린 댓글과 대댓글을 함께 조회
     * # 매개변수 : 없음
     * # 반환값 : List<CommentReplyDTO> - 댓글 및 대댓글 목록
     */
	@Transactional(readOnly = true)
	public List<CommentReplyDTO> getAllCommentsAndReplies() {
		
        return mappers.getAllCommentsAndReplies();
	}
	
    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 모든 댓글 및 대댓글수 조회
     * # 기  능 : 모든 게시물에 달린 댓글과 대댓글을 함께 조회
     * # 매개변수 : 없음
     * # 반환값 : List<CommentReplyDTO> - 댓글 및 대댓글 목록
     */
	@Transactional(readOnly = true)
    public int getPostCommentsAndReplies(int postId) {
        Integer count = mappers.getPostCommentsAndReplies(postId);        
        // Null 값이 반환될 경우 기본값 0을 반환
        return (count != null) ? count : 0;
    }
}
