import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button } from 'antd';
import { LoadingOutlined, FileSearchOutlined, ArrowRightOutlined, KeyOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const name = localStorage.getItem('name') ;
  const token = localStorage.getItem('token');

  const fetchRecentTickets = async () => {
    try {
      setLoading(true);
      setTimeout(async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/ticket/alltickets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTickets(res.data.data.slice(0, 10));
        setLoading(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to load recent tickets');
      setLoading(false);
    }
  };

  

  useEffect(() => {

    if(token == null) {
      navigate('/login')
    } else{
       fetchRecentTickets();
    }
   
  }, []);

  const columns = [
    {
      title: '🎟️ License Key',
      dataIndex: 'license_key',
      key: 'license_key',
      render: text => <span className="font-medium text-blue-700">{text}</span>
    },
    {
      title: '🙋 Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '📧 Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '📱 Device ID',
      dataIndex: 'device_id',
      key: 'device_id'
    },
    {
      title: '🛠️ Status',
      dataIndex: 'resolve_status',
      key: 'resolve_status',
      render: status => (
        <span className={`px-2 py-1 rounded-full text-xs text-white ${status ? 'bg-green-600' : 'bg-yellow-500'}`}>
          {status ? 'Resolved' : 'Unresolved'}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <ToastContainer />
      <h1 className="mb-8 text-3xl font-extrabold text-center text-gray-800">
        👋 Welcome Back, <span className="text-blue-600">{name}</span>
      </h1>

      <div className="p-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-blue-700">
            <FileSearchOutlined /> Recent Tickets
          </h2>
          <Button
            type="primary"
            onClick={() => navigate('/tickets')}
            icon={<ArrowRightOutlined />}
            className="hidden md:inline-flex"
          >
            View More
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <LoadingOutlined className="text-3xl text-blue-500 animate-spin" />
          </div>
        ) : (
          <Table
            dataSource={tickets}
            columns={columns}
            rowKey="id"
            pagination={false}
            className="overflow-x-auto"
          />
        )}

        <div className="mt-4 text-center md:hidden">
          <Button
            type="primary"
            onClick={() => navigate('/tickets')}
            icon={<ArrowRightOutlined />}
          >
            View More
          </Button>
        </div>
      </div>

      {/* CTA to License Creation */}
      <div className="p-6 mt-10 text-center bg-white shadow-md rounded-xl">
        <h3 className="mb-2 text-xl font-semibold text-gray-800">🔑 Need a New License Key?</h3>
        <p className="mb-4 text-gray-600">
          Generate secure license keys to manage software access effectively. Click below to get started.
        </p>
        <Button
          type="primary"
          icon={<KeyOutlined />}
          onClick={() => navigate('/create-license')}
          className="text-base font-semibold"
        >
          Go to License Key Generation
        </Button>
      </div>

      {/* Informational Context */}
      <div className="p-6 mt-10 bg-white shadow-md rounded-xl">
        <h3 className="mb-2 text-xl font-bold text-gray-800">🔐 About License Key Management</h3>
        <p className="leading-relaxed text-gray-600">
          License keys ensure secure, authorized access to premium software or features. At <span className="font-semibold text-blue-600">Practical Infosec</span>,
          we help you assign, validate, and track licenses efficiently. Through your dashboard, you can create new keys, monitor activations,
          and resolve issues via our support ticket system. Stay in control of your security infrastructure with real-time license operations. 🚀
        </p>
      </div>
    </div>
  );
};

export default HomePage;