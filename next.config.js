/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Note: CSP is handled by Vercel/Next.js automatically
  // Custom CSP headers removed to prevent blocking Next.js inline scripts
  // Vercel uses proper nonce-based CSP in production
};

module.exports = nextConfig;
