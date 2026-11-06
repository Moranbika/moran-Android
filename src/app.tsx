import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Layout } from '@/components/Layout';
import ProgressProvider from '@/components/ProgressProvider';
import SettingsProvider from '@/components/SettingsProvider';
import { I18nProvider } from '@/context/i18n-context';
import HomePage from '@/pages/HomePage/HomePage';
import PlanPage from '@/pages/PlanPage/PlanPage';
import BooksPage from '@/pages/BooksPage/BooksPage';
import BookWordsPage from '@/pages/BookWordsPage/BookWordsPage';
import VocabPage from '@/pages/VocabPage/VocabPage';
import ProgressPage from '@/pages/ProgressPage/ProgressPage';
import LoginPage from '@/pages/LoginPage/LoginPage';
import RegisterPage from '@/pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage/ForgotPasswordPage';
import SettingsPage from '@/pages/SettingsPage/SettingsPage';
import UpdatesPage from '@/pages/UpdatesPage/UpdatesPage';
import MembershipPage from '@/pages/MembershipPage/MembershipPage';
import { PrivacyPage, TermsPage } from '@/pages/LegalPage/LegalPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import { useSettings } from '@/context/settings-context';
import WebTestNotice from '@/components/WebTestNotice';
import PaymentStatusProvider from '@/components/PaymentStatusProvider';
import PrivacyConsentGate from '@/components/PrivacyConsentGate';
import { paymentsEnabled } from '@/lib/feature-flags';

function RequireAuth({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const location = useLocation();

  if (!settings.loggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default function App() {
  return (
    <ProgressProvider>
      <SettingsProvider>
        <I18nProvider>
          <PaymentStatusProvider>
            <Routes>
                <Route element={<RequireAuth><Layout /></RequireAuth>}>
                  <Route index element={<HomePage />} />
                  <Route path="plan" element={<PlanPage />} />
                  <Route path="books" element={<BooksPage />} />
                  <Route path="book/:id" element={<BookWordsPage />} />
                  <Route path="vocab" element={<VocabPage />} />
                  <Route path="progress" element={<ProgressPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="updates" element={<UpdatesPage />} />
                  <Route
                    path="membership"
                    element={paymentsEnabled ? <MembershipPage /> : <Navigate to="/settings" replace />}
                  />
                </Route>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <PrivacyConsentGate />
            {__MORAN_WEB_TEST__ && <WebTestNotice />}
          </PaymentStatusProvider>
        </I18nProvider>
      </SettingsProvider>
    </ProgressProvider>
  );
}
