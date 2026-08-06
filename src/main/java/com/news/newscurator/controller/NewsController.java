package com.news.newscurator.controller;

import com.news.newscurator.domain.News;
import com.news.newscurator.repository.NewsRepository;
import com.news.newscurator.service.PythonCrawlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 프론트엔드 연동을 위한 CORS 허용
public class NewsController {

    private final NewsRepository newsRepository;
    private final PythonCrawlerService pythonCrawlerService; // 스케줄러에서 쓰는 파이썬 수집 서비스

    @GetMapping
    public List<News> getAllNews() {
        return newsRepository.findAllByOrderByIdDesc();
    }

    // 🚀 수동 수집 요청 API 추가
    @PostMapping("/refresh")
    public ResponseEntity<String> refreshNews() {
        try {
            // PythonCrawlerService 내부의 실제 메서드명으로 변경 (예: runPythonScript)
            pythonCrawlerService.runCrawler();
            return ResponseEntity.ok("뉴스 수집이 성공적으로 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("뉴스 수집 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
