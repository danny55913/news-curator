package com.news.newscurator.controller;

import com.news.newscurator.domain.Bookmark;
import com.news.newscurator.domain.Member;
import com.news.newscurator.domain.News;
import com.news.newscurator.dto.BookmarkResponse;
import com.news.newscurator.repository.BookmarkRepository;
import com.news.newscurator.repository.MemberRepository;
import com.news.newscurator.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookmarkController {

    private final BookmarkRepository bookmarkRepository;
    private final MemberRepository memberRepository;
    private final NewsRepository newsRepository;

    // 🚀 북마크 추가 / 해제 (토글)
    @PostMapping("/toggle")
    @Transactional
    public ResponseEntity<?> toggleBookmark(@RequestParam Long memberId, @RequestParam Long newsId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 뉴스입니다."));

        boolean exists = bookmarkRepository.existsByMemberAndNews(member, news);
        if (exists) {
            bookmarkRepository.deleteByMemberAndNews(member, news);
            return ResponseEntity.ok(new BookmarkResponse(false, "북마크가 해제되었습니다."));
        } else {
            bookmarkRepository.save(new Bookmark(member, news));
            return ResponseEntity.ok(new BookmarkResponse(true, "북마크에 추가되었습니다."));
        }
    }

    // 🚀 해당 사용자가 북마크한 뉴스 목록 조회
    @GetMapping
    public ResponseEntity<?> getMemberBookmarks(@RequestParam Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        List<News> bookmarkedNews = bookmarkRepository.findByMember(member)
                .stream()
                .map(Bookmark::getNews)
                .collect(Collectors.toList());

        return ResponseEntity.ok(bookmarkedNews);
    }

    // 🚀 사용자가 북마크한 뉴스 ID 목록만 조회 (프론트엔드 아이콘 상태 표시용)
    @GetMapping("/ids")
    public ResponseEntity<?> getBookmarkedNewsIds(@RequestParam Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        List<Integer> newsIds = bookmarkRepository.findByMember(member)
                .stream()
                .map(b -> b.getNews().getId())
                .collect(Collectors.toList());

        return ResponseEntity.ok(newsIds);
    }
}