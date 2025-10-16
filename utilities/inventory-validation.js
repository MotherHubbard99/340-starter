const { body, validationResult } = require("express-validator")
const validate = {}
const utilities = require("../utilities");

validate.addClassification = [
  body("classification_name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Classification name must be between 2 and 100 characters.")
]

validate.validateAddClassification = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav(); //define nav here
    req.flash("notice", "Failed to add classification");
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      notice: errors.array().map(err => err.msg)
    });
  } else {
    next();
  }
};

validate.addInventoryRules = [
  body("classification_id")
    .notEmpty()
    .withMessage("Please choose a classification."),

  body("inv_make")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Make must be at least 3 characters."),

  body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Model must be at least 3 characters."),

  body("inv_year")
    .isInt({ min: 1900, max: 2099 })
    .withMessage("Year must be a number between 1900 and 2099."),

  body("inv_description")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters."),
  
  body("inv_image")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters."),
  
  body("inv_thumbnail")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters."),

  body("inv_price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("inv_miles")
    .isInt({ min: 0 })
    .withMessage("Miles must be a positive integer."),

  body("inv_color")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Color must be at least 3 characters.")
];

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    req.flash("notice", "Please correct the errors below.");
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: errors.array().map(err => err.msg),
      //sticky to the form when it errors
      ...req.body
    });
  } else {
    next();
  }
};

//update/modify/edit validatoin rules for edit-inventory.ejs
validate.updateInventoryRules = [
  body("classification_id")
    .notEmpty()
    .withMessage("Please choose a classification."),

  body("inv_make")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Make must be at least 3 characters."),

  body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Model must be at least 3 characters."),

  body("inv_year")
    .isInt({ min: 1900, max: 2099 })
    .withMessage("Year must be a number between 1900 and 2099."),

  body("inv_description")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters."),
  
  body("inv_image")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters."),
  
  body("inv_thumbnail")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters."),

  body("inv_price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("inv_miles")
    .isInt({ min: 0 })
    .withMessage("Miles must be a positive integer."),

  body("inv_color")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Color must be at least 3 characters.")
];

//Errors will be directed back to the edit view because the file is getting updated/edited/modified in views/inventory/edit-inventory.ejs
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    const inv_id = req.body.inv_id 
    
    req.flash("notice", "Please correct the errors below.");
    res.render("inventory/edit-inventory", {
      title: "Update Inventory",
      nav,
      classificationList,
      inv_id,
      message: errors.array().map(err => err.msg),
      //sticky to the form when it errors
      ...req.body
    });
  } else {
    next();
  }
};

module.exports = validate
