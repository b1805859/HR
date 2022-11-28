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
            const table = await timekeepTable.find({ _id: mongoose.Types.ObjectId(table_id) })
            if (!table)
                return res.json({ msgError: "Bảng không tồn tại" })

            
            var now = new Date();
            var year = now.getFullYear();
            var mon = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();

            console.log("minute",minute)
            console.log("hour",hour)

            const monthObj = await timekeepMonth.findOne({name: mon})

            //Kiểm tra đã chấm công hay chưa
            const acupunctureCheck = await timekeepAcupuncture.findOne({employee_id:mongoose.Types.ObjectId(user_id) ,date: day, month_id: mongoose.Types.ObjectId(monthObj._id), year: year})
            if (acupunctureCheck)
            {
                return res.json({ msgError: "Đã chấm công cho hôm nay", acupuncture: acupunctureCheck })
            }

            if(Number(hour) >= 8 && Number(minute) >= 1)
            {
                result = {...result, late_check: true}
            }
            result = {
                ...result,
                date: day,
                employee_id: user_id,
                month_id:mongoose.Types.ObjectId(monthObj._id),
                year: year,
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