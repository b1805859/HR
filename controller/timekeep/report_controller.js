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

            const report = await timekeepTable.aggregate([
                {
                    $match: {
                        _id: new ObjectId("63215058fb47ddb840bc7f0b")
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

            console.log("Report", JSON.stringify(report))
            const { employees } = report[0];
            console.log("employees", employees)
            const acupuncture = await timekeepAcupuncture.find({ employee_id: employees[0]._id, table_id: '63215058fb47ddb840bc7f0b' })
            console.log("acupuncture", acupuncture)

            // await EmployeeProfile
            //     .find({ status: "working" })
            //     .sort({ date: 1 })
            //     .skip((perPage * page) - perPage)
            //     .limit(perPage)
            //     .exec((err, employees) => {
            //         EmployeeProfile.countDocuments((err, count) => {
            //             if (err) return next(err);
            //             res.render('timekeep/timekeep-report', {
            //                 report: multipleToObject(employees), // sản phẩm trên một page
            //                 current: page, // page hiện tại
            //                 pages: Math.ceil(count / perPage) // tổng số các page
            //             });
            //         })
            //     })

        } catch (error) {
            console.log(error)
            return error
        }
    }
}


module.exports = new TimekeepReport()

