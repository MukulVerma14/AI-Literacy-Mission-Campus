import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyAttendance } from '../../api/attendance';
import AttendanceBadge from '../../components/AttendanceBadge';
import Spinner from '../../components/Spinner';

const MyAttendancePage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notInCohort, setNotInCohort] = useState(false);

  const fetchAttendance = async () => {
    try {
      const data = await getMyAttendance();
      if (data && data.cohortId === null) {
        setNotInCohort(true);
      } else {
        setSummary(data);
      }
    } catch (err) {
      console.error(err);
      if (
        err.response &&
        (err.response.status === 400 || 
         err.response.data?.message?.toLowerCase().includes('cohort') || 
         err.response.data?.message?.toLowerCase().includes('joined'))
      ) {
        setNotInCohort(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

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

  const getPercentageColor = (pct) => {
    if (pct >= 75) return 'text-green-600';
    if (pct >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notInCohort) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center space-y-5">
          <div className="text-5xl">📅</div>
          <h3 className="text-xl font-bold text-slate-800 font-sans">No Attendance Data</h3>
          <p className="text-sm text-slate-550 leading-relaxed">
            Join a cohort first to track your attendance.
          </p>
          <Link
            to="/mentee/cohorts"
            className="inline-block w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm text-sm"
          >
            Browse Cohorts
          </Link>
        </div>
      </div>
    );
  }

  const hasRecords = summary && summary.records && summary.records.length > 0;

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Attendance</h1>
          <p className="text-slate-500 mt-1">Track your session attendance history and eligibility.</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Attended Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sessions Attended</p>
                <p className="text-3xl font-black text-green-600 mt-1">{summary.sessionsAttended}</p>
              </div>
              <div className="p-3.5 bg-green-50 rounded-xl text-green-600 text-xl font-bold">
                ✓
              </div>
            </div>

            {/* Absent Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sessions Absent</p>
                <p className="text-3xl font-black text-rose-600 mt-1">{summary.sessionsAbsent}</p>
              </div>
              <div className="p-3.5 bg-rose-50 rounded-xl text-rose-600 text-xl font-bold">
                ✗
              </div>
            </div>

            {/* Percentage Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance %</p>
                <p className={`text-3xl font-black mt-1 ${getPercentageColor(summary.attendancePercentage)}`}>
                  {summary.attendancePercentage.toFixed(1)}%
                </p>
              </div>
              <div className="p-3.5 bg-blue-50 rounded-xl text-primary text-xl font-bold">
                📊
              </div>
            </div>
          </div>
        )}

        {/* Attendance Records Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-150 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Attendance Log</h2>
            {summary && (
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                Cohort: {summary.cohortName}
              </span>
            )}
          </div>
          
          <div className="overflow-x-auto">
            {!hasRecords ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <span className="text-3xl block">📋</span>
                <p className="font-semibold text-slate-700">No sessions recorded yet.</p>
                <p className="text-xs text-slate-400">Attendance details will be visible here once your mentor starts sessions.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {summary.records.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800">
                        Day {record.sessionDay}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700">
                        {record.sessionTopic}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(record.markedAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <AttendanceBadge isPresent={record.isPresent} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyAttendancePage;
