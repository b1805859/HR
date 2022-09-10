const mongoose = require('mongoose');
const { deleteOne } = require('../../models/department_model');
const DepartmentDepartment = require('../../models/department_model')


class Department {

    //Lấy thông tin chi tiết phòng ban
    async browse(req, res, next) {
        const { id } = req.params
        try {
            if (!req.params.hasOwnProperty('id')) {
                return res.status(401).send('Thiếu id phòng ban.');
            }

            const department = await DepartmentDepartment.findOne({ _id: id })
            if (!department) {
                return res.status(401).send('Không tìm thấy phòng ban.');
            }

            return res.json(department)
        } catch (error) {
            console.log(error)
            return error
        }
    }


    //Tạo phòng ban
    createDepartment = async (req, res, next) => {
        const { name, phone, leader_id, description } = req.body
        try {
            if (!req.body.hasOwnProperty('name')) {
                return res.status(401).send('Thiếu tên phòng ban.');
            }
            if (!req.body.hasOwnProperty('phone')) {
                return res.status(401).send('Thiếu số điện thoại liên lạc phòng ban.');
            }

            const nameDepartment = await DepartmentDepartment.find({ name })
            console.log("nameDepartment", nameDepartment)
            if (nameDepartment.length > 0) {
                return res.status(401).send('Tên phòng ban đã tồn tại.');
            }

            let result = {}
            //Kiểm tra dữ liệu để tạo
            if (String(name).trim()) {
                result = { ...result, name }
            }
            if (String(phone).trim()) {
                result = { ...result, phone }
            }
            if (String(description).trim()) {
                result = { ...result, description }
            }

            const newDepartment = new DepartmentDepartment(result)
            if (!newDepartment) {
                res.status(401).send('Không thể tạo phòng ban');
            }
            newDepartment.save()
            res.json(newDepartment)
        } catch (error) {
            console.log(error)
            return error
        }

    }


    //Cập nhật thông tin phòng ban
    updateDepartment = async (req, res, next) => {
        const { id } = req.params
        const { name, phone, leader_id, description } = req.body
        try {
            if (!req.body.hasOwnProperty('name')) {
                return res.status(401).send('Thiếu tên phòng ban.');
            }
            if (!req.body.hasOwnProperty('phone')) {
                return res.status(401).send('Thiếu số điện thoại liên lạc phòng ban.');
            }

            const department = await DepartmentDepartment.findOne({ _id: id })
            if (!department) {
                return res.status(401).send('Không tìm thấy phòng ban để cập nhật.');
            }

            let result = {}
            //Kiểm tra dữ liệu để tạo
            if (String(name).trim() && String(name).trim() != String(department.name).trim()) {
                result = { ...result, name }
            }
            if (String(phone).trim() && String(phone).trim() != String(department.phone).trim()) {
                result = { ...result, phone }
            }
            if (String(description).trim() && String(description).trim() != String(department.description).trim()) {
                result = { ...result, description }
            }

            const updatedDepartment = await DepartmentDepartment.updateOne({ _id: id }, result)
            if (!updatedDepartment) {
                return res.status(401).send('Cập nhật không thành công')
            }
            return this.browse(req, res)
        } catch (error) {
            console.log(error)
            return error
        }

    }


    //Lấy danh sách phòng ban có phân trang
    fetchList = async (req, res, next) => {
        const { name } = req.body
        let perPage = 5;
        let page = req.params.page || 1
        try {
            // if(req.body.hasOwnProperty('name') && String(name).trim())
            // {
            //     const department = await DepartmentDepartment.find({ })
            //     if (!department) {
            //         return res.status(401).send('Không tìm thấy phòng ban.');
            //     }
            // }
            await DepartmentDepartment
                .find({})
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec((err, departments) => {
                    DepartmentDepartment.countDocuments((err, count) => {
                        if (err) return next(err);
                        return res.json(departments)
                    })
                })



        } catch (error) {
            console.log(error)
            return error
        }
    }
}


module.exports = new Department()