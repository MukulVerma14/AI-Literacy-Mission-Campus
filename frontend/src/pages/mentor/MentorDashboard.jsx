import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMentorProfile, getMentorCohorts, createCohort } from '../../api/mentor';
import { showToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';

const SCHEDULE_DISPLAY = {
  FOUR_WEEKS: '4 Weeks (20 days)',
  SIX_WEEKS: '6 Weeks (3 days/week)',
  TEN_WEEKS: '10 Weeks (Weekends only)',
};

const MentorDashboard = () => {
  const { email } = useAuth();
  const [profile, setProfile] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [cohortName, setCohortName] = useState('');
  const [city, setCity] = useState('');
  const [scheduleOptions, setScheduleOptions] = useState('FOUR_WEEKS');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchData = async () => {
    try {
      const profileData = await getMentorProfile();
      setProfile(profileData);
      const cohortsData = await getMentorCohorts();
      setCohorts(cohortsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCohort = async (e) => {
    e.preventDefault();
    if (!cohortName.trim() || !city.trim()) {
      showToast('error', 'Please fill in all fields');
      return;
    }

    setSubmitLoading(true);
    try {
      await createCohort({ cohortName, city, scheduleOptions });
      showToast('success', 'Cohort created successfully!');
      setModalOpen(false);
      // Reset form
      setCohortName('');
      setCity('');
      setScheduleOptions('FOUR_WEEKS');
      // Refresh list
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalMentees = cohorts.reduce((sum, c) => sum + (c.currentMembers || 0), 0);

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Welcome back!</h2>
            <p className="text-slate-400 mt-1 font-medium">{email}</p>
            {profile && (
              <p className="text-xs text-slate-500 mt-2">
                College: <span className="text-slate-300 font-semibold">{profile.collegeName}</span> | Tech Stack: <span className="text-slate-300 font-semibold">{profile.techStack}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-blue-600 transition-colors shadow-md shadow-primary/20"
          >
            + Create New Cohort
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            label="Total Cohorts"
            value={cohorts.length}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatCard
            label="Total Mentees"
            value={totalMentees}
            color="bg-success/10 text-success"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
        </div>

        {/* Cohorts Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
            My Cohorts
          </h3>

          {cohorts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-10 border border-slate-100 text-center">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h4 className="text-lg font-bold text-slate-700">No cohorts found</h4>
              <p className="text-slate-500 text-sm mt-1 mb-6">Create a cohort in your city to start accepting mentees.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Cohort
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cohorts.map((cohort) => (
                <div
                  key={cohort.id}
                  className="bg-white rounded-xl border border-slate-150 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-lg text-slate-900 line-clamp-1">{cohort.cohortName}</h4>
                      <Badge status={cohort.currentMembers >= cohort.maxMembers ? 'FULL' : 'OPEN'} />
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-slate-400">City:</span>
                        <span className="text-slate-800 font-semibold">{cohort.city}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-slate-400">Schedule:</span>
                        <span className="text-slate-800 font-semibold">{SCHEDULE_DISPLAY[cohort.scheduleOptions] || cohort.scheduleOptions}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-slate-400">Capacity:</span>
                        <span className="text-slate-800 font-semibold">{cohort.currentMembers} / {cohort.maxMembers} spots filled</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-6 py-4 rounded-b-xl border-t border-slate-100">
                    <Link
                      to={`/mentor/cohorts/${cohort.id}`}
                      className="block text-center w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Cohort Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Create New Cohort"
        >
          <form onSubmit={handleCreateCohort} className="space-y-4">
            <div>
              <label htmlFor="cohort-name" className="block text-sm font-medium text-slate-700 mb-1">
                Cohort Name
              </label>
              <input
                id="cohort-name"
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g. Generative AI Foundations - Batch A"
                value={cohortName}
                onChange={(e) => setCohortName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="cohort-city" className="block text-sm font-medium text-slate-700 mb-1">
                City / Location
              </label>
              <input
                id="cohort-city"
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g. Mumbai, Bangalore, Pune"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="cohort-schedule" className="block text-sm font-medium text-slate-700 mb-1">
                Schedule Option
              </label>
              <select
                id="cohort-schedule"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-primary focus:border-primary bg-white"
                value={scheduleOptions}
                onChange={(e) => setScheduleOptions(e.target.value)}
              >
                <option value="FOUR_WEEKS">4 Weeks (20 days)</option>
                <option value="SIX_WEEKS">6 Weeks (3 days/week)</option>
                <option value="TEN_WEEKS">10 Weeks (Weekends only)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-sm font-bold text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                {submitLoading ? <Spinner size="sm" color="text-white" /> : 'Create Cohort'}
              </button>
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
};

export default MentorDashboard;
