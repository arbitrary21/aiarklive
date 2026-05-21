const USERNAME_PATTERN = /^[a-z0-9_]{2,30}$/;

export function normalizeUsername(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30);
}

export function suggestUsernameFromMetadata(metadata: {
  username?: string;
  full_name?: string;
  name?: string;
  email?: string;
}): string {
  const raw =
    metadata.username ??
    metadata.full_name ??
    metadata.name ??
    metadata.email?.split("@")[0] ??
    "user";

  const normalized = normalizeUsername(raw);
  return normalized || "user";
}

export function validateUsername(username: string): string | null {
  const normalized = normalizeUsername(username);

  if (!normalized) {
    return "Nickname is required.";
  }

  if (normalized.length < 2) {
    return "Nickname must be at least 2 characters.";
  }

  if (!USERNAME_PATTERN.test(normalized)) {
    return "Use letters, numbers, and underscores only.";
  }

  return null;
}

export async function resolveAvailableUsername(
  baseUsername: string,
  isTaken: (username: string) => Promise<boolean>,
  excludeExactMatch = false
): Promise<string> {
  const username = normalizeUsername(baseUsername) || "user";
  if (excludeExactMatch && !(await isTaken(username))) {
    return username;
  }

  if (!(await isTaken(username))) {
    return username;
  }

  let suffix = 1;
  while (suffix < 1000) {
    const candidate = `${username}${suffix}`;
    if (!(await isTaken(candidate))) {
      return candidate;
    }
    suffix += 1;
  }

  return `${username}${Date.now().toString(36)}`;
}
