import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { LockOutlined } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const isPasswordValid = form.newPassword.length >= 6;
  const isMatch = form.newPassword === form.confirmPassword;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = e => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!token) {
      toast.error('Missing or invalid token', { position: 'top-center' });
      return;
    }
    if (!isPasswordValid || !isMatch) {
      toast.error('Please fix form errors before submitting', { position: 'top-center' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/reset-password`, {
        token,
        newPassword: form.newPassword
      });

      if (response.data.success) {
        toast.success('Password reset successfully!', { position: 'top-center' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(response.data.message || 'Reset failed', { position: 'top-center' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-yellow-50 via-blue-50 to-purple-100">
      <ToastContainer />
      <div className="w-full max-w-lg p-10 bg-white shadow-2xl rounded-xl">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-gray-800">
          🔐 Set a New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-semibold text-gray-700">New Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <LockOutlined />
              </span>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  !touched.newPassword
                    ? 'border-gray-300 focus:ring-blue-500'
                    : isPasswordValid
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-red-500 focus:ring-red-500'
                }`}
              />
            </div>
            {touched.newPassword && !isPasswordValid && (
              <p className="mt-1 text-sm text-red-500">Password must be at least 6 characters</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <LockOutlined />
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  !touched.confirmPassword
                    ? 'border-gray-300 focus:ring-blue-500'
                    : isMatch
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-red-500 focus:ring-red-500'
                }`}
              />
            </div>
            {touched.confirmPassword && !isMatch && (
              <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;