var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const timekeepPosition = require("../../models/timekeep/position_model")
const EmployeeProfile = require('../../models/employee_model')

class TimekeepPosition {

    //Lấy danh sách vị trí chấm công
    getPosition = async (req, res, next) => {
        const { user, account } = req
        try {
            const positions = await timekeepPosition.find();
            if (String(account.role) == 'nhan_su') {
                res.render("timekeep/timekeep-position-list", { user: sigleToObject(user), positions })
            }
            else if (String(account.role) == 'nhan_vien') {
                res.render("timekeep/timekeep-position-list", { user: sigleToObject(user), positions, layout: "user" })
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
            const store = await timekeepPosition.create(req.body);
            res.json(store)
        } catch (err) {

        }
    }


    //Lấy danh sách hồ sơ nhân viên chưa tạo bảng công có phân trang
    fetchListPage = async (req, res, next) => {
        const { user } = req
        let perPage = 8;
        let page = req.params.page || 1
        try {
            await EmployeeProfile
                .find({ status: "working" })
                .sort({ date: 1 })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec((err, employees) => {
                    EmployeeProfile.countDocuments((err, count) => {
                        if (err) return next(err);
                        res.render('timekeep/timekeep-table', {
                            user: sigleToObject(user),
                            employees: multipleToObject(employees), // sản phẩm trên một page
                            current: page, // page hiện tại
                            pages: Math.ceil(count / perPage) // tổng số các page
                        });
                    })
                })

        } catch (error) {
            console.log(error)
            return error
        }
    }
}


module.exports = new TimekeepPosition()

