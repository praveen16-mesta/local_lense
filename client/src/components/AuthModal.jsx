import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Key } from 'lucide-react';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose, user, setUser }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpMsg, setOtpMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  if (user) {
    return (
      <div className="modal-overlay">
        <div className="modal-box" style={{ maxWidth: '400px' }}>
          <div className="modal-header">
            <h3>User Profile</h3>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center' }}>
            <div className="avatar-circle" style={{ width: '64px', height: '64px', fontSize: '24px', margin: '0 auto 16px' }}>
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <h4>{user.name || 'Citizen'}</h4>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{user.email}</p>

            <button
              className="btn btn-outline"
              style={{ width: '100%', color: '#ef4444', borderColor: '#fca5a5' }}
              onClick={() => {
                setUser(null);
                onClose();
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data.user || { name: email.split('@')[0], email });
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Check email/password.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post('/api/auth/signup', { name, email, password });
      setUser(res.data.user || { name, email });
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Signup failed.');
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMsg('Please enter your email first.');
      return;
    }
    setErrorMsg('');
    try {
      const res = await axios.post('/api/auth/sendotp', { email });
      setOtpMsg(res.data.message || `OTP sent to ${email}`);
      setMode('otp');
    } catch (err) {
      setErrorMsg('Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post('/api/auth/verify', { email, otp });
      if (res.data.Isverified) {
        setUser({ name: name || email.split('@')[0], email });
        onClose();
      } else {
        setErrorMsg('Invalid or expired OTP code.');
      }
    } catch (err) {
      setErrorMsg('OTP verification error.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <h3>
            {mode === 'login' && 'Log In to LocalLens'}
            {mode === 'signup' && 'Create Citizen Account'}
            {mode === 'otp' && 'Verify OTP Code'}
          </h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {errorMsg && (
            <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', fontSize: '13px', marginBottom: '14px' }}>
              {errorMsg}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                Log In
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
                Don't have an account?{' '}
                <span style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }} onClick={() => setMode('signup')}>
                  Sign Up
                </span>{' '}
                or{' '}
                <span style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }} onClick={handleSendOtp}>
                  Login with OTP
                </span>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="jane.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                Sign Up
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
                Already have an account?{' '}
                <span style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }} onClick={() => setMode('login')}>
                  Log In
                </span>
              </div>
            </form>
          )}

          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <p style={{ fontSize: '13px', color: '#059669', marginBottom: '14px' }}>{otpMsg}</p>
              <div className="form-group">
                <label>4-Digit Verification OTP</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                Verify & Log In
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
                <span style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }} onClick={() => setMode('login')}>
                  Back to Login
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
