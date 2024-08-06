import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import './App.css';
import { AuthProvider } from './Contexts/AuthContext';
import Detail from './Pages/Detail';
import HomePage from './Pages/HomePage';
import Carts from './Pages/Carts';
import SignupPage from './Pages/SignupPage';
import LoginPage from './Pages/LoginPage';
import AdminPage from './Pages/AdminPage';
import Profile from './Pages/Profile';
import ProtectedRoute from './Components/ProtectedRoute';
import VerifyOrder from './Pages/VerifyOrder';
import SearchResult from './Pages/SearchResult';
import WishlistPage from './Pages/WishlistPage';
import Success from './Pages/Success';
import ManageOrder from './Pages/ManageOrder';
import OrderDetails from './Pages/OrderDetails';
import Shipper from './Pages/ShipperPage'; // Import the Shipper component


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryid" element={<HomePage />} />
          <Route path="/product/:id" element={<Detail />} />
          <Route path="/verify-order" element={<VerifyOrder />} />
          <Route path="/order-success" element={<Success />} />
          {/* <Route path="/manage-order" element={<ManageOrder />} /> */}
          <Route path="/manage-order" element={<ProtectedRoute component={ManageOrder} allowedRoles={['user','shipper','admin']} />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/cart" element={<Carts />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/pro" element={<ProtectedRoute component={Profile} allowedRoles={['user','shipper']} />} />
          <Route path="/admin" element={<ProtectedRoute component={AdminPage} allowedRoles={['admin']} />} />
          <Route path="/shipper" element={<ProtectedRoute component={Shipper} allowedRoles={['shipper']} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
