/**
 * Compresses an image file to a small base64 string
 * suitable for LocalStorage caching (approx. 15KB - 40KB).
 */
export function compressImage(file: File, maxWidth = 480, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string); // Fallback to raw if context fails
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => {
        reject(err);
      };
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
}

/**
 * Calculates approximately how many bytes of localStorage are taken or remain.
 */
export function getStorageStats() {
  let totalBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const val = localStorage.getItem(key);
      totalBytes += (key.length + (val?.length || 0)) * 2; // Two bytes per char in UTF-16
    }
  }
  const maxBytes = 5 * 1024 * 1024; // 5MB standard
  return {
    usedBytes: totalBytes,
    usedMB: (totalBytes / (1024 * 1024)).toFixed(2),
    percentUsed: Math.min(100, (totalBytes / maxBytes) * 100).toFixed(1),
    limitMB: 5
  };
}
