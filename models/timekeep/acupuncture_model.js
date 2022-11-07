const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TimekeepAcupunture = new Schema({
    date: { type: 'number', string: 'Ngày chấm công' },
    month_id: { type: Schema.Types.ObjectId, ref: 'TimekeepMonth', string: 'Tháng chấm công' },
    year: {type:'string', string:"Năm"},
    table_id: { type: Schema.Types.ObjectId, ref: 'TimekeepTable', string: 'Mã bảng công' },
    late_check: {type: Boolean, default: false},

    employee_id: { type: Schema.Types.ObjectId, ref: 'EmployeeProfile', string: 'Mã hồ sơ nhân viên' },
    create_date: { type: 'Date', string: 'Ngày tạo' },
    create_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' },
    write_date: { type: 'Date', string: 'Ngày chỉnh sửa' },
    write_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' }
});

module.exports = mongoose.model('TimekeepAcupunture', TimekeepAcupunture);