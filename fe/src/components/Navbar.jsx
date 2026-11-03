import React from 'react';

const Navbar = ({ currentUser, activeTab, setActiveTab, onLogout, onOpenLogin }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <a 
          className="navbar-brand fw-bold d-flex align-items-center" 
          href="#home"
          onClick={(e) => { e.preventDefault(); setActiveTab('public-news'); }}
        >
          <span className="badge bg-primary me-2">FU</span>
          News Management System
        </a>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${activeTab === 'public-news' ? 'active text-primary fw-bold' : ''}`}
                onClick={() => setActiveTab('public-news')}
              >
                <i className="bi bi-newspaper me-1"></i> Public News
              </button>
            </li>

            {currentUser && currentUser.accountRole === 1 && (
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${activeTab === 'accounts' ? 'active text-primary fw-bold' : ''}`}
                  onClick={() => setActiveTab('accounts')}
                >
                  <i className="bi bi-people-fill me-1"></i> Account Management
                </button>
              </li>
            )}

            {currentUser && currentUser.accountRole === 2 && (
              <>
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link ${activeTab === 'categories' ? 'active text-primary fw-bold' : ''}`}
                    onClick={() => setActiveTab('categories')}
                  >
                    <i className="bi bi-folder-fill me-1"></i> Category Management
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link ${activeTab === 'news-articles' ? 'active text-primary fw-bold' : ''}`}
                    onClick={() => setActiveTab('news-articles')}
                  >
                    <i className="bi bi-file-earmark-text-fill me-1"></i> News Management
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link ${activeTab === 'news-history' ? 'active text-primary fw-bold' : ''}`}
                    onClick={() => setActiveTab('news-history')}
                  >
                    <i className="bi bi-clock-history me-1"></i> My History
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link ${activeTab === 'profile' ? 'active text-primary fw-bold' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="bi bi-person-circle me-1"></i> Profile
                  </button>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-light small">
                  Hi, <strong>{currentUser.accountName}</strong>
                </span>
                <span className={`badge ${currentUser.accountRole === 1 ? 'bg-danger' : 'bg-info text-dark'}`}>
                  {currentUser.roleName || (currentUser.accountRole === 1 ? 'Admin' : 'Staff')}
                </span>
                <button 
                  className="btn btn-outline-light btn-sm ms-2"
                  onClick={onLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-primary btn-sm px-3"
                onClick={onOpenLogin}
              >
                <i className="bi bi-box-arrow-in-right me-1"></i> Member Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

