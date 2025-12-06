"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { SubscriptionStatusResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function SubscriptionManager() {
  const [subscription, setSubscription] = useState<SubscriptionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await apiClient.getSubscription();
      setSubscription(data);
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setActionLoading(true);
    try {
      const result = await apiClient.createPortalSession({
        return_url: window.location.href,
      });
      window.location.href = result.portal_url;
    } catch (error) {
      console.error("Error opening portal:", error);
      alert("Failed to open subscription portal. Please try again.");
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll retain access until the end of your billing period.")) {
      return;
    }

    setActionLoading(true);
    try {
      await apiClient.cancelSubscription({
        reason: "User requested cancellation",
      });
      alert("Your subscription has been cancelled. You'll have access until the end of your billing period.");
      await loadSubscription();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = "/subscribe";
  };

  if (loading) {
    return (
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (cents?: number, currency?: string) => {
    if (!cents) return "N/A";
    const dollars = cents / 100;
    return `${currency?.toUpperCase() || "USD"} $${dollars.toFixed(2)}`;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { icon: React.ReactNode; color: string; text: string }> = {
      active: {
        icon: <CheckCircle className="w-4 h-4" />,
        color: "bg-green-500/20 text-green-400 border-green-500/30",
        text: "Active",
      },
      trialing: {
        icon: <AlertCircle className="w-4 h-4" />,
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        text: "Trial",
      },
      cancelled: {
        icon: <XCircle className="w-4 h-4" />,
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        text: "Cancelled",
      },
      past_due: {
        icon: <AlertCircle className="w-4 h-4" />,
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        text: "Past Due",
      },
      none: {
        icon: <AlertCircle className="w-4 h-4" />,
        color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        text: "Free",
      },
    };

    const badge = badges[status] || badges.none;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${badge.color}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const isFree = subscription?.status === "none" || subscription?.tier === "free";
  const isPremium = subscription?.tier === "premium" && ["active", "trialing"].includes(subscription?.status || "");
  const isCancelled = subscription?.status === "cancelled";

  return (
    <div className="space-y-4">
      {/* Current Plan Card */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </h3>
          {getStatusBadge(subscription?.status || "none")}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-dark-300">
            <span className="text-text-secondary">Plan</span>
            <span className="text-text-primary font-semibold capitalize">
              {subscription?.tier || "Free"}
            </span>
          </div>

          {!isFree && (
            <>
              <div className="flex justify-between items-center py-2 border-b border-dark-300">
                <span className="text-text-secondary">Billing Cycle</span>
                <span className="text-text-primary font-semibold capitalize">
                  {subscription?.billing_cycle || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dark-300">
                <span className="text-text-secondary">Price</span>
                <span className="text-text-primary font-semibold">
                  {formatPrice(subscription?.price_cents, subscription?.currency)}
                </span>
              </div>

              {subscription?.current_period_end && (
                <div className="flex justify-between items-center py-2 border-b border-dark-300">
                  <span className="text-text-secondary flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {subscription?.will_renew ? "Renews On" : "Access Until"}
                  </span>
                  <span className="text-text-primary font-semibold">
                    {formatDate(subscription?.current_period_end)}
                  </span>
                </div>
              )}

              {isCancelled && subscription?.cancelled_at && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-text-secondary">Cancelled On</span>
                  <span className="text-red-400 font-semibold">
                    {formatDate(subscription?.cancelled_at)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {isFree && (
            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-brand hover:opacity-90 text-white shadow-btn-glow"
            >
              Upgrade to Premium
            </Button>
          )}

          {isPremium && (
            <>
              <Button
                onClick={handleManageSubscription}
                disabled={actionLoading}
                className="w-full bg-dark-300 hover:bg-dark-200 text-text-primary"
              >
                {actionLoading ? "Loading..." : "Manage Subscription"}
              </Button>

              {subscription?.will_renew && (
                <Button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  variant="outline"
                  className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Cancel Subscription
                </Button>
              )}
            </>
          )}

          {isCancelled && (
            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-brand hover:opacity-90 text-white shadow-btn-glow"
            >
              Reactivate Subscription
            </Button>
          )}
        </div>
      </div>

      {/* Premium Features Info */}
      {isFree && (
        <div className="glass rounded-xl p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-3">
            Premium Features
          </h4>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Unlimited exercises and lessons</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Full voice tutor with pronunciation analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>All conversation scenarios unlocked</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Advanced progress tracking and analytics</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Priority support</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
