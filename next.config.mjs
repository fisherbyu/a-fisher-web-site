/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Don't generate AGENTS.md / CLAUDE.md on next dev
    agentRules: false,
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '').split('/')[0],
            pathname: '/**'
        }]
    },

};

export default nextConfig;