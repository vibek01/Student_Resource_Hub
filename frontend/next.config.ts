import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Still keep these if you also want to suppress build-time errors:
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  webpack(config, { dev }) {
    // 1) Remove the built-in ESLint plugin in dev so no overlay appears:
    if (dev && config.plugins) {
      config.plugins = config.plugins.filter(
        (plugin: any) => plugin.constructor.name !== 'ESLintWebpackPlugin'
      )
    }

    // 2) Keep your PDF worker rule:
    config.module.rules.push({
      test: /pdf\.worker\.min\.js$/,
      type: 'asset/resource',
    })

    return config
  },
}

export default nextConfig
