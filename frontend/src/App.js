
import './App.css';
import 'antd/dist/reset.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ViewLicenses from './pages/ViewLicenses';
import Tickets from './pages/Tickets';
import CreateLicense from './pages/CreateLicense';
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-license" element={<CreateLicense />} />
        <Route path="/view-licenses" element={<ViewLicenses />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path='/reset-password' element= {<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
