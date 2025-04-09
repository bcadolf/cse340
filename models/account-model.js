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

async function updateInfo(account_id, account_firstname, account_lastname, account_email) {
    try {
        const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
        return result.rows[0];
    } catch (error) {
        return error.message
    };
}

async function updatePass(account_id, account_password) {
    try {
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
        const result = await pool.query(sql, [account_password, account_id]);
        return result.rows[0];
    } catch (error) {
        return error.message
    };
}

module.exports = {logSignup, checkForEmail, verifyEmail, updateInfo, updatePass}