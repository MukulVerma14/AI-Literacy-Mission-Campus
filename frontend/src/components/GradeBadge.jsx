import React from 'react';

const GradeBadge = ({ grade }) => {
  const normalized = grade ? grade.toUpperCase().trim() : '';

  const styles = {
    A: 'bg-green-150 text-green-700 border-green-300 font-bold',
    B: 'bg-blue-100 text-blue-700 border-blue-300 font-bold',
    C: 'bg-amber-100 text-amber-700 border-amber-300 font-bold',
    D: 'bg-orange-100 text-orange-700 border-orange-300 font-bold',
    F: 'bg-rose-100 text-rose-700 border-rose-300 font-bold',
  };

  const currentStyle = styles[normalized] || 'bg-slate-100 text-slate-700 border-slate-300';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${currentStyle}`}>
      {grade || '—'}
    </span>
  );
};

export default GradeBadge;
