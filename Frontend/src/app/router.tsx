import { createBrowserRouter } from 'react-router'
import { RequireAuth, RequireGuest } from '@/features/auth'
import { AuthLayout } from '@/layouts/AuthLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { WalletPage } from '@/pages/WalletPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { CosechasPage, MisCosechasPage, CosechaDetailPage, RegistrarCosechaPage } from '@/features/cosechas'
import { MisInversionesPage } from '@/features/inversiones'
import { OraclePage } from '@/pages/OraclePage'
import { OnboardingPage, OnrampPage, OfframpPage, CETESPortfolioPage } from '@/features/etherfuse'
import { MarketplacePage, NFTDetailPage } from '@/features/marketplace'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'wallet', element: <WalletPage /> },
      { path: 'cosechas', element: <CosechasPage /> },
      { path: 'cosechas/nueva', element: <RegistrarCosechaPage /> },
      { path: 'cosechas/:id', element: <CosechaDetailPage /> },
      { path: 'mis-cosechas', element: <MisCosechasPage /> },
      { path: 'inversiones', element: <MisInversionesPage /> },
      { path: 'oracle', element: <OraclePage /> },
      { path: 'etherfuse/onboarding', element: <OnboardingPage /> },
      { path: 'etherfuse/onramp', element: <OnrampPage /> },
      { path: 'etherfuse/offramp', element: <OfframpPage /> },
      { path: 'etherfuse/portfolio', element: <CETESPortfolioPage /> },
      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'marketplace/:id', element: <NFTDetailPage /> },
    ],
  },
  {
    path: '/login',
    element: (
      <RequireGuest>
        <AuthLayout />
      </RequireGuest>
    ),
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/registro',
    element: (
      <RequireGuest>
        <AuthLayout />
      </RequireGuest>
    ),
    children: [{ index: true, element: <RegisterPage /> }],
  },
  { path: '*', element: <NotFoundPage /> },
])
