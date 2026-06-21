import { useLang } from '../contexts/LangContext';
import { FileScanner } from './FileScanner';
import type { ScanResult } from '../types';

/** Dedicated AI voice-clone / synthetic-speech detector, separate from the generic media scanner. */
export function VoiceCloneChecker({ onScanComplete }: { onScanComplete: (r: ScanResult) => void }) {
  const { t } = useLang();
  return (
    <FileScanner
      title={t.scanVoice}
      description={t.uploadVoiceMsg}
      acceptedTypes=".mp3,.wav,.m4a,.ogg,.aac"
      analyzeType="voice"
      onScanComplete={onScanComplete}
    />
  );
}
