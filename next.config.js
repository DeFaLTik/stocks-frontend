/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: "http://localhost:8080/api/v1",
    INTERVAL: "50000",
  },
};
module.exports = nextConfig;
