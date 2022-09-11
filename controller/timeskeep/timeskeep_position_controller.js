var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const timekeepPosition = require("../../models/timekeep_position_model")

class TimekeepPosition {

    //Lấy danh sách vị trí chấm công
    getPosition = async (req, res, next) => {
        try {
            const positions = await timekeepPosition.find();
            res.render("timekeep/timekeep-position-list", { positions })
        } catch (err) {

        }
    }

    //Lấy danh sách vị trí chấm công
    getPositionMap = async (req, res, next) => {
        try {
            const positions = await timekeepPosition.find();
            return res.json({ data: positions })
        } catch (err) {

        }
    }


    //Lấy danh sách hồ sơ nhân viên có phân trang
    storePosition = async (req, res, next) => {
        try {
            const store = await timekeepPosition.create(req.body);

            res.json(store)
        } catch (err) {

        }
    }
}


module.exports = new TimekeepPosition()

