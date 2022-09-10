const mongoose = require('mongoose');
const EmployeeProfile = require('../../models/employee_model')
var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")

class Employee {

    //Lấy thông tin chi tiết hồ sơ nhân viên
    browse = async (req, res, next) => {
        const { id } = req.params
        try {
            if (!req.params.hasOwnProperty('id')) {
                return res.status(401).send('Thiếu id hồ sơ nhân viên.');
            }

            const employee = await EmployeeProfile.findOne({ _id: id })
            if (!employee) {
                return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
            }

            res.render("employee/form-employee-information", { employee: sigleToObject(employee) })
        } catch (error) {
            console.log(error)
            return error
        }
    }


    //Tạo phòng ban
    createEmployee = async (req, res, next) => {
        const { name, avatar, code, email, phone, gender, department_id, job, birthday, birth_place, cccd_no, cccd_issued_on,
            cccd_issued_place, bank_no, religion, start_date, date_off, office_address, home_address, nation, degree, archive,
            personal_tax_no, bhxh_no, bhyt_no, bhyt_hospital, khen_thuong, ky_luat } = req.body
        const { filename } = req.file
        try {

            //Kiểm tra mã nhân viên đã tồn tại
            const nameEmployee = await EmployeeProfile.find({ code })

            if (nameEmployee.length > 0) {
                return res.status(401).send('Mã nhân viên đã tồn tại.');
            }

            //Tạo json để tạo
            let result = {
                status: 'working',
                avatar: String(filename).trim(),
            }
            let stringGroup = ["name", "avatar", "code", "email", "phone", "gender", "birth_place", "cccd_no",
                "cccd_issued_place", "bank_no", "religion", "office_address", "home_address", "nation", "degree", "archive",
                "personal_tax_no", "bhxh_no", "bhyt_no", "bhyt_hospital", "khen_thuong", "ky_luat"]

            for (const element of stringGroup) {
                if (typeof req.body[element] === 'string') {
                    result = { ...result, [`${element}`]: req.body[`${element}`] }
                }
            }


            let dateGroup = ["birthday", "cccd_issued_on", "start_date", "date_off"]
            for (const element of dateGroup) {
                if (typeof req.body[element] === 'Date') {
                    result = { ...result, [`${element}`]: req.body[`${element}`] }
                }
            }

            const newEmployee = new EmployeeProfile(result)
            if (!newEmployee) {
                res.status(401).send('Không thể tạo hồ sơ nhân viên');
            }
            newEmployee.save()
            this.fetchListPage(req, res)
        } catch (error) {
            console.log(error)
            return error
        }

    }


    //Cập nhật thông tin phòng ban
    updateEmployee = async (req, res, next) => {
        const { id } = req.params
        const { code, name, phone, email, cccd_no, nation, religion, country, bank_no, personal_tax_no, bhxh_no, bhyt_no, bhyt_hospital } = req.body
        try {

            const employee = await this.browse(req)

            //Kiểm tra mã nhân viên đã tồn tại
            const nameEmployee = await EmployeeProfile.find({ code })

            if (nameEmployee.length > 0) {
                return res.status(401).send('Mã nhân viên đã tồn tại.');
            }


            //Tạo json để tạo
            let result = {}
            let stringGroup = ["name", "avatar", "code", "email", "phone", "gender", "birth_place", "cccd_no",
                "cccd_issued_place", "bank_no", "religion", "office_address", "home_address", "nation", "degree", "archive",
                "personal_tax_no", "bhxh_no", "bhyt_no", "bhyt_hospital", "khen_thuong", "ky_luat"]

            for (const element of stringGroup) {
                if (typeof req.body[`${element}`] === 'string' && req.body[`${element}`] != employee[`${element}`]) {
                    result = { ...result, [`${element}`]: req.body[`${element}`] }
                }
            }


            let dateGroup = ["birthday", "cccd_issued_on", "start_date", "date_off"]
            for (const element of dateGroup) {
                if (typeof req.body[element] === 'Date') {
                    result = { ...result, [`${element}`]: req.body[`${element}`] }
                }
            }


            const updatedEmployee = await EmployeeProfile.updateOne({ _id: id }, result)
            if (!updatedEmployee) {
                return res.status(401).send('Cập nhật không thành công')
            }

            return this.browse(req, res)
        } catch (error) {
            console.log(error)
            return error
        }

    }



    //Lấy danh sách hồ sơ nhân viên có phân trang
    fetchListPage = async (req, res, next) => {
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
    }

    //Lưu trữ hồ sơ nhân viên
    storeEmployee = async (req, res, next) => {
        const { id } = req.params
        try {
            if (!req.params.hasOwnProperty('id')) {
                return res.status(401).send('Thiếu id hồ sơ nhân viên.');
            }

            const employee = await EmployeeProfile.findOne({ _id: id })
            if (!employee) {
                return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
            }
            const res = await EmployeeProfile.updateOne({ _id: id }, { status: 'demit' });

            res.render("employee/form-employee-information", { employee: sigleToObject(employee) })
        } catch (error) {
            console.log(error)
            return error
        }
    }



    //search manv
    searchCode = async (req, res, next) => {
        const { code } = req.params
        try {

            const employee = await EmployeeProfile.findOne({ code: { $regex: code } })
            if (!employee) {
                return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
            }

            res.json(employee)
        } catch (error) {
            console.log(error)
            return error
        }
    }

    //search manv
    dropdown = async (req, res, next) => {
        const { code } = req.params
        try {
            // { code: { $regex: code } }
            const employee = await EmployeeProfile.find({ code: { $regex: code } }).limit(8)
            if (!employee) {
                return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
            }

            res.json(employee)
        } catch (error) {
            console.log(error)
            return error
        }
    }
}


module.exports = new Employee()

