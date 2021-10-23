const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'Admin123',
    database: 'amabisca',
    port: '5432'
});

const getUsers = async (req, res) => {
    const response = await pool.query('SELECT * FROM ut_cuenta ORDER BY id ASC');
    res.status(200).json(response.rows);
};

module.exports = {
    getUsers
};