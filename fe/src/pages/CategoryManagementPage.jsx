import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

const CategoryManagementPage = ({ showNotification }) => {
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal states for Create / Update
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    categoryID: null,
    categoryName: '',
    categoryDesciption: '',
    parentCategoryID: '',
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async (kw = keyword, status = statusFilter) => {
    setLoading(true);
    try {
      const activeParam = status === '' ? null : status === 'true';
      const data = await categoryService.getAll(kw, activeParam);
      setCategories(data);
    } catch (err) {
      showNotification('Failed to load categories: ' + (err.response?.data?.message || err.message), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadCategories(keyword, statusFilter);
  };

  const handleStatusFilterChange = (e) => {
    const val = e.target.value;
    setStatusFilter(val);
    loadCategories(keyword, val);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      categoryID: null,
      categoryName: '',
      categoryDesciption: '',
      parentCategoryID: '',
      isActive: true,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setFormData({
      categoryID: cat.categoryID,
      categoryName: cat.categoryName,
      categoryDesciption: cat.categoryDesciption || '',
      parentCategoryID: cat.parentCategoryID || '',
      isActive: cat.isActive,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.categoryName.trim()) {
      errs.categoryName = 'Category name is required';
    } else if (formData.categoryName.trim().length > 150) {
      errs.categoryName = 'Category name cannot exceed 150 characters';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        parentCategoryID: formData.parentCategoryID ? parseInt(formData.parentCategoryID) : null,
      };

      if (isEditing) {
        await categoryService.update(formData.categoryID, payload);
        showNotification('Category updated successfully!', 'success');
      } else {
        await categoryService.create(payload);
        showNotification('Category created successfully!', 'success');
      }
      setIsFormModalOpen(false);
      loadCategories();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error saving category', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (cat) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await categoryService.delete(categoryToDelete.categoryID);
      showNotification(`Category "${categoryToDelete.categoryName}" deleted successfully!`, 'success');
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      loadCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete category';
      showNotification(msg, 'danger');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Header and Add Action */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold mb-1"><i className="bi bi-folder-fill text-primary me-2"></i>Category Management</h2>
          <p className="text-muted mb-0">Manage news categories. Categories linked to active articles cannot be deleted.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreateModal}>
          <i className="bi bi-folder-plus"></i> Add New Category
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleSearch} className="row g-2 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search by category name or description..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <select className="form-select" value={statusFilter} onChange={handleStatusFilterChange}>
                <option value="">-- All Statuses --</option>
                <option value="true">Active (1)</option>
                <option value="false">Inactive (0)</option>
              </select>
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-fill">Filter</button>
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => { setKeyword(''); setStatusFilter(''); loadCategories('', ''); }}
                title="Reset"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Categories Table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: '80px' }}>ID</th>
                <th scope="col">Category Name</th>
                <th scope="col">Description</th>
                <th scope="col">Parent Category</th>
                <th scope="col" style={{ width: '100px' }}>Status</th>
                <th scope="col" style={{ width: '160px' }}>Integrity</th>
                <th scope="col" className="text-end" style={{ width: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No categories found matching criteria.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.categoryID}>
                    <td className="fw-bold text-muted">#{cat.categoryID}</td>
                    <td className="fw-semibold text-dark">{cat.categoryName}</td>
                    <td className="text-muted small">{cat.categoryDesciption || '—'}</td>
                    <td>
                      {cat.parentCategoryName ? (
                        <span className="badge bg-light text-dark border">
                          <i className="bi bi-arrow-return-right me-1"></i> {cat.parentCategoryName}
                        </span>
                      ) : (
                        <span className="text-muted small">None (Root)</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${cat.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {cat.isActive ? 'Active (1)' : 'Inactive (0)'}
                      </span>
                    </td>
                    <td>
                      {cat.canDelete ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          <i className="bi bi-check2-circle me-1"></i> Safe to delete
                        </span>
                      ) : (
                        <span 
                          className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"
                          title="Category is used by news articles or has child categories"
                        >
                          <i className="bi bi-lock-fill me-1"></i> In Use (Protected)
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          title="Edit Category"
                          onClick={() => openEditModal(cat)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button 
                          className={`btn ${cat.canDelete ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
                          title={cat.canDelete ? "Delete Category" : "Cannot delete: category contains articles or subcategories"}
                          onClick={() => openDeleteConfirm(cat)}
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
        title={isEditing ? `Edit Category: ${formData.categoryName}` : "Create New Category"}
        size="md"
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
              onClick={handleSaveCategory}
              disabled={saving}
            >
              {saving && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <i className="bi bi-check-lg"></i> {isEditing ? "Update Category" : "Create Category"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveCategory}>
          <div className="mb-3">
            <label className="form-label fw-bold">Category Name <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className={`form-control ${formErrors.categoryName ? 'is-invalid' : ''}`}
              placeholder="e.g. Technology News"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
            />
            {formErrors.categoryName && <div className="invalid-feedback">{formErrors.categoryName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Description</label>
            <textarea 
              className="form-control" 
              rows="3"
              placeholder="Brief description of this news category..."
              value={formData.categoryDesciption}
              onChange={(e) => setFormData({ ...formData, categoryDesciption: e.target.value })}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Parent Category (Optional)</label>
            <select 
              className="form-select"
              value={formData.parentCategoryID}
              onChange={(e) => setFormData({ ...formData, parentCategoryID: e.target.value })}
            >
              <option value="">-- None (Top Level Category) --</option>
              {categories
                .filter((c) => !isEditing || c.categoryID !== formData.categoryID)
                .map((c) => (
                  <option key={c.categoryID} value={c.categoryID}>
                    {c.categoryName}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-check form-switch mb-3">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="isActiveSwitch"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label className="form-check-label fw-bold" htmlFor="isActiveSwitch">
              Status: {formData.isActive ? 'Active (1)' : 'Inactive (0)'}
            </label>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category Confirmation"
        message={
          categoryToDelete ? (
            categoryToDelete.canDelete 
              ? `Are you sure you want to delete category "${categoryToDelete.categoryName}"?`
              : `Warning: This category "${categoryToDelete.categoryName}" is currently assigned to one or more news articles or has subcategories. In accordance with system requirements, deleting this category is not allowed.`
          ) : ''
        }
        confirmText={categoryToDelete && !categoryToDelete.canDelete ? "Attempt Delete" : "Delete Category"}
        isDeleting={deleting}
      />
    </div>
  );
};

export default CategoryManagementPage;

