const userController = require('../controller/profile/user_controller')
const authController = require('../controller/auth/auth_controller')
const { ObjectId } = require('mongodb');
const EmployeeProfile = require('../models/employee_model')
const UserAccount = require('../models/users_models')

class Middlewares {


    isAuth = async (req, res, next) => {
        if (String(req.signedCookies['user_code']) != 'undefined') {
            const account = await UserAccount.findOne({ username: String(req.signedCookies['user_code']) })
            const user = await EmployeeProfile.findOne({ code: String(req.signedCookies['user_code']) })
            req.user = user
            req.account = account

            return next();
        }
        else {
            return res.redirect('/auth/login')
        }
    }


    checkRole = async (req, res, next) => {
        const { account } = req
        if (String(account.role) == 'nhan_su') {
            return next()
        }
        else {
            if (String(account.role) == 'nhan_vien') {
                res.redirect('/user/')
            } else {
                res.redirect('/auth/login')
            }
        }

        return next();
    }

}

module.exports = new Middlewares()
