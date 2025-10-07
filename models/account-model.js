const pool = require("../database/")

console.log("🔥 registerAccount controller hit");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
    /* Note: placeholders are used - $# - as part of the "parameterized statement" syntax. Additionally, 'Client' is included in the SQL statement to indicate the "type" of account being registered. The "RETURNING *" clause indicates to the PostgrSQL server to return values based on the record that was inserted. It is a way to confirm that the insertion worked. */
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}
module.exports = {registerAccount};