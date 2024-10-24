package com.example.question.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.community.dto.QuestionDTO;
import com.example.service.JwtTokenProvider;
import com.example.mapper.Mappers;
import com.example.question.model.Question;
import jakarta.servlet.http.HttpServletRequest;

/**
 * # 작성자 : 이재훈
 * # 작성일 : 2024-10-08
 * # 목  적 : 문의 게시물에 대한 CRUD 및 답변 관리 기능 제공
 * # 기  능 : 문의 게시물 생성, 수정, 삭제, 조회 및 답변 추가/수정/삭제 기능 제공
 */
@Service
public class QuestionService {

	@Autowired
	private JwtTokenProvider jwtTokenProvider;  // JWT 토큰 제공자

	// 파일 저장 경로 설정
	private static final String UPLOAD_DIR = "C:/DEV/uploads";
	
	@Autowired
	private Mappers mappers;

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 모든 문의글 조회
     * # 기  능 : 데이터베이스에서 모든 문의글을 조회
     * # 매개변수 : 없음
     * # 반환값 : List<Question> - 문의글 목록
     */
	@Transactional(readOnly = true)
    public List<Question> getAllQuestions() {
		
		 List<Question> QuestionPosts = mappers.getAllQuestions();
    	
        return QuestionPosts.stream()
        .map(post -> {
            post.setUserUniqueNumber(null);  // 클라이언트로 보낼 때 유저 고유번호를 null로 설정
            return post;
        })
        .collect(Collectors.toList());
    }

	/**
	 * # 작성자 : 이재훈
	 * # 작성일 : 2024-10-08
	 * # 목  적 : 특정 문의글 조회
	 * # 기  능 : 문의글 번호로 조회수 증가 후 문의글 조회
	 * # 매개변수 : int questionNum - 문의글 번호
	 * # 반환값 : Question - 조회된 문의글 객체
	 */
	@Transactional(readOnly = true)
	public Question getQuestionById(int questionNum) {

	    // 1. 조회수 증가
	    mappers.increaseQuestionView(questionNum);

	    // 2. 문의글 조회
	    Question question = mappers.getQuestionById(questionNum);

	    // 3. 사용자 고유번호(userUniqueNumber)를 null로 설정
	    question.setUserUniqueNumber(null);  // 클라이언트로 보낼 때 유저 고유번호를 null로 설정

	    return question;
	}

	
    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 파일 저장
     * # 기  능 : 업로드된 파일을 서버의 특정 경로에 저장
     * # 매개변수 : MultipartFile file - 업로드된 파일 객체
     * # 반환값 : String - 저장된 파일의 경로
     */
	private String saveFile(MultipartFile file) throws IOException {
		String originalFileName = file.getOriginalFilename();
		String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
		String fullPath = UPLOAD_DIR + File.separator + uniqueFileName;
		File dest = new File(fullPath);
		file.transferTo(dest); // 파일 저장
		
		return fullPath; // 저장된 파일 경로 반환
		 
	}
    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 문의글 생성
     * # 기  능 : 새로운 문의글을 생성하고 비밀번호 처리 및 JWT 유효성 검사
     * # 매개변수 : HttpServletRequest request, Question question - 요청 객체, 문의글 객체
     * # 반환값 : 없음
     * @throws IOException 
     */
    @Transactional
    public void createQuestion(HttpServletRequest request, Question question, MultipartFile file) throws IOException {

        // JWT 토큰에서 인증 정보 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        String userUniqueNumber = authentication.getName();
        
        // 유저의 닉네임을 데이터베이스에서 조회
        String userNickname = mappers.findNicknameByUserUniqueNumber(userUniqueNumber);

        // Question 객체에 유저 정보 설정
        question.setUserUniqueNumber(userUniqueNumber);  // JWT에서 추출한 userUniqueNumber 설정
        question.setQuestionID(userNickname);  // 작성자 닉네임 설정

        // 비공개 질문 패스워드가 null인 경우 null 처리
        if (question.getPrivateQuestionPassworld() == null) {
            question.setPrivateQuestionPassworld(null); // 실제 null 처리
        }

	    // 파일이 있을 경우 처리
	    if (file != null && !file.isEmpty()) {
	        String filePath = saveFile(file);
	        // 상대 경로로 저장 (예: /uploads/uniqueFileName)
	        question.setQuestionImgPath(new File(filePath).getName());
	    }
	    
        // 문의글 저장
        mappers.createQuestion(question);
    }


    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 문의글 수정
     * # 기  능 : 특정 문의글 수정 및 JWT 유효성 검사
     * # 매개변수 : HttpServletRequest request, int questionNum, Question question - 요청 객체, 문의글 번호, 문의글 객체
     * # 반환값 : 없음
     */
    @Transactional
    public void updateQuestion(HttpServletRequest request, int questionNum, Question question) {

        // JWT 토큰에서 인증 정보 및 role 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        if (authentication == null) {
            throw new SecurityException("인증되지 않은 사용자입니다.");
        }

        String userUniqueNumber = authentication.getName();

        // JwtTokenProvider에서 role 추출 (secretKey에 접근하지 않음)
        String token = jwtTokenProvider.resolveToken(request);
        Map<String, String> roleAndFavoriteTeam = jwtTokenProvider.getRoleAndFavoriteTeam(token);
        String role = roleAndFavoriteTeam.get("role");

        // 수정하려는 문의글 존재 여부 확인
        Question existingQuestion = mappers.getQuestionById(questionNum);

