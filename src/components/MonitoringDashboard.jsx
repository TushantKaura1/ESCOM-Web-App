import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import './MonitoringDashboard.css';

function MonitoringDashboard({ user, onLogout, onSectionChange }) {
  const { readings, addReading, updateReading, deleteReading, refreshData } = useData();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddReading, setShowAddReading] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [newReading, setNewReading] = useState({
    parameter: 'temperature',
    value: '',
    unit: '°C',
    location: {
      latitude: '',
      longitude: '',
      village: ''
    },
    notes: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });

  // Filter readings for current user
  const userReadings = readings?.filter(reading => reading.userId === user.id) || [];
  
  // Calculate user statistics
  const userStats = {
    totalReadings: userReadings.length,
    lastReading: userReadings.length > 0 ? userReadings[0].timestamp : null,
    averageAccuracy: userReadings.length > 0 
      ? (userReadings.reduce((sum, r) => sum + (r.accuracy || 0), 0) / userReadings.length).toFixed(1)
      : 0,
    parameters: [...new Set(userReadings.map(r => r.parameter))],
    locations: [...new Set(userReadings.map(r => r.location?.village).filter(Boolean))]
  };

  useEffect(() => {
    console.log('🌊 MonitoringDashboard mounted for user:', user.id);
    console.log('📊 User readings:', userReadings.length);
  }, [user, readings]);

  const handleSubmitReading = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const readingData = {
        ...newReading,
        userId: user.id,
        value: parseFloat(newReading.value),
        accuracy: Math.random() * 20 + 80 // Simulated accuracy between 80-100%
      };

      console.log('📝 Submitting reading:', readingData);
      await addReading(readingData);
      
      setSuccessMessage('Reading submitted successfully!');
      setShowAddReading(false);
      setNewReading({
        parameter: 'temperature',
        value: '',
        unit: '°C',
        location: {
          latitude: '',
          longitude: '',
          village: ''
        },
        notes: '',
        timestamp: new Date().toISOString().slice(0, 16)
      });
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('❌ Error submitting reading:', error);
      setError('Failed to submit reading. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReading = async (readingId) => {
    if (window.confirm('Are you sure you want to delete this reading?')) {
      setLoading(true);
      try {
        await deleteReading(readingId);
        setSuccessMessage('Reading deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        setError('Failed to delete reading. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderDashboard = () => (
    <div className="monitoring-dashboard">
      <div className="dashboard-header">
        <h2>📊 My Monitoring Data</h2>
        <p>Track your environmental monitoring contributions</p>
      </div>

      {successMessage && (
        <div className="success-message">
          ✅ {successMessage}
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{userStats.totalReadings}</h3>
            <p>Total Readings</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{userStats.averageAccuracy}%</h3>
            <p>Average Accuracy</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <h3>{userStats.locations.length}</h3>
            <p>Locations Monitored</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔬</div>
          <div className="stat-content">
            <h3>{userStats.parameters.length}</h3>
            <p>Parameters Tracked</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button 
          className="action-btn primary"
          onClick={() => setShowAddReading(true)}
        >
          ➕ Add New Reading
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => setActiveTab('history')}
        >
          📋 View History
        </button>
      </div>

      {userStats.lastReading && (
        <div className="recent-activity">
          <h3>📅 Recent Activity</h3>
          <div className="activity-item">
            <span className="activity-icon">🌡️</span>
            <div className="activity-content">
              <p><strong>Last Reading:</strong> {new Date(userStats.lastReading).toLocaleDateString()}</p>
              <p>Keep up the great work monitoring our coastal environment!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAddReading = () => (
    <div className="add-reading-form">
      <div className="form-header">
        <h2>📝 Submit New Reading</h2>
        <button 
          className="close-btn"
          onClick={() => setShowAddReading(false)}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmitReading} className="reading-form">
        <div className="form-section">
          <h3>Measurement Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Parameter *</label>
              <select
                value={newReading.parameter}
                onChange={(e) => {
                  const param = e.target.value;
                  setNewReading({
                    ...newReading,
                    parameter: param,
                    unit: param === 'temperature' ? '°C' : 
                          param === 'ph' ? 'pH' :
                          param === 'salinity' ? 'PSU' : 'mg/L'
                  });
                }}
                required
                className="form-input"
              >
                <option value="temperature">Temperature</option>
                <option value="ph">pH Level</option>
                <option value="salinity">Salinity</option>
                <option value="dissolved_oxygen">Dissolved Oxygen</option>
                <option value="turbidity">Turbidity</option>
                <option value="nitrate">Nitrate</option>
                <option value="phosphate">Phosphate</option>
              </select>
            </div>

            <div className="form-group">
              <label>Value *</label>
              <input
                type="number"
                step="0.01"
                value={newReading.value}
                onChange={(e) => setNewReading({...newReading, value: e.target.value})}
                required
                className="form-input"
                placeholder="Enter measurement value"
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <input
                type="text"
                value={newReading.unit}
                onChange={(e) => setNewReading({...newReading, unit: e.target.value})}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Timestamp *</label>
            <input
              type="datetime-local"
              value={newReading.timestamp}
              onChange={(e) => setNewReading({...newReading, timestamp: e.target.value})}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Location Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Village/Location *</label>
              <input
                type="text"
                value={newReading.location.village}
                onChange={(e) => setNewReading({
                  ...newReading,
                  location: {...newReading.location, village: e.target.value}
                })}
                required
                className="form-input"
                placeholder="e.g., Beach Point A, Village Center"
              />
            </div>

            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                step="0.000001"
                value={newReading.location.latitude}
                onChange={(e) => setNewReading({
                  ...newReading,
                  location: {...newReading.location, latitude: e.target.value}
                })}
                className="form-input"
                placeholder="e.g., 19.0760"
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                step="0.000001"
                value={newReading.location.longitude}
                onChange={(e) => setNewReading({
                  ...newReading,
                  location: {...newReading.location, longitude: e.target.value}
                })}
                className="form-input"
                placeholder="e.g., 72.8777"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={newReading.notes}
              onChange={(e) => setNewReading({...newReading, notes: e.target.value})}
              rows="3"
              className="form-input"
              placeholder="Any additional observations or notes..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : '📊 Submit Reading'}
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => setShowAddReading(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderHistory = () => (
    <div className="readings-history">
      <div className="history-header">
        <h2>📋 My Reading History</h2>
        <div className="history-stats">
          <span>Total: {userReadings.length} readings</span>
        </div>
      </div>

      {userReadings.length === 0 ? (
        <div className="no-readings">
          <div className="no-readings-icon">📊</div>
          <h3>No readings yet</h3>
          <p>Start monitoring by submitting your first reading!</p>
          <button 
            className="action-btn primary"
            onClick={() => setShowAddReading(true)}
          >
            ➕ Add First Reading
          </button>
        </div>
      ) : (
        <div className="readings-list">
          {userReadings.map((reading) => (
            <div key={reading.id} className="reading-card">
              <div className="reading-header">
                <div className="reading-parameter">
                  <span className="parameter-icon">
                    {reading.parameter === 'temperature' ? '🌡️' :
                     reading.parameter === 'ph' ? '🧪' :
                     reading.parameter === 'salinity' ? '🌊' :
                     reading.parameter === 'dissolved_oxygen' ? '💨' :
                     reading.parameter === 'turbidity' ? '🌫️' :
                     reading.parameter === 'nitrate' ? '🧬' :
                     reading.parameter === 'phosphate' ? '⚗️' : '📊'}
                  </span>
                  <span className="parameter-name">
                    {reading.parameter.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="reading-actions">
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteReading(reading.id)}
                    disabled={loading}
                    title="Delete reading"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="reading-content">
                <div className="reading-value">
                  <span className="value">{reading.value}</span>
                  <span className="unit">{reading.unit}</span>
                </div>
                
                <div className="reading-details">
                  <div className="detail-item">
                    <span className="detail-label">📍 Location:</span>
                    <span className="detail-value">{reading.location?.village || 'Not specified'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">📅 Date:</span>
                    <span className="detail-value">
                      {new Date(reading.timestamp).toLocaleDateString()} at {new Date(reading.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {reading.accuracy && (
                    <div className="detail-item">
                      <span className="detail-label">🎯 Accuracy:</span>
                      <span className="detail-value">{reading.accuracy.toFixed(1)}%</span>
                    </div>
                  )}
                  
                  {reading.location?.latitude && reading.location?.longitude && (
                    <div className="detail-item">
                      <span className="detail-label">🗺️ Coordinates:</span>
                      <span className="detail-value">
                        {reading.location.latitude}, {reading.location.longitude}
                      </span>
                    </div>
                  )}
                  
                  {reading.notes && (
                    <div className="detail-item notes">
                      <span className="detail-label">📝 Notes:</span>
                      <span className="detail-value">{reading.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="monitoring-dashboard-container">
      <div className="monitoring-header">
        <div className="header-left">
          <div className="dashboard-logo">
            <img src="/escom-logo.png" alt="ESCOM Logo" className="logo-image" />
            <h2>Monitoring Dashboard</h2>
          </div>
        </div>
        <div className="header-right">
          <button onClick={() => onSectionChange('dashboard')} className="back-btn">
            ← Back to Dashboard
          </button>
          <button onClick={() => onLogout()} className="logout-btn">
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>

      <div className="monitoring-nav">
        <button 
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 History
        </button>
      </div>

      <div className="monitoring-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'history' && renderHistory()}
        {showAddReading && renderAddReading()}
      </div>
    </div>
  );
}

export default MonitoringDashboard;
