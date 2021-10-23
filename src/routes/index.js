const { Router } = require('express');
const router = Router();

const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/index.controller');

router.get('/users', getUsers);

module.exports = router;