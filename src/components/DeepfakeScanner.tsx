import { useLang } from '../contexts/LangContext';
import { FileScanner } from './FileScanner';
import type { ScanResult } from '../types';

export function DeepfakeScanner({ onScanComplete }: { onScanComplete: (r: ScanResult) => void }) {
  const { t } = useLang();
  return (
    <FileScanner
      title={t.scanMedia}
      description={t.uploadMediaMsg}
      acceptedTypes=".jpg,.jpeg,.png,.mp4,.avi"
      analyzeType="media"
      onScanComplete={onScanComplete}
    />
  );
}
