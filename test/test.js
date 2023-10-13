import { strictEqual } from 'node:assert'
import { describe, it } from 'mocha'
import request from 'supertest'
import testWithExpress from './assets/testWithExpress.js'

describe('absoluteUrl', function () {
  describe('protocol', () => {
    it('should return a URL with http: protocol', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/index.html')
      })

      strictEqual(url.protocol, 'http:')
    })

    it('should return a URL with https: protocol (encrypted connection)', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/index.html')
          .trustLocalhost(true)
      }, { https: true })

      strictEqual(url.protocol, 'https:')
    })

    it('should return a URL with https: protocol from x-header (proxy enabled)', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/index.html')
          .set('x-forwarded-proto', 'https')
      }, { proxy: true })

      strictEqual(url.protocol, 'https:')
    })

    it('should return a URL with http: protocol ignoring x-header (proxy disabled)', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/index.html')
          .set('x-forwarded-proto', 'https')
      })

      strictEqual(url.protocol, 'http:')
    })
  })

  describe('hostname', () => {
    it('should return a URL with example.org hostname', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/index.html')
          .set('host', 'example.org')
      })

      strictEqual(url.hostname, 'example.org')
    })

    it('should return a URL with example.org hostname from x-header (proxy enabled)', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/index.html')
          .set('host', 'example.com')
          .set('x-forwarded-host', 'example.org')
      }, { proxy: true })

      strictEqual(url.hostname, 'example.org')
    })

    it('should return a URL with example.org hostname ignoring x-header (proxy disabled)', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/index.html')
          .set('host', 'example.org')
          .set('x-forwarded-host', 'example.com')
      })

      strictEqual(url.hostname, 'example.org')
    })
  })

  describe('port', () => {
    it('should return a URL with port from socket', async () => {
      let port = 0

      const url = await testWithExpress(async app => {
        const res = await request(app)
          .get('/index.html')

        port = res.res.socket.remotePort.toString()
      })

      strictEqual(url.port, port)
    })

    it('should return a URL with port from x-header (proxy enabled)', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/index.html')
          .set('host', 'example.com')
          .set('x-forwarded-host', 'example.org:8080')
      }, { proxy: true })

      strictEqual(url.port, '8080')
    })

    it('should return a URL with port from socket ignoring x-header (proxy disabled)', async () => {
      let port = 0

      const url = await testWithExpress(async app => {
        const res = await request(app)
          .get('/index.html')
          .set('x-forwarded-host', 'example.com')

        port = res.res.socket.remotePort.toString()
      })

      strictEqual(url.port, port)
    })
  })

  describe('pathname', () => {
    it('should return a URL with /index.html pathname', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/index.html')
      })

      strictEqual(url.pathname, '/index.html')
    })
  })

  describe('search', () => {
    it('should return a URL with ?a=b&c=1 search', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/index.html?a=b&c=1')
      })

      strictEqual(url.search, '?a=b&c=1')
    })
  })

  describe('custom function', () => {
    it('should return a URL create by the custom absoluteUrl function', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/')
      }, { absoluteUrl: () => new URL('http://example.org/') })

      strictEqual(url.hostname, 'example.org')
    })
  })

  describe('middleware', () => {
    it('should assign the absoluteUrl method to the req object', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/')
      }, { middleware: true })

      strictEqual(url.pathname, '/')
    })

    it('should return a URL create by the custom absoluteUrl function', async () => {
      const url = await testWithExpress(async app => {
        await request(app)
          .get('/')
      }, { absoluteUrl: () => new URL('http://example.org/'), middleware: true })

      strictEqual(url.hostname, 'example.org')
    })
  })
})
