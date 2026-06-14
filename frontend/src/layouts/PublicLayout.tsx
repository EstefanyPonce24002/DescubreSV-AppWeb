import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/public/PublicNavbar';
import { PublicFooter } from '../components/public/PublicFooter';

export const PublicLayout = () => {
  return (
    <div className="layout-public">
      <PublicNavbar />
      <main className="public-main">
        {/* Aquí es donde React renderizará tu Sección de Reseñas */}
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};