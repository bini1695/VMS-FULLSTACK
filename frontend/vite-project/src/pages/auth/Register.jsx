import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES, BRANCHES, DASHBOARD_BY_ROLE } from '../../constants/roles.js';
import './Auth.css';

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  branch: 'Riverside',
  password: '',
  confirmPassword: '',
  role: '',
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setMessage({ text: '', type: '' });
  };

  const pickRole = (roleKey) => {
    setForm((prev) => ({ ...prev, role: roleKey }));
    setErrors((prev) => ({ ...prev, role: '' }));
  };

  /* ---------- Validation ---------- */
  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = 'Full name is required';
    else if (form.name.trim().length < 3)
      next.name = 'Name must be at least 3 characters';

    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address';

    if (!form.phone.trim()) next.phone = 'Phone number is required';

    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6)
      next.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword)
      next.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      next.confirmPassword = 'Passwords do not match';

    if (!form.role) next.role = 'Please choose your role';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        branch: form.branch,
        password: form.password,
        role: form.role,
      });

      setMessage({
        text: `Account created as ${user.role}. Redirecting to your dashboard…`,
        type: 'success',
      });

      const target = DASHBOARD_BY_ROLE[user.role] || '/login';
      setTimeout(() => navigate(target, { replace: true }), 900);
    } catch (err) {
      setMessage({
        text: err.message || 'Registration failed',
        type: 'error',
      });
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* ---------- Left brand panel ---------- */}
        <div className="auth-brand">
          <h1>
            <i className="fas fa-paw"></i> VetraCare
          </h1>
          <p>
            Create your account and choose your role. You'll be taken to the
            dashboard built for your work.
          </p>
          <ul className="auth-features">
            <li><i className="fas fa-user-shield"></i> Administrator</li>
            <li><i className="fas fa-user-doctor"></i> Veterinarian</li>
            <li><i className="fas fa-flask-vial"></i> Laboratory technician</li>
            <li><i className="fas fa-headset"></i> Receptionist</li>
            <li><i className="fas fa-pills"></i> Pharmacist</li>
            <li><i className="fas fa-paw"></i> Pet owner</li>
          </ul>
        </div>

        {/* ---------- Right form panel ---------- */}
        <div className="auth-form-panel">
          <h2>Create your account</h2>
          <p className="subtitle">All fields are required</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Full name */}
            <div className="form-group">
              <label>Full name</label>
              <div className="input-wrap">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

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
                  placeholder="jane@vetcare.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Phone + Branch */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Phone</label>
                <div className="input-wrap">
                  <i className="fas fa-phone"></i>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(555) 018-4271"
                    autoComplete="tel"
                    disabled={loading}
                  />
                </div>
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label>Branch</label>
                <div className="input-wrap">
                  <i className="fas fa-hospital"></i>
                  <select
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
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
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className="form-group">
              <label>Confirm password</label>
              <div className="input-wrap">
                <i className="fas fa-check-circle"></i>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Role picker — now shows ALL roles */}
            <div className="form-group">
              <label>Select your role</label>
              <div className="role-grid">
                {ROLES.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    className={`role-option ${form.role === r.key ? 'selected' : ''}`}
                    onClick={() => pickRole(r.key)}
                    disabled={loading}
                  >
                    <i className={`fas ${r.icon}`}></i>
                    <span>{r.short}</span>
                  </button>
                ))}
              </div>
              {errors.role && <p className="error-text">{errors.role}</p>}
            </div>

            {/* Submit */}
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating account…
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i> Create account
                </>
              )}
            </button>
          </form>

          {/* Feedback message */}
          {message.text && (
            <div className={`auth-message ${message.type}`}>{message.text}</div>
          )}

          {/* Switch to login */}
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}