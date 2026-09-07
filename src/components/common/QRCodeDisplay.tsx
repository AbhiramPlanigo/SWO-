import React, { useEffect, useState } from 'react';
import QRCode, { QRCodeErrorCorrectionLevel } from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  level?: QRCodeErrorCorrectionLevel;
  fgColor?: string;
  bgColor?: string;
  className?: string;
  includeMargin?: boolean;
  centerLogo?: boolean;
  onDataUrlReady?: (dataUrl: string) => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  level = 'H',
  fgColor = '#16212F',
  bgColor = '#FFFFFF',
  className = '',
  includeMargin = true,
  centerLogo = true,
  onDataUrlReady,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!value) {
      setDataUrl('');
      return;
    }

    const options: QRCode.QRCodeToDataURLOptions = {
      width: size * 2, // 2x for retina crispness
      margin: includeMargin ? 2 : 1,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: (level || 'H') as QRCodeErrorCorrectionLevel,
    };

    QRCode.toDataURL(value, options)
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setError(null);
          if (onDataUrlReady) {
            onDataUrlReady(url);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to render QR Code');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, level, fgColor, bgColor, includeMargin, onDataUrlReady]);

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl text-xs p-2 text-center ${className}`}
      >
        QR Error
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-slate-100 dark:bg-white/5 animate-pulse rounded-xl ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-block rounded-2xl overflow-hidden bg-white p-2 shadow-xs border border-black/[0.06] ${className}`}
    >
      <img
        src={dataUrl}
        alt={`QR code for ${value}`}
        style={{ width: '100%', height: '100%' }}
        className="block object-contain select-none"
      />

      {/* Optional SWO / Christ Center Crest */}
      {centerLogo && size >= 140 && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-9 h-9 rounded-full bg-white border-2 border-[#C5A063] shadow-md flex items-center justify-center text-[9px] font-black text-[#16212F] tracking-tighter">
            SWO
          </div>
        </div>
      )}
    </div>
  );
};
