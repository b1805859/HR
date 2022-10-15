var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const timekeepMonth = require("../../models/timekeep/month_model")


class TimekeepMonth {

    //Tạo tháng
    createMonth = async (req, res, next) => {

        try {
            const month = new timekeepMonth(req.body)
            month.save()
            res.json({ data: month })
        } catch (error) {
            console.log(error)
            return error
        }
    }


    //Lấy danh sách tháng trong năm
    getMonth = async (req, res, next) => {

        try {
            const months = await timekeepMonth.find().sort({ datefield: -1 })
            return res.json(months)
        } catch (error) {
            console.log(error)
            return error
        }
    }
}


module.exports = new TimekeepMonth()