import React, { useState, useEffect } from 'react';
import { accountService } from '../services/accountService';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

const AccountManagementPage = ({ showNotification }) => {
  const [accounts, setAccounts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal states for Create / Update
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    accountID: null,
    accountName: '',
    accountEmail: '',
    accountRole: 2,
    accountPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async (kw = keyword, role = roleFilter) => {
    setLoading(true);
    try {
      const data = await accountService.getAll(kw, role);
      setAccounts(data);
    } catch (err) {
      showNotification('Failed to load accounts: ' + (err.response?.data?.message || err.message), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadAccounts(keyword, roleFilter);
  };

  const handleRoleFilterChange = (e) => {
    const role = e.target.value;
    setRoleFilter(role);
    loadAccounts(keyword, role);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      accountID: null,
      accountName: '',
      accountEmail: '',
      accountRole: 2,
      accountPassword: '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openEditModal = (acc) => {
    setIsEditing(true);
    setFormData({
      accountID: acc.accountID,
      accountName: acc.accountName,
      accountEmail: acc.accountEmail,
      accountRole: acc.accountRole,
      accountPassword: '', // leave empty if not changing
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.accountName.trim()) {
      errs.accountName = 'Account name is required';
    } else if (formData.accountName.trim().length < 2 || formData.accountName.trim().length > 100) {
      errs.accountName = 'Name must be between 2 and 100 characters';
    }

    if (!formData.accountEmail.trim()) {
      errs.accountEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.accountEmail.trim())) {
      errs.accountEmail = 'Invalid email format (e.g. name@fpt.edu.vn)';
    }

    if (!formData.accountRole) {
      errs.accountRole = 'Role is required';
    }

    if (!isEditing && (!formData.accountPassword || formData.accountPassword.trim().length < 4)) {
      errs.accountPassword = 'Password is required and must be at least 4 characters';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (isEditing) {
        await accountService.update(formData.accountID, formData);
        showNotification('Account updated successfully!', 'success');
      } else {
        await accountService.create(formData);
        showNotification('Account created successfully!', 'success');
      }
      setIsFormModalOpen(false);
      loadAccounts();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error saving account', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (acc) => {
    setAccountToDelete(acc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;
    setDeleting(true);
    try {
      await accountService.delete(accountToDelete.accountID);
      showNotification(`Account "${accountToDelete.accountName}" deleted successfully!`, 'success');
      setIsDeleteModalOpen(false);
      setAccountToDelete(null);
      loadAccounts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete account';
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
          <h2 className="fw-bold mb-1"><i className="bi bi-people-fill text-primary me-2"></i>Account Management</h2>
          <p className="text-muted mb-0">Manage system users (Admin & Staff roles) with strict referential integrity validation.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreateModal}>
          <i className="bi bi-person-plus-fill"></i> Add New Account
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
                  placeholder="Search by account name or email..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <select className="form-select" value={roleFilter} onChange={handleRoleFilterChange}>
                <option value="">-- All Roles --</option>
                <option value="1">Admin (Role 1)</option>
                <option value="2">Staff (Role 2)</option>
              </select>
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-fill">Filter</button>
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => { setKeyword(''); setRoleFilter(''); loadAccounts('', ''); }}
                title="Reset"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: '80px' }}>ID</th>
                <th scope="col">Full Name</th>
                <th scope="col">Email Address</th>
                <th scope="col" style={{ width: '120px' }}>Role</th>
                <th scope="col" style={{ width: '180px' }}>Integrity Status</th>
                <th scope="col" className="text-end" style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Loading accounts...
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No accounts found matching criteria.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.accountID}>
                    <td className="fw-bold text-muted">#{acc.accountID}</td>
                    <td className="fw-semibold text-dark">{acc.accountName}</td>
                    <td>{acc.accountEmail}</td>
                    <td>
                      <span className={`badge ${acc.accountRole === 1 ? 'bg-danger' : 'bg-info text-dark'}`}>
                        {acc.roleName || (acc.accountRole === 1 ? 'Admin' : 'Staff')}
                      </span>
                    </td>
                    <td>
                      {acc.canDelete ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          <i className="bi bi-check2-circle me-1"></i> Safe to delete
                        </span>
                      ) : (
                        <span 
                          className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"
                          title="Has created news articles - protected from deletion"
                        >
                          <i className="bi bi-lock-fill me-1"></i> Has articles (Protected)
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          title="Edit Account"
                          onClick={() => openEditModal(acc)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button 
                          className={`btn ${acc.canDelete ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
                          title={acc.canDelete ? "Delete Account" : "Cannot delete: account has created news articles"}
                          onClick={() => openDeleteConfirm(acc)}
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
        title={isEditing ? `Edit Account: ${formData.accountName}` : "Create New Account"}
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
              onClick={handleSaveAccount}
              disabled={saving}
            >
              {saving && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <i className="bi bi-check-lg"></i> {isEditing ? "Update Account" : "Create Account"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveAccount}>
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className={`form-control ${formErrors.accountName ? 'is-invalid' : ''}`}
              placeholder="e.g. John Doe"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
            />
            {formErrors.accountName && <div className="invalid-feedback">{formErrors.accountName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Email Address <span className="text-danger">*</span></label>
            <input 
              type="email" 
              className={`form-control ${formErrors.accountEmail ? 'is-invalid' : ''}`}
              placeholder="e.g. jdoe@fpt.edu.vn"
              value={formData.accountEmail}
              onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
            />
            {formErrors.accountEmail && <div className="invalid-feedback">{formErrors.accountEmail}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Account Role <span className="text-danger">*</span></label>
            <select 
              className={`form-select ${formErrors.accountRole ? 'is-invalid' : ''}`}
              value={formData.accountRole}
              onChange={(e) => setFormData({ ...formData, accountRole: parseInt(e.target.value) })}
            >
              <option value="1">Admin (Role 1)</option>
              <option value="2">Staff (Role 2)</option>
            </select>
            {formErrors.accountRole && <div className="invalid-feedback">{formErrors.accountRole}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              {isEditing ? "Password (Leave blank to keep unchanged)" : "Password *"}
            </label>
            <input 
              type="password" 
              className={`form-control ${formErrors.accountPassword ? 'is-invalid' : ''}`}
              placeholder={isEditing ? "Enter new password if changing" : "Enter account password"}
              value={formData.accountPassword}
              onChange={(e) => setFormData({ ...formData, accountPassword: e.target.value })}
            />
            {formErrors.accountPassword && <div className="invalid-feedback">{formErrors.accountPassword}</div>}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Account Confirmation"
        message={
          accountToDelete ? (
            accountToDelete.canDelete 
              ? `Are you sure you want to permanently delete account "${accountToDelete.accountName}" (${accountToDelete.accountEmail})?`
              : `Warning: This account "${accountToDelete.accountName}" has created news articles. In accordance with system rules, deleting this account is prohibited.`
          ) : ''
        }
        confirmText={accountToDelete && !accountToDelete.canDelete ? "Attempt Delete" : "Delete Account"}
        isDeleting={deleting}
      />
    </div>
  );
};

export default AccountManagementPage;

