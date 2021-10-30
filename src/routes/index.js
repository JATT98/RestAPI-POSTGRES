const { Router } = require('express');
const router = Router();

const { getUsers, getUserInfo, getProducts, getProductsByCategory, getProduct,
    postOrder, postOrderDetail, UpdateUser, getCart, updateDetail, deleteDetail,
    publishOrder, getMyOrders, getActiveOrders, assignOrder, completeOrder,
    modifyDetail} = require('../controllers/index.controller');

router.get('/users', getUsers);
router.post('/getUser', getUserInfo);
router.get('/products', getProducts);
router.get('/products/:id', getProductsByCategory);
router.get('/product/:id', getProduct);
router.post('/postOrder', postOrder);
router.post('/postDetail', postOrderDetail);
router.post('/updateUser', UpdateUser);
router.get('/cart/:id', getCart);
router.post('/detail/update', updateDetail);
router.post('/detail/delete', deleteDetail);
router.post('/publish', publishOrder);
router.get('/myorders/:id', getMyOrders);
router.get('/activeorders/:id', getActiveOrders);
router.post('/assignorder', assignOrder);
router.get('/completeorder/:id', completeOrder);
router.post('/modifyorder', modifyDetail);

module.exports = router;