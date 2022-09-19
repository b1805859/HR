const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TimekeepTable = new Schema({
    nam: { type: 'string', string: "Năm" },
    month_id: { type: Schema.Types.ObjectId, ref: 'TimekeepMonth', string: "Mã tháng" },
    employee_id: { type: Schema.Types.ObjectId, ref: 'EmployeeProfile', string: "Mã hồ sơ" },//nháp, thử vc, đang làm , nghỉ việc, thai sản
    position_id: { type: Schema.Types.ObjectId, ref: 'TimekeepPosition', string: "Mã vị trí chấm công" },

    create_date: { type: 'Date', string: 'Ngày tạo' },
    create_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' },
    write_date: { type: 'Date', string: 'Ngày chỉnh sửa' },
    write_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' }

});

module.exports = mongoose.model('TimekeepTable', TimekeepTable); 2