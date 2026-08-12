package com.news.newscurator.controller;

import com.news.newscurator.domain.Member;
import com.news.newscurator.dto.LoginRequest;
import com.news.newscurator.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final MemberRepository memberRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody LoginRequest request) {
        if (memberRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 존재하는 아이디입니다.");
        }
        Member member = new Member(request.getUsername(), request.getPassword());
        memberRepository.save(member);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Member> memberOpt = memberRepository.findByUsername(request.getUsername());
        if (memberOpt.isPresent() && memberOpt.get().getPassword().equals(request.getPassword())) {
            // 간단 처리를 위해 사용자 ID와 username 반환
            return ResponseEntity.ok(memberOpt.get());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
}