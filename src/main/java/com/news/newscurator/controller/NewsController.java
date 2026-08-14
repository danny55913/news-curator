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
            @RequestParam(defaultValue = "latest") String sort, // 👈 'latest' 또는 'popular'
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<News> newsPage;

        if ("popular".equalsIgnoreCase(sort)) {
            // 인기순 (북마크 많은 순)
            Pageable pageable = PageRequest.of(page, size);
            newsPage = newsRepository.searchNewsByPopularity(keyword, pageable);
        } else {
            // 최신순 (id 내림차순 기본값)
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
            newsPage = newsRepository.searchNews(keyword, pageable);
        }

        return ResponseEntity.ok(newsPage);
    }
}