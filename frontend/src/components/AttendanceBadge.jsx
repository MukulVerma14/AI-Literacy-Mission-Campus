import React from 'react';

const AttendanceBadge = ({ isPresent }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        isPresent
          ? 'bg-green-100 text-green-700 border-green-200'
          : 'bg-rose-100 text-rose-700 border-rose-200'
      }`}
    >
      {isPresent ? 'Present ✓' : 'Absent ✗'}
    </span>
  );
};

export default AttendanceBadge;
