/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Don't generate AGENTS.md / CLAUDE.md on next dev
    agentRules: false,
    // Image uploads ride in Server Action bodies; keep in sync with MAX_IMAGE_BYTES in server/media/upload.ts
    experimental: {
        serverActions: { bodySizeLimit: '30mb' },
        // Admin routes pass through proxy.ts, which buffers bodies up to this size
        proxyClientMaxBodySize: '30mb',
    },
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '').split('/')[0],
            pathname: '/**'
        }]
    },

};

export default nextConfig;