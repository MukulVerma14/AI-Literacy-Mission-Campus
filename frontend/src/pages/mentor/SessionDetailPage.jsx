import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSession } from '../../api/session';
import { getCohortMembers } from '../../api/mentor';
import { getSessionAttendance, markAttendance, markBulkAttendance } from '../../api/attendance';
import { showToast } from '../../components/Toast';
import ToggleSwitch from '../../components/ToggleSwitch';
import Spinner from '../../components/Spinner';

const MODE_COLORS = {
  ONLINE: 'bg-green-50 text-green-700 border-green-200',
  OFFLINE: 'bg-orange-50 text-orange-700 border-orange-200',
  HYBRID: 'bg-purple-50 text-purple-700 border-purple-200',
};

const SessionDetailPage = () => {
  const { cohortId: cohortIdParam, id: sessionIdParam } = useParams();
  const cohortId = cohortIdParam ? parseInt(cohortIdParam, 10) : null;
  const sessionId = sessionIdParam ? parseInt(sessionIdParam, 10) : null;

  const [session, setSession] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!cohortId || !sessionId) return;
    try {
      // 1. Fetch Session info
      const sessionData = await getSession(cohortId, sessionId);
      setSession(sessionData);

      // 2. Fetch Cohort Members
      const members = await getCohortMembers(cohortId);

      // 3. Fetch Existing Session Attendance
      const attendance = await getSessionAttendance(sessionId);

      // 4. Merge Members with Attendance (default to isPresent = false)
      const merged = members.map((member) => {
        const record = attendance.find((r) => r.menteeId === member.id);
        return {
          id: member.id,
          email: member.email,
          isPresent: record ? record.isPresent : false,
          markedAt: record ? record.markedAt : null,
        };
      });
      setMentees(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cohortId, sessionId]);

  const handleToggle = async (menteeId, newStatus) => {
    // Update local state immediately
    setMentees((prev) =>
      prev.map((m) =>
        m.id === menteeId
          ? { ...m, isPresent: newStatus, markedAt: new Date().toISOString() }
          : m
      )
    );

    // Call single mark API asynchronously
    try {
      await markAttendance(sessionId, {
        menteeId,
        isPresent: newStatus,
      });
    } catch (err) {
      console.error('Failed to mark single attendance', err);
    }
  };

  const handleMarkAllPresent = () => {
    const timestamp = new Date().toISOString();
    setMentees((prev) =>
      prev.map((m) => ({
        ...m,
        isPresent: true,
        markedAt: timestamp,
      }))
    );
  };

  const handleSaveBulk = async () => {
    setSaving(true);
    try {
      const attendanceList = mentees.map((m) => ({
        menteeId: m.id,
        isPresent: m.isPresent,
      }));
      await markBulkAttendance(sessionId, { attendanceList });
      showToast('success', 'Attendance saved!');
      // Refresh to get accurate timestamps from server
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
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

  const formatMarkedAt = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) + ' on ' + date.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
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

  if (!session) {
    return (
      <div className="flex-1 p-8 bg-slate-50 text-center">
        <h3 className="text-xl font-bold text-slate-800">Session not found</h3>
        <Link to={`/mentor/cohorts/${cohortId}/sessions`} className="text-primary hover:underline mt-2 inline-block">
          Return to Sessions List
        </Link>
      </div>
    );
  }

  const presentCount = mentees.filter((m) => m.isPresent).length;
  const totalCount = mentees.length;
  const absentCount = totalCount - presentCount;

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to={`/mentor/cohorts/${cohortId}/sessions`}
            className="text-sm font-bold text-primary hover:text-blue-600 flex items-center gap-1.5"
          >
            &larr; Back to Sessions
          </Link>
        </div>

        {/* Header Details Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-primary border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Day {session.dayNumber}
              </span>
              <span className={`border text-[10px] font-bold px-2 py-0.5 rounded ${MODE_COLORS[session.mode]}`}>
                {session.mode}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              {session.topic}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {formatDate(session.scheduledAt)}
            </p>
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="w-full sm:w-auto px-4 py-2 border border-green-250 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 hover:text-green-800 rounded-lg shadow-sm transition-colors text-center"
          >
            ✓ Mark All Present
          </button>
        </div>

        {/* Live Attendance Summary Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-sm text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present</p>
            <p className="text-2xl font-black text-green-600 mt-1">
              {presentCount} <span className="text-xs font-medium text-slate-450">/ {totalCount} Mentees</span>
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-sm text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absent</p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {absentCount} <span className="text-xs font-medium text-slate-450">/ {totalCount} Mentees</span>
            </p>
          </div>
        </div>

        {/* Mentee Attendance List Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-150 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-850">Mentee Attendance Roster</h2>
          </div>

          <div className="overflow-x-auto">
            {mentees.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No mentees are registered in this cohort.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Name / Email
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-36">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Marked At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {mentees.map((mentee) => (
                    <tr key={mentee.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800">
                        {mentee.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <ToggleSwitch
                          isOn={mentee.isPresent}
                          onToggle={(val) => handleToggle(mentee.id, val)}
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatMarkedAt(mentee.markedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Save Bulk Attendance Actions */}
        {mentees.length > 0 && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveBulk}
              disabled={saving}
              className="px-6 py-3 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm rounded-lg shadow-md flex items-center gap-2 transition-colors"
            >
              {saving ? <Spinner size="sm" color="text-white" /> : 'Save Bulk Attendance'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SessionDetailPage;
