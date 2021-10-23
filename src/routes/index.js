const { Router } = require('express');
const router = Router();

const { getUsers, getUserInfo, getProducts, getProductsByCategory, deleteUser } = require('../controllers/index.controller');

router.get('/users', getUsers);
router.put('/getUser', getUserInfo);
router.get('/products', getProducts);
router.get('/products/:id', getProductsByCategory);

module.exports = router;