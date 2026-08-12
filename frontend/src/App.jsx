import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Newspaper, Loader2, RefreshCw, Search, Bookmark, BookmarkCheck, User, LogOut, X } from 'lucide-react';
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
  // 🔐 인증 및 북마크 상태
  const [currentUser, setCurrentUser] = useState(null); // 로그인된 사용자 정보 ({ id, username })
  const [bookmarks, setBookmarks] = useState([]); // 북마크된 news_id 목록 (예: [1, 3, 5])
  const [isBookmarkOnly, setIsBookmarkOnly] = useState(false); // '내 북마크' 탭 활성화 여부

  // 🔑 모달 상태
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  // 📰 뉴스 데이터 상태
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // 🚀 검색 및 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');

  // 페이지 진입 시 로컬스토리지에서 로그인 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      fetchBookmarks(user.id);
    }
  }, []);

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

  // 📌 북마크 목록 불러오기 (백엔드 엔드포인트: /api/bookmarks)
  const fetchBookmarks = async (memberId) => {
    try {
      const res = await axios.get('/api/bookmarks', { params: { memberId } });
      // 백엔드가 List<News> 형태 목록을 반환하므로 item.id로 extraction
      setBookmarks(res.data.map(item => item.id));
    } catch (err) {
      console.error('북마크 목록을 불러오지 못했습니다:', err);
    }
  };

  // 📌 북마크 토글 (백엔드 엔드포인트: /api/bookmarks/toggle)
  const handleToggleBookmark = async (newsId) => {
    if (!currentUser) {
      alert('로그인이 필요한 기능입니다.');
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    try {
      // memberId와 newsId 모두 RequestParam으로 전송
      await axios.post('/api/bookmarks/toggle', null, {
        params: {
          memberId: currentUser.id,
          newsId: newsId
        }
      });

      setBookmarks(prev =>
        prev.includes(newsId) ? prev.filter(id => id !== newsId) : [...prev, newsId]
      );
    } catch (err) {
      console.error('북마크 처리에 실패했습니다:', err);
      alert('북마크 처리에 실패했습니다.');
    }
  };

  // 🔑 회원가입 / 로그인 제출 핸들러
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await axios.post(endpoint, authForm);
      if (authMode === 'login') {
        const user = res.data;
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        fetchBookmarks(user.id);
        setShowAuthModal(false);
        setAuthForm({ username: '', password: '' });
      } else {
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        setAuthMode('login');
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || '처리 중 오류가 발생했습니다.');
    }
  };

  // 🚪 로그아웃 핸들러
  const handleLogout = () => {
    setCurrentUser(null);
    setBookmarks([]);
    setIsBookmarkOnly(false);
    localStorage.removeItem('user');
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
    setIsBookmarkOnly(false);
    setSelectedCategory('');
    setActiveKeyword(searchTerm);
  };

  // 카테고리 탭 클릭 핸들러
  const handleCategoryClick = (categoryValue) => {
    setIsBookmarkOnly(false);
    setSelectedCategory(categoryValue);
    setSearchTerm('');
    setActiveKeyword('');
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-top-bar">
          <div className="user-nav">
            {currentUser ? (
              <div className="user-info">
                <span><User className="user-icon" /> <strong>{currentUser.username}</strong>님</span>
                <button className="auth-btn logout" onClick={handleLogout}>
                  <LogOut className="btn-icon" /> 로그아웃
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="auth-btn" onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}>로그인</button>
                <button className="auth-btn primary" onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}>회원가입</button>
              </div>
            )}
          </div>
        </div>

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
                selectedCategory === cat.value && !activeKeyword && !isBookmarkOnly ? 'active' : ''
              }`}
              onClick={() => handleCategoryClick(cat.value)}
            >
              {cat.label}
            </button>
          ))}

          {/* 내 북마크 탭 */}
          <button
            className={`category-tab bookmark-tab ${isBookmarkOnly ? 'active' : ''}`}
            onClick={() => {
              if (!currentUser) {
                alert('로그인이 필요한 기능입니다.');
                setAuthMode('login');
                setShowAuthModal(true);
                return;
              }
              setIsBookmarkOnly(true);
              setSelectedCategory('');
              setSearchTerm('');
              setActiveKeyword('');
            }}
          >
            📌 내 북마크
          </button>
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
          {newsList
            .filter(news => !isBookmarkOnly || bookmarks.includes(news.id))
            .map((news) => {
              const isBookmarked = bookmarks.includes(news.id);
              return (
                <article key={news.id} className="news-card">
                  <div className="news-card-header">
                    <h2 className="news-title">
                      <a href={news.link} target="_blank" rel="noopener noreferrer">
                        {news.title}
                        <ExternalLink className="link-icon" />
                      </a>
                    </h2>
                    <button
                      className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                      onClick={() => handleToggleBookmark(news.id)}
                      title={isBookmarked ? '북마크 해제' : '북마크 추가'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="bookmark-icon active" />
                      ) : (
                        <Bookmark className="bookmark-icon" />
                      )}
                    </button>
                  </div>
                  <p className="news-summary">{news.summary}</p>
                  <div className="news-footer">
                    <span className="news-date">
                      수집일시: {news.createdAt ? news.createdAt.replace('T', ' ').substring(0, 16) : ''}
                    </span>
                  </div>
                </article>
              );
            })}
        </div>
      )}

      {/* 🔐 로그인 / 회원가입 모달 */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{authMode === 'login' ? '로그인' : '회원가입'}</h2>
              <button className="close-btn" onClick={() => setShowAuthModal(false)}>
                <X className="icon" />
              </button>
            </div>
            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authError && <div className="auth-error">{authError}</div>}
              <div className="form-group">
                <label>아이디</label>
                <input
                  type="text"
                  required
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  placeholder="아이디를 입력하세요"
                />
              </div>
              <div className="form-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <button type="submit" className="submit-btn">
                {authMode === 'login' ? '로그인' : '회원가입'}
              </button>
            </form>
            <div className="modal-footer">
              {authMode === 'login' ? (
                <p>계정이 없으신가요? <span onClick={() => { setAuthMode('signup'); setAuthError(''); }}>회원가입</span></p>
              ) : (
                <p>이미 계정이 있으신가요? <span onClick={() => { setAuthMode('login'); setAuthError(''); }}>로그인</span></p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;