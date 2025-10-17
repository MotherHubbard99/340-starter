// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities"); 
const invController = require("../controllers/invController");
const inventoryValidate = require("../utilities/inventory-validation")
const handleErrors = require("../utilities").handleErrors;


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

//route to edit/modify/update inventory in the management view
router.get(
  "/edit/:inv_id",
  invController.buildEditInventoryView,
  handleErrors
)


//get the inventory for the public/js/inventory.js file: Populated 
router.get(
  "/getInventory/:classification_id", invController.getInventoryJSON, handleErrors)

//DELETE inventory by id
//route to edit/modify/update inventory in the management view
router.get(
  "/delete/:inv_id",
  invController.deleteInventory,
  handleErrors
)

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

//Edit/modify/update vehicle inventory info
//update matches the value from the form's action atribue in edit-inventory
router.post(
  "/update/",
  inventoryValidate.updateInventoryRules,
  inventoryValidate.checkUpdateData,
  invController.updateInventory,
  handleErrors
)

//DELETE inventory
router.post(
  "/delete/:inv_id",
  invController.deleteInventoryFinal,
  handleErrors
)

//Admin and employee only routes for certain access
router.get("/add-classification", utilities.checkAccountType, invController.buildAddClassificationView)
router.post(
  "/add-classification",
  utilities.checkAccountType,
  inventoryValidate.addClassification, 
  inventoryValidate.validateAddClassification,
  invController.insertClassification
)


router.get("/add-inventory", utilities.checkAccountType, invController.buildAddInventoryView)
router.post("/add-inventory", utilities.checkAccountType, invController.insertInventory)

router.get("/edit/:inv_id", utilities.checkAccountType, invController.buildEditInventoryView)

router.post("/update/", utilities.checkAccountType, inventoryValidate.updateInventoryRules, inventoryValidate.checkUpdateData, invController.updateInventory)

router.post("/delete/", utilities.checkAccountType, invController.deleteInventoryFinal)


module.exports = router;

