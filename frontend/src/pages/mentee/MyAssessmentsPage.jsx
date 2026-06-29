import React, { useState, useEffect } from 'react';
import { getMyAssessments } from '../../api/assessment';
import GradeBadge from '../../components/GradeBadge';
import Spinner from '../../components/Spinner';

const DISPLAY_NAMES = {
  QUIZ_1: 'Quiz 1',
  QUIZ_2: 'Quiz 2',
  FINAL_TEST: 'Final Test',
  CAPSTONE: 'Capstone',
};

const GRADE_COLORS = {
  A: 'text-green-600 border-green-200 bg-green-50',
  B: 'text-blue-600 border-blue-200 bg-blue-50',
  C: 'text-amber-600 border-amber-200 bg-amber-50',
  D: 'text-orange-600 border-orange-200 bg-orange-50',
  F: 'text-rose-600 border-rose-200 bg-rose-50',
};

const MyAssessmentsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAssessments = async () => {
    try {
      const data = await getMyAssessments();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

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

  const hasAssessments = summary && summary.assessments && summary.assessments.length > 0;

  if (!hasAssessments) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center space-y-4">
          <div className="text-5xl">📝</div>
          <h3 className="text-xl font-bold text-slate-800">No Grades Yet</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            No assessments graded yet. Your mentor will grade your quizzes and tests.
          </p>
        </div>
      </div>
    );
  }

  const overallGrade = summary.overallGrade || '—';
  const avgScore = summary.averageScore !== null && summary.averageScore !== undefined
    ? summary.averageScore.toFixed(1)
    : '—';

  const gradeColor = GRADE_COLORS[overallGrade] || 'text-slate-600 border-slate-200 bg-slate-50';

  const renderBreakdownCard = (label, score, typeKey) => {
    // Find graded assessment of this type to see the grade
    const assessment = summary.assessments.find((a) => a.type === typeKey);
    const grade = assessment ? assessment.grade : null;
    const isGraded = score !== null && score !== undefined;

    return (
      <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-sm flex flex-col justify-between h-32">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
          {isGraded ? (
            <p className="text-2xl font-black text-slate-850 mt-1">{score.toFixed(1)} <span className="text-xs font-semibold text-slate-400">/ 100</span></p>
          ) : (
            <p className="text-sm font-semibold text-slate-400 mt-2 italic">Not graded yet</p>
          )}
        </div>
        {isGraded && grade && (
          <div className="self-start">
            <GradeBadge grade={grade} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">My Assessments</h1>
          <p className="text-slate-500 mt-1">Review your quiz scores, mentor feedback, and certificate eligibility.</p>
        </div>

        {/* Top Section: Overall Grade and Eligibility Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-150 flex flex-col justify-center items-center text-center space-y-4 md:col-span-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Grade</span>
            <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center text-4xl font-black shadow-inner ${gradeColor}`}>
              {overallGrade}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-505">Average Score</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">{avgScore}%</p>
            </div>
          </div>

          {/* Certificate Banner / Policy Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-150 flex flex-col justify-between md:col-span-2">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-850">Certification Status</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                To qualify for graduation and receive your completion certificate, you must maintain a cumulative grade average of 50.0% or higher across all assigned quizzes, tests, and your final capstone project.
              </p>
            </div>

            <div className="mt-4">
              {summary.eligibleForCert ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-700">
                  <span className="text-xl">✓</span>
                  <div className="text-xs">
                    <span className="font-bold block">You are eligible for certification!</span>
                    Your average score satisfies the graduation criteria.
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-700">
                  <span className="text-xl">✗</span>
                  <div className="text-xs">
                    <span className="font-bold block">Minimum average of 50 required for certification</span>
                    Work with your mentor to improve your quiz or capstone evaluation scores.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Score Breakdown Row (4 cards) */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Score Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderBreakdownCard('QUIZ 1', summary.quiz1Score, 'QUIZ_1')}
            {renderBreakdownCard('QUIZ 2', summary.quiz2Score, 'QUIZ_2')}
            {renderBreakdownCard('FINAL TEST', summary.finalTestScore, 'FINAL_TEST')}
            {renderBreakdownCard('CAPSTONE', summary.capstoneScore, 'CAPSTONE')}
          </div>
        </div>

        {/* Detailed Assessment Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-150 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-850">Grading Logs</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Assessment Type
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Mentor Feedback
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Graded At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {summary.assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800">
                      {DISPLAY_NAMES[a.type] || a.type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-bold text-slate-700">
                      {a.score.toFixed(1)} / 100
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                      <GradeBadge grade={a.grade} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-650 max-w-xs truncate" title={a.mentorFeedback}>
                      {a.mentorFeedback || '—'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {formatDate(a.gradedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyAssessmentsPage;
