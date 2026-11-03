import React, { useState, useEffect } from 'react';
import { newsService } from '../services/newsService';
import { categoryService } from '../services/categoryService';
import { tagService } from '../services/tagService';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

const NewsArticleManagementPage = ({ currentUser, showNotification }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal states for Create / Update
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    newsArticleID: '',
    newsTitle: '',
    headline: '',
    newsContent: '',
    newsSource: '',
    categoryID: '',
    newsStatus: true,
    tagIDs: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Detail Modal
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
    loadTags();
    loadArticles();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getActive();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadTags = async () => {
    try {
      const data = await tagService.getAll();
      setAvailableTags(data);
    } catch (err) {
      console.error('Failed to load tags', err);
    }
  };

  const loadArticles = async (kw = keyword, cat = categoryFilter, stat = statusFilter) => {
    setLoading(true);
    try {
      const statusParam = stat === '' ? null : stat === 'true';
      const data = await newsService.getAll(kw, cat, statusParam);
      setArticles(data);
    } catch (err) {
      showNotification('Failed to load articles: ' + (err.response?.data?.message || err.message), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadArticles(keyword, categoryFilter, statusFilter);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      newsArticleID: '',
      newsTitle: '',
      headline: '',
      newsContent: '',
      newsSource: 'FU Press',
      categoryID: categories.length > 0 ? categories[0].categoryID : '',
      newsStatus: true,
      tagIDs: [],
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openEditModal = (art) => {
    setIsEditing(true);
    setFormData({
      newsArticleID: art.newsArticleID,
      newsTitle: art.newsTitle,
      headline: art.headline,
      newsContent: art.newsContent,
      newsSource: art.newsSource || '',
      categoryID: art.categoryID,
      newsStatus: art.newsStatus,
      tagIDs: art.tags ? art.tags.map((t) => t.tagID) : [],
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openViewModal = (art) => {
    setSelectedArticle(art);
    setIsDetailModalOpen(true);
  };

  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const exists = prev.tagIDs.includes(tagId);
      return {
        ...prev,
        tagIDs: exists ? prev.tagIDs.filter((id) => id !== tagId) : [...prev.tagIDs, tagId],
      };
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.newsTitle.trim()) errs.newsTitle = 'Title is required';
    if (!formData.headline.trim()) errs.headline = 'Headline is required';
    if (!formData.newsContent.trim()) errs.newsContent = 'Content is required';
    if (!formData.categoryID) errs.categoryID = 'Category is required';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        categoryID: parseInt(formData.categoryID),
        createdByID: currentUser.accountID,
        updatedByID: currentUser.accountID,
      };

      if (isEditing) {
        await newsService.update(formData.newsArticleID, payload);
        showNotification('News article updated successfully!', 'success');
      } else {
        await newsService.create(payload);
        showNotification('News article created successfully!', 'success');
      }
      setIsFormModalOpen(false);
      loadArticles();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error saving article', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (art) => {
    setArticleToDelete(art);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    setDeleting(true);
    try {
      await newsService.delete(articleToDelete.newsArticleID);
      showNotification(`Article "${articleToDelete.newsTitle}" deleted successfully!`, 'success');
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
      loadArticles();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to delete article', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Header and Add Action */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold mb-1"><i className="bi bi-file-earmark-text-fill text-primary me-2"></i>News Article Management</h2>
          <p className="text-muted mb-0">Create, edit, search, and manage news articles and associated tags.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreateModal}>
          <i className="bi bi-plus-circle-fill"></i> Create News Article
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleSearch} className="row g-2 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search articles by title, headline, or content..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select className="form-select" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); loadArticles(keyword, e.target.value, statusFilter); }}>
                <option value="">-- All Categories --</option>
                {categories.map((c) => (
                  <option key={c.categoryID} value={c.categoryID}>{c.categoryName}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <select className="form-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); loadArticles(keyword, categoryFilter, e.target.value); }}>
                <option value="">-- Status --</option>
                <option value="true">Active (1)</option>
                <option value="false">Inactive (0)</option>
              </select>
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-fill">Filter</button>
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => { setKeyword(''); setCategoryFilter(''); setStatusFilter(''); loadArticles('', '', ''); }}
                title="Reset"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Articles Table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: '90px' }}>ID</th>
                <th scope="col">Title</th>
                <th scope="col">Category</th>
                <th scope="col">Tags</th>
                <th scope="col" style={{ width: '90px' }}>Status</th>
                <th scope="col">Author</th>
                <th scope="col">Created Date</th>
                <th scope="col" className="text-end" style={{ width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Loading news articles...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No articles found matching criteria.
                  </td>
                </tr>
              ) : (
                articles.map((art) => (
                  <tr key={art.newsArticleID}>
                    <td className="fw-bold text-muted small">{art.newsArticleID}</td>
                    <td>
                      <div className="fw-semibold text-dark line-clamp-1">{art.newsTitle}</div>
                      <small className="text-muted line-clamp-1">{art.headline}</small>
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary border">
                        {art.categoryName}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {art.tags && art.tags.length > 0 ? (
                          art.tags.map((t) => (
                            <span key={t.tagID} className="badge bg-light text-dark border small">
                              {t.tagName}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted small">None</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${art.newsStatus ? 'bg-success' : 'bg-secondary'}`}>
                        {art.newsStatus ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <small className="text-dark fw-medium">{art.createdByName || 'Staff'}</small>
                    </td>
                    <td>
                      <small className="text-muted">
                        {art.createdDate ? art.createdDate.split('T')[0] : '—'}
                      </small>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-info" 
                          title="View Details"
                          onClick={() => openViewModal(art)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-primary" 
                          title="Edit Article"
                          onClick={() => openEditModal(art)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger" 
                          title="Delete Article"
                          onClick={() => openDeleteConfirm(art)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Popup Dialog Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={isEditing ? `Edit Article: ${formData.newsArticleID}` : "Create New News Article"}
        size="lg"
        footer={
          <>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsFormModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary d-flex align-items-center gap-2" 
              onClick={handleSaveArticle}
              disabled={saving}
            >
              {saving && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <i className="bi bi-check-lg"></i> {isEditing ? "Update Article" : "Save Article"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveArticle}>
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Article ID</label>
              <input 
                type="text" 
                className="form-control"
                placeholder={isEditing ? formData.newsArticleID : "Leave blank to auto-generate"}
                value={formData.newsArticleID}
                onChange={(e) => setFormData({ ...formData, newsArticleID: e.target.value })}
                disabled={isEditing}
              />
              <small className="text-muted">Optional unique identifier.</small>
            </div>

            <div className="col-md-5">
              <label className="form-label fw-bold">Category <span className="text-danger">*</span></label>
              <select 
                className={`form-select ${formErrors.categoryID ? 'is-invalid' : ''}`}
                value={formData.categoryID}
                onChange={(e) => setFormData({ ...formData, categoryID: e.target.value })}
              >
                <option value="">-- Choose Category --</option>
                {categories.map((c) => (
                  <option key={c.categoryID} value={c.categoryID}>{c.categoryName}</option>
                ))}
              </select>
              {formErrors.categoryID && <div className="invalid-feedback">{formErrors.categoryID}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">News Source</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. FU Press"
                value={formData.newsSource}
                onChange={(e) => setFormData({ ...formData, newsSource: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">News Title <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className={`form-control ${formErrors.newsTitle ? 'is-invalid' : ''}`}
              placeholder="Enter headline-grabbing news title..."
              value={formData.newsTitle}
              onChange={(e) => setFormData({ ...formData, newsTitle: e.target.value })}
            />
            {formErrors.newsTitle && <div className="invalid-feedback">{formErrors.newsTitle}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Headline / Subtitle <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className={`form-control ${formErrors.headline ? 'is-invalid' : ''}`}
              placeholder="Brief summary or highlight sentence..."
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            />
            {formErrors.headline && <div className="invalid-feedback">{formErrors.headline}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">News Content <span className="text-danger">*</span></label>
            <textarea 
              className={`form-control ${formErrors.newsContent ? 'is-invalid' : ''}`}
              rows="6"
              placeholder="Full article content body..."
              value={formData.newsContent}
              onChange={(e) => setFormData({ ...formData, newsContent: e.target.value })}
            ></textarea>
            {formErrors.newsContent && <div className="invalid-feedback">{formErrors.newsContent}</div>}
          </div>

          {/* Tags Selection */}
          <div className="mb-3">
            <label className="form-label fw-bold d-block">Article Tags</label>
            <div className="d-flex flex-wrap gap-2 p-2 border rounded bg-light">
              {availableTags.map((tag) => {
                const isSelected = formData.tagIDs.includes(tag.tagID);
                return (
                  <button 
                    key={tag.tagID}
                    type="button"
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => handleTagToggle(tag.tagID)}
                  >
                    <i className={`bi ${isSelected ? 'bi-check-circle-fill' : 'bi-plus'} me-1`}></i>
                    {tag.tagName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-check form-switch mb-2">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="articleStatusSwitch"
              checked={formData.newsStatus}
              onChange={(e) => setFormData({ ...formData, newsStatus: e.target.checked })}
            />
            <label className="form-check-label fw-bold" htmlFor="articleStatusSwitch">
              Publish Status: {formData.newsStatus ? 'Active (Published)' : 'Inactive (Draft)'}
            </label>
          </div>
        </form>
      </Modal>

      {/* Article Detail View Modal */}
      {selectedArticle && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Article Detail: ${selectedArticle.newsArticleID}`}
          size="lg"
          footer={
            <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </button>
          }
        >
          <div className="mb-3">
            <h4 className="fw-bold text-dark">{selectedArticle.newsTitle}</h4>
            <div className="d-flex flex-wrap gap-2 align-items-center text-muted small my-2">
              <span className="badge bg-primary">{selectedArticle.categoryName}</span>
              <span className={`badge ${selectedArticle.newsStatus ? 'bg-success' : 'bg-secondary'}`}>
                {selectedArticle.newsStatus ? 'Active' : 'Inactive'}
              </span>
              <span><i className="bi bi-person me-1"></i> Author: <strong>{selectedArticle.createdByName}</strong></span>
              <span><i className="bi bi-calendar me-1"></i> {selectedArticle.createdDate}</span>
              {selectedArticle.newsSource && <span><i className="bi bi-building me-1"></i> Source: {selectedArticle.newsSource}</span>}
            </div>
          </div>

          <div className="p-3 bg-light border-start border-4 border-primary rounded mb-3">
            <h6 className="fw-bold mb-1">Headline</h6>
            <p className="mb-0 text-muted">{selectedArticle.headline}</p>
          </div>

          <div className="p-3 bg-white border rounded mb-3">
            <h6 className="fw-bold mb-2">Content</h6>
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete News Article"
        message={
          articleToDelete ? `Are you sure you want to permanently delete article "${articleToDelete.newsTitle}"?` : ''
        }
        confirmText="Delete Article"
        isDeleting={deleting}
      />
    </div>
  );
};

export default NewsArticleManagementPage;

