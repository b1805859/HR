const express = require('express');
const router = express.Router();
const DepartmentDepartment = require('../models/department_model.js')
const timekeepTable = require('../models/timekeep/table_model')
const timekeepPosition = require('../models/timekeep/position_model')
const timekeepAcupuncture = require('../models/timekeep/acupuncture_model')
var ObjectId = require('mongodb').ObjectId; 
const EmployeeProfile = require('../models/employee_model')
const Auth = require('../middlewares/auth_middlewares')
var mongoose = require('mongoose');
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

        const department = await DepartmentDepartment.findOne({ _id: employee.department_id })
            if (!department) {
                return res.status(401).send('Không tìm thấy phòng ban.');
            }

        if (String(account.role) == "nhan_su") {
            res.render("user/admin-information", { user: sigleToObject(user), employee: sigleToObject(employee) ,department: sigleToObject(department)})
        }
        else {
            res.render("user/user-information", { user: sigleToObject(user), employee: sigleToObject(employee),department: sigleToObject(department), layout: 'user' })
        }

    } catch (error) {
        console.log(error)
        return error
    }
});


//Xem báo cáo chấm công
router.get('/report', Auth.isAuth, async (req, res) => {
    const { user } = req
        return res.render("misc/pages-misc-under-maintenance",
        {
            layout: 'user',
            user: sigleToObject(user),
        })
    // try {

    //     const report = await timekeepTable.aggregate([
    //         {
    //             $match: {
    //                 open: true,
    //                 employee_id: ObjectId(user._id)
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "employeeprofiles", // collection to join
    //                 localField: "employee_id",//field from the input documents
    //                 foreignField: "_id",//field from the documents of the "from" collection
    //                 as: "employee"// output array field
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "timekeepmonths", // collection to join
    //                 localField: "month_id",//field from the input documents
    //                 foreignField: "_id",//field from the documents of the "from" collection
    //                 as: "month"// output array field
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "timekeeptables", // collection to join
    //                 localField: "employee_id",//field from the input documents
    //                 foreignField: "employee_id",//field from the documents of the "from" collection
    //                 as: "table"// output array field
    //             }
    //         },
    //     ], function (error, data) {

    //     });

    //     // console.log("report", JSON.stringify(report));
    //     const { employee, month, table } = report[0]
    //     const acupunctures = await timekeepAcupuncture.find({ employee_id: employee[0]._id, table_id: table[0]._id })
    //     res.render('user/user-report', {
    //         table_id: table[0]._id,
    //         employee: employee[0],
    //         month:  sigleToObject(month[0]),
    //         acupunctures: JSON.stringify(acupunctures),
    //         user: sigleToObject(user),
    //         layout: 'user'
    //     });
    // } catch (error) {
    //     console.log(error)
    //     return error
    // }
});



//lấy danh sách phiên chấm công
router.get('/acupuncture', Auth.isAuth, async (req, res, next) => {
    const { user } = req
    try {
        const report = await timekeepTable.aggregate([
            {
                $match: {
                    open: true,
                    employee_id: mongoose.Types.ObjectId(user._id)
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



//lấy dữ liệu chấm công của một nhân viên
router.post('/acupunctureData', async (req, res, next) => {
    const { table_id, user_id } = req.body
    try {

        const report = await timekeepTable.aggregate([
            {
                $match: {
                    open: true,
                    employee_id: ObjectId(user_id)
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
        const { employee, month, table } = report[0]
        const acupunctures = await timekeepAcupuncture.find({ employee_id: employee[0]._id, table_id: table[0]._id })
        return res.json( {
            table_id: table[0]._id,
            employee: employee[0],
            month: JSON.stringify(month[0]),
            acupunctures: JSON.stringify(acupunctures),
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