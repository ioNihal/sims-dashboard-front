// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Inventory from './pages/Inventory/Inventory';
import Customers from './pages/Customers/Customers';
import Staffs from './pages/Staffs/Staffs';
import Orders from './pages/Orders/Orders';
import Reports from './pages/Reports/Reports';
import Suppliers from './pages/Suppliers/Suppliers';
import LoginPage from './pages/Login/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ItemDetails from './pages/Inventory/ItemDetails';
import SupplierDetail from './pages/Suppliers/SupplierDetail';
import AddSupplierModal from './pages/Suppliers/AddSupplierModal';
import EditSupplierModal from './pages/Suppliers/EditSupplierModal';
import AddItemPage from './pages/Inventory/AddItemPage';
import EditItemPage from './pages/Inventory/EditItemPage';
import AddCustomerPage from './pages/Customers/AddCustomerPage';
import EditCustomerPage from './pages/Customers/EditCustomerPage';
import CustomerDetails from './pages/Customers/CustomerDetails';
import AddStaffPage from './pages/Staffs/AddStaffPage';
import EditStaffPage from './pages/Staffs/EditStaffPage';
import StaffDetails from './pages/Staffs/StaffDetails';
import OrderDetails from './pages/Orders/OrderDetails';
import ReportDetails from './pages/Reports/ReportDetails';
import AddReportPage from './pages/Reports/AddReportPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import InvoicesPage from './pages/Invoices/InvoicesPage';
import InvoiceDetails from './pages/Invoices/InvoiceDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="dashboard">
                <Sidebar />
                <div className="content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/inventory/:id" element={<ItemDetails />} />
                    <Route path="/inventory/edit/:id" element={<EditItemPage />} />
                    <Route path="/inventory/add" element={<AddItemPage />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/customers/add" element={<AddCustomerPage />} />
                    <Route path="/customers/edit/:id" element={<EditCustomerPage />} />
                    <Route path="/customers/view/:id" element={<CustomerDetails />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/suppliers/view/:id" element={<SupplierDetail />} />
                    <Route path="/suppliers/add" element={<AddSupplierModal />} />
                    <Route path="/suppliers/edit/:supplierId" element={<EditSupplierModal />} />
                    <Route path="/staffs" element={<Staffs />} />
                    <Route path="/staffs/add" element={<AddStaffPage />} />
                    <Route path="/staffs/edit/:id" element={<EditStaffPage />} />
                    <Route path="/staffs/view/:id" element={<StaffDetails />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/reports/add" element={<AddReportPage />} />
                    <Route path="/reports/view/:id" element={<ReportDetails />} />
                    <Route path="/invoices" element={<InvoicesPage />} />
                    <Route path="/invoice/view/:id" element={<InvoiceDetails />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
