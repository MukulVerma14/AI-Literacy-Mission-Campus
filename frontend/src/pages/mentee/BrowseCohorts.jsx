import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableCohorts, joinCohort, getMenteeProfile } from '../../api/mentee';
import { showToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import Badge from '../../components/Badge';

const SCHEDULE_DISPLAY = {
  FOUR_WEEKS: '4 Weeks (20 days)',
  SIX_WEEKS: '6 Weeks (3 days/week)',
  TEN_WEEKS: '10 Weeks (Weekends only)',
};

const BrowseCohorts = () => {
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [joinLoadingId, setJoinLoadingId] = useState(null);

  const fetchCohortsAndProfile = async (cityVal = '') => {
    try {
      const cohortData = await getAvailableCohorts(cityVal);
      setCohorts(cohortData);
      
      const profileData = await getMenteeProfile();
      setProfile(profileData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohortsAndProfile();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchCohortsAndProfile(cityFilter);
  };

  const handleClearSearch = () => {
    setCityFilter('');
    setLoading(true);
    fetchCohortsAndProfile('');
  };

  const handleJoinCohort = async (cohortId) => {
    setJoinLoadingId(cohortId);
    try {
      await joinCohort(cohortId);
      showToast('success', 'Joined cohort successfully!');
      navigate('/mentee/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setJoinLoadingId(null);
    }
  };

  if (loading && cohorts.length === 0 && !profile) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  const alreadyInCohort = profile && profile.cohortId != null;

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Browse Available Cohorts</h1>
          <p className="text-slate-500 mt-2">Find and enroll in a cohort based in your campus city to start your learning journey.</p>
        </div>

        {/* City Filter Search */}
        <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              🔍
            </span>
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-350 rounded-lg text-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Filter by city (e.g. Mumbai, Bangalore, Delhi)"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              Search
            </button>
            {cityFilter && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2.5 border border-slate-200 text-sm font-bold text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Cohorts Results */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Spinner size="md" />
          </div>
        ) : cohorts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 border border-slate-100 text-center">
            <h3 className="text-lg font-bold text-slate-700">No open cohorts found</h3>
            <p className="text-slate-500 text-sm mt-1">Try searching for a different city or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cohorts.map((cohort) => {
              const isFull = cohort.currentMembers >= cohort.maxMembers || !cohort.hasSpace;
              const isJoinedThis = profile && profile.cohortId === cohort.id;

              return (
                <div
                  key={cohort.id}
                  className="bg-white rounded-xl border border-slate-150 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{cohort.cohortName}</h3>
                      <Badge status={isFull ? 'FULL' : 'OPEN'} />
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-slate-400">City:</span>
                        <span className="text-slate-800 font-semibold">{cohort.city}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-slate-400">Mentor Email:</span>
                        <span className="text-slate-800 font-semibold">{cohort.mentorName || '—'}</span>
                      </p>
                      {cohort.mentorCollege && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-slate-400">College:</span>
                          <span className="text-slate-800 font-semibold">{cohort.mentorCollege}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-slate-400">Schedule:</span>
                        <span className="text-slate-800 font-semibold">
                          {SCHEDULE_DISPLAY[cohort.scheduleOptions] || cohort.scheduleOptions}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-slate-400">Spots:</span>
                        <span className="text-slate-800 font-semibold">{cohort.currentMembers} / {cohort.maxMembers} filled</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 px-6 py-4 rounded-b-xl border-t border-slate-100 flex items-center justify-between">
                    {isJoinedThis ? (
                      <span className="text-sm font-bold text-success w-full text-center py-2 bg-green-50 border border-green-200 rounded-lg">
                        Joined ✓
                      </span>
                    ) : alreadyInCohort ? (
                      <button
                        disabled
                        className="w-full py-2 bg-slate-100 border border-slate-200 text-slate-400 text-sm font-bold rounded-lg cursor-not-allowed"
                      >
                        Already in a cohort
                      </button>
                    ) : isFull ? (
                      <button
                        disabled
                        className="w-full py-2 bg-slate-100 border border-slate-200 text-slate-400 text-sm font-bold rounded-lg cursor-not-allowed"
                      >
                        Cohort is Full
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinCohort(cohort.id)}
                        disabled={joinLoadingId !== null}
                        className="w-full py-2 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2"
                      >
                        {joinLoadingId === cohort.id ? <Spinner size="sm" color="text-white" /> : 'Join Cohort'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default BrowseCohorts;
