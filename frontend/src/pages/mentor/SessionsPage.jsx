import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCohortSessions, scheduleSession } from '../../api/session';
import { getMentorCohorts } from '../../api/mentor';
import { showToast } from '../../components/Toast';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

const MODE_COLORS = {
  ONLINE: 'bg-green-50 text-green-700 border-green-200',
  OFFLINE: 'bg-orange-50 text-orange-700 border-orange-200',
  HYBRID: 'bg-purple-50 text-purple-700 border-purple-200',
};

const SCHEDULE_DISPLAY = {
  FOUR_WEEKS: '4 Weeks (20 days)',
  SIX_WEEKS: '6 Weeks (3 days/week)',
  TEN_WEEKS: '10 Weeks (Weekends only)',
};

const SessionsPage = () => {
  const { cohortId: idParam } = useParams();
  const cohortId = idParam ? parseInt(idParam, 10) : null;
  const navigate = useNavigate();

  const [cohort, setCohort] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [dayNumber, setDayNumber] = useState('');
  const [topic, setTopic] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [mode, setMode] = useState('ONLINE');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [inlineError, setInlineError] = useState('');

  const fetchData = async () => {
    if (!cohortId) return;
    try {
      // Get cohort details
      const allCohorts = await getMentorCohorts();
      const currentCohort = allCohorts.find((c) => c.id === cohortId);
      setCohort(currentCohort);

      // Get sessions list
      const sessionsData = await getCohortSessions(cohortId);
      // Sort by day number
      const sorted = [...sessionsData].sort((a, b) => a.dayNumber - b.dayNumber);
      setSessions(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cohortId]);

  const getMaxDays = (schedule) => {
    if (schedule === 'SIX_WEEKS') return 18;
    return 20;
  };

  const handleOpenModal = () => {
    setDayNumber('');
    setTopic('');
    setScheduledAt('');
    setMode('ONLINE');
    setInlineError('');
    setModalOpen(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setInlineError('');

    const dayNum = parseInt(dayNumber, 10);
    const maxDays = cohort ? getMaxDays(cohort.scheduleOptions) : 20;

    if (isNaN(dayNum) || dayNum < 1 || dayNum > maxDays) {
      setInlineError(`Day number must be between 1 and ${maxDays}.`);
      return;
    }

    if (!topic.trim()) {
      setInlineError('Topic is required.');
      return;
    }

    if (!scheduledAt) {
      setInlineError('Date & Time is required.');
      return;
    }

    setSubmitLoading(true);
    try {
      await scheduleSession(cohortId, {
        dayNumber: dayNum,
        topic: topic.trim(),
        scheduledAt,
        mode,
      });
      showToast('success', 'Session scheduled!');
      setModalOpen(false);
      // Refresh list
      setLoading(true);
      fetchData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to schedule session.';
      setInlineError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
      const datePart = date.toLocaleDateString('en-US', options);
      
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const timePart = `${hours}:${minutes} ${ampm}`;
      
      return `${datePart} · ${timePart}`;
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

  const maxAllowedDays = getMaxDays(cohort.scheduleOptions);

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb & Back Button */}
        <div className="flex justify-between items-center">
          <Link
            to={`/mentor/cohorts/${cohortId}`}
            className="text-sm font-bold text-primary hover:text-blue-600 flex items-center gap-1.5"
          >
            &larr; Back to Cohort Detail
          </Link>
          <span className="text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full">
            Schedule: {SCHEDULE_DISPLAY[cohort.scheduleOptions] || cohort.scheduleOptions}
          </span>
        </div>

        {/* Page Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-150">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              Sessions
            </h1>
            <p className="text-slate-500 mt-1 font-medium">{cohort.cohortName}</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 shadow-md transition-colors"
          >
            + Schedule Session
          </button>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center border border-slate-150 shadow-sm space-y-3">
              <span className="text-4xl block">📅</span>
              <h3 className="font-bold text-slate-850">No sessions scheduled yet</h3>
              <p className="text-xs text-slate-550 max-w-sm mx-auto leading-relaxed">
                Click 'Schedule Session' to begin scheduling training days for your cohort.
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const modeClass = MODE_COLORS[session.mode] || 'bg-slate-50 text-slate-700 border-slate-200';
              
              return (
                <div
                  key={session.id}
                  className="bg-white rounded-xl p-5 border border-slate-150 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-primary border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Day {session.dayNumber}
                      </span>
                      <span className={`border text-[10px] font-bold px-2 py-0.5 rounded ${modeClass}`}>
                        {session.mode}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800">{session.topic}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {formatDate(session.scheduledAt)}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-3">
                    <div className="text-xs font-semibold text-slate-555">
                      <span className="text-green-600">{session.totalAttendees} present</span>
                      {' · '}
                      <span className="text-rose-600">{session.totalAbsent} absent</span>
                    </div>
                    <button
                      onClick={() => navigate(`/mentor/cohorts/${cohortId}/sessions/${session.id}`)}
                      className="px-4 py-2 border border-slate-250 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-lg shadow-sm transition-colors"
                    >
                      View Attendance
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Schedule Session Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Schedule Session"
        >
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            
            {inlineError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-lg">
                {inlineError}
              </div>
            )}

            <div>
              <label htmlFor="day-num" className="block text-sm font-semibold text-slate-700 mb-1">
                Day Number (1 - {maxAllowedDays})
              </label>
              <input
                id="day-num"
                type="number"
                min="1"
                max={maxAllowedDays}
                placeholder="e.g. 1"
                value={dayNumber}
                onChange={(e) => setDayNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 mb-1">
                Topic
              </label>
              <input
                id="topic"
                type="text"
                placeholder="e.g. AI Fundamentals"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="datetime" className="block text-sm font-semibold text-slate-700 mb-1">
                Date & Time
              </label>
              <input
                id="datetime"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="mode" className="block text-sm font-semibold text-slate-700 mb-1">
                Session Mode
              </label>
              <select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
              >
                <option value="ONLINE">ONLINE</option>
                <option value="OFFLINE">OFFLINE</option>
                <option value="HYBRID">HYBRID</option>
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
                className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                {submitLoading ? <Spinner size="sm" color="text-white" /> : 'Schedule'}
              </button>
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
};

export default SessionsPage;
