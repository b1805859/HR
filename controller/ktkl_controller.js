const mongoose = require('mongoose');
const KhenThuongKyLuat = require('../models/ktkl_model')
const EmployeeProfile = require('../models/employee_model')
var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../utils/to_Object");
const { json } = require('express');

class KTKL {

    //Lấy thông tin chi tiết hồ sơ nhân viên
    browse = async (req, res, next) => {
        const { user } = req
        const { id } = req.params
        try {
            if (!req.params.hasOwnProperty('id')) {
                return res.status(401).send('Thiếu id dòng ktkl.');
            }

            const ktkl = await KhenThuongKyLuat.findOne({ _id: id })
            if (!ktkl) {
                return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
            }
            res.render("ktkl/form-ktkl-information", {
                user: sigleToObject(user),
                ktkl: sigleToObject(ktkl)
            })
        } catch (error) {
            console.log(error)
            return error
        }
    }


    createKTKL = async (req, res, next) => {
        const {user} = req
        const { employee_code } = req.body
        try {

            //Kiểm tra mã nhân viên đã tồn tại
            const employee = await EmployeeProfile.find({ employee_code })
            if (!employee) {
                return res.status(401).send('Nhân viên không tồn tại');
            }

            //Tạo json để tạo
            let result = {
                
            }
            let stringGroup = ["employee_code", "type", "description", "day"]

            for (const element of stringGroup) {
                if (typeof req.body[element] === 'string') {
                    result = { ...result, [`${element}`]: req.body[`${element}`] }
                }
            }


            // let dateGroup = ["day"]
            // for (const element of dateGroup) {
            //     if (typeof req.body[element] === 'Date') {
            //         result = { ...result, [`${element}`]: req.body[`${element}`] }
            //     }
            // }
           

            const newKTKL = new KhenThuongKyLuat(result)
            if (!newKTKL) {
                res.status(401).send('Không thể khen thưởng kỷ luật');
            }
            await newKTKL.save()
            req.ktkl = newKTKL
            req.user = user
            res.redirect('/api/ktkl/fetchKTKLList')
        } catch (error) {
            console.log(error)
            return error
        }

    }


    //Cập nhật thông tin phòng ban
    updateKTKL = async (req, res, next) => {
        const { id } = req.params
        // const { filename } = req.file
        try {

            const ktkl = await KhenThuongKyLuat.findById(id)

            if(!ktkl) {
                return res.status(404).send("Không tìm thấy thông tin cần cập nhật")
            }

            //Tạo json để tạo
            let result = {
                // avatar: String(filename).trim()
            }
            let stringGroup = ["employee_code", "type", "description", "day"]

            for (const element of stringGroup) {
                if (typeof req.body[`${element}`] === 'string' && req.body[`${element}`] != ktkl[`${element}`]) {
                    result = { ...result, [`${element}`]: req.body[`${element}`] }
                }
            }


            // let dateGroup = ["birthday"]
            // for (const element of dateGroup) {
            //     if (typeof req.body[element] === 'Date') {
            //         result = { ...result, [`${element}`]: req.body[`${element}`] }
            //     }
            // }
            const employee = EmployeeProfile.findOne({code: result.employee_code})
            if(!employee)
            {
                return res.status(404).send("Nhân viên không tồn tại")
            }

            const updateKTKL = await KhenThuongKyLuat.updateOne({ _id: id }, result)
            if (!updateKTKL) {
                return res.status(401).send('Cập nhật không thành công')
            }
            return this.browse(req, res)
        } catch (error) {
            console.log(error)
            return error
        }

    }



    //Lấy danh sách khen thưởng kỷ luật
    fetchListPage = async (req, res, next) => {
        const { user } = req
        try {
            const ktkls = await KhenThuongKyLuat.find()
            const ktklLine = []
            for(const ktkl of ktkls) {
                let result = {}
                const {employee_code} = ktkl
                const employee = await EmployeeProfile.findOne({code: employee_code})
                if(employee)
                {
                    result = {
                        ktkl,
                        employee
                    }
                    ktklLine.push(result)
                }
            }
                 res.render('ktkl/ktkl-list',{
                    user: sigleToObject(user),
                    ktklLine: JSON.stringify(ktklLine),
                 })

        } catch (error) {
            console.log(error)
            return error
        }
    }




        //Lấy danh sách khen thưởng kỷ luật
        fetchListType = async (req, res, next) => {
            const { user } = req
            try {   
                let result = {}
                if(String(req.body.type) == 'all')
                {
                    
                }
                else if(String(req.body.type) == "khen_thuong")
                {
                    result = {type: "khen_thuong"}
                }
                else if(String(req.body.type) == "ky_luat")
                {
                    result = {type: "ky_luat"}
                }

                const ktkls = await KhenThuongKyLuat.find(result)
                console.log("ktkls", ktkls)
                const ktklLine = []
                for(const ktkl of ktkls) {
                    let result = {}
                    const {employee_code} = ktkl
                    const employee = await EmployeeProfile.findOne({code: employee_code})
                    if(employee)
                    {
                        result = {
                            ktkl,
                            employee
                        }
                        ktklLine.push(result)
                    }
                }
                console.log(ktklLine)
                    return res.json({
                        user: sigleToObject(user),
                        ktklLine: JSON.stringify(ktklLine),
                     })
    
            } catch (error) {
                console.log(error)
                return error
            }
        }




    //Xóa khen thưởng kỷ luật
    deleteKTKL = async (req, res, next) => {
        const {id} = req.params
        try {
            const result = await KhenThuongKyLuat.deleteOne({ _id: mongoose.Types.ObjectId(id)});
            if(!result)
            {
                return res.json({msgError: "Server Error"})
            }
            res.redirect('/api/ktkl/fetchKTKLList')
        } catch (error) {
            console.log(error)
            return error
        }

    }
    
}


module.exports = new KTKL()

