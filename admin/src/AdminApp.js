import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ProductUpload from './pages/ProductUpload';
import CategoryUpload from './pages/CategoryUpload'
import Category from './pages/Category'
import ProductList from './pages/ProductList'
import SubCategory from './pages/SubCategory'
import SubCategoryAdd from './pages/SubCategoryAdd'
import 'bootstrap/dist/css/bootstrap.min.css';

import { useRef } from "react";
import { createContext, useEffect, useState } from 'react';
import LoadingBar from "react-top-loading-bar";
import Signup from './pages/Signup';
const Mycontext = createContext();

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminApp = () => {
  const [progress, setProgress] = useState(0);
 

  return (
    <BrowserRouter>
      <Mycontext.Provider value={{ progress, setProgress }}>
        <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <PrivateRoute>
              <AdminLayout>
                <Category />
              </AdminLayout>
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <AdminLayout>
                <Category />
              </AdminLayout>
            </PrivateRoute>
          } />
          <Route path="/products/upload" element={
            <PrivateRoute>
              <AdminLayout>
                <ProductUpload />
              </AdminLayout>
            </PrivateRoute>
          } />
           <Route path="/products/upload/:id" element={
            <PrivateRoute>
              <AdminLayout>
                <ProductUpload />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/products/list" element={
            <PrivateRoute>
              <AdminLayout>
                <ProductList />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/category/upload" element={
            <PrivateRoute>
              <AdminLayout>
                <CategoryUpload />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/subcategory/upload" element={
            <PrivateRoute>
              <AdminLayout>
                <SubCategory />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/subCategory/add" element={
            <PrivateRoute>
              <AdminLayout>
                <SubCategoryAdd />
              </AdminLayout>
            </PrivateRoute>
          } />






        </Routes>


      </Mycontext.Provider>
    </BrowserRouter>
  );
};

export default AdminApp;
export { Mycontext };
