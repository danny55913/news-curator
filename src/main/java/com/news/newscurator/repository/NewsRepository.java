package com.news.newscurator.repository;

import com.news.newscurator.domain.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    // 🚀 검색어 필터링 및 페이징
    @Query("SELECT n FROM News n WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.summary) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<News> searchNews(@Param("keyword") String keyword, Pageable pageable);
}