import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, QrCode, CreditCard, Building2, Wallet, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function RazorpayModal({ isOpen, onClose, amount, itemTitle, devoteeInfo, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiApp, setUpiApp] = useState('gpay');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  if (!isOpen) return null;

  const handlePayNow = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const generatedId = `pay_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      setPaymentId(generatedId);
      setLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess({ paymentId: generatedId, amount, itemTitle });
        }
      }, 1500);
    }, 1200);
  };

  return (
    <div className="modal show d-block p-2 p-md-3" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1080 }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '480px' }}>
        <motion.div 
          className="modal-content bg-white text-dark rounded-4 overflow-hidden shadow-2xl border-0"
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
        >
          {/* Razorpay Brand Top Bar */}
          <div className="bg-primary px-4 py-3 text-white d-flex align-items-center justify-content-between" style={{ backgroundColor: '#0c2340' }}>
            <div className="d-flex align-items-center gap-2">
              <div className="bg-white text-primary rounded px-2 py-0.5 fw-bold font-monospace small" style={{ color: '#0c2340' }}>
                Razorpay
              </div>
              <span className="small text-white-50" style={{ fontSize: '0.75rem' }}>Trusted Gateway</span>
            </div>
            <button onClick={onClose} className="btn-close btn-close-white opacity-75 hover-opacity-100" />
          </div>

          {/* Amount & Merchant Header */}
          <div className="p-4 bg-light border-bottom">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted d-block" style={{ fontSize: '0.78rem' }}>MERCHANT</small>
                <h6 className="fw-bold mb-0 text-dark">Shri Mahakaleshwar Temple Trust</h6>
                <small className="text-secondary" style={{ fontSize: '0.8rem' }}>{itemTitle || 'Devotee Reservation'}</small>
              </div>
              <div className="text-end">
                <small className="text-muted d-block" style={{ fontSize: '0.78rem' }}>TOTAL AMOUNT</small>
                <h3 className="fw-bold mb-0 text-primary" style={{ color: '#0c2340' }}>₹{amount}</h3>
              </div>
            </div>
          </div>

          {/* Body Content */}
          {isSuccess ? (
            <div className="p-4 text-center py-5">
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                <CheckCircle2 size={64} className="text-success mb-3" />
              </motion.div>
              <h4 className="fw-bold text-dark mb-1">Payment Successful!</h4>
              <p className="text-muted small mb-3">Transaction verified by Razorpay Gateway.</p>

              <div className="p-3 bg-light rounded-3 text-start small border mb-4 font-monospace">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Payment ID:</span>
                  <strong className="text-dark">{paymentId}</strong>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Amount Paid:</span>
                  <strong className="text-success">₹{amount}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Status:</span>
                  <span className="badge bg-success">SUCCESS</span>
                </div>
              </div>

              <button className="btn btn-dark w-100 rounded-pill py-2.5 fw-bold" onClick={onClose}>
                Return to Confirmation
              </button>
            </div>
          ) : (
            <form onSubmit={handlePayNow} className="p-4">
              {/* Select Payment Method Tabs */}
              <label className="form-label text-muted small fw-bold mb-2">SELECT PAYMENT METHOD</label>
              
              <div className="d-flex gap-2 mb-3">
                <button
                  type="button"
                  className={`btn flex-fill py-2 btn-sm rounded-3 d-flex align-items-center justify-content-center gap-1.5 fw-semibold ${paymentMethod === 'upi' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={paymentMethod === 'upi' ? { backgroundColor: '#0c2340', borderColor: '#0c2340' } : {}}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <QrCode size={15} /> UPI / QR
                </button>
                <button
                  type="button"
                  className={`btn flex-fill py-2 btn-sm rounded-3 d-flex align-items-center justify-content-center gap-1.5 fw-semibold ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={paymentMethod === 'card' ? { backgroundColor: '#0c2340', borderColor: '#0c2340' } : {}}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={15} /> Card
                </button>
                <button
                  type="button"
                  className={`btn flex-fill py-2 btn-sm rounded-3 d-flex align-items-center justify-content-center gap-1.5 fw-semibold ${paymentMethod === 'netbanking' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={paymentMethod === 'netbanking' ? { backgroundColor: '#0c2340', borderColor: '#0c2340' } : {}}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <Building2 size={15} /> NetBanking
                </button>
              </div>

              {/* Method Specific Form */}
              {paymentMethod === 'upi' && (
                <div className="p-3 bg-light rounded-3 border mb-4">
                  <div className="text-center mb-3">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=mahakaltemple@sbi&pn=Mahakal%20Trust&am=500" 
                      alt="UPI QR Code" 
                      className="img-fluid rounded border p-1 bg-white mb-2"
                      style={{ width: 130, height: 130 }}
                    />
                    <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Scan QR using GPay, PhonePe, Paytm or BHIM</small>
                  </div>

                  <div className="d-flex justify-content-center gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                      <span key={app} className="badge bg-white text-dark border px-2.5 py-1 small">
                        ✓ {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="mb-4">
                  <div className="mb-2">
                    <input type="text" className="form-control form-control-sm" placeholder="Card Number (4000 0000 0000 0000)" defaultValue="4242 •••• •••• 4242" required />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <input type="text" className="form-control form-control-sm" placeholder="MM/YY" defaultValue="12/28" required />
                    </div>
                    <div className="col-6">
                      <input type="password" className="form-control form-control-sm" placeholder="CVV" defaultValue="123" required />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="mb-4">
                  <select className="form-select form-select-sm">
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Punjab National Bank</option>
                  </select>
                </div>
              )}

              {/* Pay Action Button */}
              <button 
                type="submit" 
                className="btn text-white w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                style={{ backgroundColor: '#0c2340' }}
                disabled={loading}
              >
                {loading ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Lock size={16} /> Pay ₹{amount} via Razorpay
                  </>
                )}
              </button>

              <div className="text-center mt-3 text-muted small d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={14} className="text-success" /> 256-Bit SSL Encrypted & Bank Certified Payment
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
