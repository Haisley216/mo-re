import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { IncomeAssetsProvider } from './context/IncomeAssetsContext';
import { OnboardingPage } from './pages/OnboardingPage';
import { AssetManagementPage } from './pages/AssetManagementPage';
import { IncomeAssetsPage } from './pages/IncomeAssetsPage';
import mixpanel from './lib/mixpanel';

function PageTracker() {
  const location = useLocation();
  useEffect(() => {
    mixpanel.track('page_view', { path: location.pathname });
  }, [location.pathname]);
  return null;
}

function AppRoutes() {
  const { completed } = useOnboarding();
  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route
        path="/"
        element={completed ? <AssetManagementPage /> : <Navigate to="/onboarding" replace />}
      />
      <Route path="/income-assets" element={<IncomeAssetsPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PageTracker />
      <OnboardingProvider>
        <IncomeAssetsProvider>
          <AppRoutes />
        </IncomeAssetsProvider>
      </OnboardingProvider>
    </BrowserRouter>
  );
}
