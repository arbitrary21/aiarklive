"use client";

import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import type { User } from "@/lib/types";

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSaved: (updated: Partial<User>) => void;
}

export function EditProfileModal({
  user,
  onClose,
  onSaved,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      const updates: Partial<User> = {};

      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        const res = await fetch("/api/profile/avatar", {
          method: "POST",
          body: fd,
        });
        const data = await res.json() as { ok?: boolean; avatarUrl?: string; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Avatar upload failed.");
        updates.avatar_url = data.avatarUrl;
      }

      if (username.trim() !== user.username || bio.trim() !== (user.bio ?? "")) {
        const res = await fetch("/api/profile/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim() !== user.username ? username.trim() : undefined,
            bio: bio.trim() !== (user.bio ?? "") ? bio.trim() : undefined,
          }),
        });
        const data = await res.json() as { ok?: boolean; user?: User; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Failed to update profile.");
        if (data.user) {
          updates.username = data.user.username;
          updates.bio = data.user.bio;
        }
      }

      onSaved(updates);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const displayAvatar = avatarPreview ?? user.avatar_url;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6"
        style={{
          background: "var(--surface-elevated)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Avatar */}
        <div className="mb-5 flex flex-col items-center gap-3">
          <div className="relative">
            {displayAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayAvatar}
                alt={user.username}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-3xl font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-brand-500 text-white transition hover:bg-brand-400"
              style={{ borderColor: "var(--surface-elevated)" }}
              title="Change photo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs text-brand-300 hover:underline"
          >
            Change profile photo
          </button>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-muted">
            Nickname
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={32}
            className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand-500 transition"
            style={{ borderColor: "var(--border)" }}
            placeholder="Enter your nickname"
          />
        </div>

        {/* Bio */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-muted">
            Bio
            <span className="ml-1 text-xs font-normal text-muted/60">
              ({bio.length}/200)
            </span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
            rows={3}
            className="w-full resize-none rounded-xl border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand-500 transition"
            style={{ borderColor: "var(--border)" }}
            placeholder="Tell the world about yourself..."
          />
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-xl border py-2.5 text-sm font-medium text-muted transition hover:text-foreground disabled:opacity-50"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
