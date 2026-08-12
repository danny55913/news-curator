package com.news.newscurator.repository;

import com.news.newscurator.domain.Bookmark;
import com.news.newscurator.domain.Member;
import com.news.newscurator.domain.News;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByMemberAndNews(Member member, News news);
    List<Bookmark> findByMember(Member member);
    boolean existsByMemberAndNews(Member member, News news);
    void deleteByMemberAndNews(Member member, News news);
}