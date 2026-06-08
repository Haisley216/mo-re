import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { IncomeAssetsProvider } from './context/IncomeAssetsContext';
import { OnboardingPage } from './pages/OnboardingPage';
import { AssetManagementPage } from './pages/AssetManagementPage';
import { IncomeAssetsPage } from './pages/IncomeAssetsPage';

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
      <OnboardingProvider>
        <IncomeAssetsProvider>
          <AppRoutes />
        </IncomeAssetsProvider>
      </OnboardingProvider>
    </BrowserRouter>
  );
}
