import express from 'express'
import absoluteUrl from '../index.js'

const app = express()

app.use((req, res, next) => {
  console.log(absoluteUrl(req))

  res.end('Hello World!')
})

const server = app.listen(err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`listening http://localhost:${server.address().port}/`)
  }
})
