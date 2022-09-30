const mongoose = require('mongoose');
const DepartmentDepartment = require('../../models/department_model')
const EmployeeProfile = require('../../models/employee_model')
var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")

class Department {

    //Lấy thông tin chi tiết hồ sơ nhân viên
    browse = async (req, res, next) => {
        const { id } = req.params
        const { user } = req

        try {
            if (!req.params.hasOwnProperty('id')) {
                return res.status(401).send('Thiếu id phòng ban.');
            }

            const department = await DepartmentDepartment.findOne({ _id: id })
            if (!department) {
                return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
            }

            res.render("department/form-department-information", { user: sigleToObject(user), department: sigleToObject(department) })
        } catch (error) {

            return error
        }
    }


    //Tạo phòng ban
    createDepartment = async (req, res, next) => {
        const { name, phone, employee_code } = req.body

        try {

            //Kiểm tra tên phòng ban đã tồn tại
            const nameDepartment = await DepartmentDepartment.findOne({ name: name })

            if (!(nameDepartment == null)) {
                return res.status(401).send('Tên phòng ban đã tồn tại.');
            }


            //Tạo json để tạo
            let result = {
                name: String(name).trim(),
                phone: String(phone).trim(),
                status: 'inactive',

            }

            //Kiểm tra trưởng phòng có tồn tại
            if (String(employee_code).trim()) {
                const employee = await EmployeeProfile.findOne({ code: employee_code })
                if (employee) {
                    result = { ...result, employee_id: ObjectId(employee._id), name_lead: employee.name }
                }
            }
            else {
                result = { ...result, employee_id: '' }
            }



            const newDepartment = new DepartmentDepartment(result)
            if (!newDepartment) {
                res.status(401).send('Không thể thêm mới phòng ban');
            }
            await newDepartment.save()
            return this.fetchListPage(req, res)
        } catch (error) {

            return error
        }

    }


    //Cập nhật thông tin phòng ban
    updateDepartment = async (req, res, next) => {
        const { id } = req.params
        const { name,
            phone,
            employee_code,
            status, } = req.body
        try {

            if (!req.params.hasOwnProperty('id')) {
                return res.status(401).send('Thiếu id phòng ban.');
            }

            const department = await DepartmentDepartment.findOne({ _id: id })
            if (!department) {
                return res.status(401).send('Không tìm phòng ban.');
            }

            //Kiểm tra mã nhân viên đã tồn tại
            const nameDepartment = await DepartmentDepartment.find({ name })

            if (nameDepartment.length > 0) {
                return res.status(401).send('Tên phòng ban đã tồn tại.');
            }

            //Tạo json để tạo
            let result = {}
            if (String(name).trim() !== String(department.name).trim()) {
                result = { ...result, name: String(name) }
            }
            if (String(phone).trim() !== String(department.phone).trim()) {
                result = { ...result, phone: String(phone) }
            }
            if (String(status).trim() !== String(department.status).trim()) {
                result = { ...result, status: String(status) }
            }

            const employee = await EmployeeProfile.findOne({ code: employee_code })

            result = { ...result, employee_id: String(employee._id), name_lead: employee.name }

            const updatedDepartment = await DepartmentDepartment.updateOne({ _id: id }, result)

            if (!updatedDepartment) {
                return res.status(401).send('Cập nhật không thành công')
            }

            return this.browse(req, res)
        } catch (error) {

            return error
        }

    }



    //Lấy danh sách hồ sơ nhân viên có phân trang
    fetchListPage = async (req, res, next) => {
        const { user } = req

        let perPage = 8;
        let page = req.params.page || 1
        try {
            await DepartmentDepartment
                .find()
                .sort({ date: 1 })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec((err, departments) => {
                    DepartmentDepartment.countDocuments((err, count) => {
                        if (err) return next(err);
                        res.render('department/department-list', {
                            user: sigleToObject(user),
                            departments: multipleToObject(departments), // sản phẩm trên một page
                            current: page, // page hiện tại
                            pages: Math.ceil(count / perPage) // tổng số các page
                        });
                    })
                })

        } catch (error) {

            return error
        }
    }

    // //Lưu trữ hồ sơ nhân viên
    // storeEmployee = async (req, res, next) => {
    //     const { id } = req.params
    //     try {
    //         if (!req.params.hasOwnProperty('id')) {
    //             return res.status(401).send('Thiếu id hồ sơ nhân viên.');
    //         }

    //         const employee = await DepartmentDepartment.findOne({ _id: id })
    //         if (!employee) {
    //             return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
    //         }
    //         const res = await DepartmentDepartment.updateOne({ _id: id }, { status: 'demit' });

    //         res.render("employee/form-employee-information", { employee: sigleToObject(employee) })
    //     } catch (error) {

    //         return error
    //     }
    // }



    // //search manv
    // searchCode = async (req, res, next) => {
    //     const { code } = req.params
    //     try {

    //         const employee = await DepartmentDepartment.findOne({ code: { $regex: code } })
    //         if (!employee) {
    //             return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
    //         }

    //         res.json(employee)
    //     } catch (error) {

    //         return error
    //     }
    // }

    // //search manv
    // dropdown = async (req, res, next) => {
    //     const { code } = req.params
    //     try {
    //         // { code: { $regex: code } }
    //         const employee = await DepartmentDepartment.find({ code: { $regex: code } }).limit(8)
    //         if (!employee) {
    //             return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
    //         }

    //         res.json(employee)
    //     } catch (error) {

    //         return error
    //     }
    // }
}


module.exports = new Department()

