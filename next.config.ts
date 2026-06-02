import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      { source: '/', destination: '/ar', permanent: false },
    ]
  },
}

export default nextConfig
