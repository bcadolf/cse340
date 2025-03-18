const { query } = require('express');
const {Pool} = require('pg');
require('dotenv').config();

// Connection Pool for local testing of app DO NOT USE IN PRODUCTION

let pool;
if (process.env.NODE_ENV == 'development') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });


// for troubleshooting?
    module.exports = {
        async query(text, params) {
            try {
                const res = await pool.query(text, params);
                console.log('executed query', {text});
                return res;
            } catch (error) {
                console.error('error in query', { text});
                throw error;
            }
        }
    };
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: true,
        },
    });
    module.exports = pool;
}