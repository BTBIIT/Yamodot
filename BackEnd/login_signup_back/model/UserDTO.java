package com.example.login_signup_back.model;

import java.util.Date;

//# 작성자 : 나기표
//# 작성일 : 2024-10-08
//# 목  적 : 사용자 정보를 담는 DTO 클래스
//# 기  능 : 사용자 데이터 전송 객체로 사용됨 (User entity와 직접적으로 매핑되어 데이터를 교환)
public class UserDTO {

	private String userUniqueNumber;								//고유번호
	private String adminUniqueNumber;								//관리자 고유번호
	private String adminId;													//어드민 아이디
	private String userId;													//회원가입 아이디
	private String userName;												//사용자이름
	private String userPassword;										//비밀번호 특수문자, 영어, 숫자 허용
	private String adminPassword;										//어드민 비밀번호
	private String userNickname;										//사용자의 닉네임
	private String userEmail;												//이메일
	private Date userCreateDate;										//회원가입날짜
	private Date userEditInformationDate;						//회원정보 수정날짜 / 초기 = 회원가입날짜
	private int userStopCount;											//유저정지횟수
	private Date userStopDate;											//유저정지기간
	private String userState;												//유저상태 : R = 정상, S = 정지
	private String userBeforePassword;							//이전 비밀번호
	private String userBirthDay;										//생년월일
	private int userGender;													//성별 (선택사항)
	private String userFavoriteTeam;								//좋아하는 팀
	private String userSvcUsePcyAgmtYn;							//서비스 이용 동의
	private String userPsInfoProcAgmtYn;						//개인정보 처리 방침 동의
	private String userSocialLoginSep;							//자체: Y, 카카오: K, 네이버: N, 지메일: G
	private String role;														//어드민 유저 구분자(user, admin)
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 기본 생성자
	// # 기  능 : 빈 UserDTO 객체 생성
	public UserDTO() {}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 매개변수가 있는 생성자
	// # 기  능 : 입력된 사용자 정보로 UserDTO 객체 생성
	// # 매개변수 : userUniqueNumber, adminUniqueNumber, adminId, userId, userName, userPassword, adminPassword 등 사용자 정보
	public UserDTO(String userUniqueNumber, String adminUniqueNumber, String adminId, String userId, 
		String userName, String userPassword, String adminPassword, String userNickname, 
		String userEmail, Date userCreateDate, Date userEditInformationDate, int userStopCount, 
		Date userStopDate, String userState, String userBeforePassword, String userBirthDay, 
		int userGender, String userFavoriteTeam, String userSvcUsePcyAgmtYn, 
		String userPsInfoProcAgmtYn, String userSocialLoginSep, String role) {
		this.userUniqueNumber = userUniqueNumber;
		this.adminUniqueNumber = adminUniqueNumber;
		this.adminId = adminId;
		this.userId = userId;
		this.userName = userName;
		this.userPassword = userPassword;
		this.adminPassword = adminPassword;
		this.userNickname = userNickname;
		this.userEmail = userEmail;
		this.userCreateDate = userCreateDate;
		this.userEditInformationDate = userEditInformationDate;
		this.userStopCount = userStopCount;
		this.userStopDate = userStopDate;
		this.userState = userState;
		this.userBeforePassword = userBeforePassword;
		this.userBirthDay = userBirthDay;
		this.userGender = userGender;
		this.userFavoriteTeam = userFavoriteTeam;
		this.userSvcUsePcyAgmtYn = userSvcUsePcyAgmtYn;
		this.userPsInfoProcAgmtYn = userPsInfoProcAgmtYn;
		this.userSocialLoginSep = userSocialLoginSep;
		this.role = role;
	}
	
	public String getUserUniqueNumber() {
		return userUniqueNumber;
	}
	public void setUserUniqueNumber(String userUniqueNumber) {
		this.userUniqueNumber = userUniqueNumber;
	}
	public String getAdminUniqueNumber() {
		return adminUniqueNumber;
	}
	public void setAdminUniqueNumber(String adminUniqueNumber) {
		this.adminUniqueNumber = adminUniqueNumber;
	}
	public String getAdminId() {
		return adminId;
	}
	public void setAdminId(String adminId) {
		this.adminId = adminId;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserPassword() {
		return userPassword;
	}
	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}
	public String getAdminPassword() {
		return adminPassword;
	}
	public void setAdminPassword(String adminPassword) {
		this.adminPassword = adminPassword;
	}
	public String getUserNickname() {
		return userNickname;
	}
	public void setUserNickname(String userNickname) {
		this.userNickname = userNickname;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public Date getUserCreateDate() {
		return userCreateDate;
	}
	public void setUserCreateDate(Date userCreateDate) {
		this.userCreateDate = userCreateDate;
	}
	public Date getUserEditInformationDate() {
		return userEditInformationDate;
	}
	public void setUserEditInformationDate(Date userEditInformationDate) {
		this.userEditInformationDate = userEditInformationDate;
	}
	public int getUserStopCount() {
		return userStopCount;
	}
	public void setUserStopCount(int userStopCount) {
		this.userStopCount = userStopCount;
	}
	public Date getUserStopDate() {
		return userStopDate;
	}
	public void setUserStopDate(Date userStopDate) {
		this.userStopDate = userStopDate;
	}
	public String getUserState() {
		return userState;
	}
	public void setUserState(String userState) {
		this.userState = userState;
	}
	public String getUserBeforePassword() {
		return userBeforePassword;
	}
	public void setUserBeforePassword(String userBeforePassword) {
		this.userBeforePassword = userBeforePassword;
	}
	public String getUserBirthDay() {
		return userBirthDay;
	}
	public void setUserBirthDay(String userBirthDay) {
		this.userBirthDay = userBirthDay;
	}
	public int getUserGender() {
		return userGender;
	}
	public void setUserGender(int userGender) {
		this.userGender = userGender;
	}
	public String getUserFavoriteTeam() {
		return userFavoriteTeam;
	}
	public void setUserFavoriteTeam(String userFavoriteTeam) {
		this.userFavoriteTeam = userFavoriteTeam;
	}
	public String getUserSvcUsePcyAgmtYn() {
		return userSvcUsePcyAgmtYn;
	}
	public void setUserSvcUsePcyAgmtYn(String userSvcUsePcyAgmtYn) {
		this.userSvcUsePcyAgmtYn = userSvcUsePcyAgmtYn;
	}
	public String getUserPsInfoProcAgmtYn() {
		return userPsInfoProcAgmtYn;
	}
	public void setUserPsInfoProcAgmtYn(String userPsInfoProcAgmtYn) {
		this.userPsInfoProcAgmtYn = userPsInfoProcAgmtYn;
	}
	public String getUserSocialLoginSep() {
		return userSocialLoginSep;
	}
	public void setUserSocialLoginSep(String userSocialLoginSep) {
		this.userSocialLoginSep = userSocialLoginSep;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
}
