function _absoluteUrl (req) {
  let host = req.get('Host')

  const trust = req.app.get('trust proxy fn')

  if (trust(req.connection.remoteAddress, 0)) {
    host = req.get('x-forwarded-host') || host
  }

  return new URL(`${req.protocol}://${host}${req.originalUrl}`)
}

function absoluteUrl (req, { ignoreReqAbsoluteUrl } = {}) {
  if (!ignoreReqAbsoluteUrl && typeof req.absoluteUrl === 'function') {
    return req.absoluteUrl()
  }

  return _absoluteUrl(req)
}

function middleware () {
  return (req, res, next) => {
    if (typeof req.absoluteUrl !== 'function') {
      req.absoluteUrl = () => _absoluteUrl(req)
    }

    next()
  }
}

export {
  absoluteUrl as default,
  middleware
}
