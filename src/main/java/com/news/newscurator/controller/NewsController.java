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
@CrossOrigin(origins = "*")
public class NewsController {

    private final NewsRepository newsRepository;
    private final PythonCrawlerService pythonCrawlerService;

    // 🚀 검색어(keyword) 쿼리 파라미터를 수신할 수 있도록 수정
    @GetMapping
    public List<News> getNews(@RequestParam(required = false) String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return newsRepository.searchNews(keyword.trim());
        }
        return newsRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshNews() {
        try {
            pythonCrawlerService.runCrawler();
            return ResponseEntity.ok("뉴스 수집이 성공적으로 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("뉴스 수집 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}