const express = require('express');
const router = express.Router();

const authController = require('../controller/auth/auth_controller');

//Đăng ký tài khoản
router.post('/register', authController.register);

//Đăng nhập tài khoản
router.post('/login', authController.login);

//Gửi refreshToken
router.post('/refresh', authController.refreshToken);


//Lấy thông tin hồ sơ nhân viên
router.get('/profile', authController.profile);


// //Đổi mật khẩu
// router.post('/password', authController.password);


// //Đăng xuất
// router.post('/logout', authController.logout);
module.exports = router;