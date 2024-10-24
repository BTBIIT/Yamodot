package com.example.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.example.community.dto.CommentReplyDTO;
import com.example.community.dto.PostCommentStatsDto;
import com.example.community.dto.PostWithCommentCountDTO;
import com.example.community.dto.QuestionDTO;
import com.example.community.model.Comment;
import com.example.community.model.Community;
import com.example.community.model.Reply;
import com.example.login_signup_back.model.User;
import com.example.question.model.Question;
import com.example.records.model.Batters;
import com.example.records.model.BattersTeamRecord;
import com.example.records.model.Defence;
import com.example.records.model.DefencesTeamRecord;
import com.example.records.model.PitBatMatchup;
import com.example.records.model.Pitchers;
import com.example.records.model.PitchersTeamRecord;
import com.example.scheduleresults.model.ScheduleResults;
import com.example.scheduleresults.model.ScoreBoard;

@Mapper
public interface Mappers {
    // 지훈님 관리 매퍼
    List<ScheduleResults> selectAllResults(int year, int month); // 정규시즌 결과 출력
    List<ScheduleResults> selectPostResults(int year, int month); // 포스트시즌 결과 출력
    List<ScoreBoard> selectAllScoreBoard(String date); // 모든 스코어보드 출력
    List<ScoreBoard> selectPrevScoreBoard(String date); // 선택된 날짜 기준 이전 경기 스코어보드 출력
    List<ScoreBoard> selectNextScoreBoard(String date); // 선택된 날짜 기준 다음 경기 스코어보드 출력
    List<Defence> selectAllDefence(int year, String teamName); // 선수별 수비 기록
    List<Batters> selectAllBatters(int year, String teamName); // 선수별 타자 기록
    List<Pitchers> selectAllPitchers(int year, String teamName); // 선수별 투수 기록
    List<PitBatMatchup> selectPitBatMatchup(String pitcherTeam, String pitcher, String batterTeam, String batter); // 투수 vs 타자 기록
    List<PitBatMatchup> selectPitchersList(String pitcherTeam); // 투vs타 기록 호출을 위한 선택팀 투수리스트
    List<PitBatMatchup> selectBattersList(String batterTeam); // 투vs타 기록 호출을 위한 선택팀 타자리스트
    List<DefencesTeamRecord> selectDefencesTeamRecord(int year); // 팀별 수비기록
    List<BattersTeamRecord> selectBattersTeamRecord(int year); // 팀별 타자기록
    List<PitchersTeamRecord> selectPitchersTeamRecord(int year); // 팀별 투수기록
    List<ScheduleResults> selectMainSchedule(String date); // 홈화면 스케쥴

    
    
    // 기표님 관리 매퍼
    User loginUser(@Param("userId") String userId, @Param("userPassword") String userPassword); // 유저 로그인
    User loginAdmin(@Param("adminId") String adminId, @Param("adminPassword") String adminPassword); // 어드민 로그인
    User findbyAdminUniue(@Param("adminUniqueNumber") String adminUniqueNumber); // 어드민 정보 조회
    int signupUser(User user); // 회원가입
    void socialSignupUser(User user); // 소셜회원가입
    User findByEmail(@Param("userEmail") String userEmail); // 이메일로 사용자 찾기
    List<String> getAllUserIds(); // 아이디 중복 체크
    List<String> getAllUserNicknames(); // 닉네임 중복 체크
    List<String> getAllUserNicknamesExcept(String userUniqueNumber); // 닉네임 중복 체크(회원정보 수정용)
    int updateUserInfo(User user); // 회원정보 수정
    int updateUserPassword(User user); // 비밀번호 수정
    User getUserPassword(@Param("userUniqueNumber") String userUniqueNumber); // 현재 비밀번호 조회
    User findByUniqueId(@Param("userUniqueNumber") String userUniqueNumber); // 사용자 정보 조회
    String findUserId(String userName, String userEmail); // 아이디 찾기
    User findByUserIdAndEmail(String userId, String userEmail); // 비밀번호 찾기
    int findUserPasswordByEmail(String userId, String email, String newPassword); // 임시 비밀번호 처리
    void deleteUser(Map<String, Object> params); // 회원 탈퇴 처리
    List<User> findAllUsers(); // 모든 사용자 정보 조회
    int updateUserInfoByAdmin(User updateUserInfoByAdmin); // 유저 재제사항 업데이트
    List<User> findSuspendedUsers(); // 재제기한 만기 유저

    
    
