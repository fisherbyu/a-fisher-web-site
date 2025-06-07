/** @type {import('next').NextConfig} */
const nextConfig = {
    runtime: 'nodejs18.x',
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '').split('/')[0],
            pathname: '/**'
        }]
    },
    webpack: (config) => {
        config.resolve.symlinks = false;
        return config;
    }
};

export default nextConfig;