const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const timekeepTable = require("../../models/timekeep/table_model")
const timekeepMonth = require("../../models/timekeep/month_model")
const EmployeeProfile = require("../../models/employee_model")
var mongoose = require('mongoose');
class TimekeepTable {


    renderFormCreateTable = async (req, res, next) => {
        const { user } = req
        try {
            const months = await timekeepMonth.find().sort({ datefield: -1 })
            return res.render("timekeep/timekeep-table", {
                months: multipleToObject(months),
                user: sigleToObject(user),
            })
        }
        catch (err) {
        }
    }



    createTable = async (req, res, next) => {
        const { user } = req
        const {month, year} = req.body
        const result = {
            month_id: mongoose.Types.ObjectId(month),
            year: year
        }
        try {
           
            //Lấy danh sách tháng để hiển thị
            const months = await timekeepMonth.find().sort({ datefield: -1 })


            //Kiểm tra đã tồn tại
            const checkExit = await timekeepTable.findOne(result)
            if(checkExit)
            {
                return res.render("timekeep/timekeep-table", {
                    user: sigleToObject(user),
                    months: multipleToObject(months),
                    error: "Bảng chấm công đã tồn tại"
                })
            }
            console.log("2")
            //Lấy danh sách toàn bộ nhân viên đang làm việc trong công ty để tạo bảng chấm công
            const employeeList = await EmployeeProfile.find({status:'working'})
            for(const employee of employeeList)
            {
                let employeeTable = {
                    ...result,
                    employee_id: employee._id
                }
                let table = new timekeepTable(employeeTable)
                await table.save()
            }

            

            return res.render("timekeep/timekeep-table", {
                user: sigleToObject(user),
                months: multipleToObject(months),
                success: "Tạo bảng thành công"
            })
        }
        catch (err) {
        }
    }

}


module.exports = new TimekeepTable()

