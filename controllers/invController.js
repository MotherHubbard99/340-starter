const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* ***************************
 *  Build the vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getVehicleById(inv_id)  

  if (!data  || data.length === 0) {
    return res.status(404).send("Vehicle not found")
  }
  // Data is returned as an array; get the first item
  const vehicle = data[0] //take out the first item in the array
  const detail = await utilities.buildVehicleDetail(vehicle)
  const nav = await utilities.getNav()

  res.render("inventory/detail", {
    title: vehicle.inv_make + " " + vehicle.inv_model,
    nav,
    detail,
  })
  console.log("vehicle detail data ", vehicle);
  console.log("vehicle array ", data);
}

/* ***************************
  *  Build the management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav
    })
  } catch (err) {
    next(err)
  }
}

/* ******************************
 *  Build the add classification view
 * ***************************** */

invCont.buildAddClassificationView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages: req.flash("notice")
    })
  } catch (err) {
    next(err)
  }
}
console.log("buildAddClassification triggered");


/* ******************************
 *  Insert the new classification data into DB
 * ***************************** */

invCont.insertClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const nav = await utilities.getNav();

    const regResult = await invModel.addClassification(classification_name);
    if (regResult) {
      req.flash("notice", "Congratulations, you added a new classification.");
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, adding the classification failed.");
      const classificationList = await utilities.buildClassificationList();
      res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        classificationList,
        message: req.flash("notice")
      });
    }
  } catch (err) {
    next(err)
  }
}

//Drop-down classification box used to add new inventory
invCont.buildAddInventoryView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(); // Call your dropdown builder
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: req.flash("notice")
    });
  } catch (err) {
    next(err);
  }
};

invCont.insertInventory = async function (req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    } = req.body
    const nav = await utilities.getNav();

    const regResult = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    );
    if (regResult) {
      req.flash("notice", "Congratulations, you added new inventory.");
      res.redirect("/inv/management");
    } else {
      req.flash("notice", "Sorry, adding the inventory failed.");
      const classificationList = await utilities.buildClassificationList();
      res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        message: req.flash("notice"),
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id

      });
    }
  } catch (err) {
    next(err)
  }
}


module.exports = invCont
