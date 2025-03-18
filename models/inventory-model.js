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



module.exports = {getClassifications, getInventoryByClassificationId};