var express = require('express');
var router = express.Router();
const EmployeeProfile = require('../models/employee_model')
const { multipleToObject, sigleToObject } = require('../utils/to_Object')
const Auth = require('../middlewares/auth_middlewares')
/* GET home page. */
router.get('/', Auth.isAuth, Auth.checkRole, async (req, res, next) => {
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
          res.render('employee/employee-list', {
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
});


module.exports = router;
