import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Newspaper, Loader2, RefreshCw } from 'lucide-react';
import './App.css';

function App() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="container">
      <header className="header">
        <div className="header-title">
          <h1><Newspaper className="icon" /> Tech News Curator</h1>
          <button className="refresh-btn" onClick={fetchNews} disabled={loading} title="새로고침">
            <RefreshCw className={`refresh-icon ${loading ? 'spin' : ''}`} />
          </button>
        </div>
        <p>AI가 수집하고 요약한 최신 테크 뉴스</p>
      </header>

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