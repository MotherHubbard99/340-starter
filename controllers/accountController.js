// Controller for account-related views

const utilities = require("../utilities")
//bring the accountModel into the controller
const accountModel = require("../models/account-model") 
//hashPassword before storing in the database
const bcrypt = require("bcryptjs")
/* web token for cookies */
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
    const accountData = res.locals.accountData // from JWT middleware in index.js
    const notice = req.flash("notice") //get the flash messages

    const fs = require("fs")
    const path = require("path")
    const viewPath = path.join(__dirname, "../views/account/account.ejs")
    console.log("View exists:", fs.existsSync(viewPath))


    res.render("account/account", {
      title: "My Account",
      nav, 
      notice, 
      accountData
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

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    //A saltRound is an integer indicating how many times a hash will be resent through the hashing algorithim. In our code, the 10 means that the password will be hashed, then that hash will be rehashed and so on until 10 such processes have been carried out.
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
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

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {

      /*store that the user has successfully logged in and which views the viewer can access*/
      req.session.loggedin = true;
      req.session.accountId = accountData.account_id;
      req.session.accountFirstname = accountData.account_firstname;
      req.session.accountLastname = accountData.account_lastname;
      req.session.accountEmail = accountData.account_email;

      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Update Account info
 * ************************************ */
async function buildUpdateAccount (req, res) {
  const nav = await utilities.getNav()
  const account_id = req.params.account_id
  const accountData = await accountModel.getAccountById(account_id)
  const notice = req.flash("notice")
  
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    accountData,
    notice
  })
}

/* ******************************
 * Handle account info update
 * ***************************** */
async function updateAccount (req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
  } else {
    req.flash("notice", "Update failed. Please try again.")
  }

  res.render("account/account", {
    title: "Account Management",
    nav,
    accountData,
  })
}

/* ******************************
 * Handle password change
 * ***************************** */
async function updatePassword (req, res) {
  const { account_id, account_password } = req.body
  const hashedPassword = await bcrypt.hash(account_password, 10)
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)

  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
  } else {
    req.flash("notice", "Password update failed.")
  }

  res.render("account/account", {
    title: "Account Management",
    nav,
    accountData,
  })
}

/* ******************************
 * Logout
 * ***************************** */
async function logout (req, res){
  res.clearCookie("jwt") // Remove the token
  req.session.destroy(() => {
    req.flash("notice", "You have successfully logged out.")
    res.redirect("/") // Send them home
  })
}


module.exports = {
  buildLogin,
  accountManagement, 
  buildRegister,
  registerAccount,
  accountLogin,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
  logout
}
