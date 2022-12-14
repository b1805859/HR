const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserAccount = new Schema({
    username: { type: 'string', string: 'Tên tài khoản' },
    password: { type: 'string', string: 'Mật khẩu' },
    create_date: { type: Date, default: Date.now, string: 'Ngày tạo' },
    write_date: { type: Date, default: Date.now, string: 'Ngày chỉnh sửa' },
    role: { type: 'string', default: 'nhan_vien' },
});

module.exports = mongoose.model('UserAccount', UserAccount);
