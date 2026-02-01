import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, QrCode as QrCodeIcon } from 'lucide-react';
import QRCode from 'qrcode';

export default function QRCodeModal({ sessionCode, isOpen, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && sessionCode) {
      generateQR();
    }
  }, [isOpen, sessionCode]);

  const generateQR = async () => {
    setLoading(true);
    try {
      // Generate QR code with join URL
      const joinUrl = `${window.location.origin}?code=${sessionCode}`;
      const dataUrl = await QRCode.toDataURL(joinUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1A0B0B',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('QR generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `MOOZINGA_${sessionCode}_QR.png`;
    link.href = qrDataUrl;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative max-w-md w-full"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 backdrop-blur-md border-2 border-primary-500/40 p-8 shadow-2xl shadow-primary-500/20">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-2xl opacity-50"></div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center mb-4">
                <QrCodeIcon className="w-10 h-10 text-primary-300" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">
                Scan to Join
              </h2>
              <p className="text-orange-200 mb-6">
                Anyone can scan this QR code to join your session
              </p>

              {/* QR Code Display */}
              <div className="bg-white rounded-2xl p-6 mb-6 inline-block shadow-xl">
                {loading ? (
                  <div className="w-[300px] h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={qrDataUrl}
                    alt="Session QR Code"
                    className="w-[300px] h-[300px]"
                  />
                )}

                {/* Session Code below QR */}
                <div className="mt-4 text-2xl font-bold font-mono text-gray-800">
                  {sessionCode}
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold hover:from-primary-600 hover:to-accent-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download QR Code
              </button>

              <p className="text-xs text-orange-300 mt-4">
                Share this code for easy session joining
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
