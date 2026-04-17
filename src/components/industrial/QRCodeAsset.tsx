'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';

interface QRCodeAssetProps {
  assetId: string;
  assetName: string;
  serialNumber: string;
}

export const QRCodeAsset: React.FC<QRCodeAssetProps> = ({ assetId, assetName, serialNumber }) => {
  const qrData = JSON.stringify({
    id: assetId,
    name: assetName,
    sn: serialNumber,
    action: 'maintenance_scan'
  });

  const handlePrint = () => {
    const windowUrl = window.location.href;
    const printWindow = window.open('', '', 'width=600,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR - ${assetName}</title>
            <style>
              body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .label { border: 2px solid #000; padding: 20px; text-align: center; }
              h2 { margin: 10px 0; }
              p { margin: 5px 0; color: #666; }
            </style>
          </head>
          <body>
            <div class="label">
              <h2>${assetName}</h2>
              <div id="qr-container"></div>
              <p>SN: ${serialNumber}</p>
              <p style="font-size: 10px;">ID: ${assetId}</p>
            </div>
            <script>
               // Note: In a real app we'd inject the SVG here or use a library
               // For this demonstration, we trigger print directly
               window.onload = () => { window.print(); window.close(); };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <QRCodeSVG value={qrData} size={128} level="H" includeMargin={true} />
      <div className="mt-2 text-center">
        <p className="text-sm font-bold text-gray-900">{assetName}</p>
        <p className="text-xs text-gray-500">SN: {serialNumber}</p>
      </div>
      <button
        onClick={handlePrint}
        className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors"
      >
        <Printer size={14} />
        Print Tag
      </button>
    </div>
  );
};
