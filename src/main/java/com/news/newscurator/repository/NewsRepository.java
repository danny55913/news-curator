package com.news.newscurator.repository;

import com.news.newscurator.domain.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    // 기본 최신순 조회
    List<News> findAllByOrderByIdDesc();

    // 🚀 검색어 및 카테고리 필터링 쿼리
    // keyword가 null이거나 빈값이면 전체 대상, category가 'ALL'이거나 null이면 전체 카테고리 대상
    @Query("SELECT n FROM News n WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.summary) LIKE LOWER(CONCAT('%', :keyword, '%'))) ")
    List<News> searchNews(@Param("keyword") String keyword);
}