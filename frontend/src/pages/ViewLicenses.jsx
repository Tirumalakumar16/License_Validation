import  { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ViewLicense = () => {
  const [licenses, setLicenses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [assignModal, setAssignModal] = useState({ show: false, licenseKey: '', name: '', email: '' });
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
        assigned_to: assignModal.email
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(res);
      
      if (res.data.success) {
        toast.success(`Assigned to ${assignModal.name}`, { position: 'top-center' });
        setAssignModal({ show: false, licenseKey: '', name: '', email: '' });
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
              <div key={lic.id} className="p-4 transition duration-200 bg-white rounded-lg shadow hover:shadow-lg">
                <h2 className="mb-1 text-lg font-semibold text-blue-600 break-all">{lic.license_key}</h2>
                <p><strong>Name:</strong> {lic.name || '-'}</p>
                <p><strong>Assigned To:</strong> {lic.assigned_to || '-'}</p>
                <p><strong>Created By:</strong> {lic.created_by}</p>
                <p><strong>Issued By:</strong> {lic.issued_by || '-'}</p>
                <p><strong>Device ID:</strong> {lic.device_id || '-'}</p>
                <p><strong>Status:</strong>
                  <span className={`ml-2 px-2 py-1 text-xs rounded text-white ${lic.assigned_status ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {lic.assigned_status ? 'Assigned' : 'Unassigned'}
                  </span>
                </p>
                <p><strong>Activated At:</strong> {lic.activated_at || '-'}</p>
                <p className="mt-1 text-sm text-gray-500">Created: {lic.created_at}</p>
                <p className="text-sm text-gray-500">Updated: {lic.updated_at}</p>

                {lic.assigned_status ? (
                  <button
                    disabled
                    className="w-full py-2 mt-4 text-white bg-green-600 rounded-md cursor-not-allowed"
                  >
                    License Key Assigned
                  </button>
                ) : (
                  <button
                    onClick={() => setAssignModal({ show: true, licenseKey: lic.license_key, name: '', email: '' })}
                    className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Assign License Key
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold">Whom To Assign</h3>
            <p className="mb-2 text-sm text-gray-600">License Key: <span className="font-semibold text-blue-600 break-all">{assignModal.licenseKey}</span></p>
            <input
              type="text"
              placeholder="Name"
              value={assignModal.name}
              onChange={e => setAssignModal({ ...assignModal, name: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={assignModal.email}
              onChange={e => setAssignModal({ ...assignModal, email: e.target.value })}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setAssignModal({ show: false, licenseKey: '', name: '', email: '' })}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >Cancel</button>
              <button
                onClick={handleAssign}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLicense;