import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/slices/authSlice';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Chat from './pages/Chat';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, token } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, token, isAuthenticated]);

  // Fallback redirect: if we're on a protected route and not authenticated,
  // ensure we navigate to /signin (covers edge cases after logout)
  useEffect(() => {
    const onProtectedRoute = location.pathname.startsWith('/chat');
    if (!isAuthenticated && !isLoading && onProtectedRoute) {
      navigate('/signin', { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/signin" 
          element={!isAuthenticated ? <SignIn /> : <Navigate to="/chat" />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/chat" />} 
        />
        <Route 
          path="/chat" 
          element={isAuthenticated ? <Chat /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/chat" : "/signin"} />} 
        />
      </Routes>
    </div>
  );
}

export default App;