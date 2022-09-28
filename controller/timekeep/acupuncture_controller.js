var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const timekeepAcupuncture = require("../../models/timekeep/acupuncture_model")
const timekeepTable = require("../../models/timekeep/table_model")

class TimekeepAcupuncture {

    //Chấm công
    acupuncture = async (req, res, next) => {
        let result = {}
        const { user } = req
        const { table_id } = req.params
        try {
            const table = await timekeepTable.find({ _id: table_id })

            if (!table)
                res.json({ message: "Bảng không tồn tại" })

            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();

            const acupunctureCheck = await timekeepAcupuncture.findOne({ date: day })
            if (acupunctureCheck)
                res.json({ message: "Đã chấm công" })

            result = {
                date: day,
                employee_id: user._id,
                table_id,
            }
            console.log("result", result)
            let newAcupuncture = new timekeepAcupuncture(result)
            await newAcupuncture.save()
            res.json({ data: newAcupuncture })
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