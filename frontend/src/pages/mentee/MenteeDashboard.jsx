import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMenteeProfile, getLearningJourney } from '../../api/mentee';
import Spinner from '../../components/Spinner';
import ProgressBar from '../../components/ProgressBar';

const SCHEDULE_DISPLAY = {
  FOUR_WEEKS: '4 Weeks (20 days)',
  SIX_WEEKS: '6 Weeks (3 days/week)',
  TEN_WEEKS: '10 Weeks (Weekends only)',
};

const MenteeDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const profileData = await getMenteeProfile();
      setProfile(profileData);
      const journeyData = await getLearningJourney();
      setJourney(journeyData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  const hasCohort = profile && profile.cohortId;

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-extrabold relative z-10">Hello, {profile?.email}</h2>
          <p className="text-slate-400 mt-1 font-medium relative z-10">Your learning path at AILMC</p>
          {profile && (
            <p className="text-xs text-slate-500 mt-4 relative z-10">
              Target Skill: <span className="text-slate-300 font-semibold">{profile.targetSkill || 'Not set'}</span> | Job Role: <span className="text-slate-300 font-semibold">{profile.currentJobFunction || 'Not set'}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Cohort Membership */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
              Cohort Membership
            </h3>

            {!hasCohort ? (
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 space-y-4 text-center">
                <div className="p-3 bg-amber-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-amber-500">
                  ⚠️
                </div>
                <h4 className="font-bold text-slate-800">You are not in a cohort</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Join a learning cohort to get access to custom mentor reviews, capstone evaluations, and certificate validation.
                </p>
                <Link
                  to="/mentee/cohorts"
                  className="block text-center w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm text-sm"
                >
                  Browse Cohorts
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-slate-150 overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">Active Cohort</span>
                      <h4 className="font-bold text-lg text-slate-900 mt-1">{profile.cohortName}</h4>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-slate-400">City:</span>
                      <span className="text-slate-800 font-semibold">{profile.cohortCity}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-slate-400">Schedule:</span>
                      <span className="text-slate-800 font-semibold">
                        {SCHEDULE_DISPLAY[profile.cohortSchedule] || profile.cohortSchedule}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
                  <span className="text-xs font-medium text-slate-500">
                    Your progress is synchronized with this cohort
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Learning Tracker Progress Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-xl font-bold text-slate-900">
                Progress Widget
              </h3>
              <Link
                to="/mentee/tracker"
                className="text-sm font-bold text-primary hover:text-blue-600 flex items-center gap-1.5"
              >
                Log Progress / View Logs &rarr;
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <ProgressBar
                  label="MasterClass"
                  current={journey?.masterClassHours || 0}
                  max={30}
                  color="bg-track-blue"
                />
                <ProgressBar
                  label="Self-Practice"
                  current={journey?.selfPracticeHours || 0}
                  max={30}
                  color="bg-track-green"
                />
                <ProgressBar
                  label="Capstone Project"
                  current={journey?.capstoneHours || 0}
                  max={10}
                  color="bg-track-orange"
                />
              </div>

              {/* Aggregated progress stats */}
              <div className="border-t border-slate-100 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Progress</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1">
                    {journey?.totalHours || 0} <span className="text-sm font-semibold text-slate-500">/ 70 hrs completed</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {journey?.capstoneCompleted && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-track-orange border border-orange-200 text-xs font-bold rounded-full">
                      ✓ Capstone Completed
                    </span>
                  )}
                  {journey?.certificationIssued && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-success border border-green-200 text-xs font-bold rounded-full">
                      ✓ Certified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MenteeDashboard;
