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

    // 1. 최신순 정렬 (기존 searchNews 유지)
    @Query("SELECT n FROM News n WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.summary) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<News> searchNews(@Param("keyword") String keyword, Pageable pageable);

    // 2. 🔥 인기순 정렬 (북마크 개수 많은 순 -> 최신순)
    @Query("SELECT n FROM News n LEFT JOIN Bookmark b ON b.news = n " +
            "WHERE (:keyword IS NULL OR :keyword = '' OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.summary) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "GROUP BY n " +
            "ORDER BY COUNT(b) DESC, n.id DESC")
    Page<News> searchNewsByPopularity(@Param("keyword") String keyword, Pageable pageable);
}