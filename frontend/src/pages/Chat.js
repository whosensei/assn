import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, deductMessageCredit } from '../store/slices/authSlice';
import { 
  setActiveConversation, 
  addMessage, 
  createNewConversation 
} from '../store/slices/chatSlice';
import { 
  toggleNotificationPanel, 
  closeNotificationPanel,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '../store/slices/notificationSlice';
import './Chat.css';

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const messagesEndRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { conversations, activeConversationId } = useSelector((state) => state.chat);
  const { notifications, panelOpen } = useSelector((state) => state.notifications);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const unreadCount = notifications.filter(n => !n.read).length;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Check if user has enough credits
    if (user?.credits < 1) {
      alert('Insufficient credits to send message');
      return;
    }

    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Deduct credit first
    try {
      await dispatch(deductMessageCredit()).unwrap();
    } catch (error) {
      alert('Failed to deduct credit: ' + error);
      return;
    }

    // Add user message
    dispatch(addMessage({
      conversationId: activeConversationId,
      message: {
        id: Date.now(),
        type: 'user',
        content: message.trim(),
        timestamp
      }
    }));

    // Simulate AI response
    setTimeout(() => {
      dispatch(addMessage({
        conversationId: activeConversationId,
        message: {
          id: Date.now() + 1,
          type: 'assistant',
          content: "That's an interesting point. Here's what I think... This is a mock response to demonstrate the chat functionality. In a real application, this would be connected to an actual AI service.",
          timestamp
        }
      }));
    }, 1000);

    setMessage('');
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/signin'); // Force navigation to signin page
  };

  const handleNewChat = () => {
    dispatch(createNewConversation());
  };

  const formatTime = (timeString) => {
    if (timeString === 'Today' || timeString === 'Now') return timeString;
    
    const now = new Date();
    const time = new Date(timeString);
    const diffInHours = (now - time) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return time.toLocaleDateString();
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification._id));
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  return (
    <div className="chat-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Conversations</h2>
          <button 
            className="new-chat-button"
            onClick={handleNewChat}
            title="New Chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="no-conversations">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p className="no-conversations-text">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${activeConversationId === conversation.id ? 'active' : ''}`}
                onClick={() => dispatch(setActiveConversation(conversation.id))}
              >
                <div className="conversation-content">
                  <h3 className="conversation-title">{conversation.title}</h3>
                  <p className="conversation-preview">{conversation.preview}</p>
                </div>
                <span className="conversation-time">{conversation.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-title">
            <h1>AI Chat</h1>
          </div>
          
          <div className="chat-header-actions">
            {/* Credits */}
            <div className={`credits-display ${
              user?.credits <= 0 ? 'no-credits' : 
              user?.credits <= 10 ? 'low-credits' : ''
            }`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>{user?.credits?.toLocaleString() || '1,249'}</span>
            </div>

            {/* Notifications */}
            <div className="notification-container">
              <button
                className="notification-button"
                onClick={() => dispatch(toggleNotificationPanel())}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              {/* Notification Panel */}
              {panelOpen && (
                <div className="notification-panel">
                  <div className="notification-panel-header">
                    <h3>Notifications</h3>
                    <button 
                      className="mark-all-read-button"
                      onClick={handleMarkAllRead}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <p className="no-notifications">No notifications</p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="notification-icon">
                            {notification.type === 'welcome' && (
                              <div className="icon-dot green"></div>
                            )}
                            {notification.type === 'feature_update' && (
                              <div className="icon-dot blue"></div>
                            )}
                          </div>
                          <div className="notification-content">
                            <h4>{notification.title}</h4>
                            <p>{notification.message}</p>
                            <span className="notification-time">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                          {!notification.read && (
                            <div className="unread-indicator"></div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="user-menu-container">
              <button
                className="user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </button>

              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-menu-item user-info">
                    <span>{user?.username || 'User'}</span>
                  </div>
                  <button className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Settings
                  </button>
                  <button 
                    className="user-menu-item" 
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16,17 21,12 16,7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="chat-content">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h2 className="welcome-title">Welcome to AI Chat</h2>
              <p className="welcome-subtitle">
                Start a conversation with our AI assistant. Ask questions, get help with tasks, or explore ideas together.
              </p>
              
              <div className="suggestion-buttons">
                <button className="suggestion-button" onClick={() => setMessage("Explain quantum computing in simple terms")}>
                  <span>📚</span>
                  Explain quantum computing in simple terms
                </button>
                <button className="suggestion-button" onClick={() => setMessage("Write a Python function to sort a list")}>
                  <span>💻</span>
                  Write a Python function to sort a list
                </button>
                <button className="suggestion-button" onClick={() => setMessage("What are the benefits of meditation?")}>
                  <span>🧘</span>
                  What are the benefits of meditation?
                </button>
                <button className="suggestion-button" onClick={() => setMessage("Help me plan a weekend trip to Paris")}>
                  <span>✈️</span>
                  Help me plan a weekend trip to Paris
                </button>
              </div>
            </div>
          ) : (
            <div className="messages-container">
              {activeConversation.messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.type}`}>
                  <div className="message-avatar">
                    {msg.type === 'user' ? (
                      <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">
                        {msg.type === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                    <div className="message-text">{msg.content}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="message-input-container">
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              className="message-input"
              placeholder="Ask me anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button 
              type="submit" 
              className="send-button" 
              disabled={!message.trim() || user?.credits < 1}
              title={user?.credits < 1 ? 'Insufficient credits' : ''}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2"/>
              </svg>
            </button>
          </form>
          <p className="input-footer">
            {user?.credits < 1 ? (
              <span style={{color: '#dc2626'}}>No credits remaining - Cannot send messages</span>
            ) : user?.credits <= 10 ? (
              <span style={{color: '#f59e0b'}}>Low credits ({user.credits} remaining)</span>
            ) : (
              'Press Enter to send, Shift+Enter for new line'
            )}
          </p>
          <div className="character-count">0/2000</div>
        </div>
      </div>

      {/* Overlay for closing panels */}
      {(panelOpen || showUserMenu) && (
        <div 
          className="overlay" 
          onClick={() => {
            dispatch(closeNotificationPanel());
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default Chat;