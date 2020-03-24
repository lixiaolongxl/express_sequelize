var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var winston =require('winston');
var expressWinston =require('express-winston');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var socket = require('./routes/socket')
//执行创建表结构
// var config = require('./models/index')


var app = express();
var session = require('express-session');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('hbs').__express); 
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//匹配静态文件
app.use(express.static(path.join(__dirname, 'public')));
//设置正常日志
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'  //成功的日志记录在log/success.log
        })
    ]
}));
// 使用 session 中间件
app.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}));
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    if(res.method=="OPTIONS"){
		res.json({
            status:200
        });
	}else {
		next();
    }
  
});
//记录错误日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'   //失败的日志记录在log/success.log
        })
    ]
}));
//路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/socket', socket);

// 地址匹配不到报404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  next();

  res.status(err.status || 500);
//   res.send({
//       status:500,
//       msg:`${req.path} 路径不存在`
//   })
});
module.exports = app;
