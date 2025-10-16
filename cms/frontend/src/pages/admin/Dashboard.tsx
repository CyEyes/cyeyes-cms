import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@store/authStore';
import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  Briefcase,
  Package,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { blogService } from '@services/blog.service';
import { teamService } from '@services/team.service';
import { customerService } from '@services/customer.service';
import { productService } from '@services/product.service';

interface Stats {
  totalBlogs: number;
  publishedBlogs: number;
  totalTeam: number;
  activeTeam: number;
  totalCustomers: number;
  featuredCustomers: number;
  totalProducts: number;
  activeProducts: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    totalBlogs: 0,
    publishedBlogs: 0,
    totalTeam: 0,
    activeTeam: 0,
    totalCustomers: 0,
    featuredCustomers: 0,
    totalProducts: 0,
    activeProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogs, team, customers, products] = await Promise.all([
          blogService.listAdmin({ limit: 100 }),
          teamService.list({ limit: 100 }),
          customerService.list({ limit: 100 }),
          productService.list({ limit: 100 }),
        ]);

        setStats({
          totalBlogs: blogs.total,
          publishedBlogs: blogs.data.filter((b: any) => b.status === 'published').length,
          totalTeam: team.total,
          activeTeam: team.data.filter((t: any) => t.isActive).length,
          totalCustomers: customers.total,
          featuredCustomers: customers.data.filter((c: any) => c.isFeatured).length,
          totalProducts: products.total,
          activeProducts: products.data.filter((p: any) => p.isActive).length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Blog Posts',
      total: stats.totalBlogs,
      subtitle: `${stats.publishedBlogs} Published`,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/blogs',
    },
    {
      title: 'Team Members',
      total: stats.totalTeam,
      subtitle: `${stats.activeTeam} Active`,
      icon: Users,
      color: 'from-green-500 to-green-600',
      link: '/admin/team',
    },
    {
      title: 'Customers',
      total: stats.totalCustomers,
      subtitle: `${stats.featuredCustomers} Featured`,
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/customers',
    },
    {
      title: 'Products',
      total: stats.totalProducts,
      subtitle: `${stats.activeProducts} Active`,
      icon: Package,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/products',
    },
  ];

  const quickActions = [
    { label: 'Create Blog Post', link: '/admin/blogs/new', icon: FileText },
    { label: 'Add Team Member', link: '/admin/team/new', icon: Users },
    { label: 'Add Customer', link: '/admin/customers/new', icon: Briefcase },
    { label: 'Add Product', link: '/admin/products/new', icon: Package },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card p-6 bg-gradient-to-r from-accent-blue/10 to-accent-teal/10 border-l-4 border-primary-cyan">
        <h2 className="text-2xl font-heading font-bold text-primary-navy mb-2">
          Welcome back, {user?.name}! 👋
        </h2>
        <p className="text-text-secondary">
          Here's what's happening with your content today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="glass-card p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-heading font-bold text-primary-navy mb-1">
                {loading ? (
                  <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
                ) : (
                  card.total
                )}
              </h3>
              <p className="text-sm font-medium text-text-primary mb-1">{card.title}</p>
              <p className="text-xs text-text-secondary">{card.subtitle}</p>
              <div className="mt-4 flex items-center gap-2 text-primary-cyan text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View all
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-heading font-bold text-primary-navy mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.link}
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-cyan hover:bg-blue-50 transition-all group"
              >
                <Icon className="h-5 w-5 text-primary-cyan" />
                <span className="font-medium text-text-primary group-hover:text-primary-cyan transition-colors">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-heading font-bold text-primary-navy">
            Recent Activity
          </h3>
          <Clock className="h-5 w-5 text-text-secondary" />
        </div>
        <div className="space-y-3">
          <p className="text-text-secondary text-center py-8">
            No recent activity to display
          </p>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h4 className="font-semibold text-text-primary mb-2">Your Role</h4>
          <p className="text-2xl font-heading font-bold text-primary-navy capitalize">
            {user?.role}
          </p>
        </div>
        <div className="glass-card p-6">
          <h4 className="font-semibold text-text-primary mb-2">Account Email</h4>
          <p className="text-sm text-text-secondary truncate">{user?.email}</p>
        </div>
        <div className="glass-card p-6">
          <h4 className="font-semibold text-text-primary mb-2">System Status</h4>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
