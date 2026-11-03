import React, { useState, useEffect } from 'react';
import { newsService } from '../services/newsService';
import Modal from '../components/Modal';

const PublicNewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadCategories();
    loadArticles();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await newsService.getPublicCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadArticles = async (keyword = searchKeyword, catId = selectedCategory) => {
    setLoading(true);
    try {
      const data = await newsService.getPublicNews(keyword, catId);
      setArticles(data);
    } catch (err) {
      console.error('Failed to load public news', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadArticles(searchKeyword, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);
    loadArticles(searchKeyword, catId);
  };

  const handleReset = () => {
    setSearchKeyword('');
    setSelectedCategory('');
    loadArticles('', '');
  };

  const openDetail = async (id) => {
    try {
      const data = await newsService.getPublicById(id);
      setSelectedArticle(data);
      setIsDetailOpen(true);
    } catch (err) {
      console.error('Failed to load article detail', err);
    }
  };

  return (
    <div className="container py-4">
      {/* Hero Banner */}
      <div className="p-4 p-md-5 mb-4 rounded-3 text-white bg-primary shadow-sm">
        <div className="col-md-9 px-0">
          <h1 className="display-5 fw-bold">FUNewsManagementSystem</h1>
          <p className="lead my-3">
            Stay up to date with the latest official announcements, academic schedules, admissions, and campus life events at FPT University.
          </p>
          <span className="badge bg-light text-primary fs-6 px-3 py-2">
            <i className="bi bi-shield-check me-1"></i> Public Access • Active News Only
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleSearch} className="row g-2 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search by title, headline, or keywords..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <select 
                className="form-select" 
                value={selectedCategory} 
                onChange={handleCategoryChange}
              >
                <option value="">-- All Categories --</option>
                {categories.map((cat) => (
                  <option key={cat.categoryID} value={cat.categoryID}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-fill">
                Search
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={handleReset} title="Reset Filter">
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* News Articles Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading news...</span>
          </div>
          <p className="mt-2 text-muted">Loading active news articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-5 card shadow-sm border-0 p-5">
          <i className="bi bi-journal-x text-muted" style={{ fontSize: '3.5rem' }}></i>
          <h4 className="mt-3 text-secondary">No news articles found</h4>
          <p className="text-muted">Try adjusting your search criteria or filter options.</p>
        </div>
      ) : (
        <div className="row g-4">
          {articles.map((item) => (
            <div key={item.newsArticleID} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 d-flex flex-column hover-shadow transition">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-secondary-subtle text-secondary border">
                      {item.categoryName}
                    </span>
                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-1"></i>
                      {item.createdDate ? item.createdDate.split('T')[0] : 'N/A'}
                    </small>
                  </div>

                  <h5 className="card-title fw-bold text-dark mb-2 line-clamp-2">
                    {item.newsTitle}
                  </h5>

                  <p className="card-text text-muted small flex-grow-1 line-clamp-3">
                    {item.headline}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mb-3 d-flex flex-wrap gap-1">
                      {item.tags.map((t) => (
                        <span key={t.tagID} className="badge bg-light text-dark border">
                          #{t.tagName}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                    <small className="text-muted">
                      <i className="bi bi-person me-1"></i> {item.createdByName || 'Staff'}
                    </small>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openDetail(item.newsArticleID)}
                    >
                      Read Story <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail Popup Modal */}
      {selectedArticle && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedArticle.newsTitle}
          size="lg"
          footer={
            <button className="btn btn-secondary" onClick={() => setIsDetailOpen(false)}>
              Close
            </button>
          }
        >
          <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
            <span className="badge bg-primary fs-6">{selectedArticle.categoryName}</span>
            <span className="text-muted small">
              <i className="bi bi-calendar-event me-1"></i> Published: {selectedArticle.createdDate}
            </span>
            <span className="text-muted small ms-auto">
              <i className="bi bi-person-circle me-1"></i> Author: <strong>{selectedArticle.createdByName}</strong>
            </span>
            {selectedArticle.newsSource && (
              <span className="badge bg-light text-muted border">
                Source: {selectedArticle.newsSource}
              </span>
            )}
          </div>

          <div className="alert alert-light border-start border-primary border-4 p-3 mb-4">
            <h6 className="fw-bold mb-1 text-primary">Headline</h6>
            <p className="mb-0 text-dark fst-italic">{selectedArticle.headline}</p>
          </div>

          <div className="news-content-body my-4 p-3 bg-white rounded border">
            <p className="text-dark" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
              {selectedArticle.newsContent}
            </p>
          </div>

          {selectedArticle.tags && selectedArticle.tags.length > 0 && (
            <div className="mt-4 pt-3 border-top">
              <h6 className="fw-bold text-muted small mb-2">ARTICLE TAGS:</h6>
              <div className="d-flex flex-wrap gap-1">
                {selectedArticle.tags.map((t) => (
                  <span key={t.tagID} className="badge bg-light text-dark border p-2">
                    <i className="bi bi-tag-fill me-1 text-primary"></i> {t.tagName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default PublicNewsPage;

