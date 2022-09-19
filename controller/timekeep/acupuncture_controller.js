var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const timekeepAcupuncture = require("../../models/timekeep/acupuncture_model")
const timekeepTable = require("../../models/timekeep/table_model")

class TimekeepAcupuncture {

    //Chấm công
    acupuncture = async (req, res, next) => {
        let result = {}
        try {
            const { date, table_id, employee_id } = req.body
            const table = await timekeepTable.find({ _id: table_id })
            if (!table)
                res.json({ message: "Bảng không tồn tại" })
            const acupunctureCheck = await timekeepAcupuncture.findOne({ date })
            if (acupunctureCheck)
                res.json({ message: "Ngày chấm công đã tồn tại" })

            result = {
                date,
                employee_id,
                table_id,
            }
            let newAcupuncture = new timekeepAcupuncture(result)
            await newAcupuncture.save()
            res.json({ data: newAcupuncture })
        } catch (error) {
            console.log(error)
            return error
        }
    }
}


module.exports = new TimekeepAcupuncture()