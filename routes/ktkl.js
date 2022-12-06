var express = require('express');
var router = express.Router();
const ktklController = require('../controller/ktkl_controller');
const KhenThuongKyLuat = require('../models/ktkl_model');
const { sigleToObject, multipleToObject } = require("../utils/to_Object")

const Auth = require('../middlewares/auth_middlewares')



//Lấý thông tin dòng ktkl
router.get('/information/:id', Auth.isAuth, ktklController.browse)

router.get('/deleteKTKL/:id', Auth.isAuth,async (req,res,next)=>{
    
    const {user} = req
    const {id} = req.params
    const ktklLine = await KhenThuongKyLuat.findOneAndDelete({_id: id})
    if(!ktklLine){
        return res.status(404).send({ messages: "Không tìm thấy thông tin để xóa"})
    }

    res.redirect('/api/ktkl/fetchKTKLList')
})

//Thêm khen thuong ky luat
router.post('/createKTKL', Auth.isAuth, ktklController.createKTKL)
//render form tạo hồ sơ nhân viên
router.get('/formCreateKTKL', Auth.isAuth, (req, res, next) => {
    const { user } = req
    res.render("ktkl/form-ktkl-create", { user: sigleToObject(user) })
})

//Cập nhật dòng ktkl
router.post('/updateKTKL/:id', Auth.isAuth, ktklController.updateKTKL)
//render form cập nhật khen thưởng kỷ luật
router.get('/formUpdateKTKL/:id', Auth.isAuth, Auth.checkRole, async (req, res, next) => {
    const { id } = req.params
    const { user } = req
    try {
        if (!req.params.hasOwnProperty('id')) {
            return res.status(401).send('Thiếu id dòng thông tin.');
        }

        const ktkl = await KhenThuongKyLuat.findOne({ _id: id })
        if (!ktkl) {
            return res.status(401).send('Không tìm thông tin cần nhập.');
        }

        res.render("ktkl/form-ktkl-update", { ktkl: sigleToObject(ktkl), user: sigleToObject(user) })
    } catch (error) {
        console.log(error)
        return error
    }
})



//Lấy danh khen thưởng kỷ luật có phân trang (trang có đối số)
router.get('/fetchKTKLList', Auth.isAuth, Auth.checkRole, ktklController.fetchListPage)


//Lấy danh khen thưởng kỷ có chọn lọc (trang có đối số)
router.post('/fetchKTKLList/type', ktklController.fetchListType)




//Xóa khen thưởng kỷ luật
router.get('/delete/:id', Auth.isAuth, ktklController.deleteKTKL)


module.exports = router;
