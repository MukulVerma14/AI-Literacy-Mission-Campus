import React, { useState, useEffect } from 'react';
import { getLearningJourney, logProgress } from '../../api/mentee';
import { showToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import ProgressBar from '../../components/ProgressBar';

const TRACK_DISPLAY = {
  MASTER_CLASS: 'MasterClass',
  SELF_PRACTICE: 'Self-Practice',
  CAPSTONE: 'Capstone Project',
};

const TRACK_LIMITS = {
  MASTER_CLASS: 30,
  SELF_PRACTICE: 30,
  CAPSTONE: 10,
};

const LearningTracker = () => {
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [trackType, setTrackType] = useState('MASTER_CLASS');
  const [hoursCompleted, setHoursCompleted] = useState('');
  const [topicCovered, setTopicCovered] = useState('');
  const [learningOutcomeNotes, setLearningOutcomeNotes] = useState('');
  const [productivityImpactNotes, setProductivityImpactNotes] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchJourney = async () => {
    try {
      const data = await getLearningJourney();
      setJourney(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  const handleLogProgress = async (e) => {
    e.preventDefault();
    const hours = parseInt(hoursCompleted, 10);
    if (isNaN(hours) || hours <= 0) {
      showToast('error', 'Please enter a valid positive number of hours');
      return;
    }
    if (!topicCovered.trim() || !learningOutcomeNotes.trim() || !productivityImpactNotes.trim()) {
      showToast('error', 'Please fill in all description fields');
      return;
    }

    setSubmitLoading(true);
    try {
      await logProgress({
        trackType,
        hoursCompleted: hours,
        topicCovered,
        learningOutcomeNotes,
        productivityImpactNotes,
      });

      showToast('success', 'Progress logged successfully!');
      setModalOpen(false);
      
      // Reset form
      setHoursCompleted('');
      setTopicCovered('');
      setLearningOutcomeNotes('');
      setProductivityImpactNotes('');
      setTrackType('MASTER_CLASS');

      // Refresh data
      fetchJourney();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading && !journey) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  const logs = journey?.logs || [];

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header and Log button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Learning Tracker</h1>
            <p className="text-slate-500 mt-1">Log your practice hours and track your milestone updates.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-blue-600 transition-colors shadow-md shadow-primary/20 flex items-center gap-2"
          >
            + Log Progress
          </button>
        </div>

        {/* Progress Overview Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Curriculum Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-500">Aggregate Progress:</span>
            <span className="text-lg font-extrabold text-slate-800">{journey?.totalHours || 0} / 70 hours completed</span>
          </div>
        </div>

        {/* Log History */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Progress Log History</h3>

          <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Track Type
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Hours Completed
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Topic Covered
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Notes & Outcomes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-500">
                        No progress logs found. Click "Log Progress" to submit your first entry.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const date = new Date(log.loggedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      });

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                            {date}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              log.trackType === 'MASTER_CLASS'
                                ? 'bg-blue-100 text-track-blue'
                                : log.trackType === 'SELF_PRACTICE'
                                ? 'bg-green-100 text-track-green'
                                : 'bg-orange-100 text-track-orange'
                            }`}>
                              {TRACK_DISPLAY[log.trackType] || log.trackType}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold text-slate-800">
                            {log.hoursCompleted} hr{log.hoursCompleted > 1 && 's'}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">
                            {log.topicCovered}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">
                            <div className="font-medium text-slate-800">Outcome:</div>
                            <div className="text-slate-500 mb-1">{log.learningOutcomeNotes}</div>
                            <div className="font-medium text-slate-800">Productivity:</div>
                            <div className="text-slate-500">{log.productivityImpactNotes}</div>
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

        {/* Log Progress Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Log Learning Progress"
        >
          <form onSubmit={handleLogProgress} className="space-y-4">
            <div>
              <label htmlFor="log-track" className="block text-sm font-medium text-slate-700 mb-1">
                Track Type
              </label>
              <select
                id="log-track"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-primary focus:border-primary bg-white"
                value={trackType}
                onChange={(e) => setTrackType(e.target.value)}
              >
                <option value="MASTER_CLASS">MasterClass (Max 30 hrs)</option>
                <option value="SELF_PRACTICE">Self-Practice (Max 30 hrs)</option>
                <option value="CAPSTONE">Capstone Project (Max 10 hrs)</option>
              </select>
            </div>

            <div>
              <label htmlFor="log-hours" className="block text-sm font-medium text-slate-700 mb-1">
                Hours Completed
              </label>
              <input
                id="log-hours"
                type="number"
                min="1"
                max={TRACK_LIMITS[trackType]}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder={`1 - ${TRACK_LIMITS[trackType]}`}
                value={hoursCompleted}
                onChange={(e) => setHoursCompleted(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="log-topic" className="block text-sm font-medium text-slate-700 mb-1">
                Topic Covered
              </label>
              <input
                id="log-topic"
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g. Fine-tuning Llama-3 using QLoRA"
                value={topicCovered}
                onChange={(e) => setTopicCovered(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="log-outcome" className="block text-sm font-medium text-slate-700 mb-1">
                Learning Outcome Notes
              </label>
              <textarea
                id="log-outcome"
                rows="3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="What did you learn? What codebase or concepts were practiced?"
                value={learningOutcomeNotes}
                onChange={(e) => setLearningOutcomeNotes(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="log-productivity" className="block text-sm font-medium text-slate-700 mb-1">
                Productivity Impact Notes
              </label>
              <textarea
                id="log-productivity"
                rows="3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="How did this impact your workflow, coding, or college projects?"
                value={productivityImpactNotes}
                onChange={(e) => setProductivityImpactNotes(e.target.value)}
                required
              />
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
                {submitLoading ? <Spinner size="sm" color="text-white" /> : 'Log Entry'}
              </button>
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
};

export default LearningTracker;
