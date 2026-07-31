import re
import feedparser
from bs4 import BeautifulSoup
import ollama

# HTML 태그 제거 및 텍스트 정제 함수
def clean_html(raw_html):
    if not raw_html:
        return ""
    soup = BeautifulSoup(raw_html, "parser") if False else BeautifulSoup(raw_html, "html.parser")
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
        # 로컬에 다운로드한 llama3.2 모델 호출
        response = ollama.chat(
            model='llama3.2',
            messages=[
                {'role': 'user', 'content': prompt}
            ]
        )
        return response['message']['content']
    except Exception as e:
        return f"요약 실패: {e}\n(Ollama가 실행 중인지 확인해 주세요!)"

# 메인 실행 함수
def fetch_and_summarize_test():
    rss_url = "https://news.hada.io/rss/news"
    print(f"📡 [{rss_url}] 에서 뉴스 수집 중...\n")

    feed = feedparser.parse(rss_url)

    # 상위 2개 기사에 대해서만 요약 테스트 진행
    for i, entry in enumerate(feed.entries[:2], 1):
        title = entry.title
        link = entry.link
        clean_description = clean_html(entry.get("description", ""))

        print(f"==================== [{i}] 기사 정보 ====================")
        print(f"📌 제목: {title}")
        print(f"🔗 링크: {link}\n")

        print("🤖 Ollama(llama3.2)가 3줄 요약 중...")
        summary = summarize_news(title, clean_description)
        print("📝 요약 결과:")
        print(summary)
        print("=" * 60 + "\n")

if __name__ == "__main__":
    fetch_and_summarize_test()