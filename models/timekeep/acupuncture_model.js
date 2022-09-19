const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TimekeepAcupunture = new Schema({
    date: { type: 'string', string: 'Ngày chấm công' },
    employee_id: { type: Schema.Types.ObjectId, ref: 'EmployeeProfile', string: 'Mã hồ sơ nhân viên' },
    table_id: { type: Schema.Types.ObjectId, ref: 'TimekeepTable', string: 'Mã bảng công' },
    create_date: { type: 'Date', string: 'Ngày tạo' },
    create_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' },
    write_date: { type: 'Date', string: 'Ngày chỉnh sửa' },
    write_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' }
});

module.exports = mongoose.model('TimekeepAcupunture', TimekeepAcupunture);