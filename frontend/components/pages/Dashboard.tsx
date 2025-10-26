import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { UsersIcon, BriefcaseIcon, AcademicCapIcon, CurrencyDollarIcon, CheckBadgeIcon } from '../Icons';
import api from '../../services/api';
import type { DashboardStats } from '../../types';

const StatCard: React.FC<{ icon: React.FC<any>; title: string; value: string | number; color: string; bgColor: string; }> = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className={`bg-[--card] p-5 rounded-xl shadow-sm border border-[--card-border] flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-1`}>
        <div>
            <p className="text-sm text-[--text-secondary] font-medium">{title}</p>
            <p className="text-3xl font-bold text-[--text-primary] mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
    </div>
);

const StatCardSkeleton: React.FC = () => (
    <div className="bg-[--card] p-5 rounded-xl shadow-sm border border-[--card-border] flex items-center justify-between animate-pulse">
        <div>
            <div className="h-4 bg-[--table-header] rounded w-24 mb-2"></div>
            <div className="h-8 bg-[--table-row-even] rounded w-16"></div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-[--table-header]"></div>
    </div>
);

const genderData = [
    { name: 'Male', value: 550 },
    { name: 'Female', value: 450 },
];
const GENDER_COLORS = ['#8B5A3A', '#FFB84D'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/counts');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const attendanceData = [
    { name: 'Mon', Present: Math.round((stats?.students || 1000) * 0.92) },
    { name: 'Tue', Present: Math.round((stats?.students || 1000) * 0.95) },
    { name: 'Wed', Present: Math.round((stats?.students || 1000) * 0.93) },
    { name: 'Thu', Present: Math.round((stats?.students || 1000) * 0.97) },
    { name: 'Fri', Present: Math.round((stats?.students || 1000) * 0.96) },
  ];

  const revenueData = [
      { name: 'Jan', revenue: 280000 },
      { name: 'Feb', revenue: 350000 },
      { name: 'Mar', revenue: 320000 },
      { name: 'Apr', revenue: 410000 },
      { name: 'May', revenue: 380000 },
      { name: 'Jun', revenue: stats?.totalRevenue || 450000 },
  ];


  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {loading ? (
          [...Array(5)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={UsersIcon} title="Total Students" value={stats?.students || 0} color="text-orange-600" bgColor="bg-orange-100" />
            <StatCard icon={BriefcaseIcon} title="Total Staff" value={stats?.staff || 0} color="text-blue-600" bgColor="bg-blue-100" />
            <StatCard icon={AcademicCapIcon} title="Total Classes" value={stats?.classes || 0} color="text-green-600" bgColor="bg-green-100" />
            <StatCard icon={CurrencyDollarIcon} title="Total Revenue" value={`₹${((stats?.totalRevenue || 0) / 100000).toFixed(2)}L`} color="text-purple-600" bgColor="bg-purple-100" />
            <StatCard icon={CheckBadgeIcon} title="Attendance" value={`${stats?.attendance || 0}%`} color="text-teal-600" bgColor="bg-teal-100" />
          </>
        )}
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
          <h3 className="text-lg font-semibold text-[--text-primary] mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'rgba(255, 107, 53, 0.1)'}}/>
              <Bar dataKey="Present" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
         <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
            <h3 className="text-lg font-semibold text-[--text-primary] mb-4">Student Demographics</h3>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        // FIX: The 'percent' prop from recharts can be undefined. Use nullish coalescing operator to provide a default value and prevent a TypeScript error.
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                        {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
          <h3 className="text-lg font-semibold text-[--text-primary] mb-4">Monthly Revenue (Last 6 Months)</h3>
           <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value)/1000}K`}/>
              <Tooltip cursor={{fill: 'rgba(139, 58, 58, 0.1)'}} formatter={(value: number) => `₹${value.toLocaleString()}`}/>
              <Bar dataKey="revenue" fill="var(--secondary)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
};

export default Dashboard;