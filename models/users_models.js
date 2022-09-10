const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserAccount = new Schema({
    username: { type: 'string', string: 'Tên tài khoản' },
    password: { type: 'string', string: 'Mật khẩu' },
    refreshToken: { type: 'string' },
    create_date: { type: Date, default: Date.now, string: 'Ngày tạo' },
    write_date: { type: Date, default: Date.now, string: 'Ngày chỉnh sửa' },
});

module.exports = mongoose.model('UserAccount', UserAccount);
