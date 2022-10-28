const EmployeeProfile = require('../../models/employee_model')
const DepartmentDepartment = require('../../models/department_model')
const department_controller = require('../../controller/profile/department_controller')
const UserAccount = require('../../models/users_models')
var mongoose = require('mongoose');
const { sigleToObject, multipleToObject } = require("../../utils/to_Object")
const bcrypt = require('bcrypt');
const saltRounds = 10;
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


            //Khởi tạo thông tin hồ sơ nhân viên
            let result = {
                status: 'draft',
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

            //Khởi tạo tài khoản nhân viên
            const hashPassword = bcrypt.hashSync(String(req.body.code).trim(), saltRounds);
            const resultAccount = {
                username: String(req.body.code).trim(),
                password: hashPassword
            };
            const createUser = new UserAccount(resultAccount);

            if (!createUser) {
                return res
                    .status(400)
                    .send('Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.');
            }
            await createUser.save()
            return this.fetchListPage(req, res)
        } catch (error) {
            console.log(error)
            return error
        }

    }


    //Cập nhật thông tin nhân viên
    updateEmployee = async (req, res, next) => {
        const { id } = req.params
        // const { filename } = req.file
        try {
            console.log("req.body",req.body)
            const employee = await EmployeeProfile.findOne({ _id: id })
            //Tạo json để tạo
            let result = {
                department: req.body[`department-select`]
            }

            if(req.hasOwnProperty('file'))
            {
                const { filename } = req.file
                result = {...result, avatar: String(filename).trim()}
            }

            let stringGroup = [ "name", "gender", "phone", "email", "address", "cccd_no", "nation", "religion", "country", "bank_no", "type",
                "personal_tax_no", "bhxh_no", "bhyt_hospital", "bhyt_no", "job", "birthday", "status"]

            for (const element of stringGroup) {
                if (typeof req.body[`${element}`] === 'string' && req.body[`${element}`] != employee[`${element}`]) {
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
                .find()
                .sort({code:1})
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec(async (err, employees) => {
                    let departments = await DepartmentDepartment.find()
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
                            departments: JSON.stringify(departments),
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


    //search manv
    filter = async (req, res, next) => {
        const {data} = req.body
        let perPage = 10;
        let page = req.params.page || 1
        try {
            let result = {}
            for(const key of Object.keys(data))
            {
                if(String(data[`${key}`]) == '')
                {
                   
                }
                else
                {
                    if(String([`${key}`]) == 'code')
                    {
                        
                        result = {...result, [`${key}`]: { $regex: data[`${key}`]}}
                    }
                    else
                    {
                        result = {...result, [`${key}`]: data[`${key}`]}
                    }
                }
            }
            
            //Kiểm tra nếu bộ lọc tìm kiếm không có
            if(Object.keys(result).length === 0)
            {
                page=1000
            }

            await EmployeeProfile
                .find(result)
                .sort({code:1})
                .skip()
                .limit()
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
                        console.log(employeeList)
                        res.json( {
                            employeeList: JSON.stringify(employeeList), // sản phẩm trên một page
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





}


module.exports = new Employee()

