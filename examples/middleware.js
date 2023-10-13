import express from 'express'
import { middleware } from '../index.js'

const app = express()

app.use(middleware())

app.use((req, res, next) => {
  console.log(req.absoluteUrl())

  res.end('Hello World!')
})

const server = app.listen(err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`listening http://localhost:${server.address().port}/`)
  }
})
