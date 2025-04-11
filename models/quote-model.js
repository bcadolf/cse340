const pool = require('../database/');


// function to add new quote to the db
async function newQuote(quote_asking_price, quote_miles, quote_year, quote_color, quote_condition, quote_vin, quote_email, quote_phone, quote_firstname, quote_lastname, quote_make, quote_model) {
    try {
        const sql = "INSERT INTO quotes (quote_asking_price, quote_miles, quote_year, quote_color, quote_condition, quote_vin, quote_email, quote_phone, quote_firstname, quote_lastname, quote_make, quote_model) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *";
        const result = await pool.query(sql, [quote_asking_price, quote_miles, quote_year, quote_color, quote_condition, quote_vin, quote_email, quote_phone, quote_firstname, quote_lastname, quote_make, quote_model]);
        return result.rows[0].quote_id;
    } catch (error) {
        return error.message;
    }
}

// query check quote reponse if complete
async function checkQuote(quote_id) {
    try {
    const sql = "SELECT * FROM quotes WHERE quote_id = $1";
    const result = await pool.query(sql, [quote_id]);
    return result.rows[0]
    } catch (error) {
        return error.message;
    }
}

// query to adjust quote before the response
async function changeQuote(quote_id, quote_asking_price, quote_miles, quote_year, quote_color, quote_condition, quote_vin, quote_email, quote_phone, quote_firstname, quote_lastname, quote_make, quote_model) {
    try {
        const sql = "UPDATE quotes SET quote_asking_price = $1, quote_miles = $2, quote_year = $3, quote_color = $4, quote_condition = $5, quote_vin = $6, quote_email = $7, quote_phone = $8, quote_firstname = $9, quote_lastname = $10, quote_make = $11, quote_model = $12 WHERE quote_id = $13 RETURNING *";
        const result = await pool.query(sql, [quote_asking_price, quote_miles, quote_year, quote_color, quote_condition, quote_vin, quote_email, quote_phone, quote_firstname, quote_lastname, quote_make, quote_model, quote_id]);
        return result.rows[0]
    } catch (error) {
        return error.message;
    }
}

//query to view all pending quotes
async function viewQuotes() {
    try {
        const result = await pool.query("SELECT * FROM quotes WHERE quote_offer_price IS NULL");
        return result.rows
    } catch (error) {
        return error.message;
    }
}

// query to process a pending quote and assign a price
async function processQuote(quote_id, quote_offer_price) {
    try {
        const sql = "UPDATE quotes SET quote_offer_price = $1 WHERE quote_id = $2 RETURNING *";
        const result = await pool.query(sql, [quote_offer_price, quote_id]);
        return result.rows[0]
    } catch (error) {
        return error.message;
    }
}

async function getSchema() {
    const result = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'quotes'")
    return result.rows
}

module.exports = { newQuote, checkQuote, changeQuote, viewQuotes, processQuote, getSchema };