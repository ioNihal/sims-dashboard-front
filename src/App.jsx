import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Inventory from './pages/Inventory/Inventory';
import Customers from './pages/Customers/Customers';
import Staffs from './pages/Staffs';
import Orders from './pages/Orders';
import Reports from './pages/Reports';
import './App.css';

function App() {
  return (
    <Router>
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/staffs" element={<Staffs />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
