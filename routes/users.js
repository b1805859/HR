const express = require('express');
const router = express.Router();

const timekeepTable = require('../models/timekeep/table_model')
const timekeepPosition = require('../models/timekeep/position_model')
const timekeepAcupuncture = require('../models/timekeep/acupuncture_model')
const { ObjectId } = require('mongoose')
const EmployeeProfile = require('../models/employee_model')
const Auth = require('../middlewares/auth_middlewares')
const { sigleToObject } = require('../utils/to_Object')



router.get('/', Auth.isAuth, (req, res, next) => {
    res.render('timekeep/timekeep-position-list', { layout: 'user' })
})


//lấy thông tin user
router.get('/profile', Auth.isAuth, async (req, res) => {
    //Lấy thông tin chi tiết hồ sơ bản thân
    const { user } = req
    try {

        const employee = await EmployeeProfile.findOne({ _id: user._id })
        if (!employee) {
            return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
        }

        res.render("user/user-information", { employee: sigleToObject(employee), layout: 'user' })
    } catch (error) {
        console.log(error)
        return error
    }
});


//Xem báo cáo chấm công
router.get('/report', Auth.isAuth, async (req, res) => {
    try {

        const reports = await timekeepTable.aggregate([
            {
                $match: {
                    month_id: new ObjectId("63208b9f9eb7c641a238cee4")
                }
            },
            {
                $lookup: {
                    from: "employeeprofiles", // collection to join
                    localField: "employee_id",//field from the input documents
                    foreignField: "_id",//field from the documents of the "from" collection
                    as: "employees"// output array field
                }
            },
            {
                $lookup: {
                    from: "timekeepmonths", // collection to join
                    localField: "month_id",//field from the input documents
                    foreignField: "_id",//field from the documents of the "from" collection
                    as: "months"// output array field
                }
            },
        ], function (error, data) {
            // return res.json(data);
            //handle error case also
        });


        const employeeReport = []
        for (const report of reports) {
            const { employees, months } = report
            const acupuncture = await timekeepAcupuncture.find({ table_id: ObjectId(report._id) })

            let result = {
                acupuncture: acupuncture,
                ...employees[0],
            }
            employeeReport.push(result)
        }

        //console.log("employeeArray", employeeArray)
        // console.log("monthArray", monthArray)
        console.log("employeeReport", JSON.stringify(employeeReport))
        res.render('timekeep/timekeep-report', {
            employeeReports: employeeReport
        });
    } catch (error) {
        console.log(error)
        return error
    }
});



//Chấm công
router.get('/acupuncture', Auth.isAuth, async (req, res, next) => {
    const { user } = req
    try {

        const reports = await timekeepTable.aggregate([
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
                    as: "employees"// output array field
                }
            },
            {
                $lookup: {
                    from: "timekeepmonths", // collection to join
                    localField: "month_id",//field from the input documents
                    foreignField: "_id",//field from the documents of the "from" collection
                    as: "months"// output array field
                }
            },
        ], function (error, data) {
            // return res.json(data);
            //handle error case also
        });

        console.log("1")
        const employeeReport = []
        for (const report of reports) {
            const { employees, months } = report
            const acupuncture = await timekeepAcupuncture.find({ table_id: report._id })

            let result = {
                acupuncture: acupuncture,
                ...employees[0],
            }
            employeeReport.push(result)
        }
        res.render('user/user-report', {
            employeeReports: employeeReport,
            layout: 'user'
        });
    } catch (error) {
        console.log(error)
        return error
    }
});




//Vị trí chấm công
router.get('/position', Auth.isAuth, async (req, res, next) => {
    try {
        const positions = await timekeepPosition.find();
        res.render('timekeep/timekeep-position-list', { layout: 'user', positions })
    } catch (err) {

    }
})

module.exports = router;