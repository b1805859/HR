var express = require('express');
var router = express.Router();
const timekeepingController = require('../controller/timeskeeping/timeskeeping_controller.js');
const Timekeeping = require('../models/timekeeping_model')
const { sigleToObject, multipleToObject } = require("../utils/to_Object")
// const path = require('path')
// const multer = require('multer')
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../public/assets/img/avatars/'))
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// })
// const upload = multer({ storage: storage })



// //Lấy thông tin chi tiết phòng ban
// router.get('/getTimekeepingInformation/:id', timekeepingController.browse)

// //Tạo phòng ban
// router.post('/createTimekeeping', upload.single('avatar'), timekeepingController.createTimekeeping)
// //render form tạo hồ sơ nhân viên
// router.get('/formCreateTimekeeping', (req, res, next) => {
//     res.render("timekeeping/form-timekeeping-create")
// })

// //Cập nhật thông tin phòng ban
// router.post('/updateTimekeeping/:id', timekeepingController.updateTimekeeping)
// //render form cập nhật thông hồ sơ nhân viên
// router.get('/formUpdateTimekeeping/:id', async (req, res, next) => {
//     const { id } = req.params
//     try {
//         if (!req.params.hasOwnProperty('id')) {
//             return res.status(401).send('Thiếu id hồ sơ nhân viên.');
//         }

//         const timekeeping = await Timekeeping.findOne({ _id: id })
//         if (!timekeeping) {
//             return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
//         }

//         res.render("timekeeping/form-timekeeping-update", { timekeeping: sigleToObject(timekeeping) })
//     } catch (error) {
//         console.log(error)
//         return error
//     }
// })



//Lấy danh sách phòng ban có phân trang (trang có đối số)
router.get('/fetchTimekeepingList', timekeepingController.fetchListPage)


// //Lưu trữ hồ sơ nhân viên
// router.post('/storeTimekeeping/:id', timekeepingController.browse)

// //search manv
// router.get('/searchCode/:code', timekeepingController.searchCode)

// //dropdown manv
// router.get('/dropdown/:code', timekeepingController.dropdown)

module.exports = router;
