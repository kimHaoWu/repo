var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multipart = require('connect-multiparty');
const expressSession=require('express-session'); //1

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var YoujiRouter = require('./routes/Youji')
var uploadRouter = require('./routes/upload')
var GoodRouter = require('./routes/Goods')
var AdminuserRouter = require('./routes/Adminuser')
var Admincenter = require('./routes/Admincenter')
var work = require('./routes/work')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//跨域

app.use('*', function (req, res, next){
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");//允许源访问，前端访问路径为“http://localhost:8080”
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "POST,GET,DELETE,OPTIONS");
  next();
});

app.use(expressSession({
  secret: 'asdfISDFs!ks',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:2*60*1000 }
}));




app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/notes',YoujiRouter)
app.use('/upload',uploadRouter);
app.use('/goods',GoodRouter);
app.use('/adminuser',AdminuserRouter)
app.use('/admincenter',Admincenter)
app.use('/work',work)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
