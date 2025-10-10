// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities"); 
const invController = require("../controllers/invController");
const inventoryValidate = require("../utilities/inventory-validation")
const addinvValidate = require("../utilities/inventory-validation")
//const handleErrors = require("../utilities").handleErrors;
const handleErrors = (err, req, res, next) => {
  console.error("Error at:", req.originalUrl);
  console.error(err.stack);
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: "Sorry, we appear to have lost that page."
  });
};


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the vehicle detail view
router.get("/detail/:invId", invController.buildByInvId);

// Route to build the management view
router.get("/", invController.buildManagementView, handleErrors);

//Build add vehicle view
router.get("/add-vehicle", (req, res) => {
  res.render("inventory/add-vehicle", {
    title: "Add Vehicle",
    nav
  })
})

//Build Management view
router.get("/management", invController.buildManagementView, handleErrors);

//Build add-classification view
router.get("/add-classification", invController.buildAddClassificationView, handleErrors); 
invController.buildAddClassificationView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages: req.flash("notice")
    });
  } catch (err) {
    next(err);
  }
};

//Build add-classification view
router.get("/add-inventory", invController.buildAddInventoryView, handleErrors); 
invController.buildAddInventoryView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      messages: req.flash("notice")
    });
  } catch (err) {
    next(err);
  }
};


//Process add classification
router.post(
  "/add-classification",
  inventoryValidate.addClassification,
  inventoryValidate.validateAddClassification,
  invController.insertClassification, 
);
//add new inventory
router.post(
  "/add-inventory",
   inventoryValidate.addInventoryRules,
  inventoryValidate.checkInventoryData,
  invController.insertInventory
)

module.exports = router;