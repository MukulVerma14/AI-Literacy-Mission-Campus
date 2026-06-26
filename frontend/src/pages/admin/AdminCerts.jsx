import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCertifications } from '../../api/admin';
import { updatePaymentStatus } from '../../api/cert';
import { showToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import Badge from '../../components/Badge';

const AdminCerts = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchCerts = async () => {
    try {
      const data = await getAllCertifications();
      // Sort: Pending payments first, then by date desc
      const sorted = data.sort((a, b) => {
        if (a.feeStatus === 'PENDING' && b.feeStatus !== 'PENDING') return -1;
        if (a.feeStatus !== 'PENDING' && b.feeStatus === 'PENDING') return 1;
        return new Date(b.issuedAt) - new Date(a.issuedAt);
      });
      setCerts(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleMarkAsPaid = async (certId) => {
    setActionLoadingId(certId);
    try {
      await updatePaymentStatus(certId, { feeStatus: 'PAID' });
      showToast('success', 'Certification payment status updated to PAID!');
      
      // Update state in-place to avoid complete loading spinner flicker
      setCerts((prevCerts) =>
        prevCerts.map((c) =>
          c.id === certId
            ? { ...c, feeStatus: 'PAID', paidAt: new Date().toISOString() }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-slate-500 flex items-center gap-2">
            <Link to="/admin/dashboard" className="hover:text-slate-800 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-900">Certifications</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Certificate Settlement</h1>
          <p className="text-slate-500">Track and settle processing fee collections to release graduate certifications.</p>
        </div>

        {/* Certifications Table */}
        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Cert ID
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Mentee Email
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Mentee Name
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date Issued
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Fee Amount
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date Paid
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {certs.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-sm text-slate-500">
                      No certifications have been issued yet.
                    </td>
                  </tr>
                ) : (
                  certs.map((cert) => {
                    const issueDate = new Date(cert.issuedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });

                    const paidDate = cert.paidAt
                      ? new Date(cert.paidAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—';

                    const isPaid = cert.feeStatus === 'PAID';

                    return (
                      <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 font-mono">
                          #{cert.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                          {cert.menteeEmail}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-800 font-medium">
                          {cert.menteeName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-550">
                          {issueDate}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-bold text-slate-800">
                          Rs. {cert.processingFeeAmount}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                          <Badge status={cert.feeStatus} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-550">
                          {paidDate}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                          {!isPaid ? (
                            <button
                              onClick={() => handleMarkAsPaid(cert.id)}
                              disabled={actionLoadingId !== null}
                              className="px-3.5 py-1.5 bg-success text-white font-bold text-xs rounded-lg hover:bg-green-600 shadow-sm border border-success transition-all disabled:opacity-50 flex items-center gap-1.5 ml-auto"
                            >
                              {actionLoadingId === cert.id ? (
                                <Spinner size="sm" color="text-white" />
                              ) : (
                                'Mark as Paid'
                              )}
                            </button>
                          ) : (
                            <span className="inline-flex items-center text-xs font-bold text-success pr-2.5">
                              Settled ✓
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCerts;
