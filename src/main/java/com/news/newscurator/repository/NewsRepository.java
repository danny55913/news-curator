package com.news.newscurator.repository;

import com.news.newscurator.domain.News;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {
    // 최신 수집 순서대로 전체 목록 조회
    List<News> findAllByOrderByIdDesc();
}