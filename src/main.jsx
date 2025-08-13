import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';

// Error boundary for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    
    // Send error to Telegram bot if available
    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.sendData(JSON.stringify({
          type: 'error',
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        console.error('Failed to send error to Telegram:', e);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
          color: '#e2e8f0'
        }}>
          <div style={{
            background: 'rgba(30, 30, 50, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            maxWidth: '400px'
          }}>
            <h2 style={{ color: '#ef4444', marginBottom: '15px' }}>⚠️ Something went wrong</h2>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
              We're sorry, but something unexpected happened. Please try refreshing the app.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              🔄 Refresh App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring (simplified version without web-vitals)
const reportWebVitals = (metric) => {
  console.log('Performance Metric:', metric);
  
  // Send performance data to Telegram bot if available
  if (window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.sendData(JSON.stringify({
        type: 'performance',
        metric: metric.name,
        value: metric.value,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Failed to send performance data:', e);
    }
  }
};

// Initialize Telegram Web App
const initializeTelegramApp = () => {
  if (window.Telegram?.WebApp) {
    try {
      const tg = window.Telegram.WebApp;
      
      // Initialize the app
      tg.ready();
      
      // Expand to full height
      tg.expand();
      
      // Set theme to dark
      tg.setHeaderColor('#1a1a2e');
      tg.setBackgroundColor('#0f0f23');
      
      // Enable closing confirmation
      tg.enableClosingConfirmation();
      
      // Set main button if needed
      // tg.MainButton.setText('Submit Reading');
      // tg.MainButton.show();
      
      console.log('✅ Telegram Web App initialized successfully');
      
      // Send app ready signal
      tg.sendData(JSON.stringify({
        type: 'app_ready',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }));
      
    } catch (error) {
      console.error('❌ Failed to initialize Telegram Web App:', error);
    }
  } else {
    console.log('⚠️ Telegram Web App not available - running in browser mode');
  }
};

// Service Worker registration for PWA features
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration);
        })
        .catch((registrationError) => {
          console.log('❌ Service Worker registration failed:', registrationError);
        });
    });
  }
};

// Initialize app
const initializeApp = () => {
  // Initialize Telegram Web App
  initializeTelegramApp();
  
  // Register service worker
  registerServiceWorker();
  
  // Create React root
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  // Render app with error boundary
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  // Simple performance monitoring without web-vitals
  if (process.env.NODE_ENV === 'development') {
    // Monitor basic performance metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loadTime = performance.now();
        reportWebVitals({
          name: 'Load Time',
          value: loadTime
        });
      }, 100);
    });
  }
};

// Start the app
initializeApp();

// Handle visibility change for better performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('📱 App hidden - pausing non-essential operations');
  } else {
    console.log('📱 App visible - resuming operations');
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('🌐 App is online');
  // You could show a notification or sync data here
});

window.addEventListener('offline', () => {
  console.log('📴 App is offline');
  // You could show a notification or enable offline mode here
});

// Handle beforeunload for cleanup
window.addEventListener('beforeunload', () => {
  // Cleanup any resources or send final data
  if (window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.sendData(JSON.stringify({
        type: 'app_closing',
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Failed to send closing signal:', e);
    }
  }
});
