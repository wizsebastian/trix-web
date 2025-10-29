import { useAuth } from '../contexts/AuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminPanel } from './AdminPanel';

export default function AdminRoute() {
  const { currentUser, isAdmin } = useAuth();

  // Si no hay usuario logueado, mostrar login
  if (!currentUser) {
    return <AdminLogin />;
  }

  // Si hay usuario pero no es admin, mostrar mensaje de acceso denegado
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Acceso Denegado</h2>
          <p className="text-slate-400 mb-6">
            No tienes permisos de administrador para acceder a esta sección.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg font-semibold text-white hover:shadow-lg transition"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Si es admin, mostrar panel de administración
  return <AdminPanel />;
}