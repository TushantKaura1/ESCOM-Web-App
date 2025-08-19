import React, { useState, useEffect, useRef } from 'react';
import './DynamicBotHelper.css';

const DynamicBotHelper = ({ userRole, currentSection, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);

  // Context-aware suggestions based on user role and current section
  const getContextSuggestions = () => {
    const baseSuggestions = [
      "How can I help you today?",
      "Need assistance with something specific?",
      "What would you like to know?"
    ];

    if (userRole === 'admin') {
      const adminSuggestions = {
        'dashboard': [
          "View system statistics",
          "Check recent activity",
          "Generate quick reports"
        ],
        'users': [
          "Add new user",
          "Edit user permissions",
          "View user analytics"
        ],
        'faqs': [
          "Add new FAQ",
          "Edit existing questions",
          "Organize FAQ categories"
        ],
        'analytics': [
          "Generate data reports",
          "View trend analysis",
          "Export data"
        ],
        'settings': [
          "Configure notifications",
          "Set backup schedules",
          "Manage system preferences"
        ]
      };
      return adminSuggestions[currentSection] || baseSuggestions;
    } else {
      const userSuggestions = {
        'monitoring': [
          "Submit water quality data",
          "View monitoring history",
          "Check data accuracy"
        ],
        'learning': [
          "Access training materials",
          "Find reference guides",
          "Watch tutorial videos"
        ],
        'community': [
          "Share observations",
          "Connect with other scientists",
          "Join discussions"
        ]
      };
      return userSuggestions[currentSection] || baseSuggestions;
    }
  };

  // Initialize bot with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      type: 'bot',
      content: `Hello! I'm your AI assistant. I can help you with ${userRole === 'admin' ? 'admin tasks' : 'citizen science activities'}. What would you like to know?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setSuggestions(getContextSuggestions());
  }, [userRole, currentSection]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate intelligent bot response
  const generateBotResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    let response = '';
    const lowerMessage = userMessage.toLowerCase();

    // Context-aware responses
    if (userRole === 'admin') {
      if (lowerMessage.includes('user') || lowerMessage.includes('add') || lowerMessage.includes('create')) {
        response = "To add a new user, go to User Management and click the 'Add New User' button. You can set their role, team, and permissions there.";
      } else if (lowerMessage.includes('faq') || lowerMessage.includes('question')) {
        response = "For FAQ management, navigate to the FAQ section. You can edit existing questions, add new ones, or organize them by categories.";
      } else if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
        response = "Reports and analytics are available in the Data Analytics section. You can generate monthly reports, view trends, and export data.";
      } else if (lowerMessage.includes('setting') || lowerMessage.includes('config')) {
        response = "System settings are in the Settings tab. You can configure notifications, backups, data retention, and other system preferences.";
      } else if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
        response = "To delete users or content, use the respective management sections. Remember to confirm deletions as they cannot be undone.";
      } else {
        response = "I can help you with user management, FAQ editing, report generation, system settings, and more. What specific task do you need help with?";
      }
    } else {
      if (lowerMessage.includes('water') || lowerMessage.includes('monitor') || lowerMessage.includes('data')) {
        response = "For water quality monitoring, go to the Monitoring section. You can submit new readings, view your history, and track trends over time.";
      } else if (lowerMessage.includes('learn') || lowerMessage.includes('train') || lowerMessage.includes('guide')) {
        response = "Learning resources are available in the Learning section. You'll find manuals, videos, podcasts, and reference materials to help you.";
      } else if (lowerMessage.includes('community') || lowerMessage.includes('share') || lowerMessage.includes('discuss')) {
        response = "Join the community in the Community section! Share your observations, ask questions, and connect with other citizen scientists.";
      } else if (lowerMessage.includes('accuracy') || lowerMessage.includes('quality')) {
        response = "Data quality is important! Make sure to follow the monitoring protocols, calibrate your instruments, and double-check your readings.";
      } else {
        response = "I can help you with monitoring procedures, learning resources, community features, and data submission. What would you like to know more about?";
      }
    }

    const botMessage = {
      id: messages.length + 2,
      type: 'bot',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Generate bot response
    await generateBotResponse(inputMessage);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return (
      <div className="bot-helper-minimized" onClick={toggleMinimize}>
        <span>🤖</span>
        <span>Need help?</span>
      </div>
    );
  }

  return (
    <div className="bot-helper">
      <div className="bot-header">
        <div className="bot-title">
          <span className="bot-avatar">🤖</span>
          <span>AI Assistant</span>
        </div>
        <div className="bot-controls">
          <button className="minimize-btn" onClick={toggleMinimize}>−</button>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="bot-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bot-suggestions">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-btn"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form className="bot-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything..."
          className="bot-input"
        />
        <button type="submit" className="bot-send-btn" disabled={!inputMessage.trim()}>
          ➤
        </button>
      </form>
    </div>
  );
};

export default DynamicBotHelper;
