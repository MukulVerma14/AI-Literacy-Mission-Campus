import React, { useState, useEffect } from 'react';

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { type, message } = e.detail;
      const id = Date.now();
      
      setToasts((prev) => [...prev, { id, type, message }]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener('app-toast', handleToast);
    return () => {
      window.removeEventListener('app-toast', handleToast);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform translate-y-0 scale-100 ${
            toast.type === 'success'
              ? 'bg-white border-success text-slate-800'
              : 'bg-white border-danger text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-success">
                ✓
              </span>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-danger">
                ✗
              </span>
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

// Helper function to programmatically trigger a toast from code
export const showToast = (type, message) => {
  const event = new CustomEvent('app-toast', {
    detail: { type, message },
  });
  window.dispatchEvent(event);
};

export default Toast;
