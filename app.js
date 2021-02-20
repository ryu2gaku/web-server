// Create HTTP Errors
// https://github.com/jshttp/http-errors
var createError = require("http-errors");
var express = require("express");
var path = require("path");
// Parse HTTP request cookies
// https://github.com/expressjs/cookie-parser
var cookieParser = require("cookie-parser");
// HTTP request logger middleware for node.js
// https://github.com/expressjs/morgan
var logger = require("morgan");

// 引入路由模块
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var boardRouter = require("./routes/board");
var uploadRouter = require("./routes/upload");
var downloadRouter = require("./routes/download");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views")); // 指定视图模板存储的位置
app.set("view engine", "pug"); // 设置视图模板引擎

// 将请求信息打印在控制台，便于开发调试
// dev 内置格式
// :method :url :status :response-time ms - :res[content-length]
// ~~~
// The :status token will be colored green for success codes,
// red for server error codes, yellow for client error codes,
// cyan for redirection codes, and uncolored for information codes.
app.use(logger("dev"));
// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static("node_modules"));

app.use("/", indexRouter); // 当请求地址为 host:3000 时，进入 indexRouter 处理
app.use("/users", usersRouter); // 当请求地址为 host:3000/users.. 时，进入 usersRouter 处理
app.use("/board", boardRouter);
app.use("/upload", uploadRouter);
app.use("/download", downloadRouter);

// catch 404 and forward to error handler
// 当请求地址不存在时，抛出 404 错误，就会执行下面的异常处理中间件
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// 异常处理中间件
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // 全局的配置信息
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // 参数是视图模板的名称
  res.render("error");
});

module.exports = app;
