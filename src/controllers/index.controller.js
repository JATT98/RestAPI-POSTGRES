const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'Admin123',
    database: 'amabisca',
    port: '5432'
});

const getUsers = async (req, res) => {
    const response = await pool.query('SELECT * FROM ut_rol ORDER BY nombre ASC');
    res.status(200).json(response.rows);
};

const getUserInfo = async (req, res) => {
    const {name, pass} = req.body;
    const response = await pool.query('SELECT * FROM f_login_usuario($1,$2)',[name, pass]);
    res.json(response.rows);
};

const getProducts = async (req, res) => {
    const response = await pool.query('SELECT * FROM pt_descripcion');
    res.status(200).json(response.rows);
};

const getProductsByCategory = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT pr.* FROM pt_descripcion AS pr '
                                        + 'INNER JOIN pt_relacion_categoria AS rel '
                                        + 'ON rel.prc_producto = pr.pc_producto '
                                        + 'INNER JOIN pt_categoria AS cat '
                                        + 'ON cat.pc_categoria = rel.prc_categoria '
                                        + 'WHERE rel.prc_categoria = $1 OR '
                                        + 'cat.rc_categoria_padre = $2',[id, id]);
    res.json(response.rows);
};

const postOrderDetail = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT pr.* FROM pt_descripcion AS pr '
                                        + 'INNER JOIN pt_relacion_categoria AS rel '
                                        + 'ON rel.prc_producto = pr.pc_producto '
                                        + 'INNER JOIN pt_categoria AS cat '
                                        + 'ON cat.pc_categoria = rel.prc_categoria '
                                        + 'WHERE rel.prc_categoria = $1 OR '
                                        + 'cat.rc_categoria_padre = $2',[id, id]);
    res.json(response.rows);
};

module.exports = {
    getUsers,
    getUserInfo,
    getProducts,
    getProductsByCategory
};