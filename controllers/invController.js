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

    //create the select list
    const classificationList = await utilities.buildClassificationList()

    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationList,
      message: req.flash("notice")
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

//add a new inventory item
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

//get the inventory for public/js/inventory.js file when sorting

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ******************************
 *  edit/modify inventory in the management view
 * ***************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)

    if (!itemData || itemData.length === 0) {
      req.flash("notice", "The vehicle was not found.")
      return res.redirect("/inv/management")
    }

    const vehicle = itemData[0]
    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`
    const classificationList = await utilities.buildClassificationList(vehicle.classification_id)

    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_description: vehicle.inv_description,
      inv_image: vehicle.inv_image,
      inv_thumbnail: vehicle.inv_thumbnail,
      inv_price: vehicle.inv_price,
      inv_miles: vehicle.inv_miles,
      inv_color: vehicle.inv_color,
      classification_id: vehicle.classification_id,
      message: req.flash("notice")
    })
  } catch (err) {
    next(err)
  }
}

//edit/update/modify a new inventory item from edit-inventory.ejs
invCont.updateInventory = async function (req, res, next) {
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
      inv_id
    } = req.body
    const nav = await utilities.getNav();

    const updateResult = await invModel.updateInventory(
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
      parseInt(inv_id)
    )
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationList = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      message: req.flash("notice"),
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
      inv_id
    });
  }
  } catch (err) {
    next(err)
  }
}
/* ******************************
 *  Build the delete confirmation view
 * ***************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id); // Get the inventory ID from the URL
    const nav = await utilities.getNav(); // Build the navigation

    const itemData = await invModel.getVehicleById(inv_id); // Get the vehicle data

    if (!itemData || itemData.length === 0) {
      req.flash("notice", "The vehicle was not found.");
      return res.redirect("/inv/management");
    }

    const vehicle = itemData[0]; // Extract the vehicle object
    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`; // Build display name

    const classificationList = await utilities.buildClassificationList(vehicle.classification_id);

    res.render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      classificationList,
      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_price: vehicle.inv_price,
      message: req.flash("notice")
    });
  } catch (err) {
    next(err);
  }
};


/* ******************************
 *  Carry out the inventory delete process
 * ***************************** */
invCont.deleteInventoryFinal = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id); // Get the inventory ID from the form
    const nav = await utilities.getNav(); // Build the navigation

    const deleteResult = await invModel.deleteInventory(inv_id); // Call model to delete item

    if (deleteResult) {
      req.flash("notice", "The inventory item was successfully deleted.");
      res.redirect("/inv/management"); // Redirect to management view
    } else {
      req.flash("notice", "Sorry, the delete failed.");
      res.redirect(`/inv/delete/${inv_id}`); // Redirect back to confirmation view
    }
  } catch (err) {
    next(err);
  }
};

module.exports = invCont
