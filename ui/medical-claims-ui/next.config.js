/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    output: 'export',
    outputFileTracingRoot: path.join(__dirname),
    trailingSlash: true,
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            'tailwindcss/version.js': path.resolve(__dirname, 'package.json')
        };
        return config;
    }
}

module.exports = nextConfig
