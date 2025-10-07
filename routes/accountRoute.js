//Needed Resources
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const handleErrors = require("../utilities/").handleErrors
const regValidate = require('../utilities/account-validation')


// Route that will be sent when the My Account link is selected
router.get("/", accountController.accountManagement, handleErrors)
// Route must use a function from the account controller
router.get("/login", accountController.buildLogin, handleErrors)

//Route that will be selected when the register link is selected
router.get("/register", accountController.buildRegister, handleErrors)

//POST route that will process the registration form
router.post(
  "/register",
  regValidate.registrationRules(), 
    regValidate.checkRegData,   
  accountController.registerAccount, handleErrors)

module.exports = router;
