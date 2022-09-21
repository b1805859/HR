var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const EmployeeProfile = require("../../models/employee_model")
const timekeepTable = require("../../models/timekeep/table_model");
const timekeepAcupuncture = require("../../models/timekeep/acupuncture_model");





class TimekeepReport {

    //Lấy danh sách hồ sơ nhân viên có phân trang
    fetchReport = async (req, res, next) => {
        let perPage = 8;
        let page = req.params.page || 1
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
    }
}


module.exports = new TimekeepReport()

