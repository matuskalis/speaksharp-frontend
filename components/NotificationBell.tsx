"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch unread count on mount and periodically
  useEffect(() => {
    fetchUnreadCount();

    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch recent notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchRecentNotifications();
    }
  }, [isOpen]);

  const fetchUnreadCount = async () => {
    try {
      const data = await apiClient.getUnreadNotificationCount();
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const fetchRecentNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getNotifications(5, 0, false);
      setRecentNotifications(data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await apiClient.markNotificationAsRead(notificationId);
      // Update local state
      setRecentNotifications(prev =>
        prev.map(n =>
          n.notification_id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return "🏆";
      case "goal_complete":
        return "✅";
      case "streak_risk":
        return "⚠️";
      case "streak_milestone":
        return "🔥";
      case "level_up":
        return "⬆️";
      case "weekly_summary":
        return "📊";
      case "reminder":
        return "🔔";
      default:
        return "📢";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-text-tertiary hover:text-text-primary transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-surface-secondary border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
              <h3 className="text-h4 font-semibold text-text-primary">
                Notifications
              </h3>
              <Link
                href="/notifications"
                className="text-body-sm text-primary hover:text-primary/80 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View all
              </Link>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-8 text-center text-text-tertiary">
                  Loading...
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-text-tertiary">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.08]">
                  {recentNotifications.map((notification) => (
                    <Link
                      key={notification.notification_id}
                      href={notification.action_url || "/notifications"}
                      onClick={() => {
                        if (!notification.read) {
                          handleMarkAsRead(notification.notification_id, {} as React.MouseEvent);
                        }
                        setIsOpen(false);
                      }}
                      className={cn(
                        "block px-4 py-3 hover:bg-white/[0.03] transition-colors",
                        !notification.read && "bg-primary/5"
                      )}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-body-sm font-medium text-text-primary mb-1",
                            !notification.read && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-body-sm text-text-tertiary line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-caption text-text-quaternary mt-1">
                            {formatTimestamp(notification.created_at)}
                          </p>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {recentNotifications.length > 0 && (
              <div className="px-4 py-3 border-t border-white/[0.08] bg-white/[0.02]">
                <Link
                  href="/notifications"
                  className="block text-center text-body-sm text-primary hover:text-primary/80 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications →
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
