'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizUrl: string;
  quizTitle: string;
}

export default function QRModal({ isOpen, onClose, quizUrl, quizTitle }: QRModalProps) {
  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(quizUrl);
    alert('URL copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Quiz QR Code</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="text-center">
          <h4 className="font-medium mb-4">{quizTitle}</h4>
          
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
            <QRCodeSVG 
              value={quizUrl} 
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Students can scan this QR code to join:</p>
            <div className="bg-gray-100 p-2 rounded text-sm break-all">
              {quizUrl}
            </div>
            
            <div className="flex gap-2 mt-4">
              <button 
                onClick={handleCopyUrl}
                className="btn-secondary flex-1"
              >
                Copy URL
              </button>
              <button 
                onClick={onClose}
                className="btn-primary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}