var express = require('express');
var router = express.Router();
const employeeController = require('../controller/profile/employee_controller');
const EmployeeProfile = require('../models/employee_model')
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
const Auth = require('../middlewares/auth_middlewares')



//Lấy thông tin chi tiết phòng ban
router.get('/getEmployeeInformation/:id', Auth.isAuth, employeeController.browse)

//Thêm hồ sơ nhân viên
router.post('/createEmployee', upload.single('avatar'), Auth.isAuth, employeeController.createEmployee)
//render form tạo hồ sơ nhân viên
router.get('/formCreateEmployee', Auth.isAuth, async (req, res, next) => {
    const { user } = req
    const list =  await DepartmentDepartment.find()
    res.render("employee/form-employee-create", 
    { 
        user: sigleToObject(user) ,
        departmentList: multipleToObject(list)
    })
})

//Cập nhật thông tin phòng ban
router.post('/updateEmployee/:id', upload.single('avatar'), Auth.isAuth, employeeController.updateEmployee)
//render form cập nhật thông hồ sơ nhân viên
router.get('/formUpdateEmployee/:id', Auth.isAuth, Auth.checkRole, async (req, res, next) => {
    const { id } = req.params
    const { user } = req
    try {
        if (!req.params.hasOwnProperty('id')) {
            return res.status(401).send('Thiếu id hồ sơ nhân viên.');
        }

        const employee = await EmployeeProfile.findOne({ _id: id })
        if (!employee) {
            return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
        }

        const list =  await DepartmentDepartment.find()
            if (!list) {
                return res.status(401).send('Không tìm thấy phòng ban.');
            }

        res.render("employee/form-employee-update", { 
            employee: sigleToObject(employee),
            user: sigleToObject(user),
            departmentList: multipleToObject(list) })
    } catch (error) {
        console.log(error)
        return error
    }
})



//Lấy danh sách phòng ban có phân trang (trang có đối số)
router.get('/fetchEmployeeList/:page', Auth.isAuth, Auth.checkRole, employeeController.fetchListPage)




//dropdown manv
router.post('/filter', employeeController.filter)


//search code manager
router.post('/manager', employeeController.searchCode)



module.exports = router;
