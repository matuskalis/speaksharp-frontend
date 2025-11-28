"use client";

import Link from "next/link";

export function Footer() {
  const links = [
    { name: "About", href: "/about" },
    { name: "Technology", href: "/technology" },
    { name: "Privacy", href: "/privacy" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-charcoal-900 text-white py-6 mt-16">
      <div className="mx-auto max-w-container px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-base font-semibold text-white hover:text-charcoal-300 transition-colors"
          >
            Vorex
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-charcoal-300 hover:text-white transition-colors font-light"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
