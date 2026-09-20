import React from 'react';
import { Camera, Search, PlusCircle, User, ShieldCheck } from 'lucide-react';

export default function Navbar({ search, setSearch, onOpenCreate, onOpenAuth, user, isAdmin, setIsAdmin }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-brand" onClick={() => setSearch('')}>
          <div className="logo-badge">
            <Camera size={24} />
          </div>
          <span className="logo-title">LocalLens</span>
        </div>

        <div className="header-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search community issues, location, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="header-actions">
          <button
            className={`btn ${isAdmin ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={() => setIsAdmin(!isAdmin)}
            title="Toggle Admin Mode"
          >
            <ShieldCheck size={16} />
            {isAdmin ? 'Admin View' : 'Citizen View'}
          </button>

          <button className="btn btn-primary" onClick={onOpenCreate}>
            <PlusCircle size={18} />
            Report Issue
          </button>

          <button className="btn btn-outline" onClick={onOpenAuth}>
            <User size={18} />
            {user ? user.name || user.email : 'Login'}
          </button>
        </div>
      </div>
    </header>
  );
}
