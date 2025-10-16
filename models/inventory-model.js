const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  /*return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")*/
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    return data.rows
  } catch (error) {
    console.error("getclassifications error " + error)
    return []  //returns an empty array so there is no error
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
    return []
  }
}

/* ***************************
  *  Get a single vehiclwe by inv_id
  * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getVehicleById error " + error)
    return null
  }
}

async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [classification_name])
    return data.rows[0] // Return the newly added classification
  } catch (error) {
    console.error("Error inserting classification " + error)
    return null
  }
}

async function addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,inv_price, inv_miles, inv_color) {
  try {
    const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    const data = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_miles, inv_color])
    return data.rows[0] // Return the newly added classification
  } catch (error) {
    console.error("Error inserting new inventory " + error)
    return null
  }
}

/* ***************************
 *  Update/modify/edit Inventory Data
 * ************************** */
async function updateInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id) {
  
  
  
  try {
    const sql = `
    UPDATE public.inventory
    SET classification_id = $1,
        inv_make = $2,
        inv_model = $3,
        inv_year = $4,
        inv_description = $5,
        inv_image = $6,
        inv_thumbnail = $7,
        inv_price = $8,
        inv_miles = $9,
        inv_color = $10
    WHERE inv_id = $11
    RETURNING *
  `
    const data = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image,
      inv_thumbnail, inv_price, inv_miles, inv_color, inv_id])
    
    
    console.log({
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
    })
    
    return data.rows[0] // Return the newly updated classification
  } catch (error) {
    console.error("Error updating model " + error)
    return null
  }
}

/* ***************************
 *  Delete Inventory Item per inv_id
 * ************************** */
async function deleteInventory( inv_id) {  
  try {
    const sql = `DELETE FROM inventory WHERE inv_id = $1`

    const data = await pool.query(sql, [inv_id])
    
    return data // 1 = successful delete, 0 = failure
  } catch (error) {
    console.error("Error deleting Inventory/Vehicle Item " + error)
    return null
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory, updateInventory, deleteInventory};

