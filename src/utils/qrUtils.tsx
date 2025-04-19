
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  eventId: string;
  userId?: string;
  size?: number;
  includeMargin?: boolean;
  className?: string;
}

// Generate QR code for event attendance
export const EventQRCode: React.FC<QRCodeProps> = ({
  eventId,
  userId,
  size = 128,
  includeMargin = true,
  className
}) => {
  // Create a data object with event and optional user info
  const qrData = JSON.stringify({
    eventId,
    userId,
    timestamp: new Date().toISOString()
  });
  
  return (
    <div className={className}>
      <QRCodeSVG
        value={qrData}
        size={size}
        includeMargin={includeMargin}
        level="M" // Error correction level: L, M, Q, H
      />
    </div>
  );
};
