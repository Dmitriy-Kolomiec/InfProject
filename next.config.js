/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_SERVER_URL: process.env.API_SERVER_URL,
  },
  images: {
    domains: ['localhost', 'www.inf.market'],
  },
  webpack(config) {
    config.module.rules.push({
      loader: '@svgr/webpack',
      issuer: /\.[jt]sx?$/,
      options: {
        prettier: false,
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                override: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
        titleProp: true,
      },
      test: /\.svg$/,
    });

    return config;
  },
  // experimental: {
  //   missingSuspenseWithCSRBailout: false,
  // },
};

module.exports = nextConfig;
