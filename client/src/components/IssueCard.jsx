import React, { useState, useEffect } from 'react';
import { MapPin, ThumbsUp, MessageSquare, AlertCircle, Trash2, Send } from 'lucide-react';
import axios from 'axios';

export default function IssueCard({ issue, currentUser, isAdmin, onStatusChange, onDeleteIssue, onUpvote }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(issue.upvotes ? issue.upvotes.length : 0);

  const userEmail = currentUser ? currentUser.email : 'guest@locallens.org';

  useEffect(() => {
    if (issue.upvotes && Array.isArray(issue.upvotes)) {
      setIsUpvoted(issue.upvotes.includes(userEmail));
      setUpvoteCount(issue.upvotes.length);
    }
  }, [issue, userEmail]);

  const handleUpvoteClick = async () => {
    try {
      const updated = await onUpvote(issue._id, userEmail);
      if (updated) {
        setIsUpvoted(updated.upvotes.includes(userEmail));
        setUpvoteCount(updated.upvotes.length);
      }
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/${issue._id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Fetch comments error:', err);
    }
  };

  const toggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const authorName = currentUser ? currentUser.name || currentUser.email : 'Neighbor';
      const res = await axios.post('/api/comments', {
        issueId: issue._id,
        authorEmail: userEmail,
        authorName,
        text: newComment
      });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Add comment error:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Delete comment error:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return <span className="badge badge-progress">In Progress</span>;
      case 'Resolved':
        return <span className="badge badge-resolved">Resolved</span>;
      default:
        return <span className="badge badge-reported">Reported</span>;
    }
  };

  const formattedDate = new Date(issue.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="issue-card">
      <div className="card-header">
        <div className="card-user-row">
          <div className="user-profile-meta">
            <div className="avatar-circle">
              {(issue.reporterName || 'C')[0].toUpperCase()}
            </div>
            <div>
              <div className="user-name">{issue.reporterName || 'Citizen'}</div>
              <div className="post-time">{formattedDate} • {issue.category}</div>
            </div>
          </div>

          <div className="card-tags">
            {issue.urgency === 'High' && (
              <span className="badge badge-urgency-high">
                <AlertCircle size={12} /> High Priority
              </span>
            )}
            {getStatusBadge(issue.status)}
          </div>
        </div>

        <h3 className="issue-title">{issue.title}</h3>
        <p className="issue-desc">{issue.description}</p>

        <div className="location-badge">
          <MapPin size={16} />
          {issue.location} {issue.distance ? `(${issue.distance})` : ''}
        </div>
      </div>

      {issue.imageUrl && (
        <img
          src={issue.imageUrl}
          alt={issue.title}
          className="issue-media"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      <div className="card-footer">
        <div className="interaction-group">
          <button
            className={`action-btn ${isUpvoted ? 'active-upvote' : ''}`}
            onClick={handleUpvoteClick}
          >
            <ThumbsUp size={16} />
            {upvoteCount} Upvotes
          </button>

          <button className="action-btn" onClick={toggleComments}>
            <MessageSquare size={16} />
            Comments
          </button>
        </div>

        {isAdmin ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              className="admin-status-select"
              value={issue.status}
              onChange={(e) => onStatusChange(issue._id, e.target.value)}
            >
              <option value="Reported">Reported</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <button
              className="action-btn"
              style={{ color: '#ef4444' }}
              onClick={() => onDeleteIssue(issue._id)}
              title="Delete Issue"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : null}
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comment-list">
            {comments.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#64748b' }}>No comments yet. Be the first to reply!</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="comment-item">
                  <div>
                    <div className="comment-author">{c.authorName}</div>
                    <div className="comment-text">{c.text}</div>
                  </div>
                  {(isAdmin || c.authorEmail === userEmail) && (
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <form className="comment-form" onSubmit={handleAddComment}>
            <input
              type="text"
              className="comment-input"
              placeholder="Add a public comment or update..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
