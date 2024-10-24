package com.example.membershipmanagement.controller;

import com.example.community.dto.PostCommentStatsDto;
import com.example.login_signup_back.model.User;
import com.example.login_signup_back.model.UserDTO;
import com.example.membershipmanagement.service.AdminUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.mapper.Mappers;
import java.util.List;

//# 작성자 : 나기표
//# 작성일 : 2024-10-08
//# 목  적 : 관리자 사용자의 정보 관리 기능 제공
//# 기  능 : 모든 사용자 정보 조회 및 사용자 정보 수정 (일시정지, 영구정지 등)
@RestController
@RequestMapping("/api/admin")
public class AdminUserController {
	
	@Autowired
	private Mappers mapper;  // MyBatis 매퍼 주입
	
	@Autowired
	private AdminUserService adminUserService;

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 모든 사용자 정보를 조회
	// # 기  능 : 모든 사용자 정보를 조회하고 반환
	// # 매개변수 : request - HttpServletRequest 객체
	// # 반환값 : 모든 사용자 정보가 담긴 UserDTO 리스트
	@GetMapping("/users")
	public ResponseEntity<List<UserDTO>> getAllUsers(HttpServletRequest request) {
		List<UserDTO> users = adminUserService.getAllUsers(request);
		
		if (users.isEmpty()) {
			return ResponseEntity.status(403).body(null); // 관리자 권한 없으면 403 Forbidden 반환
		}
		
		System.out.println("##########################################################################################################");
		System.out.println("유저 목록 반환");
		System.out.println(users);
		
		return ResponseEntity.ok(users);
	}
	
	// # 작성자 : 나기표
	// # 작성일 : 2024-10-09
	// # 목  적 : 사용자 정보를 수정 (일시정지 해제, 영구정지 해제 등)
	// # 기  능 : 관리자가 사용자의 상태를 업데이트하고 응답 반환
	// # 매개변수 : updateUserInfoByAdmin - 관리자가 수정하려는 사용자 정보가 담긴 UserDTO 객체
	// # 반환값 : 성공 또는 실패 메시지
	@PostMapping("/release-user")
	public ResponseEntity<String> releaseUser(HttpServletRequest request, @RequestBody UserDTO userToRelease) {
		boolean isReleased = adminUserService.releaseUser(request, convertToUser(userToRelease));
		
		if (isReleased) {
			return ResponseEntity.ok("사용자 정지가 성공적으로 해제되었습니다.");
		} else {
			return ResponseEntity.status(400).body("사용자 정지 해제 실패");
		}
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : UserDTO를 User 객체로 변환
	// # 기  능 : UserDTO에서 User로 데이터를 변환하여 내부 서비스에 맞는 객체로 반환
	// # 매개변수 : userDTO - 변환할 UserDTO 객체
	// # 반환값 : 변환된 User 객체
	private User convertToUser(UserDTO userDTO) {
		User user = new User();
		user.setUserUniqueNumber(userDTO.getUserUniqueNumber());
		user.setUserId(userDTO.getUserId());
		user.setUserName(userDTO.getUserName());
		user.setUserNickname(userDTO.getUserNickname());
		user.setUserEmail(userDTO.getUserEmail());
		user.setUserCreateDate(userDTO.getUserCreateDate());
		user.setUserState(userDTO.getUserState());
		user.setUserFavoriteTeam(userDTO.getUserFavoriteTeam());
		user.setRole(userDTO.getRole());
		
		return user;
	}

	// # 작성자 : 나기표
	// # 작성일 : 2024-10-08
	// # 목  적 : 사용자 정보를 수정 (일시정지, 영구정지 등)
	// # 기  능 : 관리자가 사용자의 상태를 업데이트하고 응답 반환
	// # 매개변수 : updateUserInfoByAdmin - 관리자가 수정하려는 사용자 정보가 담긴 UserDTO 객체
	// # 반환값 : 성공 또는 실패 메시지
	@PostMapping("/update-user")
	public ResponseEntity<String> updateUser(HttpServletRequest request, @RequestBody UserDTO updateUserInfoByAdmin) {
		boolean isUpdated = adminUserService.updateUser(request, convertToUser(updateUserInfoByAdmin));

		if (isUpdated) {
			return ResponseEntity.ok("사용자 정보가 성공적으로 업데이트되었습니다.");
		} else {
			return ResponseEntity.status(400).body("사용자 정보 업데이트 실패");
		}
	}
	
	   // # 작성자 : 이재훈
	   // # 작성일 : 2024-10-10
	   // # 목 적 : 회원의 총 게시글 수 댓글 수 조회
	   // # 기 능 : 관리자가 사용자의 게시글 수와 댓글 수 파악
	   // # 매개변수 : userUniqueNumber - 사용자 고유넘버
	   // # 반환값 : user 게시글 수 댓글 수 반환
	    @GetMapping("/{userUniqueNumber}/stats")
	    public ResponseEntity<PostCommentStatsDto> getUserPostAndCommentStats(@PathVariable String userUniqueNumber) {
	        PostCommentStatsDto stats = adminUserService.getUserPostAndCommentStats(userUniqueNumber);
	        return ResponseEntity.ok(stats);
	    } 
}
