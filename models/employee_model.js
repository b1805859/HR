const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const EmployeeProfile = new Schema({
    name: { type: 'string', string: 'Họ và tên' },
    avatar: { type: 'string', string: "Ảnh đại diện" },
    code: { type: 'string', string: 'Mã nhân viên' },
    email: { type: 'string', string: 'Email' },
    phone: { type: 'string', string: 'Số điện thoại' },
    gender: { type: 'string', string: 'Giới tính', enum: ['male', 'female'] },
    department_id: { type: Schema.Types.ObjectId, ref: 'DepartmentDepartment' },
    job: { type: 'string', string: 'Chức vụ' },

    birthday: { type: 'string', string: 'Ngày sinh' },
    status: { type: 'string', enum: ['draft', 'demit', 'working'], string: "Trạng thái" },//nháp, thử vc, đang làm , nghỉ việc, thai sản
    cccd_no: { type: 'string', string: 'CMND/CCCD' },
    bank_no: { type: 'string', string: 'Ngân hàng' },

    type: { type: 'string', enum: ['thoi_vu', 'chinh_thuc', 'thu_viec','thai_san'] },
    religion: { type: 'string', string: 'Tôn giáo' },
    address: { type: 'string', string: 'Nơi cư trú' },
    nation: { type: 'string', string: 'Dân tộc' },
    degree: { type: 'string', string: 'Bằng cấp' },
    personal_tax_no: { type: 'string', string: 'Mã số thuế' },
    bhxh_no: { type: 'string', string: 'Số BHXH' },
    bhyt_no: { type: 'string', string: 'Số thẻ BHYT' },
    bhyt_hospital: { type: 'string', string: 'Nơi đăng ký khám bệnh' },

    create_date: { type: 'Date', string: 'Ngày tạo' },
    create_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' },
    write_date: { type: 'Date', string: 'Ngày chỉnh sửa' },
    write_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' }

});

module.exports = mongoose.model('EmployeeProfile', EmployeeProfile);