import React, { useState, useEffect } from 'react';
import { newsService } from '../services/newsService';
import Modal from '../components/Modal';

const NewsHistoryPage = ({ currentUser, showNotification }) => {
  const [historyArticles, setHistoryArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.accountID) {
      loadHistory();
    }
  }, [currentUser]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await newsService.getMyHistory(currentUser.accountID);
      setHistoryArticles(data);
    } catch (err) {
      showNotification('Failed to load news history: ' + (err.response?.data?.message || err.message), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = historyArticles.filter((art) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      art.newsTitle?.toLowerCase().includes(s) ||
      art.headline?.toLowerCase().includes(s) ||
      art.categoryName?.toLowerCase().includes(s)
    );
  });

  const activeCount = historyArticles.filter((a) => a.newsStatus).length;
  const draftCount = historyArticles.length - activeCount;

  return (
    <div className="container py-4">
      {/* Header and User greeting */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold mb-1"><i className="bi bi-clock-history text-primary me-2"></i>My News History</h2>
          <p className="text-muted mb-0">
            Articles authored and published by <strong>{currentUser?.accountName}</strong> ({currentUser?.accountEmail}).
          </p>
        </div>
        <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={loadHistory}>
          <i className="bi bi-arrow-clockwise"></i> Refresh History
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-4 border-primary">
            <div className="card-body">
              <span className="text-muted small fw-bold">TOTAL CREATED ARTICLES</span>
              <h2 className="fw-bold text-dark mt-1 mb-0">{historyArticles.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-4 border-success">
            <div className="card-body">
              <span className="text-muted small fw-bold">ACTIVE (PUBLISHED)</span>
              <h2 className="fw-bold text-success mt-1 mb-0">{activeCount}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-4 border-secondary">
            <div className="card-body">
              <span className="text-muted small fw-bold">INACTIVE / DRAFT</span>
              <h2 className="fw-bold text-secondary mt-1 mb-0">{draftCount}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="input-group">
            <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search in your authored news history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: '90px' }}>ID</th>
                <th scope="col">Title & Headline</th>
                <th scope="col">Category</th>
                <th scope="col" style={{ width: '100px' }}>Status</th>
                <th scope="col">Created Date</th>
                <th scope="col">Last Modified</th>
                <th scope="col" className="text-end" style={{ width: '100px' }}>View</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Loading your news history...
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <i className="bi bi-clock-history fs-2 d-block mb-2"></i>
                    No articles found in your history.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.newsArticleID}>
                    <td className="fw-bold text-muted small">{art.newsArticleID}</td>
                    <td>
                      <div className="fw-semibold text-dark">{art.newsTitle}</div>
                      <small className="text-muted">{art.headline}</small>
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary border">
                        {art.categoryName}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${art.newsStatus ? 'bg-success' : 'bg-secondary'}`}>
                        {art.newsStatus ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td><small className="text-muted">{art.createdDate ? art.createdDate.split('T')[0] : '—'}</small></td>
                    <td><small className="text-muted">{art.modifiedDate ? art.modifiedDate.split('T')[0] : 'None'}</small></td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => { setSelectedArticle(art); setIsDetailOpen(true); }}
                      >
                        <i className="bi bi-eye"></i> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedArticle && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`History Article: ${selectedArticle.newsTitle}`}
          size="lg"
          footer={
            <button className="btn btn-secondary" onClick={() => setIsDetailOpen(false)}>
              Close
            </button>
          }
        >
          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <span className="badge bg-primary">{selectedArticle.categoryName}</span>
            <span className={`badge ${selectedArticle.newsStatus ? 'bg-success' : 'bg-secondary'}`}>
              {selectedArticle.newsStatus ? 'Active' : 'Draft'}
            </span>
            <span className="text-muted small ms-auto">
              Created: {selectedArticle.createdDate}
            </span>
          </div>

          <div className="alert alert-light border p-3 mb-3">
            <h6 className="fw-bold mb-1">Headline</h6>
            <p className="mb-0 text-muted">{selectedArticle.headline}</p>
          </div>

          <div className="bg-white p-3 border rounded mb-3">
            <h6 className="fw-bold mb-2">Full Content</h6>
            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>{selectedArticle.newsContent}</p>
          </div>

          {selectedArticle.tags && selectedArticle.tags.length > 0 && (
            <div>
              <h6 className="fw-bold small text-muted mb-2">TAGS:</h6>
              <div className="d-flex flex-wrap gap-1">
                {selectedArticle.tags.map((t) => (
                  <span key={t.tagID} className="badge bg-light text-dark border p-2">
                    <i className="bi bi-tag-fill text-primary me-1"></i> {t.tagName}
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

export default NewsHistoryPage;

