import React, { useState } from 'react';
import { authService } from '../services/authService';
import Modal from '../components/Modal';

const LoginPage = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      onLoginSuccess(data);
      onClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else if (err.response && err.response.status === 500) {
        setErrorMessage('Server Error (500). Please check backend database logs.');
      } else {
        setErrorMessage('Cannot connect to Backend (http://localhost:8080). Please ensure Backend is running in IntelliJ.');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrors({});
    setErrorMessage('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="FUNews Member Authentication"
      size="md"
    >
      {errorMessage && (
        <div className="alert alert-danger py-2 small" role="alert">
          <i className="bi bi-exclamation-circle-fill me-1"></i> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Email Address <span className="text-danger">*</span></label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
            <input 
              type="email" 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="e.g. admin@fpt.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Password <span className="text-danger">*</span></label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-lock"></i></span>
            <input 
              type="password" 
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
          disabled={loading}
        >
          {loading && <span className="spinner-border spinner-border-sm" role="status"></span>}
          <i className="bi bi-box-arrow-in-right"></i> Sign In
        </button>
      </form>

      {/* Quick Credentials Helper for Testing */}
      <div className="mt-4 pt-3 border-top">
        <p className="text-muted small fw-bold mb-2">QUICK TEST ACCOUNTS:</p>
        <div className="d-flex gap-2 flex-wrap">
          <button 
            type="button" 
            className="btn btn-outline-danger btn-sm"
            onClick={() => quickFill('admin@fpt.edu.vn', 'admin123')}
          >
            Admin (Role 1)
          </button>
          <button 
            type="button" 
            className="btn btn-outline-info text-dark btn-sm"
            onClick={() => quickFill('staff1@fpt.edu.vn', 'staff123')}
          >
            Staff 1 (Role 2)
          </button>
          <button 
            type="button" 
            className="btn btn-outline-info text-dark btn-sm"
            onClick={() => quickFill('staff2@fpt.edu.vn', 'staff123')}
          >
            Staff 2 (Role 2)
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginPage;

