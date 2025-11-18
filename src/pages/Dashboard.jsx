import { useState, useEffect } from 'react';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentActivity()
      ]);
      setStats(statsRes.data);
      setActivity(activityRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the Admin Portal</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Users" 
          value={stats.users?.total || 0}
          subtitle={`Active: ${stats.users?.active || 0} | Inactive: ${stats.users?.inactive || 0}`}
          icon={<Users size={24} />}
          color="blue"
        />
        <StatsCard 
          title="Total Bookings" 
          value={stats.bookings?.total || 0}
          subtitle={`Pending: ${stats.bookings?.pending || 0}`}
          icon={<Calendar size={24} />}
          color="green"
        />
        <StatsCard 
          title="Documents" 
          value={stats.documents?.total || 0}
          subtitle={`${stats.documents?.total_size_mb || 0} MB`}
          icon={<FileText size={24} />}
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      {activity && (
        <div className="grid md:grid-cols-2 gap-6">
          <ActivityCard 
            title="Recent Bookings" 
            items={activity.recent_bookings || []}
            type="booking"
          />
          <ActivityCard 
            title="Recent Users" 
            items={activity.recent_users || []}
            type="user"
          />
        </div>
      )}
    </div>
  );
}

function StatsCard({ title, value, subtitle, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className={`${colorClasses[color]} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 font-semibold text-sm uppercase">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
}

function ActivityCard({ title, items, type }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          items.slice(0, 5).map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-medium text-gray-800">
                {type === 'booking' ? item.name : item.username}
              </p>
              <p className="text-sm text-gray-600">
                {type === 'booking' ? `${item.date} at ${item.time}` : item.email}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
