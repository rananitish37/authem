import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Java DTO enforces min = 8 characters
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // ✅ Pass separate firstName and lastName matching RegisterRequest DTO
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate('/browse');
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      if (validationErrors) {
        // Grab the first validation error message returned by Spring Boot
        const firstErrorKey = Object.keys(validationErrors)[0];
        setError(validationErrors[firstErrorKey]);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Check inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-authem-grayBg/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-authem-border rounded-2xl p-8 shadow-sm space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-authem-green text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Join Authem Today
          </div>
          <h2 className="text-2xl font-black text-authem-dark tracking-tight">Create Your Account</h2>
          <p className="text-xs text-slate-500 font-bold">
            Buy, sell, and track live market prices for verified authentic sneakers.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                First Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Nitish"
                  className="w-full pl-10 pr-3 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Rana"
                className="w-full px-3 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="nitish.rana@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-authem-dark hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-authem-border">
          <p className="text-xs font-bold text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-authem-green hover:underline font-black">
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};