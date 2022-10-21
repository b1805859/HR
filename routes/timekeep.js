var express = require('express');
var router = express.Router();
const timekeepPositionController = require('../controller/timekeep/position_controller.js');
const timekeepTableController = require('../controller/timekeep/table_controller.js');
const timekeepReportController = require('../controller/timekeep/report_controller.js');
const timekeepMonthController = require('../controller/timekeep/month_controller');
const timekeepAcupunctureController = require('../controller/timekeep/acupuncture_controller');
const { sigleToObject, multipleToObject } = require("../utils/to_Object")
const Auth = require('../middlewares/auth_middlewares')

//Position
router.get('/position', Auth.isAuth, timekeepPositionController.getPosition)


router.get('/positionMap', Auth.isAuth, timekeepPositionController.getPositionMap)

router.get('/formCreatePosition', Auth.isAuth, Auth.checkRole, (req, res, next) => {
    const { user } = req
    res.render("timekeep/form-timekeep-create-position", { user: sigleToObject(user) })
})

router.post('/position', timekeepPositionController.storePosition)


//Tìm kiếm vị trí gần
router.post('/findPosition', timekeepPositionController.findPosition)

//Lấy danh sách hồ sơ nhân viên chưa có bảng công có phân trang (trang có đối số)
router.get('/fetchTimekeepList/:page', Auth.isAuth, Auth.checkRole, timekeepPositionController.fetchListPage)





//Table
router.get('/table', Auth.isAuth, Auth.checkRole, timekeepTableController.renderFormCreateTable)
//Tạo bảng chấm công cho tháng
router.post('/table', Auth.isAuth, Auth.checkRole, timekeepTableController.createTable)



//Report
router.get('/fetchReportList/1', Auth.isAuth, Auth.checkRole, timekeepReportController.fetchReport)
router.post('/report',  timekeepReportController.report)

//Month
router.post('/month', Auth.isAuth, Auth.checkRole, timekeepMonthController.createMonth)
//
router.get('/month', timekeepMonthController.getMonth)


//Chấm công
router.post('/acupuncture', timekeepAcupunctureController.acupuncture)

module.exports = router;
