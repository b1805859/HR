const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TimekeepMonth = new Schema({
    name: { type: 'string', string: 'Ten thang' },
    code: { type: 'string', string: 'Mã thang' },
    total: { type: 'number', string: 'Số ngày' },
    create_date: { type: 'Date', string: 'Ngày tạo' },
    create_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' },
    write_date: { type: 'Date', string: 'Ngày chỉnh sửa' },
    write_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' }


});

module.exports = mongoose.model('TimekeepMonth', TimekeepMonth);