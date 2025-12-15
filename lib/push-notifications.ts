/**
 * Web Push Notification utilities
 *
 * Handles browser push notification subscription and management
 */

import { apiClient } from './api-client';

// VAPID public key - should be generated and stored as env variable
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

/**
 * Check if push notifications are supported
 */
export function isPushSupported(): boolean {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Convert VAPID key from base64 to Uint8Array for use with PushManager.subscribe
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Register service worker and get push subscription
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported');
    return null;
  }

  if (!VAPID_PUBLIC_KEY) {
    console.warn('VAPID public key not configured');
    return null;
  }

  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Send existing subscription to backend to ensure it's registered
      await sendSubscriptionToServer(subscription);
      return subscription;
    }

    // Create new subscription
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // Send subscription to backend
    await sendSubscriptionToServer(subscription);

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Remove from backend
      await removeSubscriptionFromServer(subscription.endpoint);
      // Unsubscribe from browser
      await subscription.unsubscribe();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to unsubscribe from push:', error);
    return false;
  }
}

/**
 * Check if user is currently subscribed to push
 */
export async function isSubscribedToPush(): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch {
    return false;
  }
}

/**
 * Send subscription to backend
 */
async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  const subscriptionData = subscription.toJSON();

  await apiClient.registerPushSubscription({
    endpoint: subscriptionData.endpoint!,
    p256dh: subscriptionData.keys?.p256dh || '',
    auth: subscriptionData.keys?.auth || '',
  });
}

/**
 * Remove subscription from backend
 */
async function removeSubscriptionFromServer(endpoint: string): Promise<void> {
  await apiClient.unregisterPushSubscription(endpoint);
}

/**
 * Get push notification preferences
 */
export interface PushPreferences {
  enabled: boolean;
  streak_reminders: boolean;
  friend_challenges: boolean;
  achievements: boolean;
  daily_goals: boolean;
}

export const DEFAULT_PUSH_PREFERENCES: PushPreferences = {
  enabled: false,
  streak_reminders: true,
  friend_challenges: true,
  achievements: true,
  daily_goals: true,
};
