import React from 'react';

const StatCard = ({ label, value, icon, color = 'bg-primary/10 text-primary' }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <h4 className="text-3xl font-bold text-slate-900 mt-2">{value}</h4>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
