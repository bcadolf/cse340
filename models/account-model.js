const pool = require('../database/');


async function logSignup(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (error) {
        return error.message;
    };
};

async function checkForEmail(account_email){
    try {
        const sql = "SELECT account_email FROM account WHERE account_email = $1";
        const email = await pool.query(sql, [account_email]);
        return email.rowCount;
    } catch (error) {
        return error.message
    };
};

async function verifyEmail(account_email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1";
        const result = await pool.query(sql, [account_email]);
        return result.rows[0];
    } catch (error) {
        return error.message
    };
};

module.exports = {logSignup, checkForEmail, verifyEmail}