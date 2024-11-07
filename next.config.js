/** @type {import('next').NextConfig} */
const nextConfig = {
        experimental: {
                mdxRs: true,
                serverComponentsExternalPackages: ['mongoose'],
                esmExternals: 'loose'
              }
};

module.exports= nextConfig;
