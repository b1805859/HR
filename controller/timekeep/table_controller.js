const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const timekeepTable = require("../../models/timekeep/table_model")
const timekeepMonth = require("../../models/timekeep/month_model")
const EmployeeProfile = require("../../models/employee_model")
class TimekeepTable {


    renderFormCreateTable = async (req, res, next) => {
        const { user } = req
        try {

            return res.render("timekeep/timekeep-table", {
                user: sigleToObject(user),
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
            console
            for (let employee of employeeList) {
                const { _id } = employee
                const checkExit = await timekeepTable.findOne({ employee_id: _id, month_id: thang })
                if (checkExit) {
                    return res.render("timekeep/timekeep-table", {error:'Bảng đã tồn tại' });
                }
                let result = {
                    employee_id: _id,
                    month_id: String(thang).trim()
                }
                const doc = new timekeepTable(result);
                if(!doc)
                {
                    return res.render("timekeep/timekeep-table", {error:'Có lỗi xảy ra khi lưu dữ liệu' });
                }
                await doc.save()
                await EmployeeProfile.updateOne({ _id }, { bang_cong: true });

            }
            return res.render("timekeep/timekeep-table", {
                user: sigleToObject(user),
                success: "Tạo bảng thành công"
            })
        }
        catch (err) {
        }
    }

}


module.exports = new TimekeepTable()

