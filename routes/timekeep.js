var express = require('express');
var router = express.Router();
const timekeepPositionController = require('../controller/timekeep/position_controller.js');
const timekeepTableController = require('../controller/timekeep/table_controller.js');
const timekeepReportController = require('../controller/timekeep/report_controller.js');
const timekeepMonthController = require('../controller/timekeep/month_controller');
const timekeepAcupunctureController = require('../controller/timekeep/acupuncture_controller');
const { sigleToObject, multipleToObject } = require("../utils/to_Object")


//Position
router.get('/position', timekeepPositionController.getPosition)


router.get('/positionMap', timekeepPositionController.getPositionMap)

router.get('/formCreatePosition', (req, res, next) => { res.render("timekeep/form-timekeep-create-position") })

router.post('/position', timekeepPositionController.storePosition)

//Lấy danh sách hồ sơ nhân viên chưa có bảng công có phân trang (trang có đối số)
router.get('/fetchTimekeepList/:page', timekeepPositionController.fetchListPage)





//Table
router.get('/table', timekeepTableController.renderFormCreateTable)
//Tạo bảng chấm công cho tháng
router.post('/table', timekeepTableController.createTable)



//Report
router.get('/fetchReportList/1', timekeepReportController.fetchReport)


//Month
router.post('/month', timekeepMonthController.createMonth)


//Acupuncture
router.post('/acupuncture', timekeepAcupunctureController.acupuncture)

module.exports = router;
