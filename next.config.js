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
    ];
  },
};
