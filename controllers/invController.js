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
  res.render("./inventory/classification", {
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

  res.render("./inventory/detail", {
    title: vehicle.inv_make + " " + vehicle.inv_model,
    nav,
    detail,
  })
  console.log("vehicle detail data ", vehicle);
  console.log("vehicle array ", data);
}

module.exports = invCont
