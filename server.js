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
app.get("/", baseController.buildHome)
//Inventory routes
app.use("/inv", inventoryRoute)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
//const port = process.env.PORT //this line is causing an error 1 in render
const PORT = process.env.PORT || 5500; // fallback for local dev
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
