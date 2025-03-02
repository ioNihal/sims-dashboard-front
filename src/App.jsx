import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Inventory from './pages/Inventory/Inventory';
import Customers from './pages/Customers/Customers';
import Staffs from './pages/Staffs/Staffs';
import Orders from './pages/Orders/Orders';
import Reports from './pages/Reports';
import Suppliers from './pages/Suppliers/Suppliers';
import './App.css';
import ItemDetails from './pages/Inventory/ItemDetails';
import SupplierDetails from './pages/Suppliers/SupplierDetails';
import ViewOrder from './pages/Orders/ViewOrder';

function App() {
  return (
    <Router>
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/:id" element={<ItemDetails />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/suppliers/:supplierName" element={<SupplierDetails />} />
            <Route path="/staffs" element={<Staffs />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<ViewOrder />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
