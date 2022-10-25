var express = require('express');
var router = express.Router();
const EmployeeProfile = require('../models/employee_model')
const DepartmentDepartment = require('../models/department_model')
const { multipleToObject, sigleToObject } = require('../utils/to_Object')
const Auth = require('../middlewares/auth_middlewares')
/* GET home page. */
router.get('/', async (req, res, next) =>{
    return res.redirect('/api/employee/fetchEmployeeList/1')
});


module.exports = router;
