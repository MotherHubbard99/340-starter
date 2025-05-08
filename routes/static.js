//express package brought into the scope of the file and assigned to a local variable
const express = require('express');
//Express "router" functionality is invoked and stored into a local variable for use. () indicates Router is a function
const router = express.Router();

// Static Routes
// Set up "public" folder / subfolders for static files
//the Express router is to use the "express.static" function
router.use(express.static("public"));
//any route that containes /css is to refer ti the public/css folder
router.use("/css", express.static(__dirname + "public/css"));
//any route that contains /js is to refer to the public/js folder
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

//VERY IMPORTANT! exports the router object, along with all of these statements for use in other areas of the application
module.exports = router;