    // 재훈님 관리 매퍼
    String findNicknameByUserUniqueNumber(String userUniqueNumber); // 닉네임 추출
    List<Community> getAllCommunityPosts(); // 게시글 조회
    Community getCommunityPostById(int postId); // 특정 게시글 조회
    List<Community> getPostsByUser(@Param("userUniqueNumber") String userUniqueNumber); // 특정 유저의 게시글 조회
    int increasePostView(int postId); // 게시글 조회수 증가
    int createCommunityPost(Community community); // 게시글 생성
    int updateCommunityPost(Community community); // 게시글 수정
    int deleteCommunityPost(int postId); // 게시글 삭제
    // Question 관련
    List<Question> getAllQuestions(); // 모든 문의글 조회
    Question getQuestionById(int questionNum); // 특정 문의글 조회
    int increaseQuestionView(int questionNum); // 문의글 조회수 증가
    int createQuestion(Question question); // 문의글 생성
    int updateQuestion(Question question); // 문의글 수정
    int deleteQuestion(int questionNum); // 문의글 삭제
    List<Question> getQuestionsByUser(String userUniqueNumber); // 특정 유저의 문의글 조회
    // 댓글 관련 메서드
    List<Comment> getCommentsByPostId(@Param("postId") int postId); // 특정 게시글의 댓글 조회
    List<Comment> getCommentsByUser(@Param("userUniqueNumber") String userUniqueNumber); // 특정 유저의 댓글 조회
    Comment getCommentById(@Param("postId") int postId, @Param("postCommentNum") int postCommentNum); // 특정 댓글 조회
    int createComment(Comment comment); // 댓글 생성
    int updateComment(Comment comment); // 댓글 수정
    int deleteComment(@Param("postId") int postId, @Param("postCommentNum") int postCommentNum); // 댓글 삭제
    // 댓글 번호 재정렬 관련 메서드
    List<Comment> getCommentsByPostIdAndGreaterThanCommentNum(@Param("postId") int postId, @Param("postCommentNum") int postCommentNum); // 특정 댓글 이후의 댓글 조회
    int updateCommentNumber(@Param("newPostCommentNum") int newPostCommentNum, @Param("oldPostCommentNum") int oldPostCommentNum, @Param("postId") int postId); // 댓글 번호 재정렬
    // 대댓글 관련 메서드
    List<Reply> getRepliesByCommentId(@Param("postId") int postId, @Param("postCommentNum") int postCommentNum); // 댓글의 대댓글 조회
    Reply getReplyById(@Param("postId") int postId, @Param("postCommentNum") int postCommentNum, @Param("replyId") int replyId); // 특정 대댓글 조회
    int createReply(Reply replyComment); // 대댓글 생성
    int updateReply(Reply replyComment); // 대댓글 수정
    int deleteReply(@Param("postId") int postId, @Param("postCommentNum") int postCommentNum, @Param("replyId") int replyId); // 대댓글 삭제
    // 대댓글 번호 재정렬 관련 메서드
    List<Reply> getRepliesByPostIdAndCommentNumAndGreaterThanReplyId(@Param("postId") int postId, @Param("postCommentNum") int postCommentNum, @Param("replyId") int replyId); // 특정 대댓글 이후의 대댓글 조회
    int updateReplyNumber(@Param("newReplyId") int newReplyId, @Param("oldReplyId") int oldReplyId, @Param("postId") int postId, @Param("postCommentNum") int postCommentNum); // 대댓글 번호 재정렬
    // 댓글/대댓글 최대 번호 가져오기 메서드
    Integer getMaxCommentNumByPostId(int postId); // 댓글 최대 번호 조회
    int getMaxReplyIdByPostIdAndCommentNum(@Param("postId") int postId, @Param("postCommentNum") int postCommentNum); // 대댓글 최대 번호 조회
    List<PostWithCommentCountDTO> getAllPostsWithCommentCount(); // 모든 게시글과 댓글 수 조회
    PostWithCommentCountDTO getPostDetail(int postId); // 게시글 상세 조회
    // 문의글 작성/수정/삭제
    void addAnswer(String questionId, String answer); // 문의글 답변 추가
    void updateAnswer(int questionNum, String answer); // 문의글 답변 수정
    void deleteAnswer(int questionNum); // 문의글 답변 삭제
    void deleteAdminComment(int postId, int postCommentNum); // 댓글 삭제
    // 댓글 목록 가져오기
    List<CommentReplyDTO> getAllCommentsAndReplies(); // 모든 댓글과 대댓글 조회
    Integer getPostCommentsAndReplies(int postId); // 특정 댓글과 대댓글 수 조회
    // 문의 관리 리스트
    List<QuestionDTO> getAdminAllQuestions(); // 관리자용 문의글 목록 조회
    PostCommentStatsDto getUserPostAndCommentStats(String userUniqueNumber); // 유저 게시글 수, 댓글 수 조회
    void updateCommunityFilePathToNull(Long postId); // 커뮤니티 파일 제거
    void updateQuestionFilePathToNull(Long questionNum); // 문의글 파일 제거
}
