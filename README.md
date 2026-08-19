# 📰 Tech News Curator (테크 뉴스 큐레이터)

AI 기반으로 최신 IT/테크 뉴스를 자동 수집 및 요약하여, 카테고리별·인기순으로 제공하는 웹 애플리케이션입니다.

---

## 📌 주요 기능 (Key Features)

- **📰 뉴스 자동 수집 및 최신 목록 제공**: 파이썬 스크래핑을 통해 수집된 최신 테크 뉴스를 한눈에 확인
- **🔎 키워드 검색 & 카테고리 필터링**: 제목 및 요약 기반 키워드 검색, AI/React/Java/보안 등 관심 카테고리별 필터링
- **🔥 인기순 / 최신순 정렬**: JPA JPQL 기반으로 북마크 등록 수(인기순) 및 최신 등록일(최신순) 정렬 지원
- **📄 JPA Pageable 대용량 데이터 페이징**: 효율적인 서버 자원 관리를 위한 10개 단위 데이터 페이징 처리
- **📌 사용자 북마크 기능**: 로그인한 사용자별 관심 뉴스 북마크 저장 및 '내 북마크' 전용 탭 제공
- **🔐 회원가입 및 로그인**: 사용자별 북마크 관리를 위한 회원 인증 시스템

---

## 🛠 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React (Vite)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: CSS3

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **ORM / Database**: Spring Data JPA, SQLite
- **Build Tool**: Gradle
- **Library**: Lombok

### Data Pipeline
- **Collector**: Python Web Scraper

---

## 🏗 시스템 아키텍처 및 API 명세

### Backend API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **News** | `GET` | `/api/news` | 뉴스 목록 조회 (검색 `keyword`, 정렬 `sort`, 페이징 `page/size` 파라미터 지원) |
| **News** | `POST` | `/api/news/refresh` | 파이썬 수집기 실행 및 최신 뉴스 수집 |
| **Bookmark** | `POST` | `/api/bookmarks/toggle` | 뉴스 북마크 추가 / 해제 (토글) |
| **Bookmark** | `GET` | `/api/bookmarks` | 특정 사용자의 북마크 뉴스 목록 전체 조회 |
| **Bookmark** | `GET` | `/api/bookmarks/ids` | 특정 사용자의 북마크 뉴스 ID 리스트 조회 |
| **Auth** | `POST` | `/api/auth/signup` | 신규 회원가입 |
| **Auth** | `POST` | `/api/auth/login` | 로그인 인증 |

---

## 🚀 시작하기 (Getting Started)

### Prerequisites
- Node.js 18+
- Java 17 / JDK 17
- Python 3.x

### 1. Backend 실행
```bash
# 백엔드 프로젝트 루트 디렉토리
./gradlew bootRun
```

### 2. Backend 실행
```bash
# 프론트엔드 프로젝트 디렉토리 (frontend/)
npm install
npm run dev
```

### 📂 프로젝트 구조 (Project Structure)
```bash
news-curator/
├── src/main/java/com/news/newscurator/
│   ├── controller/      # REST API 컨트롤러 (News, Bookmark, Auth)
│   ├── domain/          # JPA Entity (News, Member, Bookmark)
│   ├── dto/             # Data Transfer Objects
│   └── repository/      # Spring Data JPA Repositories
└── frontend/
    ├── src/
    │   ├── App.jsx      # 메인 프론트엔드 로직
    │   ├── App.css      # 스타일시트
    │   └── main.jsx
    └── vite.config.js   # Vite 프록시 설정 (/api -> localhost:8080)
```