        // 관리자 권한 확인 (role이 'admin'인 경우 작성자 확인 없이 수정 가능)
        if (!"admin".equals(role)) {
            // 일반 사용자의 경우 본인 문의글만 수정 가능
            if (!existingQuestion.getUserUniqueNumber().equals(userUniqueNumber)) {
                throw new SecurityException("문의글을 수정할 권한이 없습니다.");
            }
        }

        question.setQuestionNum(questionNum);
        mappers.updateQuestion(question);
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 문의글 삭제
     * # 기  능 : 특정 문의글 삭제 및 JWT 유효성 검사
     * # 매개변수 : HttpServletRequest request, int questionNum - 요청 객체, 문의글 번호
     * # 반환값 : 없음
     */
    @Transactional
    public void deleteQuestion(HttpServletRequest request, int questionNum) {

        // JWT 토큰에서 인증 정보 및 role 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        if (authentication == null) {
            throw new SecurityException("인증되지 않은 사용자입니다.");
        }

        String userUniqueNumber = authentication.getName();

        // JwtTokenProvider에서 role 추출 (secretKey에 접근하지 않음)
        String token = jwtTokenProvider.resolveToken(request);
        Map<String, String> roleAndFavoriteTeam = jwtTokenProvider.getRoleAndFavoriteTeam(token);
        String role = roleAndFavoriteTeam.get("role");

        // 삭제하려는 문의글 존재 여부 확인
        Question existingQuestion = mappers.getQuestionById(questionNum);

        // 관리자 권한 확인 (role이 'admin'인 경우 작성자 확인 없이 삭제 가능)
        if (!"admin".equals(role)) {
            // 일반 사용자의 경우 본인 문의글만 삭제 가능
            if (!existingQuestion.getUserUniqueNumber().equals(userUniqueNumber)) {
                throw new SecurityException("문의글을 삭제할 권한이 없습니다.");
            }
        }

        mappers.deleteQuestion(questionNum);
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 답변 추가 또는 수정
     * # 기  능 : 특정 문의글에 대한 답변을 추가하거나 수정
     * # 매개변수 : HttpServletRequest request, int questionNum, String answer - 요청 객체, 문의글 번호, 답변 내용
     * # 반환값 : 없음
     */
    @Transactional
    public void addOrUpdateAnswer(HttpServletRequest request, int questionNum, String answer) {

        // JWT 토큰에서 인증 정보 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        String userUniqueNumber = authentication.getName();
        System.out.println("##########################################################################################################");
        System.out.println("이게 인증통과한 유저 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
        System.out.println("##########################################################################################################");
        System.out.println(userUniqueNumber);

        mappers.updateAnswer(questionNum, answer); // 답변이 없으면 새로 추가, 있으면 수정
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 답변 삭제
     * # 기  능 : 특정 문의글에 대한 답변을 삭제
     * # 매개변수 : HttpServletRequest request, int questionNum - 요청 객체, 문의글 번호
     * # 반환값 : 없음
     */
    @Transactional
    public void deleteAnswer(HttpServletRequest request, int questionNum) {

        // JWT 토큰에서 인증 정보 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        String userUniqueNumber = authentication.getName();
        System.out.println("##########################################################################################################");
        System.out.println("이게 인증통과한 유저 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
        System.out.println("##########################################################################################################");
        System.out.println(userUniqueNumber);

        mappers.deleteAnswer(questionNum);
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 관리자용 문의 목록 조회
     * # 기  능 : 관리자용으로 모든 문의 목록을 조회
     * # 매개변수 : HttpServletRequest request - 요청 객체
     * # 반환값 : List<QuestionDTO> - 문의글 목록
     */
    @Transactional(readOnly = true)
    public List<QuestionDTO> getAdminAllQuestions(HttpServletRequest request) {

        // JWT 토큰에서 인증 정보 추출
        Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
        String userUniqueNumber = authentication.getName();
        System.out.println("##########################################################################################################");
        System.out.println("이게 인증통과한 유저 유니크 넘버다!!!!!!!!!!!!!!!!!!!!!!!!!");
        System.out.println("##########################################################################################################");
        System.out.println(userUniqueNumber);

        return mappers.getAdminAllQuestions();
    }

	 // # 작성자 : 이재훈
	 // # 작성일 : 2024-10-08
	 // # 목  적 : 특정 사용자의 모든 문의글을 조회함
	 // # 기  능 : 주어진 userUniqueNumber로 작성된 모든 문의글을 데이터베이스에서 가져와 반환함
	 // # 매개변수 : userUniqueNumber : 사용자의 고유번호
	 // # 반환값 : 주어진 사용자의 문의글 목록 (List<Question>)
    @Transactional(readOnly = true)
   public List<Question> getQuestionsByUser(HttpServletRequest request) {
       // JWT에서 사용자 정보 추출
       Authentication authentication = jwtTokenProvider.resolveAndAuthenticateToken(request);
       String userUniqueNumber = authentication.getName();

       System.out.println("###############################################");
       System.out.println("인증된 사용자 유니크 넘버입니다: " + userUniqueNumber);
       System.out.println("###############################################");

       // 사용자에 맞는 문의글을 조회하여 반환
       return mappers.getQuestionsByUser(userUniqueNumber);
   }

	public void removeFile(Long questionNum) {
	       // 매퍼를 호출하여 해당 문의글의 파일 경로를 null로 설정
        mappers.updateQuestionFilePathToNull(questionNum);
		
	}
}
