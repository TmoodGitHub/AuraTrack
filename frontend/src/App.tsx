import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => (
  <Routes>
    <Route path='/' element={<Navigate to='/dashboard' />} />
    <Route path='/login' element={<LoginPage />} />
    <Route path='/dashboard' element={<DashboardPage />} />
    <Route path='/admin' element={<AdminPage />} />
    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);

export default App;
