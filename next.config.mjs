/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deploy pipeline nests public/ on every push, which breaks the image optimizer's
  // internal fetch. Raw files via nginx are deploy-proof; the site has ~15 images.
  images: { unoptimized: true },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'architmittal.com',
      },
    ],
  },
}

export default nextConfig
