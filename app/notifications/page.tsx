"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getNotifications(20, 0, filter === "unread");
      setNotifications(data.notifications);
      setHasMore(data.has_more);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const data = await apiClient.getNotifications(
        20,
        notifications.length,
        filter === "unread"
      );
      setNotifications(prev => [...prev, ...data.notifications]);
      setHasMore(data.has_more);
    } catch (error) {
      console.error("Failed to load more notifications:", error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await apiClient.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.notification_id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiClient.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
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
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-text-primary mb-2">
              Notifications
            </h1>
            <p className="text-body-lg text-text-tertiary">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-white/[0.03] rounded-xl p-1 w-fit">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-lg text-body-sm font-medium transition-colors",
              filter === "all"
                ? "bg-primary text-white"
                : "text-text-tertiary hover:text-text-primary"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "px-4 py-2 rounded-lg text-body-sm font-medium transition-colors",
              filter === "unread"
                ? "bg-primary text-white"
                : "text-text-tertiary hover:text-text-primary"
            )}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-surface-secondary rounded-2xl border border-white/[0.08] overflow-hidden">
          {isLoading ? (
            <div className="px-6 py-12 text-center text-text-tertiary">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-6 py-12 text-center text-text-tertiary">
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-h3 font-semibold text-text-primary mb-2">
                No notifications yet
              </h3>
              <p className="text-body-lg">
                {filter === "unread"
                  ? "You don't have any unread notifications"
                  : "We'll notify you about achievements, goals, and more"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.08]">
              {notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={cn(
                    "relative group",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <Link
                    href={notification.action_url || "#"}
                    onClick={() => {
                      if (!notification.read) {
                        handleMarkAsRead(notification.notification_id);
                      }
                    }}
                    className="block px-6 py-4 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 text-3xl">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3
                            className={cn(
                              "text-body-lg font-medium text-text-primary",
                              !notification.read && "font-semibold"
                            )}
                          >
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-body-md text-text-secondary mb-2">
                          {notification.message}
                        </p>
                        <p className="text-caption text-text-quaternary">
                          {formatTimestamp(notification.created_at)}
                        </p>
                      </div>

                      {/* Mark as read button (visible on hover for unread) */}
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleMarkAsRead(notification.notification_id);
                          }}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/[0.05] rounded-lg"
                          aria-label="Mark as read"
                        >
                          <Check className="w-4 h-4 text-text-tertiary" />
                        </button>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && !isLoading && (
            <div className="px-6 py-4 border-t border-white/[0.08] text-center">
              <Button
                onClick={loadMore}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
