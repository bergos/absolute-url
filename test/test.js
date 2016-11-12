/* global describe, it */

var assert = require('assert')
var absoluteUrl = require('../')

describe('absoluteUrl', function () {
  it('should generate a HTTP URL that contains protocol, hostname and path', function () {
    var req = {
      headers: {
        host: 'example.org',
      },
      socket: {},
      protocol: 'http:',
      url: 'index.html'
    }

    absoluteUrl()(req, null, function () {})

    assert.equal(req.absoluteUrl(), 'http://example.org/index.html')
  })

  it('should generate a HTTP URL that contains protocol, hostname, port and path', function () {
    var req = {
      headers: {
        host: 'example.org:123',
      },
      socket: {},
      protocol: 'http:',
      url: 'index.html'
    }

    absoluteUrl()(req, null, function () {})

    assert.equal(req.absoluteUrl(), 'http://example.org:123/index.html')
  })

  it('should generate a HTTP URL that contains protocol, hostname, port and path from originalUrl', function () {
    var req = {
      headers: {
        host: 'example.org:123',
      },
      protocol: 'http:',
      socket: {},
      url: 'index.html',
      originalUrl: 'original/index.html'
    }

    absoluteUrl()(req, null, function () {})

    assert.equal(req.absoluteUrl(), 'http://example.org:123/original/index.html')
  })

  it('should generate a HTTP URL that contains protocol, hostname, port and path using socket address if there is no host header', function () {
    var req = {
      headers: {},
      socket: {
        address: function () {
          return {
            address: '127.0.0.1',
            family: 'IPv4',
            port: 123
          }
        }
      },
      protocol: 'http:',
      url: 'index.html'
    }

    absoluteUrl()(req, null, function () {})

    assert.equal(req.absoluteUrl(), 'http://127.0.0.1:123/index.html')
  })

  it('should generate a HTTP URL that contains protocol, hostname, port and path using socket IPv6 address if there is no host header', function () {
    var req = {
      headers: {},
      socket: {
        address: function () {
          return {
            address: '::1',
            family: 'IPv6',
            port: 123
          }
        }
      },
      protocol: 'http:',
      url: 'index.html'
    }

    absoluteUrl()(req, null, function () {})

    assert.equal(req.absoluteUrl(), 'http://[::1]:123/index.html')
  })

  it('should detect SSL/TLS protocol', function () {
    var req = {
      headers: {
        host: 'example.org:123',
      },
      protocol: 'http:',
      socket: {
        ssl: {}
      },
      url: 'index.html'
    }

    absoluteUrl()(req, null, function () {})

    assert.equal(req.absoluteUrl(), 'https://example.org:123/index.html')
  })

  it('should skip default HTTP port', function () {
    var req = {
      headers: {
        host: 'example.org:80',
      },
      protocol: 'http:',
      socket: {},
      url: 'index.html'
    }

    absoluteUrl()(req, null, function () {})

    assert.equal(req.absoluteUrl(), 'http://example.org/index.html')
  })

  it('should skip default HTTPS port', function () {
    var req = {
      headers: {
        host: 'example.org:443',
      },
      protocol: 'http:',
      socket: {
        ssl: {}
      },
      url: 'index.html'
    }

    absoluteUrl()(req, null, function () {})

    assert.equal(req.absoluteUrl(), 'https://example.org/index.html')
  })

  it('should use basePath', function () {
    var req = {
      headers: {
        host: 'example.org:123',
      },
      protocol: 'http:',
      socket: {},
      url: 'index.html'
    }

    absoluteUrl({basePath: 'test'})(req, null, function () {})

    assert.equal(req.absoluteUrl(), 'http://example.org:123/test/index.html')
  })

  it('should ignore proxy headers if not enabled', function () {
    var req = {
      headers: {
        host: 'example.org:123',
        'x-forwarded-proto': 'https',
        'x-forwarded-host': 'otherhost',
        'x-forwarded-port': 456
      },
      protocol: 'http:',
      socket: {},
      url: 'index.html'
    }

    absoluteUrl()(req, null, function () {})

    assert.equal(req.absoluteUrl(), 'http://example.org:123/index.html')
  })

  it('should use proxy headers', function () {
    var req = {
      app: {
        get: function (key) { return key === 'trust proxy' }
      },
      hostname: 'example.org',
      protocol: 'http:',
      socket: {
        address: function () { return { port: 123 } }
      },
      url: 'index.html',
      headers: {
        'x-forwarded-proto': 'https',
        'x-forwarded-host': 'otherhost:456'
      }
    }

    absoluteUrl()(req, null, function () {})

    assert.equal(req.absoluteUrl(), 'https://otherhost:456/index.html')
  })

  describe('.attach', function () {
    it('should attach the .absoluteUrl method to the request', function () {
      var req = {}

      absoluteUrl.attach(req)

      assert.equal(typeof req.absoluteUrl, 'function')
    })

    it('should do nothing if there is already a .absoluteUrl method', function () {
      var func = function () {}
      var req = {
        absoluteUrl: func
      }

      absoluteUrl.attach(req)

      assert.equal(req.absoluteUrl, func)
    })
  })
})
