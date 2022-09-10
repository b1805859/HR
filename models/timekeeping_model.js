const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Timekeeping = new Schema({
    name: { type: 'string', string: 'Tên vị trí' },
    code: { type: 'string', string: 'Mã vị trí' },
    scope: { type: 'string', string: 'Phạm vi' },
    status: { type: 'string', string: 'Vị trí' },

    create_date: { type: Date, default: Date.now, string: 'Ngày tạo' },
    create_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' },
    write_date: { type: Date, default: Date.now, string: 'Ngày chỉnh sửa' },
    write_uid: { type: Schema.Types.ObjectId, ref: 'UserAccount' }
});

module.exports = mongoose.model('Timekeeping', Timekeeping);