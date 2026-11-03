import React, { useState, useEffect } from 'react';
import { accountService } from '../services/accountService';
import Modal from '../components/Modal';

const ProfilePage = ({ currentUser, onUserUpdated, showNotification }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    accountName: '',
    accountEmail: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.accountID) {
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await accountService.getById(currentUser.accountID);
      setProfile(data);
    } catch (err) {
      showNotification('Failed to load profile details', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setFormData({
      accountName: profile?.accountName || currentUser.accountName,
      accountEmail: profile?.accountEmail || currentUser.accountEmail,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.accountName.trim()) {
      errs.accountName = 'Name cannot be empty';
    } else if (formData.accountName.trim().length < 2) {
      errs.accountName = 'Name must be at least 2 characters';
    }

    if (!formData.accountEmail.trim()) {
      errs.accountEmail = 'Email cannot be empty';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.accountEmail.trim())) {
      errs.accountEmail = 'Invalid email format';
    }

    if (formData.newPassword) {
      if (!formData.oldPassword) {
        errs.oldPassword = 'Must enter current password to set a new password';
      }
      if (formData.newPassword.length < 4) {
        errs.newPassword = 'New password must be at least 4 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const updated = await accountService.updateProfile(currentUser.accountID, {
        accountName: formData.accountName,
        accountEmail: formData.accountEmail,
        oldPassword: formData.oldPassword || null,
        newPassword: formData.newPassword || null,
      });

      showNotification('Profile updated successfully!', 'success');
      setIsEditModalOpen(false);
      setProfile(updated);
      onUserUpdated({
        ...currentUser,
        accountName: updated.accountName,
        accountEmail: updated.accountEmail,
      });
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to update profile', 'danger');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h4 className="fw-bold mb-0 text-dark">
                <i className="bi bi-person-badge-fill text-primary me-2"></i>My Profile
              </h4>
              <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={openEditModal}>
                <i className="bi bi-pencil-square"></i> Edit Profile
              </button>
            </div>

            <div className="card-body p-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : (
                <div className="row g-4 align-items-center">
                  <div className="col-md-4 text-center border-end">
                    <div className="avatar-circle mx-auto mb-3 bg-primary text-white d-flex align-items-center justify-content-center rounded-circle" style={{ width: '90px', height: '90px', fontSize: '2.5rem' }}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <h5 className="fw-bold mb-1">{profile?.accountName || currentUser?.accountName}</h5>
                    <span className={`badge ${currentUser?.accountRole === 1 ? 'bg-danger' : 'bg-info text-dark'}`}>
                      {currentUser?.roleName || (currentUser?.accountRole === 1 ? 'Administrator' : 'Staff Member')}
                    </span>
                  </div>

                  <div className="col-md-8">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item px-0 d-flex justify-content-between py-2">
                        <span className="text-muted"><i className="bi bi-hash me-2"></i>Account ID:</span>
                        <span className="fw-bold">#{profile?.accountID || currentUser?.accountID}</span>
                      </li>
                      <li className="list-group-item px-0 d-flex justify-content-between py-2">
                        <span className="text-muted"><i className="bi bi-person me-2"></i>Full Name:</span>
                        <span className="fw-bold">{profile?.accountName || currentUser?.accountName}</span>
                      </li>
                      <li className="list-group-item px-0 d-flex justify-content-between py-2">
                        <span className="text-muted"><i className="bi bi-envelope me-2"></i>Email Address:</span>
                        <span className="fw-bold">{profile?.accountEmail || currentUser?.accountEmail}</span>
                      </li>
                      <li className="list-group-item px-0 d-flex justify-content-between py-2">
                        <span className="text-muted"><i className="bi bi-shield-check me-2"></i>Role Authority:</span>
                        <span className="fw-bold">
                          {currentUser?.accountRole === 1 ? 'Admin (Role 1)' : 'Staff (Role 2)'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Personal Profile"
        size="md"
        footer={
          <>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsEditModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary d-flex align-items-center gap-2" 
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving && <span className="spinner-border spinner-border-sm" role="status"></span>}
              <i className="bi bi-check-lg"></i> Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className={`form-control ${formErrors.accountName ? 'is-invalid' : ''}`}
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
              value={formData.accountEmail}
              onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
            />
            {formErrors.accountEmail && <div className="invalid-feedback">{formErrors.accountEmail}</div>}
          </div>

          <hr className="my-3" />
          <h6 className="fw-bold text-muted small mb-2">CHANGE PASSWORD (OPTIONAL)</h6>

          <div className="mb-2">
            <label className="form-label small">Current Password</label>
            <input 
              type="password" 
              className={`form-control ${formErrors.oldPassword ? 'is-invalid' : ''}`}
              placeholder="Enter current password to verify"
              value={formData.oldPassword}
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
            />
            {formErrors.oldPassword && <div className="invalid-feedback">{formErrors.oldPassword}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label small">New Password</label>
            <input 
              type="password" 
              className={`form-control ${formErrors.newPassword ? 'is-invalid' : ''}`}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
            {formErrors.newPassword && <div className="invalid-feedback">{formErrors.newPassword}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label small">Confirm New Password</label>
            <input 
              type="password" 
              className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;

