package com.news.newscurator.controller;

import com.news.newscurator.domain.News;
import com.news.newscurator.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NewsController {

    private final NewsRepository newsRepository;

    @GetMapping
    public ResponseEntity<Page<News>> getNews(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // 최신순(id 내림차순) 기본 정렬 적용
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        // 💡 searchNews 메서드로 호출
        Page<News> newsPage = newsRepository.searchNews(keyword, pageable);

        return ResponseEntity.ok(newsPage);
    }
}