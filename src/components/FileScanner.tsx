import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  UploadCloud, CheckCircle, RefreshCw, Search, Video, FileText, Mic, Shield, ShieldCheck,
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { fileToBase64 } from '../lib/utils';
import { analyzeMedia, analyzeDocument, analyzeVoice } from '../lib/api';
import { ScanningAnimation } from './ScanningAnimation';
import { AnalysisResultCard } from './AnalysisResultCard';
import type { ScanResult } from '../types';

type AnalyzeType = 'media' | 'document' | 'voice';

const ANALYZERS: Record<AnalyzeType, (b64: string, mime: string) => Promise<ScanResult>> = {
  media: analyzeMedia,
  document: analyzeDocument,
  voice: analyzeVoice,
};

interface FileScannerProps {
  title: string;
  description: string;
  acceptedTypes: string;
  analyzeType: AnalyzeType;
  onScanComplete: (r: ScanResult) => void;
}

export function FileScanner({
  title,
  description,
  acceptedTypes,
  analyzeType,
  onScanComplete,
}: FileScannerProps) {
  const { t } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke old object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (selectedFile: File) => {
    // Revoke previous URL before creating a new one
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(selectedFile);
    setResult(null);
    setError(null);
    if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else if (selectedFile.type.startsWith('audio/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsScanning(true);
    setError(null);

    try {
      const base64Data = await fileToBase64(file);
      const parsed = await ANALYZERS[analyzeType](base64Data, file.type);
      setResult(parsed);
      onScanComplete(parsed);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze file. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const TitleIcon = analyzeType === 'media' ? Video : analyzeType === 'voice' ? Mic : FileText;

  const fileExtension = file?.name.split('.').pop()?.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-8 text-left sm:text-center">
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight mb-2 flex items-center justify-center gap-3">
          <TitleIcon className="w-8 h-8 text-cyan-400" />
          {title}
        </h2>
        <p className="text-slate-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="flex flex-col gap-4">
          <div
            role="button"
            tabIndex={0}
            aria-label={t.clickToUpload}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={handleKeyDown}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[300px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 overflow-hidden
              ${isDragOver
                ? 'glass-cyan scale-[1.02] neon-pulse'
                : isScanning
                  ? 'glass-cyan'
                  : file && !isScanning
                    ? 'glass border-cyan-500/30'
                    : 'glass hover:border-cyan-500/30'
              }
            `}
          >
            {/* Animated dashed border overlay when no file */}
            {!file && !isScanning && (
              <div className="absolute inset-0 animated-border rounded-2xl pointer-events-none opacity-40" />
            )}

            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept={acceptedTypes}
              aria-label={`Upload ${analyzeType} file`}
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />

            {isDragOver ? (
              <div className="flex flex-col items-center gap-3 text-cyan-400">
                <UploadCloud className="w-16 h-16 animate-bounce" />
                <p className="font-bold text-lg">Drop file here</p>
              </div>
            ) : previewUrl && file?.type.startsWith('video/') ? (
              <video src={previewUrl} className="max-h-[220px] rounded-lg object-contain" controls />
            ) : previewUrl && file?.type.startsWith('image/') ? (
              <img src={previewUrl} alt="Preview of uploaded file" className="max-h-[220px] rounded-lg object-contain" />
            ) : previewUrl && file?.type.startsWith('audio/') ? (
              <div className="flex flex-col items-center gap-3">
                <Mic className="w-16 h-16 text-cyan-500" />
                <audio src={previewUrl} controls className="max-w-[260px]" />
              </div>
            ) : (
              <>
                <UploadCloud className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-300 font-medium text-lg mb-1">{t.clickToUpload}</p>
                <p className="text-slate-500 text-sm">{t.supports} {acceptedTypes.replace(/,/g, ', ')}</p>
                <p className="text-slate-600 text-xs mt-2">or drag and drop</p>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            {file && (
              <span className="text-sm text-cyan-400 flex items-center gap-2 min-w-0">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{file.name}</span>
                <span className="text-slate-500 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                {fileExtension && (
                  <span className="text-[10px] font-mono bg-cyan-950/50 text-cyan-400 px-2 py-0.5 rounded border border-cyan-900/50 flex-shrink-0">
                    .{fileExtension}
                  </span>
                )}
              </span>
            )}
            <button
              onClick={handleAnalyze}
              disabled={!file || isScanning}
              className={`ml-auto px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap
                ${!file || isScanning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'btn-gradient text-white'
                }`}
            >
              {isScanning ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> {t.analyzing}</>
              ) : (
                <><Search className="w-5 h-5" /> {t.startScan}</>
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm" role="alert">{error}</p>
          )}
        </div>

        {/* Results Section */}
        <div className="flex flex-col relative h-full min-h-[400px]">
          {isScanning ? (
            <ScanningAnimation type={analyzeType} />
          ) : result ? (
            <AnalysisResultCard result={result} />
          ) : analyzeType === 'document' ? (
            <div className="flex-1 flex flex-col items-center justify-center glass rounded-2xl p-8 text-center text-slate-400">
              <ShieldCheck className="w-16 h-16 mb-4 text-cyan-500 opacity-80" />
              <p className="text-lg text-slate-100 font-medium mb-4">{t.verificationReady}</p>
              <ul className="text-sm space-y-2 text-left w-full max-w-[200px]">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" /> Aadhaar Cards</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" /> PAN Cards</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" /> Passports</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" /> Certificates</li>
              </ul>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center glass rounded-2xl p-8 text-center text-slate-500">
              <Shield className="w-16 h-16 mb-4 opacity-50" />
              <p>{t.resultsWillAppear}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
