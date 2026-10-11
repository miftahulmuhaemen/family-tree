import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FamilyTreePage } from './pages/FamilyTreePage';
import { LandingPage } from './pages/LandingPage';
import { DocsPage } from './pages/DocsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { NotificationProvider } from './context/NotificationContext';
import { StackedToastContainer } from './components/toast/StackedToastContainer';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/policy" element={<PrivacyPolicyPage />} />
            <Route path="/tos" element={<TermsOfServicePage />} />
            <Route path="/app" element={<FamilyTreePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <StackedToastContainer />
      </NotificationProvider>
    </QueryClientProvider>
  );
}
