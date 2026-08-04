import os
import re
import sqlite3
from datetime import datetime
import feedparser
from bs4 import BeautifulSoup
import ollama

# 1. SQLite DB 파일 경로 및 초기화
DB_PATH = "news.db"

def init_db():
    """데이터베이스 테이블 생성 (없는 경우)"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # news 테이블 생성 (link 컬럼에 UNIQUE 제약 조건을 걸어 중복 방지)
    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS news (
                                                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                       title TEXT NOT NULL,
                                                       link TEXT UNIQUE NOT NULL,
                                                       summary TEXT NOT NULL,
                                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                   )
                   """)
    conn.commit()
    conn.close()

def is_already_saved(link):
    """이미 DB에 저장된 기사인지 확인"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM news WHERE link = ?", (link,))
    result = cursor.fetchone()
    conn.close()
    return result is not None

def save_news(title, link, summary):
    """요약된 뉴스 데이터 DB에 저장"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO news (title, link, summary) VALUES (?, ?, ?)",
            (title, link, summary)
        )
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        # 이미 존재하는 링크인 경우
        return False
    except Exception as e:
        print(f"❌ DB 저장 중 오류 발생: {e}")
        return False

# HTML 태그 제거 및 텍스트 정제 함수
def clean_html(raw_html):
    if not raw_html:
        return ""
    soup = BeautifulSoup(raw_html, "html.parser")
    text = soup.get_text(separator=" ")
    return re.sub(r'\s+', ' ', text).strip()

# Ollama를 활용한 뉴스 3줄 요약 함수
def summarize_news(title, content):
    prompt = f"""
다음 IT/기술 뉴스 기사를 읽고 핵심 내용을 한국어로 요약해 주세요.

[기사 제목]
{title}

[기사 본문]
{content}

[요청 사항]
1. 핵심 내용을 3개의 불릿 포인트로 깔끔하게 요약할 것.
2. 각 줄은 불필요한 서론 없이 바로 주요 사실만 다룰 것.
"""
    try:
        response = ollama.chat(
            model='llama3.2',
            messages=[
                {'role': 'user', 'content': prompt}
            ]
        )
        return response['message']['content']
    except Exception as e:
        return f"요약 실패: {e}"

# 메인 실행 함수
def fetch_and_process_news():
    # 1. DB 초기화
    init_db()

    rss_url = "https://news.hada.io/rss/news"
    print(f"📡 [{rss_url}] 에서 뉴스 수집 및 DB 파이프라인 처리 중...\n")

    feed = feedparser.parse(rss_url)

    # 상위 3개 기사 처리 테스트
    for i, entry in enumerate(feed.entries[:3], 1):
        title = entry.title
        link = entry.link
        clean_description = clean_html(entry.get("description", ""))

        print(f"==================== [{i}] 기사 확인 ====================")
        print(f"📌 제목: {title}")
        print(f"🔗 링크: {link}")

        # 2. 중복 체크 (이미 저장된 경우 스킵)
        if is_already_saved(link):
            print("⏩ 이미 DB에 저장된 기사입니다. 요약을 건너뜁니다.\n")
            continue

        # 3. 신규 기사일 경우 Ollama 요약 진행
        print("🤖 Ollama(llama3.2)가 3줄 요약 중...")
        summary = summarize_news(title, clean_description)

        # 4. DB 저장
        if save_news(title, link, summary):
            print("💾 DB에 성공적으로 저장되었습니다!")
            print("📝 요약 내용:")
            print(summary)
        else:
            print("⚠️ DB 저장 실패 (중복 혹은 오류)")

        print("=" * 60 + "\n")

if __name__ == "__main__":
    fetch_and_process_news()