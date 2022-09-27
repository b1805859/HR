const bcrypt = require('bcrypt');
const saltRounds = 10;
const userController = require('../profile/user_controller')
const userAccount = require('../../models/users_models')
const jwt = require('jsonwebtoken');
var randToken = require('rand-token');
const { ifError } = require('assert');
const promisify = require('util').promisify;
const verify = promisify(jwt.verify).bind(jwt);
class Auth {

    //Đăng ký
    async register(req, res, next) {
        const username = req.body.username;
        const user = await userController.getUser(username);
        if (user) res.status(409).send('Tên tài khoản đã tồn tại.');
        else {
            const hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
            const newUser = {
                username: username,
                password: hashPassword
            };
            const createUser = userController.createUser(newUser);
            if (!createUser) {
                return res
                    .status(400)
                    .send('Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.');
            }
            res.render('auth/login')
        }
    }



    //Đăng nhập
    login = async (req, res, next) => {
        const username = req.body.username
        const password = req.body.password
        const user = await userController.getUser(username)
        if (!user) res.status(401).send('Tên đăng nhập không tồn tại.');

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid)
            return res.status(401).send('Mật khẩu không chính xác.');


        // Set cookie
        await res.cookie('user_code', String(user.username), { signed: true, maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
        if (String(user.role) == 'nhan_su') {

            res.redirect('/')
        } else if (String(user.role) == 'nhan_vien') {

            res.redirect('/user/')
        }
    }






    formLogin = (req, res, next) => {
        res.render("auth/login", { layout: false })
    };



    formRegister = (req, res, next) => {
        res.render("auth/register", { layout: false })
    };


    logout = (req, res, next) => {
        res.clearCookie("user_code");
        res.redirect('/auth/login')
    };



    formSetPassword = (req, res, next) => {
        res.render("auth/set-password", { layout: false })
    };


    //Đổi mật khẩu
    setPassword = async (req, res, next) => {
        const { account } = req
        console.log("account", account)
        const passwordold = req.body.passwordold
        const passwordnew = req.body.passwordnew
        const isPasswordValid = bcrypt.compareSync(passwordold, account.password);
        if (!isPasswordValid)
            return res.status(401).send('Mật khẩu không chính xác.');


        const hashPassword = bcrypt.hashSync(passwordnew, saltRounds);

        await userAccount.updateOne({ _id: account._id }, { password: hashPassword });
        if (String(account.role) == 'nhan_su') {
            return res.redirect('/')
        }
        else {
            return res.redirect('/user/')
        }

    }

}
module.exports = new Auth()

