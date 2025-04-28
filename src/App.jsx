// App.jsx
import React, { useContext } from 'react';
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
import Invoices from './pages/Invoices/Invoices';
import InvoiceDetails from './pages/Invoices/InvoiceDetails';
// import RegisterPage from './pages/Login/RegisterPage';
import ProfileWidget from "./components/widgets/ProfileWidget";
import Feedbacks from './pages/Feedbacks/Feedbacks';
import { ThemeToggleButton } from './components/ThemeToggleButton';


function App() {

 

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : { name: "Jane Doe", id: "DEFAULT_ID", avatarUrl: "https://example.com/path/to/avatar.jpg" };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="dashboard">
                <Sidebar />
                <div className="main">
                  <div className="topbar" >
                   <ThemeToggleButton />
                    <ProfileWidget user={user} />
                  </div>
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
                      <Route path="/invoices" element={<Invoices />} />
                      <Route path="/invoice/view/:id" element={<InvoiceDetails />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/feedbacks" element={<Feedbacks />} />
                    </Routes>
                  </div>
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
