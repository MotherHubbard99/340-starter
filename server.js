/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/basecontroller")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities")
//require the session package and DB conncection
const session = require("express-session")
const pool = require("./database/")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* *********************** */
/* Middleware */
/*************************/
/* invokes the app.use() function and indicates the session is to be applied */
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
   secret: process.env.SESSION_SECRET,
  /* This session for the session in the database is typically "false". But, because we are using "flash" messages we need to resave the session table after each message, so it must be set to "true". */
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
 }))

//confirm session is working
 app.use((req, res, next) => {
  console.log("Session object:", req.session)
  next()
})

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  /*  "locals" option and a name of "messages". This allows any message to be stored into the response, making it available in a view. */
  res.locals.messages = require('express-messages')(req, res)
  next()
})


//tells Express that anything inside the public folder can be served directly via URL
const path = require("path")
app.use(express.static(path.join(__dirname, "public")))

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 

//cookies
app.use(cookieParser())

/*JSON Web Token in index.js*/
app.use(utilities.checkJWTToken)

//store if the user has logged in, so we know what to show and which views they have access to
app.use((req, res, next) => {
  res.locals.loggedin = req.session.loggedin;
  res.locals.account_firstname = req.session.account_firstname;
  next();
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")//not at views root. In views/layouts/

/* ***********************
 * Routes
 *************************/
app.use(static)
//Index route
//app.get('/', function (req, res) {
  //res.render("index", {title: "HomeTest"})
//})
app.get("/", utilities.handleErrors(baseController.buildHome))

//Inventory routes
//app.use() is an Express function that directs the application to use the resources passed in as parameters.
app.use("/inv", inventoryRoute)

//Acount login routes
app.use("/account", accountRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Blasted errors!'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500

const host = process.env.HOST || 'localhost'


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

