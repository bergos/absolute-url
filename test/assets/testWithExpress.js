import { readFile } from 'node:fs/promises'
import { createServer as createHttpsServer } from 'node:https'
import express from 'express'
import absoluteUrlFunction, { middleware as absoluteUrlMiddleware } from '../../index.js'

async function testWithExpress (func, { absoluteUrl, https, middleware, proxy } = {}) {
  let url = null

  const app = express()

  // enable support for x-forwarded proxy headers
  if (proxy) {
    app.set('trust proxy', 'loopback')
  }

  // assign a custom function
  if (absoluteUrl) {
    app.use((req, res, next) => {
      req.absoluteUrl = absoluteUrl

      next()
    })
  }

  // use the middleware
  if (middleware) {
    app.use(absoluteUrlMiddleware())
  }

  // get the URL from middleware or function
  app.use((req, res, next) => {
    url = middleware ? req.absoluteUrl() : absoluteUrlFunction(req)

    next()
  })

  // TLS or plain http: ?
  if (https) {
    const server = createHttpsServer({
      key: await readFile('test/assets/example.org-key.pem'),
      cert: await readFile('test/assets/example.org.pem'),
      requestCert: false,
      rejectUnauthorized: false
    }, app)

    await func(server)
  } else {
    await func(app)
  }

  return url
}

export default testWithExpress
