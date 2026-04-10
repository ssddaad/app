import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// ─── 懒加载路由组件（减小首屏 JS 体积） ──────────────────────────────────────
const HomePage          = lazy(() => import('./pages/HomePage'));
const ConsultPage       = lazy(() => import('./pages/consult/ConsultPage'));
const InformationPage   = lazy(() => import('./pages/Information/InformationPage'));
const ShopPage          = lazy(() => import('./pages/Shop/ShopPage'));
const PersonalInfoPage  = lazy(() => import('./pages/Profile/PersonalInfoPage'));
const PreventionPage    = lazy(() => import('./pages/PreventionPage'));
const CausePage         = lazy(() => import('./pages/CausePage'));
const SymptomPage       = lazy(() => import('./pages/SymptomPage'));
const AppointmentPage   = lazy(() => import('./pages/consult/AppointmentPage'));
const ReportsPage       = lazy(() => import('./pages/consult/ReportsPage'));
const MyDoctorsPage     = lazy(() => import('./pages/consult/MyDoctorsPage'));
const FAQPage           = lazy(() => import('./pages/consult/FAQPage'));
const EmergencyPage     = lazy(() => import('./pages/consult/EmergencyPage'));
const AIPage            = lazy(() => import('./pages/consult/AIPage'));
const DoctorConsultPage = lazy(() => import('./pages/consult/DoctorConsultPage'));
const BookingPage       = lazy(() => import('./pages/consult/BookingPage'));
const PaymentPageWrapper = lazy(() =>
  import('./pages/Shop/PaymentPageWrapper').then((m) => ({ default: m.PaymentPageWrapper }))
);

// ─── 全局加载占位 ─────────────────────────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontSize: '14px',
      color: '#999',
    }}
  >
    加载中…
  </div>
);

const App: React.FC = () => {
  // GitHub Pages 部署时使用 /app/ 作为 basename
  // vite.config.ts 通过 define 注入 __GITHUB_PAGES__ 变量
  const basename = import.meta.env.BASE_URL === '/app/' ? '/app' : '/';
  
  return (
    <Router basename={basename}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/consult"      element={<ConsultPage />} />
          <Route path="/info/*"       element={<InformationPage />} />
          <Route path="/shop"         element={<ShopPage />} />
          <Route path="/profile"      element={<PersonalInfoPage />} />
          <Route path="/cause"        element={<CausePage />} />
          <Route path="/prevention/*" element={<PreventionPage />} />
          <Route path="/symptom/*"    element={<SymptomPage />} />
          <Route path="/appointment"  element={<AppointmentPage />} />
          <Route path="/reports"      element={<ReportsPage />} />
          <Route path="/doctors"      element={<MyDoctorsPage />} />
          <Route path="/faq"          element={<FAQPage />} />
          <Route path="/emergency"    element={<EmergencyPage />} />
          <Route path="/ai"           element={<AIPage />} />
          <Route path="/doctor-consult" element={<DoctorConsultPage />} />
          <Route path="/booking"      element={<BookingPage />} />
          <Route path="/payment"      element={<PaymentPageWrapper />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
