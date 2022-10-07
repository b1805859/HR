const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const KhenThuongKyLuat = new Schema({
    employee_code: {type: 'string', string: 'Mã nhân viên'},
    day: { type: 'string', string: 'Thời gian' },
    type: { type: 'string', enum: ['khen_thuong', 'ky_luat'] },
    description: { type: 'string', string: 'Mô tả' },
    create_date: { type: 'Date', string: 'Ngày tạo' },
    create_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' },
    write_date: { type: 'Date', string: 'Ngày chỉnh sửa' },
    write_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' }

});

module.exports = mongoose.model('KhenThuongKyLuat', KhenThuongKyLuat);