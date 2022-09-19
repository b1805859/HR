var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const timekeepMonth = require("../../models/timekeep/month_model")


class TimekeepMonth {

    //Lấy danh sách hồ sơ nhân viên có phân trang
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
}


module.exports = new TimekeepMonth()