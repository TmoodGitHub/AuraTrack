import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      {/** External Route */}
      <Route path='/login' element={<LoginPage />} />

      {/** Internal Routes */}
      <Route path='/' element={<Layout />}>
        <Route index element={<Navigate to='/dashboard' />} />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/account'
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin'
          element={
            <ProtectedRoute requiredRole='admin'>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/** Not Found */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
