// ✅ ForgotPasswordModal.jsx
import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { MailOutlined } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPasswordModal = ({ trigger }) => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isEmailValid = /\S+@\S+\.\S+/.test(email);

  const handleReset = async () => {
    if (!isEmailValid) {
      toast.error('Please enter a valid email', { position: 'top-center' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/send-reset-link`, { email });

      if (res.data.success) {
        toast.success('Reset link sent to your email!', { position: 'top-center' });
        setVisible(false);
        setEmail('');
      } else {
        toast.error(res.data.message || 'Failed to send reset link', { position: 'top-center' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong', { position: 'top-center' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div onClick={() => setVisible(true)}>
        {trigger}
      </div>

      <Modal
  title="🔐 Reset Password"
  open={visible}
  centered
  onCancel={() => setVisible(false)}
  onOk={handleReset}
  okText="Send Reset Link"
  confirmLoading={submitting}
  okButtonProps={{ disabled: !isEmailValid }}
>
  <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
  <Input
    prefix={<MailOutlined />}
    type="email"
    placeholder="Enter your registered email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</Modal>
    </>
  );
};

export default ForgotPasswordModal;
