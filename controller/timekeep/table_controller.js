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
            const years =["2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030",]
            var tables = []

            for(const year of years)
            {
                for(const month of months)
                {
                    let table = await timekeepTable.findOne({month_id:mongoose.Types.ObjectId(month._id), year: String(year).trim()})
                    if(table)
                    {
                        let element = {table: table, monthName: String(month.name).trim()}
                        tables.push(element)
                    }
                }
            }

            return res.render("timekeep/timekeep-table", {
                months: multipleToObject(months),
                tables: JSON.stringify(tables),
                user: sigleToObject(user),
            })
        }
        catch (err) {
        }
    }



    createTable = async (req, res, next) => {
        const {month_id, year} = req.body
        try {

            const result = {
                month_id: mongoose.Types.ObjectId(month_id),
                year: String(year).trim()
            }

            console.log("1")
           
            //Kiểm tra đã tồn tại
            const checkExit = await timekeepTable.findOne(result)
            if(checkExit)
            {
                return res.json({
                    user: sigleToObject(user),
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

            const months = await timekeepMonth.find().sort({ datefield: -1 })
            const years =["2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030",]
            var tables = []

            for(const year of years)
            {
                for(const month of months)
                {
                    let table = await timekeepTable.findOne({month_id:mongoose.Types.ObjectId(month._id), year: String(year).trim()})
                    if(table)
                    {
                        let element = {table: table, monthName: String(month.name).trim()}
                        tables.push(element)
                    }
                }
            }

            
            return res.json( {
                months: multipleToObject(months),
                tables: JSON.stringify(tables),
                success: "Tạo bảng thành công"
            })
        }
        catch (err) {
        }
    }

}


module.exports = new TimekeepTable()

