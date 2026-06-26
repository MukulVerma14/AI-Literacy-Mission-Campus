import React from 'react';

const ProgressBar = ({ label, current, max, color = 'bg-primary' }) => {
  const percentage = Math.min(Math.round((current / max) * 100), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm font-medium">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-600 font-semibold">{current} / {max} hrs ({percentage}%)</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/50">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
