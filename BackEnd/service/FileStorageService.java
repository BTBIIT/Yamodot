package com.example.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

   private final Path fileStorageLocation;

   // 생성자에서 uploadDir을 @Value로 주입받아 경로 설정
   public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
      this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
   }

   public String storeFile(MultipartFile file) throws IOException {
      Path targetLocation = this.fileStorageLocation.resolve(file.getOriginalFilename());
      Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
      System.out.println("파일 저장 경로: " + targetLocation.toString()); // 파일 저장 경로 출력
      return file.getOriginalFilename();
   }

   public Resource loadFileAsResource(String fileName) throws IOException {
      // 파일을 로드하여 리소스 반환
      Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
      Resource resource = new UrlResource(filePath.toUri());

      if (resource.exists()) {
         return resource;
      } else {
         throw new IOException("파일을 찾을 수 없습니다: " + fileName);
      }
   }
}