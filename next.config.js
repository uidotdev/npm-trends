const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/[[...packets]]',
          has: [{ type: 'query', key: "", value: "" }]
        },
        {
          source: '/sitemap.xml.gz',
          destination: 'https://npmtrends.s3.amazonaws.com/sitemaps/sitemap.xml.gz',
        },
      ]
    }
  },
});
