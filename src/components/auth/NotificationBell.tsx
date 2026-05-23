"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Notification } from "@/lib/types";

export function NotificationBell() {
  const { user, configured } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !configured) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user, configured, fetchNotifications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!configured || !user) return null;

  const markRead = async (ids?: string[]) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    await fetchNotifications();
  };

  const handleOpen = () => {
    setOpen((v) => !v);
    if (!open && unreadCount > 0) {
      void markRead();
    }
  };

  const getNotificationHref = (notification: Notification): string => {
    if (notification.type === "follow") {
      return `/profile/${notification.actor_id}`;
    }
    if (notification.video_id) {
      return `/video/${notification.video_id}`;
    }
    return "#";
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleOpen}
        className="btn-icon relative"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border shadow-xl"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
          }}
        >
          <div
            className="border-b px-4 py-3"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <p className="text-xs text-muted">
              Likes, comments, follows, and new uploads
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted">
                Loading...
              </p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted">
                No notifications yet. Follow creators to get updates.
              </p>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={getNotificationHref(notification)}
                  onClick={() => {
                    setOpen(false);
                    if (!notification.read_at) {
                      void markRead([notification.id]);
                    }
                  }}
                  className={clsx(
                    "block border-b px-4 py-3 text-sm transition hover:bg-[var(--surface-elevated)]",
                    !notification.read_at && "bg-brand-500/5"
                  )}
                  style={{ borderColor: "var(--border)" }}
                >
                  <p className="text-foreground">{notification.message}</p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(notification.created_at).toLocaleString("en-US")}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
