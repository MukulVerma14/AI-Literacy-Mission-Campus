import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMentorCohorts, getCohortMembers, getCohortProgress } from '../../api/mentor';
import { issueCertificate } from '../../api/cert';
import { showToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';

const SCHEDULE_DISPLAY = {
  FOUR_WEEKS: '4 Weeks (20 days)',
  SIX_WEEKS: '6 Weeks (3 days/week)',
  TEN_WEEKS: '10 Weeks (Weekends only)',
};

const CohortDetail = () => {
  const { id } = useParams();
  const cohortId = LongParam(id);

  const [cohort, setCohort] = useState(null);
  const [members, setMembers] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members'); // 'members' | 'progress'

  // Certificate Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [mentorRating, setMentorRating] = useState(5);
  const [processingFeeAmount, setProcessingFeeAmount] = useState(75);
  const [capstoneCompleted, setCapstoneCompleted] = useState(true);
  const [certSubmitLoading, setCertSubmitLoading] = useState(false);

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
          </nav>
        </div>

        {/* Tab Panels */}
        {activeTab === 'members' ? (
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
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-500">
                        No mentees have joined this cohort yet.
                      </td>
                    </tr>
                  ) : (
                    members.map((mentee) => {
                      const isCertIssued = progress.find((p) => p.id === mentee.id)?.certificationIssued || false;
                      const capHours = progress.find((p) => p.id === mentee.id)?.capstoneHours || 0;

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
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1.5 text-success font-medium">
                              <span className="w-1.5 h-1.5 bg-success rounded-full" /> Yes
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
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
        ) : (
          /* Progress Tab */
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

      </div>
    </div>
  );
};

export default CohortDetail;
