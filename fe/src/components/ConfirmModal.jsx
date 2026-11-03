import React from 'react';
import Modal from './Modal';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = "Confirm Deletion", message, confirmText = "Delete", isDeleting = false }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <>
          <button 
            type="button" 
            className="btn btn-secondary px-3" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger px-3 d-flex align-items-center gap-2" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <span className="spinner-border spinner-border-sm" role="status"></span>}
            <i className="bi bi-trash3-fill"></i> {confirmText}
          </button>
        </>
      }
    >
      <div className="text-center py-3">
        <div className="text-danger mb-3">
          <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '3rem' }}></i>
        </div>
        <h5 className="fw-bold mb-2">Are you sure?</h5>
        <p className="text-muted mb-0">{message || "This action cannot be undone."}</p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

