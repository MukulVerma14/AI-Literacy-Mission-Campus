import React, { useState, useEffect } from 'react';
import { getMyCertificate } from '../../api/cert';
import { getMenteeProfile } from '../../api/mentee';
import Spinner from '../../components/Spinner';
import Badge from '../../components/Badge';
import millionmindsLogo from '../../assets/millionminds-logo.png';

const CertPage = () => {
  const [cert, setCert] = useState(null);
  const [cohortName, setCohortName] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCert = async () => {
    try {
      const data = await getMyCertificate();
      setCert(data);
      try {
        const profile = await getMenteeProfile();
        setCohortName(profile.cohortName || '');
      } catch (err) {
        console.error('Failed to fetch mentee profile:', err);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setErrorMsg('Certificate not yet issued. Complete all tracks and ask your mentor to issue your certificate.');
      } else {
        setErrorMsg('Failed to load certificate. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCert();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (errorMsg || !cert) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center space-y-4">
          <div className="text-4xl text-slate-300">🎓</div>
          <h3 className="text-xl font-bold text-slate-800">Certificate Status</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {errorMsg || 'Certificate has not been issued yet.'}
          </p>
          <div className="bg-slate-50 p-4 rounded-lg text-xs text-slate-400 font-medium text-left border border-slate-100">
            <span className="font-bold text-slate-650 block mb-1">Requirements Checklist:</span>
            <ul className="list-disc list-inside space-y-1">
              <li>Complete 30 hours of MasterClass</li>
              <li>Complete 30 hours of Self-Practice</li>
              <li>Log 10 hours of Capstone and mark it completed</li>
              <li>Request your mentor to approve and issue certificate</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = cert.feeStatus === 'PAID';
  const issueDate = cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '—';
  
  const paymentDate = cert.paidAt ? new Date(cert.paidAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '—';

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto space-y-8 print:space-y-0">
        
        {/* Header (hidden in print) */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-5 print:hidden">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">My Certificate</h1>
            <p className="text-slate-500 mt-1">View your graduation status and processing fee updates.</p>
          </div>
          {isPaid && (
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2"
            >
              🖨️ Print / Download PDF
            </button>
          )}
        </div>

        {/* Payment Warning/Verified Banners (hidden in print) */}
        {!isPaid ? (
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-5 shadow-sm border border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge status="PENDING" />
                <span className="font-bold text-slate-800 text-sm">Processing Fee Payment Pending</span>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed">
                Your mentor has issued your certificate! Complete the processing fee payment of{' '}
                <span className="font-bold text-slate-900">Rs. {cert.processingFeeAmount}</span> to activate your credential.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              Contact your mentor to confirm payment
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5 shadow-sm border border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge status="PAID" />
                <span className="font-bold text-slate-800 text-sm">Verified ✓</span>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed">
                Your processing fee payment of <span className="font-bold text-slate-900">Rs. {cert.processingFeeAmount}</span> has been verified! Your certificate is now active.
              </p>
            </div>
          </div>
        )}

        {/* Certificate Display */}
        <div className="bg-white border-8 border-double border-amber-600 rounded-3xl p-8 sm:p-16 shadow-2xl relative overflow-hidden select-none max-w-4xl mx-auto text-center font-serif text-slate-800 min-h-[500px] flex flex-col justify-between border-slate-300">
          {/* Corner Decorative Borders */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-650 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-650 pointer-events-none" />
          
          {/* Background seal watermark watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
            <span className="text-9xl">🎓</span>
          </div>

          <div className="space-y-6">
            {/* Top Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 mb-6">
              {/* Left Side: Millionminds logo */}
              <div className="flex justify-center sm:justify-start">
                <div className="bg-white rounded-lg p-1.5 shadow-sm border border-slate-100">
                  <img src={millionmindsLogo} alt="Millionminds" className="h-12 w-auto" />
                </div>
              </div>
              
              {/* Center: Title & Subtitle */}
              <div className="text-center">
                <div className="text-xl font-bold tracking-widest text-amber-700 uppercase whitespace-nowrap">
                  Certificate of Completion
                </div>
                <p className="text-slate-400 font-sans font-bold text-xs uppercase tracking-widest mt-1 whitespace-nowrap">
                  AI Literacy Mission @ Campus (AILMC)
                </p>
              </div>

              {/* Right Side: Spacer */}
              <div className="hidden sm:block" />
            </div>
            
            <div className="py-4">
              <p className="text-sm italic text-slate-500 font-sans">This is proudly presented to</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 border-b border-slate-200 w-fit mx-auto px-10 py-2 italic tracking-wide">
                {cert.menteeName && cert.menteeName.trim() !== '' && cert.menteeName !== cert.menteeEmail
                  ? cert.menteeName
                  : cert.menteeEmail}
              </h2>
            </div>

            <div className="max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-slate-650 font-sans font-medium px-4">
              for successfully completing the rigorous 70-hour AI curriculum comprising expert-led MasterClasses (30 hours), hands-on Self-Practice labs (30 hours), and a mentor-evaluated AI Capstone implementation (10 hours).
            </div>

            {cohortName && (
              <p className="text-xs sm:text-sm text-slate-500 italic mt-2 text-center font-sans">
                Cohort: {cohortName}
              </p>
            )}
          </div>

          {/* Certificate Footer Meta details */}
          <div className="border-t border-slate-200 pt-8 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center font-sans">
            {/* LEFT */}
            <div>
              <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">DATE ISSUED</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{issueDate}</p>
            </div>
            
            {/* CENTER */}
            <div className="space-y-1">
              <img src={millionmindsLogo} alt="Millionminds" className="h-10 w-auto mx-auto" />
              <p className="text-xs text-gray-400 font-medium">Powered by Millionminds</p>
            </div>

            {/* RIGHT */}
            <div>
              <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">CERTIFICATE ID</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">AILMC-{String(cert.id).padStart(3, '0')}</p>
            </div>
          </div>
        </div>

        {/* Download / Print button below certificate */}
        {isPaid && (
          <div className="flex justify-center mt-6 print:hidden">
            <button
              onClick={handlePrint}
              className="px-6 py-3 rounded-lg text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-md flex items-center gap-2"
            >
              🖨️ Print / Download PDF
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CertPage;
