import React, { useState ,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined, MenuOutlined, CloseOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('tempToken');

    setMenuOpen(false);
    navigate('/login');
  };

  
  

  const actionsMenu = (
  <Menu className="min-w-[220px] text-base font-medium">
    <Menu.Item
      key="create"
      className="px-4 py-3 text-lg hover:bg-blue-50"
    >
      <Link
        to="/create-license"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-2 font-bold text-blue-700 text-md hover:text-blue-800"
      >
        🎯 <span>Create License Key</span>
      </Link>
    </Menu.Item>
    <Menu.Item
      key="view"
      className="px-4 py-3 text-lg hover:bg-blue-50"
    >
      <Link
        to="/view-licenses"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-2 font-bold text-green-700 text-md hover:text-green-800"
      >
        📋 <span>View License Keys</span>
      </Link>
    </Menu.Item>
    <Menu.Item
      key="tickets"
      className="px-4 py-3 text-lg hover:bg-blue-50"
    >
      <Link
        to="/tickets"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-2 font-bold text-yellow-700 text-md hover:text-yellow-800"
      >
        🛠️ <span>Tickets</span>
      </Link>
    </Menu.Item>
  </Menu>
);

  return (
    <header className="sticky top-0 z-50 w-full bg-black shadow-md">
      <div className="flex items-center justify-between px-4 py-5 md:px-8">
        {/* Logo */}
        <Link to="/" className="font-extrabold text-white lg:text-3xl sm:text-2xl">
          Practical Infosec
        </Link>

        {/* Desktop Menu */}
        <div className="items-center hidden gap-6 mr-12 md:flex">
          <Link to="/" className="text-xl font-bold text-white hover:text-blue-600">Home</Link>

          {!token ? (
            <Link
              to="/login"
              className="flex items-center gap-1 text-xl font-semibold text-orange-400 hover:text-white"
            >
              <LoginOutlined /> Login
            </Link>
          ) : (
            <>
              <Dropdown overlay={actionsMenu} trigger={['click']}>
                <Button className="text-lg font-bold text-gray-800 hover:text-blue-600" icon={<DownOutlined />}>
                  Actions
                </Button>
              </Dropdown>
              <Button
              className='text-lg font-bold'
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="text-xl text-gray-700 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="px-4 pb-4 bg-white shadow-md md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="mt-3 font-bold text-center text-gray-800 hover:text-blue-600"
            >
              Home
            </Link>

            {!token ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1 font-medium text-green-700"
              >
                <LoginOutlined /> Login
              </Link>
            ) : (
              <>
                <Dropdown overlay={actionsMenu} trigger={['click']}>
                  <Button className="flex items-center gap-1 font-bold">
                    Actions <DownOutlined />
                  </Button>
                </Dropdown>
                <Button
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  className="mt-2 font-bold"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;