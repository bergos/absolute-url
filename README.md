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
