var express = require('express');
var router = express.Router();
const timekeepPositionController = require('../controller/timeskeep/timeskeep_position_controller.js');
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


//Position
router.get('/position', timekeepPositionController.getPosition)
router.get('/positionMap', timekeepPositionController.getPositionMap)


router.get('/formCreatePosition', (req, res, next) => {
    res.render("timekeep/form-timekeep-create-position")
})
router.post('/position', timekeepPositionController.storePosition)

// router.post('/position/add', timekeepPositionController.setPosition)




module.exports = router;
