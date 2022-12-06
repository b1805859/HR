var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const EmployeeProfile = require("../../models/employee_model")
const DepartmentDepartment = require("../../models/department_model")
const timekeepTable = require("../../models/timekeep/table_model");
const timekeepMonth = require('../../models/timekeep/month_model')
const timekeepAcupuncture = require("../../models/timekeep/acupuncture_model");
var mongoose = require('mongoose');




class TimekeepReport {

    //Lấy danh sách hồ sơ nhân viên có phân trang
    fetchReport = async (req, res, next) => {
        const { user } = req
        try {
            const departments = await DepartmentDepartment.find()
            const months = await timekeepMonth.find().sort({ datefield: -1 })
            res.render('timekeep/timekeep-report', {
                months: multipleToObject(months),
                user: sigleToObject(user),
                users: JSON.stringify(user),
            });
        } catch (error) {
            console.log(error)
            return error
        }
    }



    report = async (req, res, next) => {
        const { user } = req
        try {
        
            //Khởi tạo truy vấn
            let result = {
                month_id: mongoose.Types.ObjectId(req.body.month_id),
                year: req.body.year
            }
            const reports = await timekeepTable.aggregate([
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
            

            if(reports.length == 0)
            {   
                return res.json({
                    msgError: "Không có bảng chấm công",
                    user: sigleToObject(user),
                    })
            }
            const {month} = reports[0]
            const months = await timekeepMonth.find().sort({ datefield: -1 })
            const employeeReport = []
            for(const report of reports)
            {
                const { employee } = report
                const acupuncture = await timekeepAcupuncture.find({ table_id: ObjectId(report._id) })
                let result = {
                    acupuncture: acupuncture,
                    ...employee[0],
                }
                employeeReport.push(result)
            }
            return res.json({
                employeeReports: JSON.stringify(employeeReport),
                month: JSON.stringify(month[0]),
                months: JSON.stringify(months),
                year: JSON.stringify(req.body.year),
                user: sigleToObject(user),
            });
        } catch (error) {
            console.log(error)
            return error
        }
    }
}


module.exports = new TimekeepReport()

