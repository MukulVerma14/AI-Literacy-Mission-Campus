import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCohorts } from '../../api/admin';
import Spinner from '../../components/Spinner';
import Badge from '../../components/Badge';

const SCHEDULE_DISPLAY = {
  FOUR_WEEKS: '4 Weeks (20 days)',
  SIX_WEEKS: '6 Weeks (3 days/week)',
  TEN_WEEKS: '10 Weeks (Weekends only)',
};

const AdminCohorts = () => {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const data = await getAllCohorts();
        setCohorts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCohorts();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-slate-500 flex items-center gap-2">
            <Link to="/admin/dashboard" className="hover:text-slate-800 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-900">Cohorts</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">All Active Cohorts</h1>
          <p className="text-slate-500">List of all active learning cohorts created by college mentors across campuses.</p>
        </div>

        {/* Cohorts Table */}
        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Cohort Name
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    City / Campus Location
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Mentor Email
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Members / Capacity
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {cohorts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-sm text-slate-500">
                      No cohorts have been created yet.
                    </td>
                  </tr>
                ) : (
                  cohorts.map((cohort) => {
                    const isFull = cohort.currentMembers >= cohort.maxMembers || !cohort.hasSpace;

                    return (
                      <tr key={cohort.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                          #{cohort.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                          {cohort.cohortName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 font-medium">
                          {cohort.city}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-650 font-medium">
                          {cohort.mentorName || '—'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 font-medium">
                          {SCHEDULE_DISPLAY[cohort.scheduleOptions] || cohort.scheduleOptions}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-bold text-slate-800">
                          {cohort.currentMembers} / {cohort.maxMembers}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                          <Badge status={isFull ? 'FULL' : 'OPEN'} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCohorts;
