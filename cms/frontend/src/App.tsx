import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public pages
import HomePage from '@pages/public/Home';
import BlogListPage from '@pages/public/BlogList';
import BlogPostPage from '@pages/public/BlogPost';
import TeamPage from '@pages/public/Team';
import CustomersPage from '@pages/public/Customers';
import ProductsPage from '@pages/public/Products';
import ProductDetailPage from '@pages/public/ProductDetail';
import ContactPage from '@pages/public/Contact';

// Auth pages
import LoginPage from '@pages/auth/Login';

// Admin pages
import AdminLayout from '@pages/admin/AdminLayout';
import Dashboard from '@pages/admin/Dashboard';
import BlogManagement from '@pages/admin/BlogManagement';
import BlogEditor from '@pages/admin/BlogEditor';
import TeamManagement from '@pages/admin/TeamManagement';
import CustomerManagement from '@pages/admin/CustomerManagement';
import ProductManagement from '@pages/admin/ProductManagement';
import MessageManagement from '@pages/admin/MessageManagement';
import ContactInfoPage from '@pages/admin/ContactInfo';
import ProfilePage from '@pages/admin/Profile';
import TwoFactorAuthPage from '@pages/admin/TwoFactorAuth';

// Components
import ProtectedRoute from '@components/common/ProtectedRoute';
import PublicLayout from '@components/common/PublicLayout';
import ErrorBoundary from '@components/ErrorBoundary';
import DebugPanel from '@components/DebugPanel';

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" />
      <DebugPanel position="bottom-right" />

      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="blogs" element={<BlogManagement />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/edit/:id" element={<BlogEditor />} />

          <Route path="team" element={<TeamManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="messages" element={<MessageManagement />} />

          <Route path="contact-info" element={<ContactInfoPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/2fa" element={<TwoFactorAuthPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
