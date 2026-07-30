import re
import feedparser
from bs4 import BeautifulSoup

# HTML 태그 제거 및 텍스트 정제 함수
def clean_html(raw_html):
    if not raw_html:
        return ""
    # 1. HTML 태그 파싱 및 텍스트 추출
    soup = BeautifulSoup(raw_html, "html.parser")
    text = soup.get_text(separator=" ")

    # 2. 연속된 공백 및 줄바꿈 하나로 통일
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# 뉴스 수집 및 출력 함수
def fetch_news_test():
    # IT/기술 분야 뉴스 RSS 예시 (GeekNews)
    rss_url = "https://news.hada.io/rss/news"
    print(f"📡 [{rss_url}] 에서 뉴스 데이터 수집 중...\n")

    feed = feedparser.parse(rss_url)
    print(f"✅ 총 {len(feed.entries)}개의 기사를 가져왔습니다.\n")

    # 상위 3개 기사만 정제해서 출력 테스트
    for i, entry in enumerate(feed.entries[:3], 1):
        title = entry.title
        link = entry.link
        raw_description = entry.get("description", "")
        clean_description = clean_html(raw_description)

        print(f"[{i}] {title}")
        print(f"🔗 링크: {link}")
        print(f"📝 정제된 본문 (앞 100자): {clean_description[:100]}...")
        print("-" * 60)

if __name__ == "__main__":
    fetch_news_test()