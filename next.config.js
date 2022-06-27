const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' use.fortawesome.com ;
  style-src 'self';
  font-src 'self';  
`

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
];

module.exports = withBundleAnalyzer({
  images: {
    domains: ['flat.badgen.net'],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/[[...packets]]',
          has: [{ type: 'query', key: '', value: '' }],
        },
        {
          source: '/sitemap.xml.gz',
          destination: 'https://npmtrends.s3.amazonaws.com/sitemaps/sitemap.xml.gz',
        },
      ],
    };
  },
});
