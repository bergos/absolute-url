# absolute-url

[![build status](https://img.shields.io/github/actions/workflow/status/bergos/absolute-url/test.yaml?branch=master)](https://github.com/bergos/absolute-url/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/absolute-url.svg)](https://www.npmjs.com/package/absolute-url)

Get the absolute URL of an Express request object.

## Install

```bash
npm install --save absolute-url
```

## Usage

The library offers two ways to use the functionality:

### Function

The default export is a function that can be called with the Express request object as a parameter.
It returns the absolute URL as a `URL` object.

```javascript
import absoluteUrl from 'absolute-url'

app.use((req, res, next) => {
  console.log(absoluteUrl(req))

  next()
})
```

See `examples/function.js` for a full working example.

### Middleware

The package also exports a `middleware` factory function.
It can be used to attach a `.absoluteUrl` method to the Express request object.
The method returns the absolute URL as a `URL` object.

```javascript
import { middleware } from 'absolute-url'

app.use(middleware())

app.use((req, res, next) => {
  console.log(req.absoluteUrl())

  next()
})
```

See `examples/middleware.js` for a full working example.
