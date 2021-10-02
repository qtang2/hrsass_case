const Koa = require('koa')
const serve = require('koa-static')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')
const proxy = require('koa2-proxy-middleware')

const app = new Koa()

app.use(proxy({
  targets: {
    // (.*) means anything
    '/prod-api/(.*)': {
      target: 'http://ihrm-java.itheima.net/api', // 后端服务器地址
      changeOrigin: true,
      pathRewrite: {
        '/prod-api': ''
      }
    }
  }
}))

app.use(historyApiFallback({
  whiteList: ['/prod-api']
}))

app.use((serve(__dirname + '/public')))

app.listen(3333, () => {
  console.log('IHRM project started, running at http://localhost:3333')
})
