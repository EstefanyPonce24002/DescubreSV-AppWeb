import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
//import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
//import { Home } from '../pages/public/Home';
//import { Explore } from '../pages/public/Explore';
import { UsersManager } from '../pages/admin/UsersManager';
//import { Login } from '../pages/auth/Login';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/users" replace />} />
          <Route path="users" element={<UsersManager />} />
        </Route>

        {/* Forzar que la raíz y cualquier otra ruta lleven a la vista de usuarios */}
        <Route path="/" element={<Navigate to="/admin/users" replace />} />
        <Route path="*" element={<Navigate to="/admin/users" replace />} />
      </Routes>
    </BrowserRouter>
  );
};