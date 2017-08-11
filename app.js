const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv').config()

const art = require('./api/art')
const writing = require('./api/writing')
const auth = require('./auth')

const app = express()

app.use('cors')
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1/art', art)
app.use('/api/v1/writing', writing)
app.use('/auth', auth)

app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  // res.status(err.status || 500)
  res.status(err.status || res.statusCode || 500)
  res.json({
    message:err.message,
    error:req.app.get('env') === 'development' ? err : {}
  })
})

module.exports = app
