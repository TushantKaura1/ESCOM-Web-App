import React, { useState, useEffect } from 'react';
import './DailyUpdatesManager.css';

const DailyUpdatesManager = ({ userRole }) => {
  const [updates, setUpdates] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'medium',
    tags: [],
    media: [],
    scheduledDate: '',
    expirationDate: '',
    autoExpire: false
  });

  // Load updates from localStorage or demo data
  useEffect(() => {
    const savedUpdates = localStorage.getItem('dailyUpdates');
    if (savedUpdates) {
      setUpdates(JSON.parse(savedUpdates));
    } else {
      // Demo data
      const demoUpdates = [
        {
          id: 1,
          title: 'New Water Quality Monitoring Protocol',
          content: 'We have updated our water quality monitoring protocols to include additional parameters for better environmental assessment.',
          type: 'protocol',
          priority: 'high',
          tags: ['protocol', 'monitoring', 'water-quality'],
          media: [],
          scheduledDate: '2024-01-20',
          expirationDate: '2024-12-31',
          autoExpire: true,
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
          author: 'Admin Team',
          viewCount: 45,
          status: 'active'
        },
        {
          id: 2,
          title: 'Community Science Workshop',
          content: 'Join us for a hands-on workshop on data collection and analysis techniques. Open to all citizen scientists.',
          type: 'event',
          priority: 'medium',
          tags: ['workshop', 'training', 'community'],
          media: [],
          scheduledDate: '2024-02-15',
          expirationDate: '2024-02-15',
          autoExpire: true,
          createdAt: '2024-01-18T14:30:00Z',
          updatedAt: '2024-01-18T14:30:00Z',
          author: 'Training Team',
          viewCount: 32,
          status: 'active'
        }
      ];
      setUpdates(demoUpdates);
      localStorage.setItem('dailyUpdates', JSON.stringify(demoUpdates));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updateData = {
      ...formData,
      id: editingUpdate ? editingUpdate.id : Date.now(),
      createdAt: editingUpdate ? editingUpdate.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: userRole === 'admin' ? 'Admin User' : 'System',
      viewCount: editingUpdate ? editingUpdate.viewCount : 0,
      status: 'active'
    };

    if (editingUpdate) {
      // Edit existing update
      const updatedUpdates = updates.map(update => 
        update.id === editingUpdate.id ? updateData : update
      );
      setUpdates(updatedUpdates);
      localStorage.setItem('dailyUpdates', JSON.stringify(updatedUpdates));
      setEditingUpdate(null);
    } else {
      // Add new update
      const newUpdates = [updateData, ...updates];
      setUpdates(newUpdates);
      localStorage.setItem('dailyUpdates', JSON.stringify(newUpdates));
    }

    // Reset form
    setFormData({
      title: '',
      content: '',
      type: 'general',
      priority: 'medium',
      tags: [],
      media: [],
      scheduledDate: '',
      expirationDate: '',
      autoExpire: false
    });
    setShowAddForm(false);
  };

  const handleEdit = (update) => {
    setEditingUpdate(update);
    setFormData({
      title: update.title,
      content: update.content,
      type: update.type,
      priority: update.priority,
      tags: update.tags,
      media: update.media,
      scheduledDate: update.scheduledDate,
      expirationDate: update.expirationDate,
      autoExpire: update.autoExpire
    });
    setShowAddForm(true);
  };

  const handleDelete = (updateId) => {
    if (window.confirm('Are you sure you want to delete this update?')) {
      const filteredUpdates = updates.filter(update => update.id !== updateId);
      setUpdates(filteredUpdates);
      localStorage.setItem('dailyUpdates', JSON.stringify(filteredUpdates));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'protocol': return '📋';
      case 'event': return '📅';
      case 'announcement': return '📢';
      case 'maintenance': return '🔧';
      default: return '📝';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="daily-updates-manager">
      <div className="updates-header">
        <h2>📢 Daily Updates & Announcements</h2>
        {userRole === 'admin' && (
          <button 
            className="add-update-btn"
            onClick={() => setShowAddForm(true)}
          >
            ➕ Add Update
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingUpdate) && (
        <div className="update-form-overlay">
          <div className="update-form-modal">
            <div className="form-header">
              <h3>{editingUpdate ? '✏️ Edit Update' : '➕ Add New Update'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingUpdate(null);
                  setFormData({
                    title: '',
                    content: '',
                    type: 'general',
                    priority: 'medium',
                    tags: [],
                    media: [],
                    scheduledDate: '',
                    expirationDate: '',
                    autoExpire: false
                  });
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="update-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter update title"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="content">Content *</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Enter update content"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="general">General</option>
                    <option value="protocol">Protocol</option>
                    <option value="event">Event</option>
                    <option value="announcement">Announcement</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="scheduledDate">Scheduled Date</label>
                  <input
                    type="date"
                    id="scheduledDate"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expirationDate">Expiration Date</label>
                  <input
                    type="date"
                    id="expirationDate"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tags-container">
                  {formData.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="remove-tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type tag and press Enter"
                  onKeyPress={handleTagInput}
                  className="tag-input"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="autoExpire"
                    checked={formData.autoExpire}
                    onChange={handleInputChange}
                  />
                  Auto-expire after expiration date
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingUpdate ? '💾 Update' : '➕ Add Update'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingUpdate(null);
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Updates List */}
      <div className="updates-list">
        {updates.length === 0 ? (
          <div className="no-updates">
            <p>No updates available at the moment.</p>
          </div>
        ) : (
          updates.map(update => (
            <div key={update.id} className="update-card">
              <div className="update-header">
                <div className="update-meta">
                  <span className="update-type">
                    {getTypeIcon(update.type)} {update.type}
                  </span>
                  <span 
                    className="update-priority"
                    style={{ backgroundColor: getPriorityColor(update.priority) }}
                  >
                    {update.priority}
                  </span>
                </div>
                <div className="update-actions">
                  {userRole === 'admin' && (
                    <>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(update)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(update.id)}
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h3 className="update-title">{update.title}</h3>
              <p className="update-content">{update.content}</p>

              {update.tags.length > 0 && (
                <div className="update-tags">
                  {update.tags.map(tag => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="update-footer">
                <div className="update-info">
                  <span>📅 {formatDate(update.scheduledDate)}</span>
                  <span>👤 {update.author}</span>
                  <span>👁️ {update.viewCount} views</span>
                </div>
                {update.expirationDate && (
                  <span className="expiration">
                    ⏰ Expires: {formatDate(update.expirationDate)}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyUpdatesManager;
