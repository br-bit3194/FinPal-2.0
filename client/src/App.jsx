import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import ProfilePage from './pages/ProfilePage';
import DashboardLayout from './Layout/DashboardLayout';
import PrivateRoute from '../src/components/PrivateRoutes';
import FinSight from './pages/FinSight';
import ChallengesDashboard from './components/Challenges/ChallengesDashboard';
import Team from './pages/Team';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="income" element={<IncomePage />} />
            <Route path="expenses" element={<ExpensePage />} />
            <Route path="finsight" element={<FinSight />} />
            <Route path="challenges" element={<ChallengesDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
