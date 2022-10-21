var express = require('express');
var router = express.Router();
const EmployeeProfile = require('../models/employee_model')
const DepartmentDepartment = require('../models/department_model')
const { multipleToObject, sigleToObject } = require('../utils/to_Object')
const Auth = require('../middlewares/auth_middlewares')
/* GET home page. */
router.get('/', Auth.isAuth, Auth.checkRole, async (req, res, next) => {
  const { user } = req

        let perPage = 7;
        let page = req.params.page || 1
        try {
            await EmployeeProfile
                .find({ status: "working" })
                .sort({ date: 1 })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec(async (err, employees) => {
                    const employeeList = []
                    for(const employee of employees) {
                        let result ={}
                        const { department_id } = employee
                        const department = await DepartmentDepartment.findOne({ _id: department_id })
                        result ={ employee ,department: department.name}
                        employeeList.push(result)
                    }
                    EmployeeProfile.countDocuments((err, count) => {
                        if (err) return next(err);
                        res.render('employee/employee-list', {
                            user: sigleToObject(user),
                            employees: JSON.stringify(employeeList), // sản phẩm trên một page
                            current: page, // page hiện tại
                            pages: Math.ceil(count / perPage) // tổng số các page
                        });
                    })
                })

        } catch (error) {
            console.log(error)
            return error
        }
});


module.exports = router;
