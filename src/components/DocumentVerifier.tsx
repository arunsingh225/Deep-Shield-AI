import { useLang } from '../contexts/LangContext';
import { FileScanner } from './FileScanner';
import type { ScanResult } from '../types';

export function DocumentVerifier({ onScanComplete }: { onScanComplete: (r: ScanResult) => void }) {
  const { t } = useLang();
  return (
    <FileScanner
      title={t.verifyDoc}
      description={t.uploadDocDesc}
      acceptedTypes="image/*,application/pdf"
      analyzeType="document"
      onScanComplete={onScanComplete}
    />
  );
}
