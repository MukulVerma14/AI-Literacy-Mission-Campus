import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMentorCohorts, getCohortMembers, getCohortProgress } from '../../api/mentor';
import { issueCertificate } from '../../api/cert';
import { getCohortSessions } from '../../api/session';
import { gradeAssessment, getCohortAssessments, getMenteeAssessments } from '../../api/assessment';
import { showToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import GradeBadge from '../../components/GradeBadge';

const SCHEDULE_DISPLAY = {
  FOUR_WEEKS: '4 Weeks (20 days)',
  SIX_WEEKS: '6 Weeks (3 days/week)',
  TEN_WEEKS: '10 Weeks (Weekends only)',
};

const DISPLAY_NAMES = {
  QUIZ_1: 'Quiz 1',
  QUIZ_2: 'Quiz 2',
  FINAL_TEST: 'Final Test',
  CAPSTONE: 'Capstone',
};

const CohortDetail = () => {
  const { id } = useParams();
  const cohortId = LongParam(id);

  const [cohort, setCohort] = useState(null);
  const [members, setMembers] = useState([]);
  const [progress, setProgress] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [menteeSummaries, setMenteeSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members'); // 'members' | 'progress'

  // Certificate Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [mentorRating, setMentorRating] = useState(5);
  const [processingFeeAmount, setProcessingFeeAmount] = useState(75);
  const [capstoneCompleted, setCapstoneCompleted] = useState(true);
  const [certSubmitLoading, setCertSubmitLoading] = useState(false);

  // Grade Modal State
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradeType, setGradeType] = useState('QUIZ_1');
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [gradeSubmitLoading, setGradeSubmitLoading] = useState(false);
  const [gradeInlineError, setGradeInlineError] = useState('');

  // Assessment Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMenteeSummary, setSelectedMenteeSummary] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Assessments Tab State
  const [assessmentsTabFilter, setAssessmentsTabFilter] = useState('ALL');
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [filteredAssessmentsLoading, setFilteredAssessmentsLoading] = useState(false);

  function LongParam(strVal) {
    return strVal ? parseInt(strVal, 10) : null;
  }

  const fetchData = async () => {
    try {
      const allCohorts = await getMentorCohorts();
      const currentCohort = allCohorts.find((c) => c.id === cohortId);
      setCohort(currentCohort);

      const membersData = await getCohortMembers(cohortId);
      setMembers(membersData);

      const progressData = await getCohortProgress(cohortId);
      setProgress(progressData);

      const sessionsData = await getCohortSessions(cohortId);
      setSessions(sessionsData);

      // Fetch assessment summaries for all members
      const summariesMap = {};
      await Promise.all(
        membersData.map(async (m) => {
          try {
            const summary = await getMenteeAssessments(m.id);
            summariesMap[m.id] = summary;
          } catch (err) {
            console.error('Failed to load assessments for mentee ' + m.id, err);
          }
        })
      );
      setMenteeSummaries(summariesMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cohortId) {
      fetchData();
    }
  }, [cohortId]);

  const handleOpenCertModal = (mentee) => {
    // Find mentee's latest progress log details to confirm capstone hours
    const menteeProgress = progress.find((p) => p.id === mentee.id);
    const capstoneHours = menteeProgress ? menteeProgress.capstoneHours : 0;

    if (capstoneHours === 0) {
      showToast('error', 'Cannot issue certificate: Mentee must log at least 1 Capstone hour.');
      return;
    }

    setSelectedMentee(mentee);
    setMentorRating(5);
    setProcessingFeeAmount(75);
    setCapstoneCompleted(true);
    setCertModalOpen(true);
  };

  const handleIssueCertSubmit = async (e) => {
    e.preventDefault();
    if (processingFeeAmount < 50 || processingFeeAmount > 75) {
      showToast('error', 'Processing fee amount must be between 50 and 75.');
      return;
    }

    setCertSubmitLoading(true);
    try {
      await issueCertificate(selectedMentee.id, {
        mentorRating,
        processingFeeAmount: parseFloat(processingFeeAmount),
        capstoneCompleted,
      });

      showToast('success', `Certificate issued successfully for ${selectedMentee.email}!`);
      setCertModalOpen(false);
      fetchData(); // Refresh details
    } catch (err) {
      console.error(err);
    } finally {
      setCertSubmitLoading(false);
    }
  };

  const handleOpenGradeModal = (mentee, defaultType = 'QUIZ_1') => {
    setSelectedMentee(mentee);
    setGradeType(defaultType);
    
    // Check if score exists in summary
    const summary = menteeSummaries[mentee.id];
    let score = '';
    let feedback = '';
    
    if (summary) {
      const existing = summary.assessments?.find(a => a.type === defaultType);
      if (existing) {
        score = existing.score.toString();
        feedback = existing.mentorFeedback || '';
      }
    }
    
    setGradeScore(score);
    setGradeFeedback(feedback);
    setGradeInlineError('');
    setGradeModalOpen(true);
  };

  const handleGradeTypeChange = (newType) => {
    setGradeType(newType);
    const summary = menteeSummaries[selectedMentee.id];
    let score = '';
    let feedback = '';
    if (summary) {
      const existing = summary.assessments?.find(a => a.type === newType);
      if (existing) {
        score = existing.score.toString();
        feedback = existing.mentorFeedback || '';
      }
    }
    setGradeScore(score);
    setGradeFeedback(feedback);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setGradeInlineError('');

    const scoreNum = parseFloat(gradeScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      setGradeInlineError('Score must be a number between 0 and 100.');
      return;
    }

    setGradeSubmitLoading(true);
    try {
      await gradeAssessment({
        menteeId: selectedMentee.id,
        type: gradeType,
        score: scoreNum,
        mentorFeedback: gradeFeedback.trim() || null,
      });

      showToast('success', 'Grade saved!');
      setGradeModalOpen(false);

      // Refresh data
      setLoading(true);
      await fetchData();
      
      // If we are currently in filtered view on Assessments tab, reload it
      if (activeTab === 'assessments' && assessmentsTabFilter !== 'ALL') {
        setFilteredAssessmentsLoading(true);
        const data = await getCohortAssessments(cohortId, assessmentsTabFilter);
        setFilteredAssessments(data);
        setFilteredAssessmentsLoading(false);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to save grade.';
      setGradeInlineError(msg);
    } finally {
      setGradeSubmitLoading(false);
    }
  };

  const handleOpenDetailModal = async (mentee) => {
    setSelectedMentee(mentee);
    setDetailLoading(true);
    setDetailModalOpen(true);
    try {
      const data = await getMenteeAssessments(mentee.id);
      setSelectedMenteeSummary(data);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to load assessment summary.');
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleFilterChange = async (type) => {
    setAssessmentsTabFilter(type);
    if (type !== 'ALL') {
      setFilteredAssessmentsLoading(true);
      try {
        const data = await getCohortAssessments(cohortId, type);
        setFilteredAssessments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFilteredAssessmentsLoading(false);
      }
    }
  };

  const getScoreColorClass = (score) => {
    if (score === null || score === undefined) return 'text-slate-400 font-medium';
    if (score >= 75) return 'text-green-600 font-bold';
    if (score >= 50) return 'text-amber-600 font-bold';
    return 'text-rose-600 font-bold';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="flex-1 p-8 bg-slate-50 text-center">
        <h3 className="text-xl font-bold text-slate-800">Cohort not found</h3>
        <Link to="/mentor/dashboard" className="text-primary hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="text-sm font-semibold text-slate-500 flex items-center gap-2">
          <Link to="/mentor/dashboard" className="hover:text-slate-800 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-900">Cohort Details</span>
        </div>

        {/* Cohort Details Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{cohort.cohortName}</h1>
              <Badge status={cohort.currentMembers >= cohort.maxMembers ? 'FULL' : 'OPEN'} />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-400">City:</span>{' '}
                <span className="text-slate-800 font-semibold">{cohort.city}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-400">Schedule:</span>{' '}
                <span className="text-slate-800 font-semibold">{SCHEDULE_DISPLAY[cohort.scheduleOptions] || cohort.scheduleOptions}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-400">Mentor:</span>{' '}
                <span className="text-slate-800 font-semibold">{cohort.mentorName}</span>
              </p>
            </div>
          </div>
          <div className="bg-primary/5 rounded-xl px-5 py-3 border border-primary/10">
            <p className="text-xs text-primary font-bold uppercase tracking-wider">Cohort Enlistment</p>
            <p className="text-2xl font-black text-primary mt-1">
              {cohort.currentMembers} <span className="text-sm font-semibold text-slate-500">/ {cohort.maxMembers} Mentees</span>
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="border-b border-slate-200">
          <nav className="flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-1 border-b-2 font-bold text-sm transition-all focus:outline-none ${
                activeTab === 'members'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-4 px-1 border-b-2 font-bold text-sm transition-all focus:outline-none ${
                activeTab === 'progress'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Progress Tracker
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-1 border-b-2 font-bold text-sm transition-all focus:outline-none ${
                activeTab === 'sessions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Sessions ({sessions.length})
            </button>
            <button
              onClick={() => setActiveTab('assessments')}
              className={`py-4 px-1 border-b-2 font-bold text-sm transition-all focus:outline-none ${
                activeTab === 'assessments'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Assessments
            </button>
          </nav>
        </div>

        {/* Tab Panels */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Mentee Email
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Target AI/ML Skill
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Job Function / Major
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-24">
                      Avg Score
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-20">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider w-72">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-sm text-slate-500">
                        No mentees have joined this cohort yet.
                      </td>
                    </tr>
                  ) : (
                    members.map((mentee) => {
                      const isCertIssued = progress.find((p) => p.id === mentee.id)?.certificationIssued || false;
                      const capHours = progress.find((p) => p.id === mentee.id)?.capstoneHours || 0;
                      const summary = menteeSummaries[mentee.id];
                      const avg = summary?.averageScore;

                      return (
                        <tr key={mentee.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                            {mentee.email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                            {mentee.targetSkill || '—'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                            {mentee.currentJobFunction || '—'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold">
                            <span className={getScoreColorClass(avg)}>
                              {avg !== null && avg !== undefined ? `${avg.toFixed(1)}%` : '—'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1.5 text-success font-medium">
                              <span className="w-1.5 h-1.5 bg-success rounded-full" /> Yes
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm space-x-2">
                            <button
                              onClick={() => handleOpenGradeModal(mentee)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-250 shadow-sm"
                            >
                              Grade &rarr;
                            </button>
                            <button
                              onClick={() => handleOpenDetailModal(mentee)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-150 text-slate-650 transition-colors border border-slate-200 shadow-sm"
                            >
                              View Scores
                            </button>
                            {isCertIssued ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-50 text-success border border-green-200">
                                Certificate Issued
                              </span>
                            ) : (
                              <button
                                onClick={() => handleOpenCertModal(mentee)}
                                disabled={capHours === 0}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                  capHours === 0
                                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-primary text-white border-primary hover:bg-blue-600 shadow-sm'
                                }`}
                                title={capHours === 0 ? 'Mentee must log capstone progress first' : 'Issue certificate'}
                              >
                                Issue Cert
                              </button>
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
        )}

        {activeTab === 'progress' && (
          <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Mentee Email
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      MasterClass Hrs
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Self-Practice Hrs
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Capstone Hrs
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Total/70
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Cert Issued?
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {progress.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-sm text-slate-500">
                        No progress logged by members yet.
                      </td>
                    </tr>
                  ) : (
                    progress.map((mentee) => {
                      const total = mentee.totalHoursCompleted || 0;
                      const percent = Math.min(Math.round((total / 70) * 100), 100);

                      return (
                        <tr key={mentee.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                            {mentee.email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold text-track-blue">
                            {mentee.masterClassHours || 0} / 30
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold text-track-green">
                            {mentee.selfPracticeHours || 0} / 30
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold text-track-orange">
                            {mentee.capstoneHours || 0} / 10
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-bold text-slate-900">{total} hrs</span>
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
        )}

        {activeTab === 'sessions' && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Sessions</p>
                <p className="text-2xl font-black text-slate-800 mt-1">
                  {sessions.length} <span className="text-sm font-semibold text-slate-505">sessions scheduled out of {cohort.scheduleOptions === 'SIX_WEEKS' ? 18 : 20}</span>
                </p>
              </div>
              <Link
                to={`/mentor/cohorts/${cohortId}/sessions`}
                className="px-4 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:bg-blue-600 shadow-sm transition-colors text-center"
              >
                Manage Sessions &rarr;
              </Link>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/50">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min((sessions.length / (cohort.scheduleOptions === 'SIX_WEEKS' ? 18 : 20)) * 100, 100)}%` }}
              />
            </div>

            {/* Mini Session List */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Session Log Preview</h4>
              {sessions.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No sessions scheduled yet.</p>
              ) : (
                <div className="overflow-x-auto border border-slate-150 rounded-lg">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">Day</th>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">Topic</th>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">Mode</th>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {sessions.slice(0, 5).map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50">
                          <td className="whitespace-nowrap px-4 py-2 text-xs font-semibold text-slate-800">Day {s.dayNumber}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-xs text-slate-600 font-medium">{s.topic}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-xs font-bold text-slate-500 uppercase">{s.mode}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-xs text-slate-500">
                            {new Date(s.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sessions.length > 5 && (
                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                      <Link to={`/mentor/cohorts/${cohortId}/sessions`} className="text-xs font-bold text-primary hover:underline">
                        View all {sessions.length} sessions...
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Issue Certificate Modal */}
        <Modal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          title="Issue Certificate & Complete Track"
        >
          {selectedMentee && (
            <form onSubmit={handleIssueCertSubmit} className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Recipient</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{selectedMentee.email}</p>
              </div>

              {/* Star Rating Select */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mentor Rating (1-5 Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setMentorRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${
                        star <= mentorRating ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Processing Fee Slider/Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="processing-fee" className="block text-sm font-medium text-slate-700">
                    Processing Fee Amount (Rs 50 - 75)
                  </label>
                  <span className="text-sm font-bold text-slate-800">Rs. {processingFeeAmount}</span>
                </div>
                <input
                  id="processing-fee"
                  type="range"
                  min="50"
                  max="75"
                  step="1"
                  value={processingFeeAmount}
                  onChange={(e) => setProcessingFeeAmount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Rs. 50</span>
                  <span>Rs. 75</span>
                </div>
              </div>

              {/* Capstone Completed Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="capstone-comp"
                  type="checkbox"
                  checked={capstoneCompleted}
                  onChange={(e) => setCapstoneCompleted(e.target.checked)}
                  className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                />
                <label htmlFor="capstone-comp" className="text-sm font-medium text-slate-700">
                  Capstone project verified and completed?
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-sm font-bold text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={certSubmitLoading}
                  className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {certSubmitLoading ? <Spinner size="sm" color="text-white" /> : 'Confirm & Issue'}
                </button>
              </div>
            </form>
          )}
        </Modal>

        {activeTab === 'assessments' && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 space-y-6">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100">
              {['ALL', 'QUIZ_1', 'QUIZ_2', 'FINAL_TEST', 'CAPSTONE'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange(type)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all shadow-sm ${
                    assessmentsTabFilter === type
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-250'
                  }`}
                >
                  {type === 'ALL'
                    ? 'All'
                    : type === 'QUIZ_1'
                    ? 'Quiz 1'
                    : type === 'QUIZ_2'
                    ? 'Quiz 2'
                    : type === 'FINAL_TEST'
                    ? 'Final Test'
                    : 'Capstone'}
                </button>
              ))}
            </div>

            {/* Table Content */}
            {assessmentsTabFilter === 'ALL' ? (
              /* All View */
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mentee</th>
                      <th scope="col" className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz 1</th>
                      <th scope="col" className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz 2</th>
                      <th scope="col" className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Final Test</th>
                      <th scope="col" className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Capstone</th>
                      <th scope="col" className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Avg</th>
                      <th scope="col" className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                      <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {members.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-10 text-center text-sm text-slate-500">No members in this cohort.</td>
                      </tr>
                    ) : (
                      members.map((mentee) => {
                        const summary = menteeSummaries[mentee.id];
                        const avg = summary?.averageScore;
                        const grade = summary?.overallGrade;

                        return (
                          <tr key={mentee.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{mentee.email}</td>
                            <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                              <span className={getScoreColorClass(summary?.quiz1Score)}>
                                {summary?.quiz1Score !== null && summary?.quiz1Score !== undefined ? summary.quiz1Score.toFixed(1) : '—'}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                              <span className={getScoreColorClass(summary?.quiz2Score)}>
                                {summary?.quiz2Score !== null && summary?.quiz2Score !== undefined ? summary.quiz2Score.toFixed(1) : '—'}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                              <span className={getScoreColorClass(summary?.finalTestScore)}>
                                {summary?.finalTestScore !== null && summary?.finalTestScore !== undefined ? summary.finalTestScore.toFixed(1) : '—'}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                              <span className={getScoreColorClass(summary?.capstoneScore)}>
                                {summary?.capstoneScore !== null && summary?.capstoneScore !== undefined ? summary.capstoneScore.toFixed(1) : '—'}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-bold">
                              <span className={getScoreColorClass(avg)}>
                                {avg !== null && avg !== undefined ? `${avg.toFixed(1)}%` : '—'}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-center text-sm">
                              <GradeBadge grade={grade} />
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                              <button
                                onClick={() => handleOpenGradeModal(mentee)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white border border-primary hover:bg-blue-600 shadow-sm transition-colors"
                              >
                                Grade
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Filtered View */
              <div className="overflow-x-auto">
                {filteredAssessmentsLoading ? (
                  <div className="p-12 flex justify-center"><Spinner size="md" /></div>
                ) : filteredAssessments.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">No grades logged yet for this type in this cohort.</div>
                ) : (
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mentee Email</th>
                        <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-28">Score</th>
                        <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Grade</th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Feedback</th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Graded At</th>
                        <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredAssessments.map((record) => {
                        const menteeObj = members.find((m) => m.id === record.menteeId);
                        return (
                          <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{record.menteeEmail}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-bold">
                              <span className={getScoreColorClass(record.score)}>
                                {record.score.toFixed(1)} / 100
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                              <GradeBadge grade={record.grade} />
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-655 max-w-xs truncate" title={record.mentorFeedback}>
                              {record.mentorFeedback || '—'}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-550">{formatDate(record.gradedAt)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                              <button
                                onClick={() => menteeObj && handleOpenGradeModal(menteeObj, assessmentsTabFilter)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white border border-primary hover:bg-blue-600 shadow-sm transition-colors"
                              >
                                Grade
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* Issue Certificate Modal */}
        <Modal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          title="Issue Certificate & Complete Track"
        >
          {selectedMentee && (
            <form onSubmit={handleIssueCertSubmit} className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Recipient</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{selectedMentee.email}</p>
              </div>

              {/* Star Rating Select */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mentor Rating (1-5 Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setMentorRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${
                        star <= mentorRating ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Processing Fee Slider/Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="processing-fee" className="block text-sm font-medium text-slate-700">
                    Processing Fee Amount (Rs 50 - 75)
                  </label>
                  <span className="text-sm font-bold text-slate-800">Rs. {processingFeeAmount}</span>
                </div>
                <input
                  id="processing-fee"
                  type="range"
                  min="50"
                  max="75"
                  step="1"
                  value={processingFeeAmount}
                  onChange={(e) => setProcessingFeeAmount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Rs. 50</span>
                  <span>Rs. 75</span>
                </div>
              </div>

              {/* Capstone Completed Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="capstone-comp"
                  type="checkbox"
                  checked={capstoneCompleted}
                  onChange={(e) => setCapstoneCompleted(e.target.checked)}
                  className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                />
                <label htmlFor="capstone-comp" className="text-sm font-medium text-slate-700">
                  Capstone project verified and completed?
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-sm font-bold text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={certSubmitLoading}
                  className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {certSubmitLoading ? <Spinner size="sm" color="text-white" /> : 'Confirm & Issue'}
                </button>
              </div>
            </form>
          )}
        </Modal>

        {/* Grade Assessment Modal */}
        <Modal
          isOpen={gradeModalOpen}
          onClose={() => setGradeModalOpen(false)}
          title="Grade Assessment"
        >
          {selectedMentee && (
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              {gradeInlineError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-lg">
                  {gradeInlineError}
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Mentee</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{selectedMentee.email}</p>
              </div>

              <div>
                <label htmlFor="grade-type" className="block text-sm font-semibold text-slate-700 mb-1">
                  Assessment Type
                </label>
                <select
                  id="grade-type"
                  value={gradeType}
                  onChange={(e) => handleGradeTypeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
                >
                  <option value="QUIZ_1">Quiz 1{menteeSummaries[selectedMentee.id]?.quiz1Score !== null && menteeSummaries[selectedMentee.id]?.quiz1Score !== undefined ? ' (Update Grade)' : ''}</option>
                  <option value="QUIZ_2">Quiz 2{menteeSummaries[selectedMentee.id]?.quiz2Score !== null && menteeSummaries[selectedMentee.id]?.quiz2Score !== undefined ? ' (Update Grade)' : ''}</option>
                  <option value="FINAL_TEST">Final Test{menteeSummaries[selectedMentee.id]?.finalTestScore !== null && menteeSummaries[selectedMentee.id]?.finalTestScore !== undefined ? ' (Update Grade)' : ''}</option>
                  <option value="CAPSTONE">Capstone{menteeSummaries[selectedMentee.id]?.capstoneScore !== null && menteeSummaries[selectedMentee.id]?.capstoneScore !== undefined ? ' (Update Grade)' : ''}</option>
                </select>
              </div>

              <div>
                <label htmlFor="grade-score" className="block text-sm font-semibold text-slate-700 mb-1">
                  Score (0 - 100)
                </label>
                <input
                  id="grade-score"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="e.g. 85.5"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="grade-feedback" className="block text-sm font-semibold text-slate-700 mb-1">
                  Mentor Feedback
                </label>
                <textarea
                  id="grade-feedback"
                  rows="3"
                  placeholder="Add feedback for the mentee..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradeModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-sm font-bold text-slate-655 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={gradeSubmitLoading}
                  className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {gradeSubmitLoading ? <Spinner size="sm" color="text-white" /> : 'Save Grade'}
                </button>
              </div>
            </form>
          )}
        </Modal>

        {/* Assessment Details Modal */}
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title="Mentee Scoreboard"
        >
          {detailLoading ? (
            <div className="p-12 flex justify-center"><Spinner size="lg" /></div>
          ) : selectedMenteeSummary ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mentee</span>
                  <span className="text-sm font-semibold text-slate-800">{selectedMenteeSummary.menteeEmail}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Score</span>
                  <span className={`text-base font-bold ${getScoreColorClass(selectedMenteeSummary.averageScore)}`}>
                    {selectedMenteeSummary.averageScore !== null && selectedMenteeSummary.averageScore !== undefined
                      ? `${selectedMenteeSummary.averageScore.toFixed(1)}%`
                      : '—'}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Grade</span>
                  <div className="mt-0.5">
                    <GradeBadge grade={selectedMenteeSummary.overallGrade} />
                  </div>
                </div>
              </div>

              {/* Eligibility status banner */}
              <div>
                {selectedMenteeSummary.eligibleForCert ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 flex items-center gap-2 text-green-700">
                    <span className="text-base">✓</span>
                    <span className="text-xs font-semibold">Eligible for certification</span>
                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center gap-2 text-rose-700">
                    <span className="text-base">✗</span>
                    <span className="text-xs font-semibold">Score below 50 — not eligible</span>
                  </div>
                )}
              </div>

              {/* Score breakdown table */}
              <div className="border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                      <th scope="col" className="px-4 py-2.5 text-center text-xs font-bold text-slate-500 uppercase w-20">Score</th>
                      <th scope="col" className="px-4 py-2.5 text-center text-xs font-bold text-slate-500 uppercase w-16">Grade</th>
                      <th scope="col" className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {['QUIZ_1', 'QUIZ_2', 'FINAL_TEST', 'CAPSTONE'].map((typeKey) => {
                      const assessment = selectedMenteeSummary.assessments?.find((a) => a.type === typeKey);
                      return (
                        <tr key={typeKey}>
                          <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-800">
                            {DISPLAY_NAMES[typeKey] || typeKey}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold">
                            {assessment ? (
                              <span className={getScoreColorClass(assessment.score)}>
                                {assessment.score.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Not graded</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-center text-xs">
                            {assessment ? <GradeBadge grade={assessment.grade} /> : '—'}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600 max-w-[120px] truncate" title={assessment?.mentorFeedback}>
                            {assessment?.mentorFeedback || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setDetailModalOpen(false)}
                  className="px-5 py-2 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-700 shadow-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </Modal>

      </div>
    </div>
  );
};

export default CohortDetail;
