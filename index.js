var path = require('path')
var url = require('url')

function absoluteUrl (options, req, res, next) {
  options = options || {}

  req.absoluteUrl = function () {
    var absoluteUrl = {
      protocol: this.protocol,
      hostname: this.hostname,
      port: this.socket.address().port,
      pathname: this.originalUrl || this.url
    }

    if (absoluteUrl.protocol === 'http' && req.socket.ssl) {
      absoluteUrl.protocol += 's'
    }

    if (options.basePath) {
      absoluteUrl.pathname = path.join(options.basePath, absoluteUrl.pathname)
    }

    // use proxy header fields?
    if (req.app.get('trust proxy')) {
      if ('x-forwarded-proto' in this.headers) {
        absoluteUrl.protocol = this.headers['x-forwarded-proto']
      }

      if ('x-forwarded-host' in this.headers) {
        var hostParts = this.headers['x-forwarded-host'].split(':')

        absoluteUrl.hostname = hostParts.shift()
        absoluteUrl.port = hostParts.shift()
      }
    }

    // ignore port if default http(s) port
    if (absoluteUrl.protocol === 'http' && absoluteUrl.port === 80) {
      absoluteUrl.port = ''
    }

    if (absoluteUrl.protocol === 'https' && absoluteUrl.port === 443) {
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
