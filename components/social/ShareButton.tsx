"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Twitter, MessageCircle, Copy, Check, X } from 'lucide-react';
import {
  createTwitterShareUrl,
  createWhatsAppShareUrl,
  copyToClipboard,
  isNativeShareAvailable,
  nativeShare,
} from '@/lib/share-utils';

export interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  variant?: 'default' | 'compact' | 'icon';
  onShare?: (platform: string) => void;
}

export function ShareButton({
  title,
  text,
  url,
  variant = 'default',
  onShare,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleNativeShare = async () => {
    const success = await nativeShare(title, text, url);
    if (success) {
      onShare?.('native');
      setIsOpen(false);
      showSuccessToast('Shared successfully!');
    }
  };

  const handleTwitterShare = () => {
    const shareUrl = createTwitterShareUrl(text, url);
    window.open(shareUrl, '_blank', 'width=550,height=420');
    onShare?.('twitter');
    setIsOpen(false);
    showSuccessToast('Opened Twitter!');
  };

  const handleWhatsAppShare = () => {
    const shareUrl = createWhatsAppShareUrl(text, url);
    window.open(shareUrl, '_blank');
    onShare?.('whatsapp');
    setIsOpen(false);
    showSuccessToast('Opened WhatsApp!');
  };

  const handleCopyLink = async () => {
    const shareText = url ? `${text}\n\n${url}` : text;
    const success = await copyToClipboard(shareText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShare?.('copy');
      showSuccessToast('Copied to clipboard!');
      setTimeout(() => setIsOpen(false), 1000);
    }
  };

  const showSuccessToast = (message: string) => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-white/70 hover:text-white transition-all"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <ShareModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onTwitter={handleTwitterShare}
          onWhatsApp={handleWhatsAppShare}
          onCopy={handleCopyLink}
          onNative={isNativeShareAvailable() ? handleNativeShare : undefined}
          copied={copied}
        />
        <Toast show={showToast} />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-white/70 hover:text-white text-sm font-medium transition-all"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <ShareModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onTwitter={handleTwitterShare}
          onWhatsApp={handleWhatsAppShare}
          onCopy={handleCopyLink}
          onNative={isNativeShareAvailable() ? handleNativeShare : undefined}
          copied={copied}
        />
        <Toast show={showToast} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
      >
        <Share2 className="w-5 h-5" />
        Share Achievement
      </button>
      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onTwitter={handleTwitterShare}
        onWhatsApp={handleWhatsAppShare}
        onCopy={handleCopyLink}
        onNative={isNativeShareAvailable() ? handleNativeShare : undefined}
        copied={copied}
      />
      <Toast show={showToast} />
    </>
  );
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTwitter: () => void;
  onWhatsApp: () => void;
  onCopy: () => void;
  onNative?: () => void;
  copied: boolean;
}

function ShareModal({
  isOpen,
  onClose,
  onTwitter,
  onWhatsApp,
  onCopy,
  onNative,
  copied,
}: ShareModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-6 bg-dark-100 rounded-2xl border border-white/[0.08] shadow-2xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Share Your Win!</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              {/* Native Share (Mobile) */}
              {onNative && (
                <button
                  onClick={onNative}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-white transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Share</div>
                    <div className="text-sm text-white/60">Use system share</div>
                  </div>
                </button>
              )}

              {/* Twitter/X */}
              <button
                onClick={onTwitter}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-white transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">Twitter / X</div>
                  <div className="text-sm text-white/60">Share on Twitter</div>
                </div>
              </button>

              {/* WhatsApp */}
              <button
                onClick={onWhatsApp}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-white transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">WhatsApp</div>
                  <div className="text-sm text-white/60">Share on WhatsApp</div>
                </div>
              </button>

              {/* Copy Link */}
              <button
                onClick={onCopy}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-white transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0">
                  {copied ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </div>
                  <div className="text-sm text-white/60">
                    {copied ? 'Link copied to clipboard' : 'Copy to clipboard'}
                  </div>
                </div>
              </button>
            </div>

            <p className="text-xs text-white/40 text-center mt-6">
              Share your progress and inspire others to learn!
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Toast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg z-50 flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span className="font-medium">Success!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
