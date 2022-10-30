var express = require('express');
var router = express.Router();
const departmentController = require('../controller/profile/department_controller');
const DepartmentDepartment = require('../models/department_model')
const EmployeeProfile = require('../models/employee_model')
const { sigleToObject, multipleToObject } = require("../utils/to_Object")
const Auth = require('../middlewares/auth_middlewares')



//Lấy thông tin chi tiết phòng ban
router.get('/getDepartmentInformation/:id', Auth.isAuth, Auth.checkRole, departmentController.browse)

//Tạo phòng ban
router.post('/createDepartment', Auth.isAuth, Auth.checkRole, departmentController.createDepartment)
//render form tạo hồ sơ nhân viên
router.get('/formCreateDepartment', Auth.isAuth, (req, res, next) => {
    const { user } = req
    res.render("department/form-department-create", { user: sigleToObject(user) })
})

//Cập nhật thông tin phòng ban
router.post('/updateDepartment/:id', Auth.isAuth, departmentController.updateDepartment)
// render form cập nhật thông hồ sơ nhân viên
router.get('/formUpdateDepartment/:id', Auth.isAuth, Auth.checkRole, async (req, res, next) => {
    const { id } = req.params
    const { user } = req
    try {
        if (!req.params.hasOwnProperty('id')) {
            return res.status(401).send('Thiếu id phòng ban.');
        }

        let result ={}

        const department = await DepartmentDepartment.findOne({ _id: id })
        if (!department) {
            return res.status(401).send('Không tìm thấy phòng ban.');
        }


        
        result = {...result,department}
        if(String(department.employee_code).trim())
        {
            const employee = await EmployeeProfile.findOne({code: department.employee_code})
            if(!employee)
            {
                return res.status(401).send('Nhân viên không tồn tại.');
            }
            result = {...result,name_lead: employee.name}
        }else
        {
            result = {...result,name_lead: ''}
        }

        res.render("department/form-department-update", { department: JSON.stringify(result), user: sigleToObject(user) })
    } catch (error) {
        console.log(error)
        return error
    }
})



//Lấy danh sách phòng ban có phân trang (trang có đối số)
router.get('/fetchDepartmentList/:page', Auth.isAuth, Auth.checkRole, departmentController.fetchListPage)


//Lấy danh sách phòng ban
router.get('/getListDepartment', departmentController.getListDepartment)


//Lưu trữ hồ sơ nhân viên
// router.post('/storeDepartment/:id', departmentController.browse)

// //search manv
// router.get('/searchCode/:code', departmentController.searchCode)

// //dropdown manv
// router.get('/dropdown/:code', departmentController.dropdown)

module.exports = router;
