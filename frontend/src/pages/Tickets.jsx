import  { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircleOutlined, ExclamationCircleOutlined, MailOutlined, UserOutlined, ToolOutlined, DesktopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {

  
  
  
  MobileOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  
  
  IdcardOutlined,
  TagOutlined,
  TeamOutlined
} from "@ant-design/icons";

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
    <div
      key={ticket.id}
      className="p-6 transition-all duration-300 transform bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-1"
    >
      {/* License Key */}
      <h2 className="flex items-center mb-4 text-lg font-bold text-blue-600">
        <ToolOutlined className="mr-2 text-blue-500" /> 
        {ticket.license_key}
      </h2>

      {/* Info Section */}
      <div className="space-y-2 text-sm text-gray-700">
        <p className="flex items-center">
          <UserOutlined className="mr-2 text-indigo-500" />
          <strong className="mr-1">Name:</strong> {ticket.name || "-"}
        </p>
        <p className="flex items-center">
          <MailOutlined className="mr-2 text-pink-500" />
          <strong className="mr-1">Email:</strong> {ticket.email || "-"}
        </p>
        <p className="flex items-center">
          <IdcardOutlined className="mr-2 text-teal-500" />
          <strong className="mr-1">Device ID:</strong> {ticket.device_id || "-"}
        </p>

        {/* Type Badge */}
        <p className="flex items-center">
          <TagOutlined className="mr-2 text-yellow-500" />
          <strong className="mr-1">Type:</strong>
          <span
            className={`inline-flex items-center ml-2 px-3 py-1 text-xs rounded-full font-medium shadow-sm ${
              ticket.type === "DESKTOP"
                ? "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 border border-indigo-300"
                : ticket.type === "MOBILE"
                ? "bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 border border-pink-300"
                : "bg-gray-100 text-gray-600 border border-gray-300"
            }`}
          >
            {ticket.type === "DESKTOP" && (
              <DesktopOutlined className="mr-1" />
            )}
            {ticket.type === "MOBILE" && (
              <MobileOutlined className="mr-1" />
            )}
            {ticket.type || "-"}
          </span>
        </p>

        <p className="flex items-center">
          <ExclamationCircleOutlined className="mr-2 text-red-500" />
          <strong className="mr-1">Reason:</strong> {ticket.reason || "-"}
        </p>

        {/* Status Badge */}
        <p className="flex items-center">
          <TeamOutlined className="mr-2 text-green-500" />
          <strong className="mr-1">Status:</strong>
          <span
            className={`ml-2 px-3 py-1 text-xs rounded-full font-medium shadow-sm ${
              ticket.resolve_status
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-yellow-100 text-yellow-700 border border-yellow-300"
            }`}
          >
            {ticket.resolve_status ? "Resolved" : "Unresolved"}
          </span>
        </p>

        <p className="flex items-center">
          <UserOutlined className="mr-2 text-purple-500" />
          <strong className="mr-1">Resolved By:</strong> {ticket.resolved_by || "-"}
        </p>

        {/* Timeline Style Dates */}
        <div className="mt-3 space-y-1 text-xs text-gray-500">
          <p className="flex items-center">
            <CalendarOutlined className="mr-2 text-gray-400" /> 
            Created: {ticket.created_at}
          </p>
          <p className="flex items-center">
            <ClockCircleOutlined className="mr-2 text-gray-400" /> 
            Updated: {ticket.updated_at}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {ticket.resolve_status ? (
        <button
          disabled
          className="flex items-center justify-center w-full py-2 mt-5 font-semibold text-white bg-green-500 rounded-lg cursor-not-allowed"
        >
          <CheckCircleOutlined className="mr-2" /> Resolved
        </button>
      ) : (
        <button
          onClick={() => handleResolve(ticket.license_key)}
          className="flex items-center justify-center w-full py-2 mt-5 font-semibold text-white transition duration-300 bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105"
        >
          <ExclamationCircleOutlined className="mr-2" /> Resolve
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