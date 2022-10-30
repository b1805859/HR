const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DepartmentDepartment = new Schema({
    name: { type: 'string', string: 'Tên phòng ban' },
    phone: { type: 'string', string: 'Số điện thoại' },
    status: { type: 'string', enum: ['active', 'inactive'], },
    employee_code: { type: 'string', string: 'Mã trưởng phòng' },

    create_date: { type: Date, default: Date.now, string: 'Ngày tạo' },
    create_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' },
    write_date: { type: Date, default: Date.now, string: 'Ngày chỉnh sửa' },
    write_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' }
});

module.exports = mongoose.model('DepartmentDepartment', DepartmentDepartment);