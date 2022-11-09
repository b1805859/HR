const express = require('express');
const router = express.Router();
const DepartmentDepartment = require('../models/department_model.js')
const timekeepTable = require('../models/timekeep/table_model')
const timekeepMonth = require('../models/timekeep/month_model')
const timekeepPosition = require('../models/timekeep/position_model')
const userAccount = require('../models/users_models')
const timekeepAcupuncture = require('../models/timekeep/acupuncture_model')
var ObjectId = require('mongodb').ObjectId; 
const EmployeeProfile = require('../models/employee_model')
const Auth = require('../middlewares/auth_middlewares')
var mongoose = require('mongoose');
const { sigleToObject, multipleToObject } = require('../utils/to_Object');
const { findOne } = require('../models/employee_model');
const { default: axios } = require('axios');



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


//Xem báo cáo chấm công qua các tháng
router.get('/report', Auth.isAuth, async (req, res) => {
    const { user } = req
    try {
        const months = await timekeepMonth.find().sort({ datefield: -1 })
        res.render('user/user-report', {
            months: multipleToObject(months),
            user: sigleToObject(user),
            users: JSON.stringify(user),
            layout: 'user'
        });
    } catch (error) {
        console.log(error)
        return error
    }
});


//Xem báo cáo chấm công qua các tháng
router.post('/report', async (req, res) => {
    const { user } = req.body
        try {
        
            //Khởi tạo truy vấn
            let result = {
                employee_id:mongoose.Types.ObjectId(user._id),
                month_id: mongoose.Types.ObjectId(req.body.month_id),
                year: String(req.body.year).trim()
            }
            const report = await timekeepTable.aggregate([
                {
                    $match: {
                        ...result
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

            if(report.length == 0)
            {   
                return res.json({
                    msgError: "Không có bảng chấm công",
                    })
            }
            const {month} = report[0]
            const months = await timekeepMonth.find().sort({ datefield: -1 })
            const employeeReport =[]
                const { employee, table } = report[0]
                const acupuncture = await timekeepAcupuncture.find({ table_id: mongoose.Types.ObjectId(table[0]._id) })
                let data = {
                    acupuncture: acupuncture,
                    ...employee[0],
                }
                employeeReport.push(data)
            return res.json({
                employeeReports: JSON.stringify(employeeReport),
                month: JSON.stringify(month[0]),
                months: JSON.stringify(months),
                year: JSON.stringify(req.body.year),
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


            //Lấy đối tượng là tháng hiện tại
            var now = new Date();
            var year = now.getFullYear();
            var mon = now.getMonth() + 1;
            var day = now.getDate();
            // var hour = now.getHours();
            // var minute = now.getMinutes();
            // var second = now.getSeconds();

            //Tìm tháng
            const monthObj = await timekeepMonth.findOne({name: mon})

            //Khởi tạo truy vấn
            let result = {
                employee_id:mongoose.Types.ObjectId(user._id),
                month_id: mongoose.Types.ObjectId(monthObj._id),
                year: String(year).trim()
            }
            const report = await timekeepTable.aggregate([
                {
                    $match: {
                        ...result
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


            if(report.length == 0)
            {   
                return res.render("user/user-acupuncture",{
                    msgError: "Không có bảng chấm công",
                    user: sigleToObject(user),
                    layout: 'user'
                    })
            }
            const { employee, month, table} = report[0]
            const employeeReport =[]
                const acupuncture = await timekeepAcupuncture.find({ table_id: mongoose.Types.ObjectId(table[0]._id) })
                let data = {
                    acupuncture: acupuncture,
                    ...employee[0],
                }
                employeeReport.push(data)


            //Lấy thông tin account
            const account = await userAccount.findOne({username: String(user.code)})
                console.log("userAccount", account)
            if(String(account.role)=='nhan_su')
            {
                return res.render("user/user-acupuncture",{
                    table_id:JSON.stringify(table[0]._id),
                    employeeReports: JSON.stringify(employeeReport),
                    month: JSON.stringify(month[0]),
                    year: JSON.stringify(year),
                    user: sigleToObject(user),
                });
            }
            else
            {
                return res.render("user/user-acupuncture",{
                    table_id:JSON.stringify(table[0]._id),
                    employeeReports: JSON.stringify(employeeReport),
                    month: JSON.stringify(month[0]),
                    year: JSON.stringify(year),
                    user: sigleToObject(user),
                    layout: 'user'
                });
            }
        } catch (error) {
            console.log(error)
            return error
        }
});



//lấy dữ liệu chấm công của một nhân viên
router.post('/acupunctureData', async (req, res, next) => {
    const { table_id, user_id } = req.body
    try {


            var now = new Date();
            var year = now.getFullYear();

            //Khởi tạo truy vấn
            let result = {
                _id:mongoose.Types.ObjectId(table_id),
                employee_id:mongoose.Types.ObjectId(user_id),
            }
            const report = await timekeepTable.aggregate([
                {
                    $match: {
                        ...result
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


            if(report.length == 0)
            {   
                return res.json({msgError: "Không có bảng chấm công"})
            }
            const { employee, month, table} = report[0]
            const employeeReport =[]
                const acupuncture = await timekeepAcupuncture.find({ table_id: mongoose.Types.ObjectId(table[0]._id) })
                let data = {
                    acupuncture: acupuncture,
                    ...employee[0],
                }
                employeeReport.push(data)

            return res.json({
                table_id: table[0]._id,
                employeeReports: JSON.stringify(employeeReport),
                month: JSON.stringify(month[0]),
                year: JSON.stringify(year),
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



//Phòng ban của tôi
router.get('/department', Auth.isAuth, async (req, res, next) => {
    const { user } = req
    try {
        console.log("user", user)
        const employees = await EmployeeProfile.find({department_id: mongoose.Types.ObjectId(user.department_id)})
        console.log(employees)
        res.render('user/user-department', { 
            layout: 'user',
            user: sigleToObject(user),
            employees: multipleToObject(employees)
        })
    } catch (err) {

    }
})



module.exports = router;