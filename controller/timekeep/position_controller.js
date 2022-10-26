const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const timekeepPosition = require("../../models/timekeep/position_model")
const EmployeeProfile = require('../../models/employee_model')
var mongoose = require('mongoose');
class TimekeepPosition {

    //Lấy danh sách vị trí chấm công
    getPosition = async (req, res, next) => {
        const { user, account } = req
        try {
            const positions = await timekeepPosition.find();
            if (String(account.role) == 'nhan_su') {
                res.render("timekeep/timekeep-position-list", { user: sigleToObject(user), positions:JSON.stringify(positions) })
            }
            else if (String(account.role) == 'nhan_vien') {
                res.render("timekeep/timekeep-position-list", { user: sigleToObject(user), positions:JSON.stringify(positions), layout: "user" })
            }
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
            const { name, longitude, latitude } = req.body
            let result = {
                name,
                longitude,
                latitude
            }
            await timekeepPosition.create(result);
            return res.redirect("/api/timekeep/position")
        } catch (err) {
            console.error(err);
            if (err.code === 11000) {
                return res.status(400).json({ error: 'This store already exists' });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }



    findPosition = async (req, res, next) => {
        const { latitude, longitude } = req.body
        const { user } = req
        try {
            const position_data = await timekeepPosition.aggregate([{
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [
                            Number(longitude), Number(latitude)
                        ]
                    },
                    distanceField: "dist.calculated",
                    maxDistance: 800,
                    spherical: true
                }
            }
            ]);
            return res.json({ position: position_data, user: sigleToObject(user) });
        } catch (err) {
            res.status(400).send({ success: false, msg: err.message });
        }
    }




    //Lấy danh sách hồ sơ nhân viên có phân trang
    deletePosition = async (req, res, next) => {
        const {id} = req.params
        try {
            const resultDelete = await timekeepPosition.deleteOne({_id: mongoose.Types.ObjectId(id)})
            if(!resultDelete)
            {
                return res.json({msgError: "Có lỗi xảy ra"})
            }
            return res.redirect("/api/timekeep/position")
        } catch (err) {
            console.error(err);
            if (err.code === 11000) {
                return res.status(400).json({ error: 'This store already exists' });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }
}


module.exports = new TimekeepPosition()

