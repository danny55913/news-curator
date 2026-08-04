package com.news.newscurator.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Slf4j
@Service
public class PythonCrawlerService {

    /**
     * 파이썬 스크립트 비동기 실행
     */
    @Async
    public void runCrawler() {
        executePython();
    }

    /**
     * 1시간마다 비동기로 실행
     */
    @Async
    @Scheduled(fixedDelay = 3600000, initialDelay = 10000)
    public void scheduledCrawl() {
        log.info("⏰ 주기적 뉴스 수집 스케줄러 작동");
        executePython();
    }

    /**
     * 실제 파이썬 프로세스를 실행하는 내부 메서드
     */
    private void executePython() {
        try {
            // 💡 1. 가상환경(venv)을 쓰신다면 해당 python.exe 경로로 지정을 권장합니다.
            // 예: "C:/Users/USER/IdeaProjects/news-curator/venv/Scripts/python.exe"
            ProcessBuilder processBuilder = new ProcessBuilder("python", "collector/main.py");

            // 2. 작업 디렉토리 고정
            processBuilder.directory(new File("C:/Users/USER/IdeaProjects/news-curator"));

            // 3. UTF-8 인코딩 지정 및 에러 스트림 병합
            processBuilder.environment().put("PYTHONIOENCODING", "UTF-8");
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            // 4. 파이썬 콘솔 출력 스트림 읽기 (실시간 로그)
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info("[Python] {}", line);
                }
            }

            int exitCode = process.waitFor();
            log.info("파이썬 수집기 종료 코드: {}", exitCode);

        } catch (Exception e) {
            log.error("파이썬 크롤러 실행 중 예외 발생", e);
        }
    }
}