import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@store/authStore';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Package,
  Settings,
  Mail,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/admin/blogs',
      label: 'Blog Posts',
      icon: FileText,
    },
    {
      path: '/admin/team',
      label: 'Team Members',
      icon: Users,
    },
    {
      path: '/admin/customers',
      label: 'Customers',
      icon: Briefcase,
    },
    {
      path: '/admin/products',
      label: 'Products',
      icon: Package,
    },
    {
      path: '/admin/messages',
      label: 'Messages',
      icon: Mail,
    },
    {
      path: '/admin/contact-info',
      label: 'Contact Info',
      icon: Settings,
    },
    {
      path: '/admin/profile',
      label: 'My Profile',
      icon: UserCircle,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-accent-blue to-accent-teal rounded-lg flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm">C</span>
          </div>
          <span className="text-lg font-heading font-bold text-primary-navy">CyEyes CMS</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
          <div className="h-10 w-10 bg-gradient-to-br from-accent-blue to-accent-teal rounded-xl flex items-center justify-center">
            <span className="text-white font-heading font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-heading font-bold text-primary-navy">CyEyes CMS</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-gradient-to-r from-accent-blue/10 to-accent-teal/10 text-primary-cyan border-l-4 border-primary-cyan'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-navy'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {active && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-text-primary truncate">{user?.name}</p>
              <p className="text-xs text-text-secondary truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        {/* Top Bar */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 px-8 items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary-navy">
              {menuItems.find((item) => isActive(item.path))?.label || 'Admin Panel'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm text-text-primary">{user?.name}</p>
                <p className="text-xs text-text-secondary">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
