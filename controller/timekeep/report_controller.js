var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const EmployeeProfile = require("../../models/employee_model")
const timekeepTable = require("../../models/timekeep/table_model");
const timekeepAcupuncture = require("../../models/timekeep/acupuncture_model");





class TimekeepReport {

    //Lấy danh sách hồ sơ nhân viên có phân trang
    fetchReport = async (req, res, next) => {
        const { user } = req

        let perPage = 8;
        let page = req.params.page || 1
        try {
            const reports = await timekeepTable.aggregate([
                {
                    $match: {
                        open: true       
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

            const count = reports.length;
            const employeeReport = []
            const { months } = reports[0]
            for (const report of reports) {
                const { employees,} = report
                const acupuncture = await timekeepAcupuncture.find({ table_id: ObjectId(report._id) })

                let result = {
                    acupuncture: acupuncture,
                    ...employees[0],
                }
                employeeReport.push(result)
            }

            res.render('timekeep/timekeep-report', {
                user: sigleToObject(user),
                employeeReports: JSON.stringify(employeeReport),
                month: JSON.stringify(months[0]),
                current: page, // page hiện tại
                pages: Math.ceil(count / perPage) // tổng số các page
            });
        } catch (error) {
            console.log(error)
            return error
        }
    }
}


module.exports = new TimekeepReport()

