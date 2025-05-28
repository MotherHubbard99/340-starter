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
const baseController = require("./controller/baseController")
//express as a function is assigned to the app variable
const app = express()
//route file "static" is imported and stored into the "static" variable
const static = require("./routes/static")
//Index route
app.get("/", baseController.buildHome)


/* ***********************
 * View Enfine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") //.ejs extensions always default to the views folder so views isn't needed to be added in the file path


/* ***********************
 * Routes
 *************************/
//The resource which has been exported in the static file is now to be used by the app. This single line of code now allows the app to know where the public folder is located and that it and all of its subfolders will be used for static files.
//By doing things in this manner it allows for all the functionality, while allowing the server.js file to remain uncluttered.
app.use(static)
//Index route
//app.get watches the "get" object for a particular route
// "/" is the route being watched
//function(req, res) is a js function that takes the request and response objects as parameters
//res is the response object and render() is an Express function that will retrieve the specified view of "index" to be sent back to the browser
//Index Route
app.get("/", baseController.buildHome)

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
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
