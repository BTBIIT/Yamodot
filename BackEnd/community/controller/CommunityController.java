package com.example.community.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.example.community.dto.PostWithCommentCountDTO;
import com.example.community.model.Community;
import com.example.community.service.CommunityService;
import com.example.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.HttpHeaders;

/**
 * # 작성자 : 이재훈
 * # 작성일 : 2024-10-08
 * # 목  적 : 커뮤니티 게시물에 대한 CRUD 처리 및 파일 업로드 기능 제공
 * # 기  능 : 커뮤니티 게시물의 생성, 조회, 수정, 삭제 기능을 포함하며, 파일 업로드 및 이미지 제공 기능 지원
 */
@RestController
@RequestMapping("/api/community")
public class CommunityController {

   @Autowired
   private CommunityService communityService;

   private final FileStorageService fileStorageService;

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : FileStorageService 주입
     * # 기  능 : 파일 저장 서비스를 주입받아 사용
     * @param fileStorageService 파일 저장 서비스
     */
   @Autowired
   public CommunityController(FileStorageService fileStorageService) {
      
      this.fileStorageService = fileStorageService;
   }
   
   /**
    * # 작성자 : 이재훈
    * # 작성일 : 2024-10-13
    * # 목 적 : 파일 제거시 경로를 NULL로 수정
    * # 기 능 : 이미지 경로 제거
    * # 반환값 : postId - 게시물 번호
    */
   @PutMapping("/removeFile/{postId}")
   public ResponseEntity<?> removeFile(@PathVariable Long postId) {
       // 해당 게시물을 조회하여 파일 경로를 null로 설정
       communityService.removeFile(postId);
       return ResponseEntity.ok().build();
   }

   
    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 모든 커뮤니티 게시물 조회
     * # 기  능 : 데이터베이스에서 모든 커뮤니티 게시물을 조회하여 반환
     * # 반환값 : List<Community> - 모든 게시물 목록
     */
   @GetMapping("/posts")
   public List<Community> getAllPosts() {
      
      return communityService.getAllCommunityPosts();
   }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 유저가 작성한 게시물 조회
     * # 기  능 : 유저의 고유 Number를 이용하여 해당 유저가 작성한 게시물 조회
     * # 매개변수 : String userUniqueNumber - 유저의 고유 Number
     * # 반환값 : List<Community> - 해당 유저의 게시물 목록
     */
    @GetMapping("/user/posts")
    public List<Community> getPostsByUser(HttpServletRequest request) {
        // HttpServletRequest를 서비스에 넘겨서 처리
        return communityService.getPostsByUser(request);
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 특정 게시물 조회
     * # 기  능 : 게시물 ID를 이용하여 특정 게시물의 정보를 조회
     * # 매개변수 : int postId - 게시물의 고유 ID
     * # 반환값 : ResponseEntity<Community> - 게시물 정보 또는 NotFound 상태 반환
     */
    @GetMapping("/post/{postId}")
    public ResponseEntity<Community> getPostById(@PathVariable int postId) {
        
        Community community = communityService.getCommunityPostById(postId);
        if (community != null) {
            // 이미지가 있을 경우, 파일명에 경로를 추가하여 URL로 변환
            if (community.getPostImgPath() != null) {
                String imageUrl = "/uploads/" + community.getPostImgPath();  // /uploads/ 경로와 파일명을 결합
                community.setPostImgPath(imageUrl);  // 이미지 경로를 업데이트
            }
            return ResponseEntity.ok(community);  // 업데이트된 Community 객체 반환
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 게시물 생성
     * # 기  능 : 제목, 내용, 카테고리, 파일 등을 받아 새로운 게시물을 생성
     * # 매개변수 : HttpServletRequest request, String postTitle, String postContent, int categoryName, String userUniqueNumber, MultipartFile file
     * # 반환값 : ResponseEntity<String> - 게시물 생성 성공 또는 실패 메시지
     */
   @PostMapping("/post")
   public ResponseEntity<String> createPost(HttpServletRequest request, 
                                            @RequestParam("postTitle") String postTitle,
                                            @RequestParam("postContent") String postContent, 
                                            @RequestParam("categoryName") int categoryName,
                                            @RequestPart(value = "file", required = false) MultipartFile file) {
       
       try {
           // JWT 토큰에서 인증 정보 추출 (서비스에서 처리)
           Community community = new Community();
           community.setPostTitle(postTitle);
           community.setPostContent(postContent);
           community.setCategoryName(categoryName);

           // 파일이 있을 경우 처리
           if (file != null && !file.isEmpty()) {
               String fileName = fileStorageService.storeFile(file);
               community.setPostImgPath(fileName);
           }
           
           // 서비스 레벨에서 토큰을 처리하여 userUniqueNumber를 설정하고, 게시물 생성 처리
           communityService.createCommunityPost(request, community, file);
           return ResponseEntity.ok("게시물이 성공적으로 생성되었습니다.");
       } catch (IOException e) {
           e.printStackTrace();
           return ResponseEntity.status(500).body("파일 업로드 중 오류가 발생했습니다.");
       }
   }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 이미지 파일 업로드
     * # 기  능 : 업로드된 이미지 파일을 저장하고 파일 경로를 반환
     * # 매개변수 : MultipartFile file - 업로드할 이미지 파일
     * # 반환값 : ResponseEntity<String> - 저장된 이미지의 URL 또는 오류 메시지
     */
   @PostMapping("/uploadImage")
   public ResponseEntity<String> uploadImage(@RequestPart("file") MultipartFile file) {
      try {
         if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            String fileUrl = "/uploads/" + fileName;
            return ResponseEntity.ok(fileUrl); // 이미지 URL 반환
         } else {
            return ResponseEntity.badRequest().body("파일이 없습니다.");
         }
      } catch (IOException e) {
         e.printStackTrace();
         return ResponseEntity.status(500).body("이미지 업로드 중 오류 발생.");
      }
   }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 게시물 수정
     * # 기  능 : 게시물 ID를 이용하여 해당 게시물을 수정
     * # 매개변수 : int postId, String postTitle, String postContent, int categoryName, String userUniqueNumber, MultipartFile file
     * # 반환값 : ResponseEntity<String> - 게시물 수정 성공 또는 실패 메시지
     */
   @PutMapping("/post/{postId}")
   public ResponseEntity<String> updatePost(HttpServletRequest request ,@PathVariable int postId, @RequestParam("postTitle") String postTitle,
         @RequestParam("postContent") String postContent, @RequestParam("categoryName") int categoryName,
         @RequestPart(value = "file", required = false) MultipartFile file) {

      try {
         Community community = communityService.getCommunityPostById(postId);
         if (community == null) {
            return ResponseEntity.status(404).body("게시물을 찾을 수 없습니다.");
         }

         community.setPostTitle(postTitle);
         community.setPostContent(postContent);
         community.setCategoryName(categoryName);

         if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            community.setPostImgPath("/uploads/" + fileName);
         }

         communityService.updateCommunityPost(request, postId, community, file);
         return ResponseEntity.ok("게시물이 성공적으로 수정되었습니다.");
      } catch (IOException e) {
         e.printStackTrace();
         return ResponseEntity.status(500).body("파일 업로드 중 오류가 발생했습니다.");
      }
   }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 게시물 삭제
     * # 기  능 : 게시물 ID를 이용하여 해당 게시물을 삭제
     * # 매개변수 : int postId - 삭제할 게시물의 ID
     * # 반환값 : ResponseEntity<String> - 게시물 삭제 성공 메시지
     */
   @DeleteMapping("/post/{postId}")
   public ResponseEntity<String> deletePost(HttpServletRequest request, @PathVariable int postId) {
      
      communityService.deleteCommunityPost(request, postId);
      
      return ResponseEntity.ok("게시물이 성공적으로 삭제되었습니다.");
   }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 파일 다운로드
     * # 기  능 : 서버에 저장된 파일을 클라이언트에 제공
     * # 매개변수 : String fileName - 다운로드할 파일명
     * # 반환값 : ResponseEntity<Resource> - 파일 리소스 또는 오류 상태 반환
     */
     // 10-14 utf-8 파일 깨짐 방지
    @GetMapping("/downloadFile/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName);
            String contentType = Files.probeContentType(resource.getFile().toPath());

            // 파일 이름을 URL 인코딩 처리 (한글 포함 파일 깨짐 방지)
            String encodedFileName = java.net.URLEncoder.encode(resource.getFilename(), "UTF-8")
                    .replaceAll("\\+", "%20");

            // Content-Disposition 헤더에 인코딩된 파일 이름 설정
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + encodedFileName + "\"")
                    .body(resource);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }


    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 이미지 제공
     * # 기  능 : 파일명을 이용해 이미지 파일을 제공
     * # 매개변수 : String filename - 제공할 이미지 파일명
     * # 반환값 : ResponseEntity<Resource> - 이미지 리소스 또는 오류 상태 반환
     */
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
       
