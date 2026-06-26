import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllMentors } from '../../api/admin';
import Spinner from '../../components/Spinner';

const AdminMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await getAllMentors();
        setMentors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
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
            <span className="text-slate-900">Mentors</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">All College Mentors</h1>
          <p className="text-slate-500">List of verified mentors conducting cohorts and guiding mentees across campuses.</p>
        </div>

        {/* Mentors Table */}
        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Mentor Email
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    College / Campus Association
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tech Stack Expertise
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Cohorts Led
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {mentors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-500">
                      No mentors registered on the platform yet.
                    </td>
                  </tr>
                ) : (
                  mentors.map((mentor) => (
                    <tr key={mentor.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        #{mentor.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                        {mentor.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 font-medium">
                        {mentor.collegeName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-650 font-mono">
                        {mentor.techStack}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-bold text-primary">
                        {mentor.totalCohorts}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminMentors;
