// Controller for account-related views

const utilities = require("../utilities")
//bring the accountModel into the controller
const accountModel = require("../models/account-model") 

/* ****************************************
*  Deliver login view
* *************************************** */

const buildLogin = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      notice: req.flash("notice"),
      accountEmail: req.body?.account_email || "",
    })
  } catch (err) {
    next(err)
  }
}

const accountManagement = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("account/account", {
      title: "My Account",
      nav
    })
  } catch (err) {
    next(err)
    }
    console.log("Account Management view rendered")
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
 if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.redirect("/account/login");

  
  } else {
    req.flash("notice", "Sorry, the registration failed.")
   res.redirect("/account/login");
  }
  console.log("Registration was a success")
}


module.exports = {
  buildLogin,
  accountManagement, 
  buildRegister,
  registerAccount
}
