/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
        pathname: "/**", // Permite todas as rotas sob este domínio
      },
    ],
  },
};

module.exports = nextConfig;

