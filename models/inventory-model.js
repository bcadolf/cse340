const pool = require('../database/');


// db query to get all classification data
async function getClassifications() {
    return await pool.query('SELECT * FROM public.classification ORDER BY classification_name');
}

// db query to get all inventory items and classification name by id
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS inv
            JOIN public.classification AS clas
            ON inv.classification_id = clas.classification_id
            WHERE inv.classification_id = $1`, [classification_id]
        )
        return data.rows;
    } catch (error) {
        console.error('getclassificationsbyid error' + error)
    }
}

// db query for inv item details
async function getDetailByInvId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE public.inventory.inv_id = $1`, [inv_id]
        );
        return data.rows;
    } catch (error) {
        console.error('getdetailsbyid error' + error)
    }
}

async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name]);
    } catch (error) {
        return error.message;
    }
}

async function checkForClass(classification_name) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_name = $1";
        const className = await pool.query(sql, [classification_name]);
        return className.rowCount;
    } catch (error) {
        return error.message
    }
}

async function getInvColumns() {
    try {
        const result = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'inventory' AND column_name NOT IN ('inv_id', 'classification_id')`);
        return result.rows;
    } catch (error) {
        return error.message
    }
}

async function modifyInventory(inv_miles, inv_price, inv_year, inv_description, inv_image, inv_thumbnail, inv_make, inv_color, inv_model, classification_id, inv_id = null) {
    try {
        if (inv_id) {
            const sql = "UPDATE inventory SET inv_miles = $1, inv_price = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_make = $7, inv_color = $8, inv_model = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
            const result = await pool.query(sql, [inv_miles, inv_price, inv_year, inv_description, inv_image, inv_thumbnail, inv_make, inv_color, inv_model, classification_id, inv_id]);
            return result.rows[0];
        } else {
        const sql = "INSERT INTO inventory (inv_miles, inv_price, inv_year, inv_description, inv_image, inv_thumbnail, inv_make, inv_color, inv_model, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING inv_id";
        const result = await pool.query(sql, [inv_miles, inv_price, inv_year, inv_description, inv_image, inv_thumbnail, inv_make, inv_color, inv_model, classification_id]);
        return result.rows[0].inv_id }
    } catch (error) {
        return error.message
    }
}


module.exports = {getClassifications, getInventoryByClassificationId, getDetailByInvId, addClassification, checkForClass, getInvColumns, modifyInventory};