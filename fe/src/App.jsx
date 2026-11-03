import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PublicNewsPage from './pages/PublicNewsPage';
import LoginPage from './pages/LoginPage';
import AccountManagementPage from './pages/AccountManagementPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import NewsArticleManagementPage from './pages/NewsArticleManagementPage';
import NewsHistoryPage from './pages/NewsHistoryPage';
import ProfilePage from './pages/ProfilePage';
import { authService } from './services/authService';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('public-news');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showNotification(`Welcome back, ${user.accountName}!`, 'success');
    if (user.accountRole === 1) {
      setActiveTab('accounts');
    } else {
      setActiveTab('news-articles');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTab('public-news');
    showNotification('You have logged out successfully.', 'info');
  };

  const handleUserUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('funews_user', JSON.stringify(updatedUser));
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Top Navbar */}
      <Navbar 
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Toast Notification Banner */}
      {notification && (
        <div className="container mt-3">
          <div className={`alert alert-${notification.type} alert-dismissible fade show shadow-sm`} role="alert">
            <i className={`bi ${notification.type === 'success' ? 'bi-check-circle-fill' : notification.type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} me-2`}></i>
            {notification.message}
            <button type="button" className="btn-close" onClick={() => setNotification(null)} aria-label="Close"></button>
          </div>
        </div>
      )}

      {/* Main Content Area based on Tab */}
      <main className="flex-grow-1">
        {activeTab === 'public-news' && (
          <PublicNewsPage />
        )}

        {activeTab === 'accounts' && currentUser?.accountRole === 1 && (
          <AccountManagementPage showNotification={showNotification} />
        )}

        {activeTab === 'categories' && currentUser?.accountRole === 2 && (
          <CategoryManagementPage showNotification={showNotification} />
        )}

        {activeTab === 'news-articles' && currentUser?.accountRole === 2 && (
          <NewsArticleManagementPage currentUser={currentUser} showNotification={showNotification} />
        )}

        {activeTab === 'news-history' && currentUser?.accountRole === 2 && (
          <NewsHistoryPage currentUser={currentUser} showNotification={showNotification} />
        )}

        {activeTab === 'profile' && currentUser && (
          <ProfilePage 
            currentUser={currentUser} 
            onUserUpdated={handleUserUpdated} 
            showNotification={showNotification} 
          />
        )}
      </main>

      {/* Login Popup Dialog */}
      <LoginPage 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer className="bg-white border-top py-3 mt-5">
        <div className="container text-center text-muted small">
          <p className="mb-1">
            <strong>FUNewsManagementSystem</strong> — Assignment 02 SBA301 (Spring Boot 3 + ReactJS).
          </p>
          <p className="mb-0">
            Database: <code>A2StudentName_ClassCode</code> • 3-Layer Repository Architecture • Axios HTTP Client
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

