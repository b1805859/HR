const mongoose = require('mongoose');
const EmployeeProfile = require('../../models/employee_model')
const DepartmentDepartment = require('../../models/department_model')
var ObjectId = require('mongoose').Types.ObjectId;
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")

class Employee {

    //Lấy thông tin chi tiết hồ sơ nhân viên
    browse = async (req, res, next) => {
        const { user } = req
        const { id } = req.params
        try {
            if (!req.params.hasOwnProperty('id')) {
                return res.status(401).send('Thiếu id hồ sơ nhân viên.');
            }

            const employee = await EmployeeProfile.findOne({ _id: id })
            if (!employee) {
                return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
            }
            const department = await DepartmentDepartment.findOne({ _id: employee.department_id })
            if (!department) {
                return res.status(401).send('Không tìm thấy phòng ban.');
            }
            res.render("employee/form-employee-information", {
                user: sigleToObject(user),
                employee: sigleToObject(employee),
                department: sigleToObject(department)
            })
        } catch (error) {
            console.log(error)
            return error
        }
    }


    //Thêm nhân viên
    createEmployee = async (req, res, next) => {
        const { code } = req.body

        try {
            //Kiểm tra mã nhân viên đã tồn tại
            const nameEmployee = await EmployeeProfile.find({ code })

            if (nameEmployee.length > 0) {
                return res.status(401).send('Mã nhân viên đã tồn tại.');
            }

            let result = {
                status: 'working',
                department_id: req.body[`department-select`]
            }

            if(req.hasOwnProperty('file'))
            {
                const { filename } = req.file
                result = {...result, avatar: String(filename).trim()}
            }
            else
            {
                result = {...result, avatar: '1.png'}
            }


            let stringGroup = ["code", "name", "gender", "phone", "email", "address", "cccd_no", "nation", "religion", "country", "bank_no", "type",
                "personal_tax_no", "bhxh_no", "bhyt_hospital", "bhyt_no", "job" ,"birthday"]

            for (const element of stringGroup) {
                if (typeof req.body[element] === 'string') {
                    result = { ...result, [`${element}`]: req.body[`${element}`] }
                }
            }

            const newEmployee = new EmployeeProfile(result)
            if (!newEmployee) {
                res.status(401).send('Không thể tạo hồ sơ nhân viên');
            }
            await newEmployee.save()
            return this.fetchListPage(req, res)
        } catch (error) {
            console.log(error)
            return error
        }

    }


    //Cập nhật thông tin phòng ban
    updateEmployee = async (req, res, next) => {
        const { id } = req.params
        const { code } = req.body
        // const { filename } = req.file
        try {

            const employee = await EmployeeProfile.findOne({ _id: id })

            //Kiểm tra mã nhân viên đã tồn tại
            const nameEmployee = await EmployeeProfile.findOne({ code })
            if (nameEmployee)
                return res.status(401).send('Mã nhân viên đã tồn tại')


            //Tạo json để tạo
            let result = {
                status: 'working',
                department: req.body[`department-select`]
            }

            if(req.hasOwnProperty('file'))
            {
                const { filename } = req.file
                result = {...result, avatar: String(filename).trim()}
            }
            else
            {
                result = {...result, avatar: '1.png'}
            }

            let stringGroup = ["code", "name", "gender", "phone", "email", "address", "cccd_no", "nation", "religion", "country", "bank_no", "type",
                "personal_tax_no", "bhxh_no", "bhyt_hospital", "bhyt_no", "job"]

            for (const element of stringGroup) {
                if (typeof req.body[`${element}`] === 'string' && req.body[`${element}`] != employee[`${element}`]) {
                    result = { ...result, [`${element}`]: req.body[`${element}`] }
                }
            }


            let dateGroup = ["birthday"]
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
        const { user } = req

        let perPage = 8;
        let page = req.params.page || 1
        try {
            await EmployeeProfile
                .find({ status: "working" })
                .sort({ date: 1 })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec(async (err, employees) => {
                    const employeeList = []
                    for(const employee of employees) {
                        let result ={}
                        const { department_id } = employee
                        const department = await DepartmentDepartment.findOne({ _id: department_id })
                        result ={ employee ,department: department.name}
                        employeeList.push(result)
                    }
                    EmployeeProfile.countDocuments((err, count) => {
                        if (err) return next(err);
                        res.render('employee/employee-list', {
                            user: sigleToObject(user),
                            employees: JSON.stringify(employeeList), // sản phẩm trên một page
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
        const { user } = req
        const { id } = req.params
        try {
            if (!req.params.hasOwnProperty('id')) {
                return res.status(401).send('Thiếu id hồ sơ nhân viên.');
            }

            const employee = await EmployeeProfile.findOne({ _id: id })
            if (!employee) {
                return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
            }
            await EmployeeProfile.updateOne({ _id: id }, { status: 'demit' });

            return res.redirect('/api/employee/fetchEmployeeList/1')
        } catch (error) {
            console.log(error)
            return error
        }
    }



    //search manv
    searchCode = async (req, res, next) => {
        const { code } = req.body
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





    // fetchListKeyPage= async (req, res, next) => {
    //     const { user } = req
    //     const {type, value} =req.params
    //     let perPage = 8;
    //     let page = req.params.page || 1
    //     try {
    //         let search ={
    //             [`${type}`]: value
    //         }
    //         await EmployeeProfile
    //             .find(search)
    //             .sort({ date: 1 })
    //             .skip((perPage * page) - perPage)
    //             .limit(perPage)
    //             .exec(async (err, employees) => {
    //                 const employeeList = []
    //                 for(const employee of employees) {
    //                     let result ={}
    //                     const { department_id } = employee
    //                     const department = await DepartmentDepartment.findOne({ _id: department_id })
    //                     result ={ employee ,department: department.name}
    //                     employeeList.push(result)
    //                 }
    //                 EmployeeProfile.countDocuments((err, count) => {
    //                     if (err) return next(err);
    //                     res.render('employee/employee-list', {
    //                         user: sigleToObject(user),
    //                         employees: JSON.stringify(employeeList), // sản phẩm trên một page
    //                         current: page, // page hiện tại
    //                         pages: Math.ceil(count / perPage) // tổng số các page
    //                     });
    //                 })
    //             })

    //     } catch (error) {
    //         console.log(error)
    //         return error
    //     }
    // }
}


module.exports = new Employee()

