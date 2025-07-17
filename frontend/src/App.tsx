import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => (
  <Routes>
    {/** External Route */}
    <Route path='/login' element={<LoginPage />} />

    {/** Internal Routes */}
    <Route path='/' element={<Layout />}>
      <Route index element={<Navigate to='/dashboard' />} />
      <Route path='/dashboard' element={<DashboardPage />} />
      <Route path='/admin' element={<AdminPage />} />
    </Route>

    {/** Not Found */}
    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);

export default App;
