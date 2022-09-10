var express = require('express');
var router = express.Router();
const departmentController = require('../controller/profile/department_controller');

//Lấy thông tin chi tiết phòng ban
router.post('/getDepartmentInformation/:id', departmentController.browse)

//Tạo phòng ban
router.post('/createDepartment', departmentController.createDepartment)

//Cập nhật thông tin phòng ban
router.post('/updateDepartment/:id', departmentController.updateDepartment)

//Lấy danh sách phòng ban có phân trang
router.post('/fetchDepartmentList/:page', departmentController.fetchList)


module.exports = router;
