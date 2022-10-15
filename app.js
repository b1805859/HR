var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connect = require('./config/connect');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config()



var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/users');
var employeeRouter = require('./routes/employee');
var departmentRouter = require('./routes/department')
var timekeepRouter = require('./routes/timekeep')
var ktklRouter = require('./routes/ktkl')
var app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const axios = require("axios")
// view engine setup
app.use(cookieParser('ID'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

connect();


//Api
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/ktkl', ktklRouter)
app.use('/api/timekeep', timekeepRouter)
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/', indexRouter);


//Socket io
io.on('connection', (socket) => {
    console.log('connected');

    socket.on("user-input-code-type", async ( data) => {
            const response = await axios({
                method: 'post',
                url: `http://localhost:3000/api/employee/searchCode`,
                headers: {},
                data: {
                    code: data.code,
                    type: data.type
                }
            });
            console.log( response.data)
           return socket.emit("server-send-client-employee", response.data);
    })
    socket.on("search-code", data => {
        axios.get(`http://localhost:3000/api/employee/dropdown/${data}`)
            .then(function (response) {
                socket.emit("server-send-dropdown", response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    })

    socket.on("user-acupuncture", async data => {
        const response = await axios({
            method: 'post',
            url: `http://localhost:3000/api/timekeep/findPosition`,
            headers: {},
            data: {
                latitude: data.latitude,
                longitude: data.longitude
            }
        });
        const { position } = response.data
        if (position.length > 0) {
            await axios({
                method: 'post',
                url: `http://localhost:3000/api/timekeep/acupuncture`,
                data: {
                    table_id: data.table_id,
                    user_id: data.user_id
                }
            });
        }
        else {
           return socket.emit("server-send-result", { msg: "Vị trí chấm công không đúng" })
        }

        const acupunctureLine = await axios({
            method: 'post',
            url: `http://localhost:3000/user/acupunctureData`,
            data: {
                //table_id: data.table_id,
                user_id: data.user_id
            }
        });
           return socket.emit("server-send-acupuncture-data", { ...acupunctureLine.data });
    })


    socket.on("/api/timekeep/month", async () => {
        const response = await axios({
            method: 'get',
            url: `http://localhost:3000/api/timekeep/month`,
            headers: {},
            data: {
                
            }
        });
        socket.emit("server/api/timekeep/timekeep-table",response.data)
    })

});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

module.exports = app;
