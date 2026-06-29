import React from 'react';

const ToggleSwitch = ({ isOn, onToggle, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onToggle(!isOn)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        isOn ? 'bg-success' : 'bg-rose-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isOn ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
