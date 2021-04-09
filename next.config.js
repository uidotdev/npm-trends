module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/[[...packets]]',
      },
      {
        source: '/index',
        destination: '/[[...packets]]',
      },
      {
        source: '/sitemap.xml.gz',
        destination: 'https://npmtrends.s3.amazonaws.com/sitemaps/sitemap.xml.gz',
      },
    ];
  },
};
