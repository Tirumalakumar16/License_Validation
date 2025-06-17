import React from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { KeyOutlined } from '@ant-design/icons'; // Ant Design icon

const CreateLicense = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  const handleCreateLicense = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/license/create`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`✅ License Created: ${response.data.license_Key}`, {
          position: 'top-center',
          autoClose: 5000,
        });
      } else {
        toast.error('Failed to create license key');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'License creation failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <ToastContainer />
      <div className="w-full max-w-2xl p-8 bg-white shadow-xl rounded-2xl">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="mb-3 text-5xl text-blue-600">
            <KeyOutlined />
          </div>
          <h2 className="text-3xl font-bold text-blue-700">Generate a New License Key</h2>
          <p className="max-w-md mt-2 text-gray-600">
            License keys ensure secure, authenticated access to software. Click the button below to create and assign a new license key.
          </p>
        </div>

        <div className="mb-6 space-y-3 text-left text-gray-700">
          <p>
            🔐 <strong>Secure & Unique:</strong> Generated using strong randomization logic.
          </p>
          <p>
            📧 <strong>Email Delivery:</strong> License is sent to the assigned user instantly.
          </p>
          <p>
            📊 <strong>Audit Friendly:</strong> Full tracking of creation and usage time.
          </p>
        </div>

        <button
          onClick={handleCreateLicense}
          className="w-full py-3 text-lg font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Create License Key
        </button>
      </div>
    </div>
  );
};

export default CreateLicense;