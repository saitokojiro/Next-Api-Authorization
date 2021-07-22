module.exports = {
  reactStrictMode: true,
}
module.exports = {
  async headers() {
    return [
      {
        source: '/login',
        headers: [
          {
            key: 'access-control-expose-headers',
            value: 'Set-Cookie',
          },{
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },{
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ]
  },
}