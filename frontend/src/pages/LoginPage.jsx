import  { useEffect, useState  } from 'react';
import { useNavigate  } from 'react-router-dom';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import {  Button } from 'antd';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPasswordModal from '../modals/ForgotPasswordModal';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
   
   const token = localStorage.getItem('token');
    useEffect(() => {
  
      if(token != null) {
        navigate('/')
      } 
     
    }, []);

  const isEmailValid = /\S+@\S+\.\S+/.test(form.email);
  const isPasswordValid = form.password.length >= 6;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };
  

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, form);
      console.log(response);
      
      if (response.data.success) {  
        localStorage.setItem('tempToken', response.data.token); // Save for OTP step
        toast.success('OTP sent to your email', { position: 'top-center' });
        navigate('/verify-otp');
      } else {
        toast.error('Invalid email or password', { position: 'top-center' });
      }
    } catch (err) {
      toast.error('Login failed. Invalid email or password.', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
      <ToastContainer />
      <div className="w-full max-w-lg p-10 bg-white shadow-2xl rounded-xl">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-gray-800">
          Login<span className="text-blue-600 whitespace-nowrap"></span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label htmlFor="email" className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <MailOutlined />
              </span>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2
                ${!touched.email ? 'border-gray-300 focus:ring-blue-500' :
                  isEmailValid ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500'}`}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <LockOutlined />
              </span>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2
                ${!touched.password ? 'border-gray-300 focus:ring-blue-500' :
                  isPasswordValid ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500'}`}
              />
            </div>
            {touched.password && !isPasswordValid && (
              <p className="mt-1 text-sm text-red-500">Password must be at least 6 characters</p>
            )}
          </div>
 {/* Forgot Password Link */}
<div className="mt-3 text-right">
  <ForgotPasswordModal
    trigger={
      <Button
        type="primary"
        className="text-base font-semibold bg-red-400"
      >
        Forgot password?
      </Button>
    }
  />
</div>

      

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
 
       
      </div>
    </div>
  );
};

export default LoginPage;
