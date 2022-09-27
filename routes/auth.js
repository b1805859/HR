const express = require('express');
const router = express.Router();

const authController = require('../controller/auth/auth_controller');
const Auth = require('../middlewares/auth_middlewares')

//Đăng ký tài khoản
router.post('/register', authController.register);
//Render form register
router.get('/register', authController.formRegister);

//Đăng nhập tài khoản
router.post('/login', authController.login);
//Render form login
router.get('/login', authController.formLogin);

// //Đổi mật khẩu
// router.post('/password', authController.password);


//Đăng xuất
router.get('/logout', authController.logout);


//Đổi mật khẩu
//Render form register
router.get('/setpassword', Auth.isAuth, authController.formSetPassword);
router.post('/setpassword', Auth.isAuth, authController.setPassword);

module.exports = router;