import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Newspaper, Loader2, RefreshCw, Search } from 'lucide-react';
import './App.css';

// 카테고리 목록 정의
const CATEGORIES = [
  { label: '전체', value: '' },
  { label: 'AI/머신러닝', value: 'AI' },
  { label: '프론트엔드', value: 'React' },
  { label: '백엔드/인프라', value: 'Java' },
  { label: '보안/기타', value: '보안' },
];

function App() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // 🚀 검색 및 카테고리 상태 추가
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');

  // activeKeyword나 selectedCategory가 변경될 때마다 뉴스 다시 로드
  useEffect(() => {
    fetchNews();
  }, [selectedCategory, activeKeyword]);

  // 뉴스 목록 불러오기 (검색어 / 카테고리 반영)
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      // 카테고리 선택 값과 검색어 중 우선순위 적용
      const queryKeyword = activeKeyword || selectedCategory;

      const response = await axios.get('/api/news', {
        params: queryKeyword ? { keyword: queryKeyword } : {}
      });

      setNewsList(response.data);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('뉴스를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 수동 뉴스 수집
  const handleRefresh = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      await axios.post('/api/news/refresh');
      await fetchNews();
    } catch (err) {
      console.error('Failed to refresh news:', err);
      alert('뉴스 수집 중 오류가 발생했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // 검색 제출 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedCategory(''); // 키워드 직접 검색 시 카테고리 선택 해제
    setActiveKeyword(searchTerm);
  };

  // 카테고리 탭 클릭 핸들러
  const handleCategoryClick = (categoryValue) => {
    setSelectedCategory(categoryValue);
    setSearchTerm(''); // 카테고리 클릭 시 검색창 초기화
    setActiveKeyword('');
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-title">
          <h1><Newspaper className="icon" /> Tech News Curator</h1>
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

      {/* 🚀 검색바 및 카테고리 필터 영역 */}
      <section className="filter-section">
        {/* 검색창 */}
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="뉴스 제목 또는 요약 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="search-btn">검색</button>
        </form>

        {/* 카테고리 탭 */}
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              className={`category-tab ${
                selectedCategory === cat.value && !activeKeyword ? 'active' : ''
              }`}
              onClick={() => handleCategoryClick(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 수집 진행 중 상태 표시 */}
      {isRefreshing && (
        <div className="status-box">
          <Loader2 className="spinner" />
          <p>파이썬 수집기를 실행하여 최신 뉴스를 긁어오는 중입니다...</p>
        </div>
      )}

      {loading && !isRefreshing && (
        <div className="status-box">
          <Loader2 className="spinner" />
          <p>뉴스를 불러오는 중...</p>
        </div>
      )}

      {error && <div className="status-box error">{error}</div>}

      {!loading && !isRefreshing && !error && newsList.length === 0 && (
        <div className="status-box">
          {activeKeyword || selectedCategory
            ? `'${activeKeyword || selectedCategory}' 검색 결과가 없습니다.`
            : '수집된 뉴스가 없습니다.'}
        </div>
      )}

      {!loading && !isRefreshing && !error && (
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