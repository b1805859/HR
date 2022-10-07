const express = require('express');
const router = express.Router();

const timekeepTable = require('../models/timekeep/table_model')
const timekeepPosition = require('../models/timekeep/position_model')
const timekeepAcupuncture = require('../models/timekeep/acupuncture_model')
const { ObjectId } = require('mongoose')
const EmployeeProfile = require('../models/employee_model')
const Auth = require('../middlewares/auth_middlewares')
const { sigleToObject, multipleToObject } = require('../utils/to_Object')



router.get('/', Auth.isAuth, (req, res, next) => {
    const { user } = req
    res.render('user/timekeep-position-list', { user: sigleToObject(user), layout: 'user' })
})


//lấy thông tin user
router.get('/profile', Auth.isAuth, async (req, res) => {
    //Lấy thông tin chi tiết hồ sơ bản thân
    const { user, account } = req
    try {

        const employee = await EmployeeProfile.findOne({ _id: user._id })
        if (!employee) {
            return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
        }
        if (String(account.role) == "nhan_su") {
            res.render("user/admin-information", { user: sigleToObject(user), employee: sigleToObject(employee) })
        }
        else {
            res.render("user/user-information", { user: sigleToObject(user), employee: sigleToObject(employee), layout: 'user' })
        }

    } catch (error) {
        console.log(error)
        return error
    }
});


//Xem báo cáo chấm công
router.get('/report', Auth.isAuth, async (req, res) => {
    const { user } = req
    try {

        const report = await timekeepTable.aggregate([
            {
                $match: {
                    open: true,
                    employee_id: user._id
                }
            },
            {
                $lookup: {
                    from: "employeeprofiles", // collection to join
                    localField: "employee_id",//field from the input documents
                    foreignField: "_id",//field from the documents of the "from" collection
                    as: "employee"// output array field
                }
            },
            {
                $lookup: {
                    from: "timekeepmonths", // collection to join
                    localField: "month_id",//field from the input documents
                    foreignField: "_id",//field from the documents of the "from" collection
                    as: "month"// output array field
                }
            },
            {
                $lookup: {
                    from: "timekeeptables", // collection to join
                    localField: "employee_id",//field from the input documents
                    foreignField: "employee_id",//field from the documents of the "from" collection
                    as: "table"// output array field
                }
            },
        ], function (error, data) {

        });

        // console.log("report", JSON.stringify(report));
        const { employee, month, table } = report[0]
        const acupunctures = await timekeepAcupuncture.find({ employee_id: employee[0]._id, table_id: table[0]._id })
        res.render('user/user-report', {
            table_id: table[0]._id,
            employee: employee[0],
            month: JSON.stringify(month[0]),
            acupunctures: JSON.stringify(acupunctures),
            user: sigleToObject(user),
            layout: 'user'
        });
    } catch (error) {
        console.log(error)
        return error
    }
});



//lấy danh sách phiên chấm công
router.get('/acupuncture', Auth.isAuth, async (req, res, next) => {
    const { user } = req
    try {

        const report = await timekeepTable.aggregate([
            {
                $match: {
                    open: true,
                    employee_id: user._id
                }
            },
            {
                $lookup: {
                    from: "employeeprofiles", // collection to join
                    localField: "employee_id",//field from the input documents
                    foreignField: "_id",//field from the documents of the "from" collection
                    as: "employee"// output array field
                }
            },
            {
                $lookup: {
                    from: "timekeepmonths", // collection to join
                    localField: "month_id",//field from the input documents
                    foreignField: "_id",//field from the documents of the "from" collection
                    as: "month"// output array field
                }
            },
            {
                $lookup: {
                    from: "timekeeptables", // collection to join
                    localField: "employee_id",//field from the input documents
                    foreignField: "employee_id",//field from the documents of the "from" collection
                    as: "table"// output array field
                }
            },
        ], function (error, data) {

        });

        // console.log("report", JSON.stringify(report));
        const { employee, month, table } = report[0]
        const acupunctures = await timekeepAcupuncture.find({ employee_id: employee[0]._id, table_id: table[0]._id })
        res.render('user/user-acupuncture', {
            table_id: table[0]._id,
            employee: employee[0],
            month: JSON.stringify(month[0]),
            acupunctures: JSON.stringify(acupunctures),
            user: sigleToObject(user),
            layout: 'user'
        });
    } catch (error) {
        console.log(error)
        return error
    }
});




//Vị trí chấm công
router.get('/position', Auth.isAuth, async (req, res, next) => {
    const { user } = req
    try {
        const positions = await timekeepPosition.find();
        res.render('user/timekeep-position-list', { layout: 'user', positions, user: sigleToObject(user) })
    } catch (err) {

    }
})

module.exports = router;