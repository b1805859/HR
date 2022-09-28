const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const timekeepTable = require("../../models/timekeep/table_model")
const timekeepMonth = require("../../models/timekeep/month_model")
const EmployeeProfile = require("../../models/employee_model")
class TimekeepTable {


    renderFormCreateTable = async (req, res, next) => {
        const { user } = req
        try {

            const months = await timekeepMonth.find().sort({ datefield: -1 })
            res.render("timekeep/timekeep-table", {
                user: sigleToObject(user),
                months: multipleToObject(months)
            })
        }
        catch (err) {
        }
    }



    createTable = async (req, res, next) => {
        const { user } = req
        try {
            const { thang } = req.body
            const employeeList = await EmployeeProfile.find({ bang_cong: false })
            for (let employee of employeeList) {
                const { _id } = employee
                const checkExit = await timekeepTable.findOne({ employee_id: _id, month_id: thang })
                if (checkExit) {
                    res.json({ msg: "Bảng đã tồn tại", data: {} })
                }
                let result = {
                    employee_id: _id,
                    month_id: String(thang).trim()
                }

                const doc = new timekeepTable(result);
                await doc.save()
                await userAccount.updateOne({ _id: employee._id }, { bang_cong: true });

            }
            res.render("timekeep/timekeep-table", {
                user: sigleToObject(user),
                success: "Tạo bảng thành công"
            })
        }
        catch (err) {
        }
    }

}


module.exports = new TimekeepTable()

