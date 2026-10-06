import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { DASHBOARD_BY_ROLE, normalizeRole } from '../../constants/roles.js';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setMessage({ text: '', type: '' });
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      /* login() finds the user by email, checks the password,
         and returns { id, name, email, role, ... } */
      const user = await login({
        email: form.email,
        password: form.password,
      });

      setMessage({
        text: `Welcome back, ${user.name}! Redirecting to your dashboard…`,
        type: 'success',
      });

      /* Redirect based on role stored on the user record */
      const role = normalizeRole(user.role);
      const target = DASHBOARD_BY_ROLE[role];
      if (!target) throw new Error('This account does not have a supported dashboard role');
      setLoading(false);
      navigate(target, { replace: true });
    } catch (err) {
      setMessage({ text: err.message || 'Login failed', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* ---------- Left brand panel ---------- */}
        <div className="auth-brand">
          <h1>
            <i className="fas fa-paw"></i> VetraCare
          </h1>
          <p>
            Sign in with your email and we'll take you straight to the
            dashboard built for your role.
          </p>
          <ul className="auth-features">
            <li><i className="fas fa-user-shield"></i> Admin &amp; security controls</li>
            <li><i className="fas fa-user-doctor"></i> Vet clinical workspace</li>
            <li><i className="fas fa-flask-vial"></i> Lab sample tracking</li>
            <li><i className="fas fa-headset"></i> Front-desk operations</li>
            <li><i className="fas fa-pills"></i> Pharmacy dispensing</li>
            <li><i className="fas fa-paw"></i> Pet owner portal</li>
          </ul>
        </div>

        {/* ---------- Right form panel ---------- */}
        <div className="auth-form-panel">
          <h2>Welcome back</h2>
          <p className="subtitle">
            Enter your email — we'll detect your role automatically
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label>Email address</label>
              <div className="input-wrap">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@vetcare.com"
                  autoComplete="email"
                  autoFocus
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Signing in…
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i> Sign in
                </>
              )}
            </button>
          </form>

          {/* Message */}
          {message.text && (
            <div className={`auth-message ${message.type}`}>{message.text}</div>
          )}

          {/* Switch to register */}
          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}