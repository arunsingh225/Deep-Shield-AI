import { Award, Download } from 'lucide-react';
import type { ScanResult } from '../types';
import { generateVerificationID } from '../lib/utils';

export function CertificateAction({ result }: { result: ScanResult }) {
  const handleDownload = () => {
    const certId = generateVerificationID();
    const dateStr = new Date().toLocaleString();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DeepShield Authenticity Certificate</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f4f8; margin: 0; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .cert-container { background: white; border: 8px solid #0ea5e9; border-radius: 12px; padding: 60px; max-w-3xl; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.1); position: relative; overflow: hidden; }
          .bg-pattern { position: absolute; inset: 0; opacity: 0.03; background-image: radial-gradient(#0ea5e9 2px, transparent 2px); background-size: 30px 30px; pointer-events: none; }
          .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 30px; margin-bottom: 40px; }
          .logo { color: #0ea5e9; font-size: 48px; margin-bottom: 15px; }
          h1 { color: #0f172a; margin: 0; font-size: 36px; letter-spacing: 2px; text-transform: uppercase; }
          .subtitle { color: #64748b; font-size: 18px; margin-top: 10px; }
          .content { text-align: center; }
          .declaration { font-size: 24px; color: #334155; line-height: 1.6; margin: 40px 0; font-weight: 300; }
          .highlight { font-weight: bold; color: #10b981; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 40px; }
          .detail-item { margin-bottom: 15px; }
          .detail-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
          .detail-value { font-size: 16px; color: #0f172a; font-weight: 600; margin-top: 4px; }
          .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; }
          .signature-box { text-align: center; }
          .signature-line { width: 200px; border-top: 1px solid #cbd5e1; margin-bottom: 10px; }
          .id-badge { background: #0f172a; color: white; padding: 10px 20px; border-radius: 4px; font-family: monospace; font-size: 14px; letter-spacing: 1px; }
          .stamp { position: absolute; bottom: 50px; right: 50px; width: 120px; height: 120px; border: 4px solid #10b981; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #10b981; font-weight: bold; font-size: 18px; transform: rotate(-15deg); opacity: 0.8; }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div class="bg-pattern"></div>
          <div class="header">
             <div class="logo">🛡️ DeepShield AI</div>
             <h1>Certificate of Authenticity</h1>
             <div class="subtitle">Digital Asset Verification Report</div>
          </div>

          <div class="content">
            <div class="declaration">
              This digital asset has been thoroughly analyzed and is verified as <span class="highlight">GENUINE & SAFE</span> by the DeepShield AI engine.
            </div>

            <div class="details">
              <div class="detail-item">
                <div class="detail-label">Asset Type</div>
                <div class="detail-value">${result.type.toUpperCase()}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Verification Date</div>
                <div class="detail-value">${dateStr}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Confidence Score</div>
                <div class="detail-value">${result.confidence}%</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Trust Score</div>
                <div class="detail-value">${result.trust_score ?? result.confidence}/100</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Threat Level</div>
                <div class="detail-value">${result.threat_level}</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>Authorized by <br><b>DeepShield AI Systems</b></div>
            </div>
            <div class="id-badge">ID: ${certId}</div>
          </div>
          <div class="stamp">VERIFIED</div>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-green-500/10 border border-green-200 dark:bg-green-950/30 dark:border-green-900/50 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h4 className="text-green-600 dark:text-green-400 font-bold flex items-center gap-2 text-lg">
          <Award className="w-5 h-5" /> Asset Verified Safe
        </h4>
        <p className="text-slate-400 text-sm mt-1">Generate an official certificate of authenticity for your records.</p>
      </div>
      <button
        onClick={handleDownload}
        className="bg-green-500 hover:bg-green-600 text-slate-950 px-5 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(16,185,129,0.3)] w-full sm:w-auto justify-center"
      >
        <Download className="w-5 h-5" /> 📜 Download Certificate
      </button>
    </div>
  );
}
