import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Dashboard } from '../pages/Dashboard';
import { Fundraising } from '../pages/Fundraising';
import { CampaignCreate } from '../pages/CampaignCreate';
import { CampaignDetail } from '../pages/CampaignDetail';
import { PublicCampaign } from '../pages/PublicCampaign';
import { Donors } from '../pages/Donors';
import { Beneficiaries } from '../pages/Beneficiaries';
import { Projects } from '../pages/Projects';
import { Finance } from '../pages/Finance';
import { Volunteers } from '../pages/Volunteers';
import { Reports } from '../pages/Reports';
import { Settings } from '../pages/Settings';
import { Login } from '../pages/Login';

export const router = createBrowserRouter([
  // Admin Login & Email Verification
  {
    path: '/login',
    element: <Login />,
  },
  // Public Campaign Page (Standalone donor view, NO admin shell)
  {
    path: '/campaigns/:id/public',
    element: <PublicCampaign />,
  },
  // Main ImpactHub Admin App Shell
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'fundraising',
        element: <Fundraising />,
      },
      {
        path: 'campaigns/new',
        element: <CampaignCreate />,
      },
      {
        path: 'campaigns/:id',
        element: <CampaignDetail />,
      },
      {
        path: 'donors',
        element: <Donors />,
      },
      {
        path: 'beneficiaries',
        element: <Beneficiaries />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'finance',
        element: <Finance />,
      },
      {
        path: 'volunteers',
        element: <Volunteers />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
