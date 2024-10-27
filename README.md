# 📋 포트폴리오

안녕하세요! 저희는 백엔드와 프론트엔드 개발, 데이터 분석, 그리고 UI/UX 설계를 아우르는 8인 팀입니다. 
이 문서는 프로젝트에 사용된 기술과 팀원들의 역할을 정리한 포트폴리오입니다.

---

## 🔧 사용 기술

![Java](https://img.shields.io/badge/Java-007396?style=flat-square&logo=java&logoColor=white) ![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=flat-square&logo=mariadb&logoColor=white) 
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![Scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=black) 
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white) ![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=flat-square&logo=plotly&logoColor=white)  

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) 

![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black) ![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=flat-square&logo=ubuntu&logoColor=white) ![JSP](https://img.shields.io/badge/JSP-323330?style=flat-square&logo=java&logoColor=white) ![NGINX](https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=nginx&logoColor=white) ![Windows](https://img.shields.io/badge/Windows_10-0078D6?style=flat-square&logo=windows&logoColor=white) 

![Apache Tomcat](https://img.shields.io/badge/Apache_Tomcat-F8DC75?style=flat-square&logo=apache-tomcat&logoColor=black)  ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)  ![MyBatis](https://img.shields.io/badge/MyBatis-B7178C?style=flat-square&logo=MyBatis&logoColor=white) 

![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)  ![Notion](https://img.shields.io/badge/Notion-000000?style=flat-square&logo=notion&logoColor=white) ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white)  

---

## 🧑‍🤝‍🧑 팀 구성 및 역할

- **팀장** : 프로젝트 총괄 및 일정 관리  
- **본인 (기술팀장)** : 기술적 문제 해결 및 백엔드와 프론트 협업 관리   
  - **Flask를 이용한 데이터분석 시스템 개발** : 3년치 크롤링 된 야구데이터 분석, 분석에 필요한 함수 구현 
  - **Plotly를 이용한 데이터분석결과 시각화** : 데이터분석이 된 결과를 동적인 그래프를 구현하는 Plotly라이브러리를 사용하여 시각화
  - **데이터베이스 설계** : RDBMS인 MariaDB를 이용하여  야구커뮤니티에 적합한 테이블 구성 및 데이터분석을 위한 테이블 생성 및 연결
  - **리눅스 배포시스템 구축** : 개발환경이 윈도우였으나, 자원의 최적화 및 실무에 가까운 경험을 위해 WSL을 이용하여 우분투 설치 및 NGINX를 통한 리버스프록시 및 웹서버 배포
  - **기타** : 하루 단위의 DataBase 백업, 프론트 코드와 백엔드 코드간 연결 오류 참여, 일정 조율 등
- **백엔드 팀원 (3명)**: Java 기반 회원 관리, MyBatis 및 데이터 수집 담당  
- **프론트엔드 팀원 (3명)**: React로 UI 구현 및 데이터 시각화 작업  

---

## 💼 프로젝트 링크 및 설명

### 📌 데이터베이스 (MariaDB)
- **설명**: 야구커뮤니티에 어울리는 테이블 생성 및 분석에 적합한 테이블 생성 
- **주요 기능**: 유저와 관리자간의 테이블 구분, 유저에 각각 고유 값을 부여하여 식별가능 
- **기술 스택**: MariaDB
- **프로젝트 링크**: [DB 구축](https://github.com/BTBIIT/Yamodot/tree/main/Yamodot_DB)  

---

### 📌 데이터 분석 및 시각화 (Python)
- **설명**: Flask를 통한 함수형 프로그래밍 구현, 데이터 분석 및 데이터 시각화 
- **주요 기능**: 데이터 분석, 데이터 시각화, Flask를 통한 함수형 프로그래밍 
- **기술 스택**: Python, Flask, Scikit-learn, Plotly  
- **프로젝트 링크**: [데이터 분석](https://github.com/BTBIIT/Yamodot/tree/main/Yamodot_DA)  

---

### 📌 리눅스 시스템구축 및 NGINX 설정 및 구현
- **설명**:  웹 배포를 위한 리눅스 환경 설정 및 우분투를 통한 웹 배포
- **기능**: 웹 서버 배포
- **기술 스택**: WSL, Ubuntu, PowerShell, NGINX
- **프로젝트 링크**: [서버 배포](https://github.com/BTBIIT/Yamodot/tree/main/Server)  

---

### 📌 백엔드 프로젝트 (Java)
- **설명**:  Spring Boot와 MariaDB를 활용한 회원 관리 시스템, 커뮤니티 시스템, 일정 등
- **기능**: 웹 서버 배포
- **기술 스택**: Java, Spring Boot, MyBatis, MariaDB
- **프로젝트 링크**: [백엔드](https://github.com/BTBIIT/Yamodot/tree/main/BackEnd)  
---

### 📌 프론트엔드 커뮤니케이션 기능
- **설명**: 실시간 메시지 송수신 기능 구현  
- **기술 스택**: React, Flask, WebSocket  
- **프로젝트 링크**: [프론트 커뮤니케이션](FrontEnd/src/components)  

---

### 📌 프론트엔드 데이터 시각화
- **설명**: Plotly를 활용한 데이터 분석 결과 시각화  
- **기술 스택**: React, Plotly  
- **프로젝트 링크**: [프론트 데이터 시각화](FrontEnd/src/components/record)  

---

## 🛠️ 디자인 및 협업 도구
- **노션**: 프로젝트 계획 및 문서화  
- **피그마**: UI/UX 설계 및 프로토타입 제작  

---

## 📞 연락처 및 협업 플랫폼
- **이메일**: rjsgur789@gmail.com  
- **GitHub**: [깃허브 주소](https://github.com/BTBIIT)  
- **Notion 페이지**: [프로젝트 정리](https://www.notion.so/ce44f74dfd184bc8a04318bb0b4a1bc8)  
- **Figma 디자인**: [디자인 프로토타입](https://www.figma.com/files/team/1415630019616147499/recents-and-sharing/recently-viewed?fuid=1415630017685170899)  
