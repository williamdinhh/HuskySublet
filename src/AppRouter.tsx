import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Setup from './pages/Setup';
import BrowseApp from './BrowseApp'; // We'll rename the current App.tsx content

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--hinge-light-gray, #f5f5f7)',
        }}
      >
        <div style={{ fontSize: '1rem', color: 'var(--hinge-gray, #8e8e93)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
      <Route
        path="/setup"
        element={
          user ? (
            <ProtectedRoute>
              <Setup />
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <BrowseApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
