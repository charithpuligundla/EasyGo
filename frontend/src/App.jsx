import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SearchPage from './pages/SearchPage';
import CustomerDashboard from './pages/CustomerDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import BookingPage from './pages/BookingPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import StaticPage from './pages/StaticPage';
import AdminDashboard from './pages/AdminDashboard';
import MessagesPage from './pages/MessagesPage';
import NotFoundPage from './pages/NotFoundPage';
import { sitePages } from './content/sitePages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="vehicles/:vehicleId" element={<VehicleDetailPage />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="org-dashboard" element={<OrganizationDashboard />} />
          <Route path="list" element={<OrganizationDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="messages/:bookingId" element={<MessagesPage />} />
          <Route path="book/:vehicleId" element={<BookingPage />} />
          <Route path="contact" element={<StaticPage slug="contact" />} />
          {Object.keys(sitePages)
            .filter((slug) => slug !== 'contact')
            .map((slug) => (
              <Route key={slug} path={slug} element={<StaticPage slug={slug} />} />
            ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
