/**
 * Utilities for client-side image compression and video URL normalization
 */

export function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Convert to webp if supported, or jpeg
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Normalizes user-input video URLs (e.g. YouTube watch links, shorts, youtu.be, Vimeo)
 * to proper embed URLs or keeps direct video URLs intact.
 */
export function formatVideoUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If already embed
  if (trimmed.includes('youtube.com/embed/') || trimmed.includes('player.vimeo.com')) {
    return trimmed;
  }

  // YouTube watch link: https://www.youtube.com/watch?v=XXXX
  const ytWatchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*?&v=)([a-zA-Z0-9_-]+)/);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return `https://www.youtube.com/embed/${ytWatchMatch[1]}`;
  }

  // YouTube short link: https://youtu.be/XXXX
  const ytShortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (ytShortMatch && ytShortMatch[1]) {
    return `https://www.youtube.com/embed/${ytShortMatch[1]}`;
  }

  // YouTube Shorts: https://www.youtube.com/shorts/XXXX
  const ytShortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (ytShortsMatch && ytShortsMatch[1]) {
    return `https://www.youtube.com/embed/${ytShortsMatch[1]}`;
  }

  // Vimeo: https://vimeo.com/XXXX
  const vimeoMatch = trimmed.match(/vimeo\.com\/([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
}

export function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.startsWith('data:video/') ||
    url.startsWith('blob:') ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
  );
}
