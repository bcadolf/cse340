/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require('express-ejs-layouts')
const baseCtrl = require('./controllers/baseCtrl')
const inventoryRoute = require('./routes/inventoryRoute')
const utilities = require('./utilities/')
const session = require('express-session')
const pool = require('./database/')
const accountRoute = require('./routes/accountRoute')
const bodyParser = require("body-parser")

// middleware
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// express messages middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root



/* ***********************
 * Routes
 *************************/
app.use(static)
// Index Route
app.get('/', utilities.handleErrors(baseCtrl.buildHOME))
//inventory routes
app.use('/inv', inventoryRoute)
//account routes
app.use('/account', accountRoute)
// 404 route
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry the page is missing or lost.'});
})


// express error handler goes after all middleware
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalURL}": ${err.message}`);
  if (err.status == 404) {
    res.render('errors/404', {
      title: '404',
      message: err.message,
      nav,
    });
  } else {
    res.render('errors/error', {
      title: err.status || 'Server Error',
      message: err.message,
      nav
    });
  }
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
