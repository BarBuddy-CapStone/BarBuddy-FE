import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Modal, message } from 'antd';

const QRScanner = ({ isOpen, onClose, onScanSuccess }) => {
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const isProcessingRef = useRef(false);
  const lastScannedCodeRef = useRef(null);

  useEffect(() => {
    if (isOpen && videoRef.current && !qrScannerRef.current) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        async result => {
          if (isProcessingRef.current || result.data === lastScannedCodeRef.current) {
            return;
          }
          
          try {
            isProcessingRef.current = true;
            lastScannedCodeRef.current = result.data;
            setError(null);
            console.log("QR Code Result:", result.data);
            
            if (!result.data) {
              throw new Error('Mã QR không hợp lệ');
            }

            if (qrScannerRef.current) {
              qrScannerRef.current.stop();
            }

            const processingMessage = message.loading('Đang xử lý mã QR...', 0);

            try {
              await onScanSuccess(result.data);
              processingMessage();
              message.success('Đã tìm thấy đơn đặt bàn!');
              onClose();
            } catch (error) {
              processingMessage();
              setError('Không tìm thấy đơn đặt bàn trong hệ thống');
              message.error('Không tìm thấy đơn đặt bàn');
              
              setTimeout(() => {
                lastScannedCodeRef.current = null;
                if (qrScannerRef.current && isOpen) {
                  qrScannerRef.current.start();
                }
              }, 2000);
            }
          } finally {
            isProcessingRef.current = false;
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScannerRef.current.start();
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
      isProcessingRef.current = false;
      lastScannedCodeRef.current = null;
    };
  }, [isOpen, onClose, onScanSuccess]);

  const handleClose = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    isProcessingRef.current = false;
    lastScannedCodeRef.current = null;
    setError(null);
    onClose();
  };

  return (
    <Modal
      title="Quét mã QR tìm kiếm đơn đặt bàn"
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={500}
    >
      <div className="qr-scanner-container">
        {error && (
          <div className="text-red-500 mb-2 text-center">{error}</div>
        )}
        <div className="relative">
          <video ref={videoRef} className="w-full" />
        </div>
      </div>
    </Modal>
  );
};

export default QRScanner; 