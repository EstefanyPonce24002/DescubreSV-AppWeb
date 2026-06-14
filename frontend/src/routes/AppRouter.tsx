import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { UsersManager } from '../pages/admin/UsersManager';
import { CategoriesManager } from '../pages/admin/CategoriesManager';
import { DestinationsManager } from '../pages/admin/DestinationsManager';
import { Login } from '../pages/auth/Login';
import { Home } from '../pages/public/Home';
import { Explore } from '../pages/public/Explore';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const DefaultRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  return user.rol === 'ADMIN'
    ? <Navigate to="/admin/users" replace />
    : <Navigate to="/" replace />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ZONA PÚBLICA */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
        </Route>
        
        {/* AUTENTICACIÓN */}
        <Route path="/login" element={<Login />} />

        {/* PANEL DE ADMINISTRACIÓN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/users" replace />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="destinations" element={<DestinationsManager />} />
        </Route>

        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};