import React from 'react';

const Badge = ({ status }) => {
  const normalized = status ? status.toUpperCase() : '';

  const styles = {
    // Cohort status / Cert Status
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    PAID: 'bg-green-100 text-green-800 border-green-200',
    OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
    FULL: 'bg-rose-100 text-rose-800 border-rose-200',
    
    // Roles
    MENTOR: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    MENTEE: 'bg-teal-100 text-teal-800 border-teal-200',
    SUPER_ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const currentStyle = styles[normalized] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}>
      {status}
    </span>
  );
};

export default Badge;
