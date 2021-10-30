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
    const response = await pool.query('SELECT * FROM f_login_usuario($1,$2) LIMIT 1',[name, pass]);
    
        res.json(response.rows[0]);
    
    }

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

const getProduct = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM pt_descripcion '
                                        + 'WHERE pc_producto = $1',[id]);
    res.json(response.rows[0]);
};

const postOrder = async (req, res) => {
    const {name} = req.body;
    const response = await pool.query('SELECT * FROM f_crear_orden($1)',[name]);
    res.json(response.rows[0]);
};

const postOrderDetail = async (req, res) => {
    const {orden,producto,cantidad} = req.body;
    const response = await pool.query('SELECT * FROM f_post_detalle($1,$2,$3)',[orden, producto, cantidad]);
    res.json(response.rows[0]);
};

const UpdateUser = async (req, res) => {
    const {codigo,usuario,clave,nombre,apellido,direccion,telefono,correo} = req.body;
    const response = await pool.query('SELECT * FROM f_mod_usuario($1,$2,$3,$4,$5,$6,$7,$8)',
            [codigo, usuario, clave,nombre,apellido,direccion,telefono,correo]);
    res.json(response.rows[0]);
};

const getCart = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT pd.pc_producto, pd.nombre, pd.precio, '
                                    + 'pd.imagen, od.cantidad FROM pt_descripcion AS pd '
                                    + 'INNER JOIN ot_descripcion AS od ON od.prc_producto = pc_producto '
                                    + 'WHERE prc_orden = $1;',[id]);
    res.json(response.rows);
};

const updateDetail = async (req, res) => {
    const {orden,producto,cantidad} = req.body;
    const response = await pool.query('UPDATE ot_descripcion SET cantidad = $1 '
                                    + 'WHERE prc_orden = $2 AND prc_producto = $3',[cantidad,orden,producto]);
    res.json({"msj": "OK"});
};

const deleteDetail = async (req, res) => {
    const {orden,producto} = req.body;
    const response = await pool.query('DELETE FROM ot_descripcion '
                                    + 'WHERE prc_orden = $1 AND prc_producto = $2',[orden,producto]);
    res.json({"msj": "OK"});
};

const publishOrder = async (req, res) => {
    const {orden,pago} = req.body;
    const response = await pool.query('UPDATE ot_identificacion SET rc_estado = 4, '
                                    + 'pago = $1, f_emision = (SELECT NOW())  WHERE pc_orden = $2',[pago,orden]);
    res.json({"msj": "OK"});
};

const getMyOrders = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT oi.pc_orden AS orden, COALESCE(oi.detalle, \' \') AS detalle, '
                                    + 'CONCAT(ud.nombre,\' \',ud.apellido) AS repartidor, '
                                    + 'COALESCE(TO_CHAR(oi.f_emision::timestamp, \'DD Mon YYYY\'), \' \') AS fecha, COALESCE(ud.telefono, \'46463819\') AS telefono FROM ot_identificacion AS oi '
                                    + 'FULL JOIN ut_cuenta AS uc ON uc.pc_cuenta = oi.rc_emisor '
                                    + 'FULL JOIN ut_descripcion AS ud ON ud.prc_usuario = uc.pc_cuenta '
                                    + 'WHERE oi.rc_cliente = $1 AND oi.rc_estado IN (3,4);',[id]);
    res.json(response.rows);
};

const getActiveOrders = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT oi.pc_orden AS orden, CONCAT(ud.nombre,\' \',ud.apellido) AS cliente, '
                                    + 'COALESCE(TO_CHAR(oi.f_emision::timestamp, \'DD Mon YYYY\'), \' \') AS fecha, '
                                    + 'COALESCE(ud.telefono, \' \') AS telefono, oe.nombre AS estado '
                                    + 'FROM ot_identificacion AS oi '
                                    + 'INNER JOIN ot_estado AS oe ON oe.pc_estado = oi.rc_estado '
                                    + 'FULL JOIN ut_cuenta AS uc ON uc.pc_cuenta = oi.rc_cliente '
                                    + 'FULL JOIN ut_descripcion AS ud ON ud.prc_usuario = uc.pc_cuenta '
                                    + 'WHERE oi.rc_estado = 4 OR (oi.rc_estado = 3 AND oi.rc_emisor = $1)',[id]);
    res.json(response.rows);
};

const assignOrder = async (req, res) => {
    const {emisor,orden} = req.body;
    const response = await pool.query('UPDATE ot_identificacion SET rc_emisor = $1, '
                                    + 'rc_estado = 3 WHERE pc_orden = $2',[emisor, orden]);
    res.json({"msj": "OK"});
};

const completeOrder = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('UPDATE ot_identificacion SET pago = \'Pagada\', '
                                    + 'rc_estado = 1 WHERE pc_orden = $1',[id]);
    res.json({"msj": "OK"});
};

const modifyDetail = async (req, res) => {
    const {detalle,orden} = req.body;
    const response = await pool.query('UPDATE ot_identificacion SET '
                                    + 'detalle = $1 WHERE pc_orden = $2',[detalle, orden]);
    res.json({"msj": "OK"});
};


module.exports = {
    getUsers,                   getUserInfo,
    getProducts,                getProduct,
    getProductsByCategory,      postOrder,
    postOrderDetail,            UpdateUser,
    getCart,                    updateDetail,
    deleteDetail,               publishOrder,
    getMyOrders,                getActiveOrders,
    assignOrder,                completeOrder,
    modifyDetail
};