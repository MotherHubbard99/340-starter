const invModel = require("../models/inventory-model")
const Util = {}
const utilities = require("../utilities");


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
//Util.getNav = async function (req, res, next) {
Util.getNav = async function(){
  try {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';

    if (Array.isArray(data) && data.length > 0) {
  data.forEach((row) => {
        list += `<li>
          <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
            ${row.classification_name}
          </a>
        </li>`;
      });
    } else {
      console.error("No classification data returned from model", data);
    }

    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Error building navigation:", error);
    return "<ul><li><a href='/' title='Home page'>Home</a></li></ul>"; // Return a basic nav on error
  }

//module.exports = router; //causing an error
  
  /*Make sure there is data before trying to build*/ 
  if (data && data.rows) {
    data.rows.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    });
  } else {
    console.error("No classification data returned from model", data);
  }
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = '';
  grid += '<div class="vehicle-list-container">'
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
          + ' details"><img src="/images/' + vehicle.inv_thumbnail
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
  grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  } 
  grid += '</div>'  //close the container div
  return grid
}
/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = async function (data) {
   // Sanitize the image path to remove any accidental duplication
  const cleanPath = data.inv_image.replace(/^(\/?images\/)?vehicles\/vehicles\//, '$1vehicles/');
  
   //make and model as a header
  let detail = '<h1>' + data.inv_make + ' ' + data.inv_model + '</h1>';

  detail += '<div class="vehicle-detail-container">';
  
  //image
  detail += '<div class="vehicle-image">';
    detail += '<img src="/images/' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + '" />';
  detail += '</div>';
  detail += '<div class="vehicle-info">';
  
    //create a table for the rest of the data
    detail += '<table class = "vehicle-specs">';
    //price, description, color, year
      detail += '<tr><th>Year:</th><td> ' + data.inv_year + '</td></tr>';
      detail += '<tr><th>Color:</th><td> ' + data.inv_color + '</td></tr>';
      detail += '<tr><th>Price:</th><td> $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</td></tr>';
      //mileage
      detail += '<tr><th>Mileage:</th><td> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</td></tr>';
      detail += '<tr><th>Description:</th><td> ' + data.inv_description + '</td></tr>';
    detail += '</table>';
  detail += '</div>'; //close vehicle-info
  detail += '</div>'; // close vehicle-detail-container
  return detail;
}

/* ****************************************
 * Add Inventory drop-down box
/* ****************************************/
Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications()
  console.log("getClassifications() returned:", data);
  // use data directly, not data.rows
  if (!Array.isArray(data)) {
    console.error("Invalid classification data:", data);
    return '<select><option value="">Error loading classifications</option></select>';
  }

    let classificationList = '<select name="classification_id" id="classificationList" required">';
    classificationList += "<option value=''>Choose a Classification</option>"
      //classificationList += '<option value="">Custom</option>';
      //classificationList += '<option value="">Sedan</option>';
      //classificationList += '<option value="">Sport</option>';
      //classificationList += '<option value="">SUV</option>';
     // classificationList += '<option value="">Truck</option>';

  //Dynamic options from DB
    data.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util