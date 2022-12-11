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

            let result ={}

            const department = await DepartmentDepartment.findOne({ _id: id })
            if (!department) {
                return res.status(401).send('Không tìm thấy hồ sơ nhân viên.');
            }

            result = {...result,department}
            if(String(department.employee_code).trim())
            {
                const employee = await EmployeeProfile.findOne({code: department.employee_code})
                if(!employee)
                {
                    return res.status(401).send('Nhân viên không tồn tại.');
                }
                result = {...result,name_lead: employee.name}
            }else
            {
                result = {...result,name_lead: ''}
            }

            res.render("department/form-department-information", { user: sigleToObject(user), department: JSON.stringify(result) })
        } catch (error) {

            return error
        }
    }


    //Tạo phòng ban
    createDepartment = async (req, res, next) => {
        const { name, phone } = req.body
        
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
                employee_code:"",
                role: 'nhan_vien'
            }

            
        
            const newDepartment = new DepartmentDepartment(result)
            if (!newDepartment) {
                res.status(401).send('Không thể thêm mới phòng ban');
            }

            //Cập nhật lại phòng ban nhân viên
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
            employee_code } = req.body
        try {

            if (!req.params.hasOwnProperty('id')) {
                return res.status(401).send('Thiếu id phòng ban.');
            }

            const department = await DepartmentDepartment.findOne({ _id: mongoose.Types.ObjectId(id) })
            if (!department) {
                return res.status(401).send('Không tìm phòng ban!');
            }


            //Tạo json để tạo
            let result = {}
            if (String(name).trim() !== String(department.name).trim()) {
                //Kiểm tra tên phòng ban đã tồn tại
                const nameDepartment = await DepartmentDepartment.find({ name: result.name })

                if (nameDepartment.length > 0) {
                    return res.status(401).send('Tên phòng ban đã tồn tại.');
                }
                result = { ...result, name: String(name) }
            }
            if (String(phone).trim() !== String(department.phone).trim()) {
                result = { ...result, phone: String(phone) }
            }



            const employee = await EmployeeProfile.findOne({ code: employee_code })
            if(employee)
            {
                result = { ...result, employee_code: employee.code }
            }
            else
            {
                result = { ...result, employee_code: '' }
            }


            const updatedDepartment = await DepartmentDepartment.updateOne({ _id: mongoose.Types.ObjectId(id) }, result)

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
                .sort({name:1})
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec((err, departments) => {
                    DepartmentDepartment.countDocuments( async (err, count) => {
                        let departmentList = []
                        for(const department of departments)
                        {
                            let result = {department}

                                if(department.employee_code != '')
                                {
                                    const employee = await EmployeeProfile.findOne({code: department.employee_code})
                                    result = {...result,name_lead: employee.name}
                                }else
                                {
                                    result = {...result,name_lead: ''}
                                }
                            departmentList.push(result)
                        }
                        
                        if (err) return next(err);
                        res.render('department/department-list', {
                            user: sigleToObject(user),
                            departments: JSON.stringify(departmentList), // sản phẩm trên một page
                            current: page, // page hiện tại
                            pages: Math.ceil(count / perPage) // tổng số các page
                        });
                    })
                })

        } catch (error) {

            return error
        }
    }

    //Lấy danh sách tháng trong năm
    getListDepartment = async (req, res, next) => {
        try {
            const departments = await DepartmentDepartment.find().sort({ datefield: -1 })
            return res.json(departments)
        } catch (error) {
            console.log(error)
            return error
        }
    }
}


module.exports = new Department()

