import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/admin';
import Spinner from '../../components/Spinner';
import StatCard from '../../components/StatCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Mentors',
      value: stats?.totalMentors || 0,
      color: 'bg-blue-100 text-primary',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      label: 'Total Mentees',
      value: stats?.totalMentees || 0,
      color: 'bg-teal-100 text-teal-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      label: 'Total Cohorts',
      value: stats?.totalCohorts || 0,
      color: 'bg-indigo-100 text-indigo-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      label: 'Certs Issued',
      value: stats?.totalCertificatesIssued || 0,
      color: 'bg-purple-100 text-purple-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Pending Payments',
      value: stats?.certsPendingPayment || 0,
      color: 'bg-amber-100 text-warning',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Paid Deals',
      value: stats?.certsPaid || 0,
      color: 'bg-green-100 text-success',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Administrator Console</h1>
          <p className="text-slate-500 mt-2">Oversee campus AI literacy metrics, cohorts, certificate settlements, and mentors.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <StatCard
              key={idx}
              label={card.label}
              value={card.value}
              color={card.color}
              icon={card.icon}
            />
          ))}
        </div>

        {/* Quick Links Menu Grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">Admin Subviews</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/admin/mentors"
              className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all flex flex-col justify-between h-40"
            >
              <div>
                <span className="text-2xl">👨‍🏫</span>
                <h4 className="font-bold text-slate-800 text-lg mt-2">All Mentors</h4>
                <p className="text-xs text-slate-450 mt-1">View list of all college mentors and college associations.</p>
              </div>
              <span className="text-sm font-bold text-primary self-end hover:underline">Manage Mentors &rarr;</span>
            </Link>

            <Link
              to="/admin/cohorts"
              className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all flex flex-col justify-between h-40"
            >
              <div>
                <span className="text-2xl">👥</span>
                <h4 className="font-bold text-slate-800 text-lg mt-2">All Cohorts</h4>
                <p className="text-xs text-slate-450 mt-1">Review active cohorts, schedules, and capacity spots.</p>
              </div>
              <span className="text-sm font-bold text-primary self-end hover:underline">Manage Cohorts &rarr;</span>
            </Link>

            <Link
              to="/admin/mentees"
              className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all flex flex-col justify-between h-40"
            >
              <div>
                <span className="text-2xl">🎓</span>
                <h4 className="font-bold text-slate-800 text-lg mt-2">All Mentees</h4>
                <p className="text-xs text-slate-450 mt-1">Track student details, hours completed, and certificate approvals.</p>
              </div>
              <span className="text-sm font-bold text-primary self-end hover:underline">Manage Mentees &rarr;</span>
            </Link>

            <Link
              to="/admin/certs"
              className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all flex flex-col justify-between h-40"
            >
              <div>
                <span className="text-2xl">💰</span>
                <h4 className="font-bold text-slate-800 text-lg mt-2">Certifications</h4>
                <p className="text-xs text-slate-450 mt-1">Manage processing fee settlement and payment confirmations.</p>
              </div>
              <span className="text-sm font-bold text-primary self-end hover:underline">Manage Payments &rarr;</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
