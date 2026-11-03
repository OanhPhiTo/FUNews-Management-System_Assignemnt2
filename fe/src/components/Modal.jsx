import React from 'react';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'lg' }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}
      role="dialog"
    >
      <div className={`modal-dialog modal-dialog-centered modal-${size}`} role="document">
        <div className="modal-content shadow-lg border-0 rounded-3">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-dark">{title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body p-4">
            {children}
          </div>
          {footer && (
            <div className="modal-footer bg-light">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

