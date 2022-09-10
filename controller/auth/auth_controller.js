const bcrypt = require('bcrypt');
const saltRounds = 10;
const userController = require('../profile/user_controller')
const jwt = require('jsonwebtoken');
var randToken = require('rand-token');
const promisify = require('util').promisify;
const verify = promisify(jwt.verify).bind(jwt);
class Auth {

    decodeToken = async (token, secretKey) => {
        try {
            return await jwt.verify(token, secretKey, {
                ignoreExpiration: true,
            });
        } catch (error) {
            console.log(`Error in decode access token: ${error}`);
            return null;
        }
    };

    generateToken = async (payload, secretSignature, tokenLife) => {
        try {
            return await jwt.sign(
                {
                    payload,
                },
                secretSignature,
                {
                    algorithm: 'HS256',
                    expiresIn: tokenLife,
                },
            );
        } catch (error) {
            console.log(`Error in generate access token:  + ${error}`);
            return null;
        }

    }


    verifyToken = async (token, secretKey) => {
        try {
            return await verify(token, secretKey);
        } catch (error) {
            console.log(`Error in verify access token:  + ${error}`);
            return null;
        }
    };


    //Đăng ký
    async register(req, res, next) {
        const username = req.body.username;
        const user = await userController.getUser(username);
        if (user) res.status(409).send('Tên tài khoản đã tồn tại.');
        else {
            const hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
            const newUser = {
                username: username,
                password: hashPassword
            };
            const createUser = userController.createUser(newUser);
            if (!createUser) {
                return res
                    .status(400)
                    .send('Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.');
            }
            return res.send({
                username,
            });
        }
    }



    //Đăng nhập
    login = async (req, res, next) => {
        const username = req.body.username
        const password = req.body.password
        const user = await userController.getUser(username)
        if (!user) res.status(401).send('Tên đăng nhập không tồn tại.');

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid)
            return res.status(401).send('Mật khẩu không chính xác.');

        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

        const dataForAccessToken = {
            username: user.username,
        };
        const accessToken = await this.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
        );

        if (!accessToken)
            res.status(401).send('Đăng nhập không thành công, vui lòng thử lại.');

        let refreshToken = randToken.generate(16); // tạo 1 refresh token ngẫu nhiên

        if (!user.refreshToken) {
            // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
            await userController.updateRefreshToken(user.username, refreshToken);
        } else {
            // Nếu user này đã có refresh token thì lấy refresh token đó từ database
            refreshToken = user.refreshToken;
        }


        return res.json({
            message: 'Đăng nhập thành công.',
            accessToken,
            refreshToken,
            user,
        });
    }



    refreshToken = async (req, res) => {
        //Lấy access token từ header
        const accessTokenFromHeader = req.headers.x_authorization;
        if (!accessTokenFromHeader) {
            return res.status(400).send('Không tìm thấy access token.');
        }

        //Lấy refresh token từ body
        const refreshTokenFromBody = req.body.refreshToken;
        if (!refreshTokenFromBody) {
            return res.status(400).send('Không tìm thấy refresh token.');
        }


        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;


        //Decode access token
        const decoded = await this.decodeToken(
            accessTokenFromHeader,
            accessTokenSecret
        )

        if (!decoded) {
            return res.status(400).send('Access token không hợp lệ.');
        }

        const username = decoded.payload.username; // Lấy username từ payload

        const user = await userController.getUser(username);
        if (!user) {
            return res.status(401).send('User không tồn tại.');
        }

        console.log("refreshTokenFromBody", refreshTokenFromBody)
        console.log("user.refreshToken", user.refreshToken)
        if (refreshTokenFromBody !== user.refreshToken) {
            return res.status(400).send('Refresh token không hợp lệ.');
        }
        const dataForAccessToken = {
            username,
        };

        const accessToken = await this.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
        );

        if (!accessToken) {
            return res
                .status(400)
                .send('Tạo access token không thành công, vui lòng thử lại.');
        }

        return res.json({
            accessToken,
        });
    }

}
module.exports = new Auth()

