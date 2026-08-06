import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Newspaper, Loader2, RefreshCw } from 'lucide-react';
import './App.css';

function App() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // 수집 로딩 상태 추가
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/news');
      setNewsList(response.data);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('뉴스를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 🚀 파이썬 크롤러 실행 요청 (수동 수집 버튼)
    const handleRefresh = async () => {
      if (isRefreshing) return;

      try {
        setIsRefreshing(true);
        // 1. 파이썬 수집기 실행 요청
        await axios.post('/api/news/refresh');
        // 2. 수집 완료 후 목록 다시 불러오기
        await fetchNews();
      } catch (err) {
        console.error('Failed to refresh news:', err);
        alert('뉴스 수집 중 오류가 발생했습니다.');
      } finally {
        setIsRefreshing(false);
      }
    };

  return (
    <div className="container">
      <header className="header">
        <div className="header-title">
          <h1><Newspaper className="icon" /> Tech News Curator</h1>
          {/* onClick을 handleRefresh로 변경, disabled에 isRefreshing 추가 */}
          <button
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            title="지금 뉴스 수집하기"
          >
            <RefreshCw className={`refresh-icon ${isRefreshing ? 'spin' : ''}`} />
          </button>
        </div>
        <p>AI가 수집하고 요약한 최신 테크 뉴스</p>
      </header>

      {/* 수집 진행 중일 때 안내 메시지 */}
        {isRefreshing && (
          <div className="status-box">
            <Loader2 className="spinner" />
            <p>파이썬 수집기를 실행하여 최신 뉴스를 긁어오는 중입니다...</p>
          </div>
        )}

      {loading && (
        <div className="status-box">
          <Loader2 className="spinner" />
          <p>뉴스를 불러오는 중...</p>
        </div>
      )}

      {error && <div className="status-box error">{error}</div>}

      {!loading && !error && newsList.length === 0 && (
        <div className="status-box">수집된 뉴스가 없습니다.</div>
      )}

      {!loading && !error && (
        <div className="news-list">
          {newsList.map((news) => (
            <article key={news.id} className="news-card">
              <h2 className="news-title">
                <a href={news.link} target="_blank" rel="noopener noreferrer">
                  {news.title}
                  <ExternalLink className="link-icon" />
                </a>
              </h2>
              <p className="news-summary">{news.summary}</p>
              <div className="news-footer">
                <span className="news-date">
                  수집일시: {news.createdAt ? news.createdAt.replace('T', ' ').substring(0, 16) : ''}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;