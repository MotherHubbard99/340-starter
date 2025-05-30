const pool = require("../database") //imports the database connection file (named index.js) from the database folder which is one level above the current file. Because the file is index.js, it is the default file, and will be located inside the database folder without being specified. The path could also be ../database/index.js. It would return the same result.

/* ***************************
 *  Get all classification data
 * ************************** */
//creates an "asynchronous" function, named getClassifications. An asynchronous function returns a promise, without blocking (stopping) the execution of the code. It allows the application to continue and will then deal with the results from the promise when delivered.
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
} //will return (send back) the result of the SQL query, which will be sent to the database server using a pool connection, when the resultset (data) or an error, is sent back by the database server. Notice the two keywords: return and await. Await is part of the Async - Await promise structure introduced in ES6. Return is an Express keyword, indicating that the data should be sent to the code location that called the function originally.

module.exports = {getClassifications} //exports the function for use elsewhere.