const userAccount = require('../../models/users_models')

class User {

    //Lấy thông tin user
    async getUser(username) {
        try {
            const user = await userAccount.findOne({ name: username }).exec();
            return user;
        } catch {
            return false;
        }
    };


    //Tạo user
    async createUser(user) {
        try {
            const { username, password } = user
            const newUser = new userAccount({ username, password });
            await newUser.save();
        } catch {
            return false;
        }
    };


    //Cập nhật refeshToken
    async updateRefreshToken(username, refreshToken) {
        try {
            await userAccount.findOneAndUpdate(username, { refreshToken: refreshToken });
            return true;
        } catch {
            return false;
        }

    }
}
module.exports = new User()

