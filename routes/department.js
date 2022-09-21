var express = require('express');
var router = express.Router();
const departmentController = require('../controller/profile/department_controller');
const DepartmentDepartment = require('../models/department_model')
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



// //Lấy thông tin chi tiết phòng ban
// router.get('/getDepartmentInformation/:id', departmentController.browse)

//Tạo phòng ban
router.post('/createDepartment', upload.single('avatar'), departmentController.createDepartment)
//render form tạo hồ sơ nhân viên
router.get('/formCreateDepartment', (req, res, next) => {
    res.render("department/form-department-create")
})

// //Cập nhật thông tin phòng ban
// router.post('/updateDepartment/:id', departmentController.updateDepartment)
// //render form cập nhật thông hồ sơ nhân viên
// router.get('/formUpdateDepartment/:id', async (req, res, next) => {
//     const { id } = req.params
//     try {
//         if (!req.params.hasOwnProperty('id')) {
//             return res.status(401).send('Thiếu id hồ sơ nhân viên.');
//         }

//         const employee = await DepartmentDepartment.findOne({ _id: id })
//         if (!employee) {
//             return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
//         }

//         res.render("employee/form-employee-update", { employee: sigleToObject(employee) })
//     } catch (error) {
//         console.log(error)
//         return error
//     }
// })



//Lấy danh sách phòng ban có phân trang (trang có đối số)
router.get('/fetchDepartmentList/:page', departmentController.fetchListPage)


//Lưu trữ hồ sơ nhân viên
// router.post('/storeDepartment/:id', departmentController.browse)

// //search manv
// router.get('/searchCode/:code', departmentController.searchCode)

// //dropdown manv
// router.get('/dropdown/:code', departmentController.dropdown)

module.exports = router;
