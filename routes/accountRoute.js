//Needed Resources
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")
const { handleErrors } = utilities
const regValidate = require("../utilities/account-validation")


//for testing purposes
console.log("handleErrors:", handleErrors)
console.log("accountLogin:", accountController.accountLogin)


// Route that will be sent when the My Account link is selected
router.get("/", utilities.checkLogin, handleErrors(accountController.accountManagement))

// Route must use a function from the account controller
router.get("/login", handleErrors(accountController.buildLogin))

//Route that will be selected when the register link is selected
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//POST route that will process the registration form
router.post(
  "/register",
  regValidate.registrationRules(), 
  regValidate.checkRegData,   
  handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  handleErrors(accountController.accountLogin)
)

//updating Account info
router.get("/update/:account_id", utilities.checkLogin, accountController.buildUpdateAccount)

// GET: Show update form
router.get("/update/:account_id", utilities.checkLogin, accountController.buildUpdateAccount)

//POST: Handle account info update
router.post(
  "/update",
  validate.updateAccountRules,
  validate.checkUpdateData,
  accountController.updateAccount
)

//POST: handle password change
router.post(
  "/update-password",
  regValidate.passwordChangeRules(),
  regValidate.checkPasswordChange,
  accountController.updatePassword
)

//Logout
router.get("/logout", accountController.logout)

module.exports = router;
