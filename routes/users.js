const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth_middlewares');
const isAuth = authMiddleware.isAuth;

//lấy thông tin user
router.get('/profile', isAuth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;