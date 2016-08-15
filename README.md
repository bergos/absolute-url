# absolute-url

Attaches .absoluteUrl() function to req.

## Usage

    // load module
    var absoluteUrl = require('absolute-url')

    // add routing
    app.use(absoluteUrl())

    // use it in your middleware
    app.use(function (req, res, next) {
      console.log(req.absoluteUrl())
    })

### Attaching

If you don't know if `absolute-url` is used as middleware, it's possible to attach it dynamically.
That is usefull inside of a middleware where you want to use an application specific instance (with options) or the default one.

    app.use(function (req, res, next) {
      absoluteUrl.attach(req)

      console.log(req.absoluteUrl())
    })
