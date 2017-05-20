var path = require('path')
var url = require('url')

function absoluteUrl (options, req, res, next) {
  options = options || {}

  req.absoluteUrl = function () {
    var originalUrl = url.parse(this.originalUrl || this.url)

    var absoluteUrl = {
      protocol: this.protocol,
      pathname: originalUrl.pathname,
      search: originalUrl.search
    }

    if (absoluteUrl.protocol === 'http:' && req.socket.ssl) {
      absoluteUrl.protocol = 'https:'
    }

    if (options.basePath) {
      absoluteUrl.pathname = path.join(options.basePath, absoluteUrl.pathname)
    }

    var host = this.headers.host

    // use proxy header fields?
    if (req.app && req.app.get('trust proxy')) {
      if ('x-forwarded-proto' in this.headers) {
        absoluteUrl.protocol = this.headers['x-forwarded-proto']
      }

      if ('x-forwarded-host' in this.headers) {
        host = this.headers['x-forwarded-host']
      }
    }

    if (!host) {
      var address = req.socket.address()

      host = address.address + ':' + address.port
    }

    var hostPortIndex = host.lastIndexOf(':')

    if (hostPortIndex === -1) {
      absoluteUrl.hostname = host
    } else {
      absoluteUrl.hostname = host.substring(0, hostPortIndex)
      absoluteUrl.port = parseInt(host.substring(hostPortIndex + 1))
    }

    // ignore port if default http(s) port
    if (absoluteUrl.protocol === 'http:' && absoluteUrl.port === 80) {
      absoluteUrl.port = ''
    }

    if (absoluteUrl.protocol === 'https:' && absoluteUrl.port === 443) {
      absoluteUrl.port = ''
    }

    return url.format(absoluteUrl)
  }

  if (next) {
    next()
  }
}

function init (options) {
  return absoluteUrl.bind(null, options)
}

init.attach = function (req, options) {
  if (!req.absoluteUrl) {
    absoluteUrl(options, req)
  }
}

module.exports = init
