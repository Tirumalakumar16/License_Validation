import  { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircleOutlined, ExclamationCircleOutlined, MailOutlined, UserOutlined, ToolOutlined, DesktopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 9;
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setTimeout(async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/ticket/alltickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data.data);
        setLoading(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to fetch tickets');
      setLoading(false);
    }
  };

  useEffect(()=>{
        if(token == null){
          navigate('/login')
        } else {
          fetchTickets();
        }
      },[])



  const handleResolve = async (licenseKey) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/ticket/resolve`, { license_key: licenseKey }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Resolved Ticket: ${licenseKey} and Email is sent...!`, { position: 'top-center' });
      fetchTickets();
    } catch (err) {
      toast.error('Failed to resolve ticket');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filter === 'all' || ticket.resolve_status.toString() === filter;
    const searchMatch = ticket.license_key.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-blue-100">
      <ToastContainer />
      <h1 className="mb-6 text-3xl font-bold text-center text-black">🎫 Tickets</h1>

      <div className="flex flex-col items-center justify-between mb-6 space-y-4 md:flex-row md:space-y-0">
        <input
          type="text"
          placeholder="Search by License Key..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md md:w-1/2"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="all">All</option>
          <option value="1">Resolved</option>
          <option value="0">Unresolved</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {currentTickets.map(ticket => (
              <div key={ticket.id} className="p-5 transition-transform transform bg-white shadow-md rounded-xl hover:shadow-xl hover:-translate-y-1">
                <h2 className="mb-2 text-lg font-bold text-blue-600"><ToolOutlined /> {ticket.license_key}</h2>
                <p><UserOutlined className="mr-1" /><strong>Name:</strong> {ticket.name}</p>
                <p><MailOutlined className="mr-1" /><strong>Email:</strong> {ticket.email}</p>
                <p><DesktopOutlined className="mr-1" /><strong>Device ID:</strong> {ticket.device_id}</p>
                <p><strong>Reason:</strong> {ticket.reason}</p>
                <p><strong>Status:</strong>
                  <span className={`ml-2 px-2 py-1 text-white text-sm rounded ${ticket.resolve_status ? 'bg-green-600' : 'bg-yellow-500'}`}>
                    {ticket.resolve_status ? 'Resolved' : 'Unresolved'}
                  </span>
                </p>
                <p><strong>Resolved By:</strong> {ticket.resolved_by || '-'}</p>
                <p className="text-sm text-gray-500">Created: {ticket.created_at}</p>
                <p className="text-sm text-gray-500">Updated: {ticket.updated_at}</p>

                {ticket.resolve_status ? (
                  <button
                    disabled
                    className="w-full py-2 mt-4 font-bold text-white bg-green-600 rounded-lg cursor-not-allowed"
                  >
                    <CheckCircleOutlined /> Resolved
                  </button>
                ) : (
                  <button
                    onClick={() => handleResolve(ticket.license_key)}
                    className="w-full py-2 mt-4 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    <ExclamationCircleOutlined  /> Resolve
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewTickets;