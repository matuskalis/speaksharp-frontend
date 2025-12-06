"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface DialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

export interface DialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export interface DialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

export function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange: onOpenChange || (() => {}) }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children }: { children: React.ReactElement }) {
  const { onOpenChange } = React.useContext(DialogContext);
  return React.cloneElement(children, {
    onClick: () => onOpenChange(true),
  });
}

export function DialogContent({ className, children }: DialogContentProps) {
  const { open, onOpenChange } = React.useContext(DialogContext);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative w-full max-w-lg",
                "glass gradient-border rounded-2xl p-6",
                "max-h-[90vh] overflow-y-auto",
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 rounded-lg p-1 text-text-muted hover:bg-white/[0.05] hover:text-text-primary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function DialogHeader({ className, children }: DialogHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-2 mb-4", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ className, children }: DialogTitleProps) {
  return (
    <h2 className={cn("text-xl font-semibold text-text-primary", className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({ className, children }: DialogDescriptionProps) {
  return (
    <p className={cn("text-sm text-text-muted", className)}>
      {children}
    </p>
  );
}

export function DialogFooter({ className, children }: DialogFooterProps) {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6", className)}>
      {children}
    </div>
  );
}