        try {
            Resource file = fileStorageService.loadFileAsResource(filename);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(file);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 관리자용 모든 게시물 조회
     * # 기  능 : 관리자 페이지에서 모든 게시물을 조회하여 반환
     * # 반환값 : List<PostWithCommentCountDTO> - 게시물 목록
     */
    @GetMapping("/admin/posts")
    public List<PostWithCommentCountDTO> getAllPostsForAdmin() {
       
        return communityService.getAllPostsWithCommentCount();
    }

    /**
     * # 작성자 : 이재훈
     * # 작성일 : 2024-10-08
     * # 목  적 : 관리자용 게시물 상세 조회
     * # 기  능 : 게시물 ID를 이용하여 관리자 페이지에서 게시물 상세 정보를 조회
     * # 매개변수 : int postId - 조회할 게시물의 ID
     * # 반환값 : ResponseEntity<PostWithCommentCountDTO> - 게시물 정보 또는 NotFound 상태 반환   
     */
    @GetMapping("/admin/post/{postId}")
    public ResponseEntity<PostWithCommentCountDTO> getPostDetail(@PathVariable int postId) {
       
        PostWithCommentCountDTO postDetail = communityService.getPostDetail(postId);
        if (postDetail != null) {
            return ResponseEntity.ok(postDetail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
}
