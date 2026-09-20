import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import TrendingBanner from './components/TrendingBanner';
import IssueCard from './components/IssueCard';
import CreateIssueModal from './components/CreateIssueModal';
import AuthModal from './components/AuthModal';
import { CameraOff } from 'lucide-react';

export default function App() {
  const [issues, setIssues] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/issues', {
        params: {
          category: activeCategory,
          search: search
        }
      });
      setIssues(res.data);
    } catch (err) {
      console.error('Fetch issues error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [activeCategory, search]);

  const handleIssueCreated = (newIssue) => {
    setIssues([newIssue, ...issues]);
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const res = await axios.patch(`/api/issues/${issueId}/status`, { status: newStatus });
      setIssues(issues.map(i => i._id === issueId ? res.data : i));
    } catch (err) {
      console.error('Status change error:', err);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      await axios.delete(`/api/issues/${issueId}`);
      setIssues(issues.filter(i => i._id !== issueId));
    } catch (err) {
      console.error('Delete issue error:', err);
    }
  };

  const handleUpvote = async (issueId, userEmail) => {
    try {
      const res = await axios.post(`/api/issues/${issueId}/upvote`, { userEmail });
      setIssues(issues.map(i => i._id === issueId ? res.data : i));
      return res.data;
    } catch (err) {
      console.error('Upvote error:', err);
      return null;
    }
  };

  return (
    <div>
      <Navbar
        search={search}
        setSearch={setSearch}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      <CategoryBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <main className="main-container">
        <TrendingBanner issues={issues} />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            Loading community feed...
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-state">
            <CameraOff className="empty-state-icon" />
            <h3>No Issues Found</h3>
            <p>
              {search
                ? `No reports matching "${search}".`
                : activeCategory !== 'All'
                ? `No issues reported in "${activeCategory}" yet.`
                : 'No community issues have been reported yet. Be the first to submit one!'}
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '16px' }}
              onClick={() => setIsCreateOpen(true)}
            >
              Report New Issue
            </button>
          </div>
        ) : (
          issues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              currentUser={user}
              isAdmin={isAdmin}
              onStatusChange={handleStatusChange}
              onDeleteIssue={handleDeleteIssue}
              onUpvote={handleUpvote}
            />
          ))
        )}
      </main>

      <CreateIssueModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onIssueCreated={handleIssueCreated}
        currentUser={user}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        setUser={setUser}
      />
    </div>
  );
}
