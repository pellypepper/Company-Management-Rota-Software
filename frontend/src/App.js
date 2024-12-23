// App.js
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './pages/main/main';
import Loginpage from './pages/login/login';
import Registerpage from './pages/register/register';
import Dashboard from './pages/Dashboard';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import StaffDashboard from './pages/dashboard/staffdash/staffdash';
import Rota from './pages/dashboard/staffdash/rota';
import Maindash from './pages/dashboard/staffdash/board';
import Shift from './pages/dashboard/staffdash/shift';
import Timesheet from './pages/dashboard/staffdash/timesheet';
import Leave from './pages/dashboard/staffdash/leave';
import ManagerDashboard from './pages/dashboard/managerdash/managerdash';
import HrDashboard from './pages/dashboard/hrdash/hrdash'; 
import ProtectedRoute from './components/protected';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Main />
    },
    {
      path: '/login',
      element: <Loginpage />
    },
    {
      path: '/register',
      element: <Registerpage />
    },
    {
      path: '/managerdash',
      element: (
        <ProtectedRoute allowedRoles={['manager']}>
          <ManagerDashboard />
        </ProtectedRoute>
      )
    },
    {
      path: '/hrdash',
      element: (
        <ProtectedRoute allowedRoles={['hr']}>
          <HrDashboard />
        </ProtectedRoute>
      )
    }, 
    {
      path: '/staffdash',
      element: (
        <ProtectedRoute allowedRoles={['staff']}>
          <StaffDashboard />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Maindash /> },
        {
          path: 'rota',
          element: <Rota />
        },
        {
          path: 'shift',
          element: <Shift />
        },
        {
          path: 'timesheet',
          element: <Timesheet />
        },
        {
          path: 'leave',
          element: <Leave />
        },
      ]
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
