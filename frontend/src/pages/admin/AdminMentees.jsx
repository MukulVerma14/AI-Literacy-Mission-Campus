import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllMentees } from '../../api/admin';
import Spinner from '../../components/Spinner';

const AdminMentees = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const data = await getAllMentees();
        setMentees(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentees();
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
            <span className="text-slate-900">Mentees</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">All Registered Mentees</h1>
          <p className="text-slate-500">Track all students registered on the platform, their track hour completions, and cohort designations.</p>
        </div>

        {/* Mentees Table */}
        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Mentee Email
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Enrolled Cohort
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Target Skill
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Hours / 70
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Certificate Issued?
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {mentees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-sm text-slate-500">
                      No mentees registered on the platform yet.
                    </td>
                  </tr>
                ) : (
                  mentees.map((mentee) => {
                    const total = mentee.totalHoursCompleted || 0;
                    const percent = Math.min(Math.round((total / 70) * 100), 100);

                    return (
                      <tr key={mentee.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                          #{mentee.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                          {mentee.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-650 font-medium">
                          {mentee.cohortName ? (
                            <span className="text-slate-800 font-semibold">{mentee.cohortName}</span>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 font-medium">
                          {mentee.targetSkill || '—'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="font-bold text-slate-800">{total} hrs</span>
                            <span className="text-xs text-slate-400 font-semibold">({percent}%)</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                          {mentee.certificationIssued ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600">
                              No
                            </span>
                          )}
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

export default AdminMentees;
