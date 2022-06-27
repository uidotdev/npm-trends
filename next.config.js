const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const ContentSecurityPolicy = `
  default-src 'self';
  connect-src 'self' npm-trends-gateway.onrender.com;
  script-src 'self' use.fortawesome.com www.google-analytics.com;
  style-src 'self' use.fortawesome.com 'unsafe-inline';
  img-src 'self' data: flat.badgen.net;
  font-src 'self' data:;  
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
