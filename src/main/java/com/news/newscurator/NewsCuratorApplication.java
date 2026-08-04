package com.news.newscurator;

import com.news.newscurator.service.PythonCrawlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableAsync       // 비동기 실행 활성화
@EnableScheduling  // 주기적 스케줄링 활성화
@SpringBootApplication
@RequiredArgsConstructor
public class NewsCuratorApplication {

    private final PythonCrawlerService pythonCrawlerService;

    public static void main(String[] args) {
        SpringApplication.run(NewsCuratorApplication.class, args);
    }

    // 서버 구동이 완료된 직후 파이썬 크롤러 1회 실행
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        pythonCrawlerService.runCrawler();
    }
}