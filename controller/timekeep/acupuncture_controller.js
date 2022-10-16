var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const EmplopyeeProfile = require("../../models/employee_model")
const timekeepAcupuncture = require("../../models/timekeep/acupuncture_model")
const timekeepTable = require("../../models/timekeep/table_model")
const timekeepMonth = require("../../models/timekeep/month_model")
var mongoose = require('mongoose');
class TimekeepAcupuncture {

    //Chấm công
    acupuncture = async (req, res, next) => {
        let result = {}
        const { table_id, user_id } = req.body
        try {
            const table = await timekeepTable.find({ _id: table_id })
            if (!table)
                res.json({ message: "Bảng không tồn tại" })

            if(table[0].open == false)
            {
                res.json({ message: "Bảng công không mở" })
            }

            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();

            //Kiểm tra đã chấm công hay chưa
            const acupunctureCheck = await timekeepAcupuncture.findOne({ date: 31 })
            if (acupunctureCheck)
                return res.json({ message: "Đã chấm công cho hôm nay" })



            //Kiểm tra cuối tháng
            const monthTable = await timekeepMonth.findOne({ _id: table[0].month_id })
            if(31 == monthTable.total)
            {
                await timekeepTable.updateOne({ _id: table_id },{open: false})
                await EmplopyeeProfile.updateOne({ _id: user_id },{bang_cong: false})
            }




                result = {
                    date: 31,
                    employee_id: user_id,
                    table_id,
                }
                let newAcupuncture = new timekeepAcupuncture(result)
                await newAcupuncture.save()

            return res.json({ data: newAcupuncture })
        } catch (error) {
            console.log(error)
            return error
        }
    }



    getDateTime = () => {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if (month.toString().length == 1) {
            month = '0' + month;
        }
        if (day.toString().length == 1) {
            day = '0' + day;
        }
        if (hour.toString().length == 1) {
            hour = '0' + hour;
        }
        if (minute.toString().length == 1) {
            minute = '0' + minute;
        }
        if (second.toString().length == 1) {
            second = '0' + second;
        }
        var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
        return dateTime;
    }
}


module.exports = new TimekeepAcupuncture()