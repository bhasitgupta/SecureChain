import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import './UIDLogin.css';

export default function UIDLogin({ onSuccess }) {
  const { loginWithUID } = useAuth();
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uid.trim() || !password.trim()) {
      setError('Please enter both UID and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await loginWithUID(uid.trim(), password);
      onSuccess?.(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="uid-login" onSubmit={handleSubmit}>
      <div className="uid-field">
        <label htmlFor="uid-input" className="uid-label">User ID</label>
        <div className="uid-input-wrap">
          <User size={16} className="uid-input-icon" />
          <input
            id="uid-input"
            type="text"
            placeholder="Enter your User ID"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="uid-input"
            autoComplete="username"
          />
        </div>
      </div>

      <div className="uid-field">
        <label htmlFor="pwd-input" className="uid-label">Password</label>
        <div className="uid-input-wrap">
          <Lock size={16} className="uid-input-icon" />
          <input
            id="pwd-input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="uid-input"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="uid-toggle-pwd"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="uid-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary uid-submit-btn"
        disabled={loading}
      >
        {loading ? (
          <><Loader2 size={16} className="spin" /> Authenticating...</>
        ) : (
          'Login'
        )}
      </button>

      <p className="uid-forgot">
        Forgot password? Contact your system administrator.
      </p>
    </form>
  );
}
