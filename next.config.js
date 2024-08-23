/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        GOOGLE_PLACE_API_KEY: process.env.GOOGLE_PLACE_API_KEY,
        NEXT_PUBLIC_PLACE_ID: process.env.NEXT_PUBLIC_PLACE_ID,
    },
};

module.exports = nextConfig;