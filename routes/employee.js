var express = require('express');
var router = express.Router();
const employeeController = require('../controller/profile/employee_controller');
const EmployeeProfile = require('../models/employee_model')
const { sigleToObject, multipleToObject } = require("../utils/to_Object")
const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/assets/img/avatars/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage })
//Lấy thông tin chi tiết phòng ban
router.get('/getEmployeeInformation/:id', employeeController.browse)

//Tạo phòng ban
router.post('/createEmployee', upload.single('avatar'), employeeController.createEmployee)
//render form tạo hồ sơ nhân viên
router.get('/formCreateEmployee', (req, res, next) => {
    res.render("employee/form-employee-create")
})

//Cập nhật thông tin phòng ban
router.post('/updateEmployee/:id', employeeController.updateEmployee)
//render form cập nhật thông hồ sơ nhân viên
router.get('/formUpdateEmployee/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        if (!req.params.hasOwnProperty('id')) {
            return res.status(401).send('Thiếu id hồ sơ nhân viên.');
        }

        const employee = await EmployeeProfile.findOne({ _id: id })
        if (!employee) {
            return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
        }

        res.render("employee/form-employee-update", { employee: sigleToObject(employee) })
    } catch (error) {
        console.log(error)
        return error
    }
})



//Lấy danh sách phòng ban có phân trang (trang có đối số)
router.get('/fetchEmployeeList/:page', employeeController.fetchListPage)


//Lưu trữ hồ sơ nhân viên
router.post('/storeEmployee/:id', employeeController.browse)

//search manv
router.get('/searchCode/:code', employeeController.searchCode)

//dropdown manv
router.get('/dropdown/:code', employeeController.dropdown)

module.exports = router;
