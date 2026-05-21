const LIKES_KEY = "aiarklive-likes";
const SAVES_KEY = "aiarklive-saves";

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]) {
  localStorage.setItem(key, JSON.stringify(ids));
}

export function getLocalLikes(): string[] {
  return readIds(LIKES_KEY);
}

export function getLocalSaves(): string[] {
  return readIds(SAVES_KEY);
}

export function toggleLocalLike(videoId: string): boolean {
  const ids = readIds(LIKES_KEY);
  const exists = ids.includes(videoId);
  writeIds(
    LIKES_KEY,
    exists ? ids.filter((id) => id !== videoId) : [...ids, videoId]
  );
  return !exists;
}

export function toggleLocalSave(videoId: string): boolean {
  const ids = readIds(SAVES_KEY);
  const exists = ids.includes(videoId);
  writeIds(
    SAVES_KEY,
    exists ? ids.filter((id) => id !== videoId) : [...ids, videoId]
  );
  return !exists;
}

export function isLocallyLiked(videoId: string): boolean {
  return readIds(LIKES_KEY).includes(videoId);
}

export function isLocallySaved(videoId: string): boolean {
  return readIds(SAVES_KEY).includes(videoId);
}
