/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deploy pipeline nests public/ on every push, which breaks the image optimizer's
  // internal fetch. Raw files via nginx are deploy-proof; the site has ~15 images.
  output: 'standalone',
  images: {
    // Deploy pipeline nests public/ each push and breaks the optimizer — serve raw.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'architmittal.com',
      },
    ],
  },
}

export default nextConfig
