export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}

export function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return diffSec <= 1 ? 'Just now' : `${diffSec} seconds ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} mins ago`;
  const diffHrs = Math.round(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  const diffDays = Math.round(diffHrs / 24);
  return `${diffDays} days ago`;
}

export function generateVerificationID() {
  const prefix = "DSA";
  const year = new Date().getFullYear();
  const country = "IND";
  const timestamp = Date.now().toString(36).toUpperCase();
  const scanHash = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${year}-${country}-${timestamp}-${scanHash}`;
}
