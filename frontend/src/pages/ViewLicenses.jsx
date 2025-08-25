import  { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ViewLicense = () => {
  const [licenses, setLicenses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [assignModal, setAssignModal] = useState({ show: false, licenseKey: '', name: '', email: '' ,type : ''});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const licensesPerPage = 9;

  const navigate = useNavigate()
  const token = localStorage.getItem('token');

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      setTimeout(async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/license/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLicenses(res.data.data);
        setLoading(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to fetch licenses');
      setLoading(false);
    }
  };

   useEffect(()=>{
          if(token == null){
            navigate('/login')
          } else {
            fetchLicenses();
          }
        },[])

  const handleAssign = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/license/assign`, {
        licenseKey: assignModal.licenseKey,
        name: assignModal.name,
        assigned_to: assignModal.email,
        type : assignModal.type
        
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(res);
      
      if (res.data.success) {
        toast.success(`Assigned to ${assignModal.name}`, { position: 'top-center' });
        setAssignModal({ show: false, licenseKey: '', name: '', email: '' ,type : ''});
        fetchLicenses();
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(`License Key Already Assigned to :${assignModal.email}`);
    }
  }; 
 
  const filteredLicenses = licenses.filter(lic => {
    const status = lic.assigned_status === 1 ? '1' : '0';
    const statusMatch = filter === 'all' || filter === status;
    const searchMatch = lic.license_key.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  const indexOfLastLicense = currentPage * licensesPerPage;
  const indexOfFirstLicense = indexOfLastLicense - licensesPerPage;
  const currentLicenses = filteredLicenses.slice(indexOfFirstLicense, indexOfLastLicense);
  const totalPages = Math.ceil(filteredLicenses.length / licensesPerPage);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <ToastContainer />
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by License Key..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md sm:w-1/2"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md sm:w-auto"
        >
          <option value="all">All</option>
          <option value="1">Assigned</option>
          <option value="0">Unassigned</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {currentLicenses.map(lic => (
    <div
      key={lic.id}
      className="p-5 transition-transform duration-200 bg-white border border-gray-100 shadow-md rounded-xl hover:shadow-xl hover:-translate-y-1"
    >
      {/* License Key */}
      <h2 className="mb-3 text-lg font-bold text-blue-600 break-all">
        🔑 {lic.license_key}
      </h2>

      {/* Info section */}
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-semibold">👤 Name:</span> {lic.name || "-"}
        </p>
        <p>
          <span className="font-semibold">📧 Assigned To:</span>{" "}
          {lic.assigned_to || "-"}
        </p>

        {/* Type badge */}
        <p>
          <span className="font-semibold">💻 Type:</span>{" "}
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
              lic.type === "DESKTOP"
                ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                : lic.type === "MOBILE"
                ? "bg-pink-100 text-pink-700 border border-pink-300"
                : "bg-gray-100 text-gray-600 border border-gray-300"
            }`}
          >
            {lic.type || "-"}
          </span>
        </p>

        <p>
          <span className="font-semibold">📝 Created By:</span>{" "}
          {lic.created_by}
        </p>
        <p>
          <span className="font-semibold">🏢 Issued By:</span>{" "}
          {lic.issued_by || "-"}
        </p>
        <p>
          <span className="font-semibold">📱 Device ID:</span>{" "}
          {lic.device_id || "-"}
        </p>

        {/* Status badge */}
        <p>
          <span className="font-semibold">📌 Status:</span>{" "}
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
              lic.assigned_status
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-yellow-100 text-yellow-700 border border-yellow-300"
            }`}
          >
            {lic.assigned_status ? "Assigned" : "Unassigned"}
          </span>
        </p>

        <p>
          <span className="font-semibold">⚡ Activated At:</span>{" "}
          {lic.activated_at || "-"}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          📅 Created: {lic.created_at}
        </p>
        <p className="text-xs text-gray-500">⏱ Updated: {lic.updated_at}</p>
      </div>

      {/* Buttons */}
      {lic.assigned_status ? (
        <button
          disabled
          className="w-full py-2 mt-5 text-sm font-medium text-white bg-green-500 rounded-lg cursor-not-allowed"
        >
          ✅ License Key Assigned
        </button>
      ) : (
        <button
          onClick={() =>
            setAssignModal({
              show: true,
              licenseKey: lic.license_key,
              name: "",
              email: "",
              type: ""
            })
          }
          className="w-full py-2 mt-5 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          🔗 Assign License Key
        </button>
      )}
    </div>
  ))}
</div>



          <div className="flex flex-wrap justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-md mb-2 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

   {assignModal.show && (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-60 backdrop-blur-sm">
    <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl animate-fadeIn">
      <h3 className="mb-4 text-2xl font-bold text-center text-gray-800">Whom To Assign</h3>
      
      <p className="mb-4 text-sm text-center text-gray-600">
        License Key:{" "}
        <span className="font-semibold text-blue-600 break-all">
          {assignModal.licenseKey}
        </span>
      </p>

      {/* Name Input */}
      <input
        type="text"
        placeholder="Enter Name"
        value={assignModal.name}
        onChange={e =>
          setAssignModal({ ...assignModal, name: e.target.value })
        }
        className="w-full p-3 mb-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Email Input */}
      <input
        type="email"
        placeholder="Enter Email"
        value={assignModal.email}
        onChange={e =>
          setAssignModal({ ...assignModal, email: e.target.value })
        }
        className="w-full p-3 mb-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Type Dropdown */}
      <select
        value={assignModal.type || ""}
        onChange={e =>
          setAssignModal({ ...assignModal, type: e.target.value })
        }
        className="w-full p-3 mb-4 transition border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="" disabled>
          Select Type
        </option>
        <option value="DESKTOP">💻 DESKTOP</option>
        <option value="MOBILE">📱 MOBILE</option>
      </select>

      {/* Buttons */}
      <div className="flex justify-between mt-5">
        <button
          onClick={() =>
            setAssignModal({
              show: false,
              licenseKey: "",
              name: "",
              email: "",
              type: ""
            })
          }
          className="w-1/3 px-4 py-2 font-medium text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleAssign}
          className="w-1/3 px-4 py-2 font-medium text-white transition bg-green-600 rounded-lg shadow-md hover:bg-green-700"
        >
          Assign
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default ViewLicense;