import  { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { LockOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const OtpVerification = () => {

    useEffect(()=>{
    if(token == null) {
      navigate('/login')
    }
  },[])
  
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem('tempToken');

  useEffect(() => {
    
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);



  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error('Enter a valid 6-digit OTP', { position: 'top-center' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/verify-otp`, { token,otp });
      if (res.data.success) {
        localStorage.setItem('token', res.data.realToken);
        localStorage.setItem('name',res.data.name)
        toast.success('2FA verified successfully!', { position: 'top-center' });
        setTimeout(() => navigate('/'), 1500);
      } else {
        toast.error(res.data.message || 'OTP verification failed', { position: 'top-center' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong', { position: 'top-center' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendAttempts >= 3) {
      toast.error('Maximum resend attempts reached', { position: 'top-center' });
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/resend-otp`,{token});
      if (res.data.success) {
        toast.success('OTP resent successfully!', { position: 'top-center' });
        setResendAttempts(resendAttempts + 1);
        setTimeLeft(60);
        setResendDisabled(true);
      } else {
        toast.error(res.data.message || 'Failed to resend OTP', { position: 'top-center' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong', { position: 'top-center' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-yellow-100 via-purple-100 to-blue-100">
      <ToastContainer />
     <div className="w-full p-8 mx-auto bg-white shadow-2xl sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-xl">
        <h2 className="mb-4 text-2xl font-bold text-center text-blue-700">🔐 Enter OTP</h2>
        <p className="mb-6 text-center text-gray-600">We've sent a 6-digit OTP to your registered email.</p>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold text-gray-700">One-Time Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <LockOutlined />
            </span>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleVerifyOtp}
          disabled={submitting}
          className="w-full py-2 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="mt-6 text-center text-gray-700">
          {resendDisabled ? (
            <p className="text-sm">⏳ Resend available in <strong>{timeLeft}s</strong></p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={resendAttempts >= 3}
              className={`mt-2 inline-flex items-center px-4 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 ${
                resendAttempts >= 3 && 'opacity-50 cursor-not-allowed'
              }`}
            >
              <ReloadOutlined className="mr-2" /> Resend OTP
            </button>
          )}
        </div>

        <p className="mt-3 text-xs text-center text-gray-500">
          Attempt {resendAttempts} of 3
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;