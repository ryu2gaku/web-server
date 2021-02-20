# Express

## 1. 使用 express-generator 快速搭建项目框架

```sh
$ npx express-generator
```

生成目录（使用 pug 视图引擎）

```sh
.
├── package.json
├── app.js  # 入口文件
├── bin
│   └── www # 配置文件
├── public  # 静态资源
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes  # 路由
│   ├── index.js
│   └── users.js
└── views   # 视图
    ├── error.pug
    ├── index.pug
    └── layout.pug
```

安装所有依赖包

```sh
$ npm install
```

默认在 `package.json` 文件中会自动生成一个快速启动的脚本，执行 `npm start` 即可以启动项目。

```js
{
  "scripts": {
    "start": "node ./bin/www"
  },
}
```

## 2. 中间件

中间件的概念：

- 中间件就是一个函数
- 中间件可以处理请求，也可以处理响应
- 中间件有一个 `next` 函数
- 中间件算是客户端对服务器请求的拦截器，比如当客户端发送请求接口时，需要对接口做权限的验证，这时就可以使用中间件
- Express 中有五大中间件：应用程序中间件、路由中间件、异常处理中间件、内置中间件、第三方中间件
- 使用 `use` 关键字，执行中间件函数

中间件的特点：

- 中间件可以执行任何代码
- 中间件可以更改请求和响应的对象 `req` 和 `res`
- 中间件可以决定是否要结束响应周期，如果不写 `next()`，等于就停止响应了；加上 `next()`，表示继续调用栈的下一个中间件，或执行下一个函数；

### 2.1 应用程序中间件

```js
const express = require("express");
const path = require("path");
const app = express();

// 定义中间件
// ~~~~~~~~~~~~~~~~
// 定义了第一个中间件
var myLogger = function (req, res, next) {
  console.log("...");
  // 转向下一个路由，中间件
  next();
};
// 定义了第二件中间件
var requestTime = function (req, res, next) {
  console.log(new Date().getTime());
  next();
};

// 使用中间件
// ~~~~~~~~~~~~~~~~
// 使用中间件 myLogger
app.use(myLogger);
// 可以同时使用多个中间件
app.use(requestTime, myLogger);

// 当请求路径为 / 时，执行这个函数
app.get("/", function (req, res) {
  res.send("hello world");
});

// 监听服务
app.listen(3000, () => {
  console.log("localhost start 3000 ...");
});
```

### 2.2 路由中间件

`app.js` 文件

```js
const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./user");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 当请求的路径开头是 /user 时，跳转到 /user.js 文件中处理
app.use("/user", userRouter);

app.listen(3000, () => {
  console.log("localhost start 3000 ...");
});
```

`user.js` 文件

```js
const express = require("express");
// 定义路由
var router = express.Router();

// 当请求的路径为 /user/:id 时，执行这个中间件函数
router.use("/:id", function (req, res, next) {
  console.log("id 拦截器，可以做一些权限的验证");
  next();
});

// 当请求的接口为 /getname 时，执行这个函数
router.get("/getname", function (req, res) {
  // 可以设置响应头信息
  res.setHeader("Content-Type", "text/html");
  // 返回数据，res.json() 表示返回的数据为 json 格式
  res.json({
    name: "hanye",
    age: 20,
  });
});

// 当请求的接口为 /add 时，执行这个函数
router.post("/add", function (req, res) {
  // 用 req.body 获取 post 数据，需要装 body-parser 中间件
  console.log(req.body);
  res.send(req.body);
});

// 当请求的接口为 /getinfo 时，执行这个函数
// 例如：http://localhost:3000/user/getinfo?username=zhangsan&age=20
router.get("/getinfo", function (req, res) {
  console.log(req.query); // {username:"zhangsan",age:20}
  res.send(req.query);
});

module.exports = router;

// 获取数据的方式
// ~~~~~~~~~~~~
// req.body   获取 post 方式传过来的数据，需要装 body-parser 中间件
// req.query  获取 get 方式，形式为 ?name=zhangesan&age=18
//            中的 name 和 age 的值，不需要配置任何中间件
// req.params 获取 get 方式，形式为 /user/:id/age/:num
//            中的 id 和 num 的值
// res.json() 表示返回的数据为 json 格式
```

### 2.3 异常处理中间件

```js
/**
 * 异常处理中间件中必须要有四个参数，且参数的顺序不能乱 (err, req, res, next)
 * 该中间件通常写在最后的位置
 */
const express = require("express");
const app = express();

// 例如当一个中间件抛出异常时，会触发异常处理中间件
router.get("/getinfo", function (req, res) {
  throw new Error("error message");
});

// 按照错误优先的原则，err 参数在第一个位置
app.use(function (err, req, res, next) {
  console.log(err.stack);
  // 返回错误信息
  res.status(400).send("somting is wrong!");
});
```

### 2.4 内置中间件

```js
// 设置静态资源目录，比如 html、css 等
express.static();

// 将请求的数据转成 json 格式，express 需要是 4.16+ 版本
// 不过在项目中我们一般都使用 body-parser.josn()，body-parser 的功能更多
express.json();

// 使用系统的模块 querystring 来处理参数，express 需要是 4.16+ 版本
// 一般也都是使用 body-parser.urlencoded() 来替代
express.urlencoded();
```

### 2.5 第三方中间件

使用第三方中间件之前，要先进行安新。

## 3. 响应 Response

### 3.1 res.append

```js
// 响应 HTTP 头添加信息
// res.append(field [, value])

// Appends the specified `value` to the HTTP response header `field`.
// If the header is not already set, it creates the header with the specified value.
// The `value` parameter can be a string or an array.

// Note: calling `res.set()` after `res.append()` will reset the previously-set header value.

res.append("Link", ["<http://localhost/>", "<http://localhost:3000/>"]);
res.append("Set-Cookie", "foo=bar; Path=/; HttpOnly");
res.append("Warning", "199 Miscellaneous warning");
```

### 3.2 res.attachment()

```js
// 设置附件响应头
// res.attachment([filename])

// Sets the HTTP response `Content-Disposition` header field to “attachment”.
// - 设置 HTTP 响应头 Content-Disposition 字段值为 'attachment'（附件）
// If a `filename` is given, then it sets the Content-Type
// based on the extension name via `res.type()`,
// and sets the `Content-Disposition` “filename=” parameter.
// - 如果已给出文件名，那么设置 Content-Type 字段值为 res.type() 获取的文件扩展名，
// - 并在 Content-Disposition 字段中设置 'filename=' 参数

res.attachment();
// Content-Disposition: attachment

res.attachment("path/to/logo.png");
// Content-Disposition: attachment; filename="logo.png"
// Content-Type: image/png
```

### 3.3 res.type()

```js
// 设置 Content-Type
// res.type(type)

// Sets the `Content-Type` HTTP header to the MIME type
// as determined by `mime.lookup()` for the specified `type`.
// - 使用 mime.lookup() 返回的 type 值设置 Content-Type 响应头
// If `type` contains the “/” character,
// then it sets the `Content-Type` to `type`.

res.type(".html");
// => 'text/html'
res.type("html");
// => 'text/html'
res.type("json");
// => 'application/json'
res.type("application/json");
// => 'application/json'
res.type("png");
// => 'image/png'
```

### 3.4 res.download()

```js
// res.download(path [, filename] [, fn])

// Transfers the file at `path` as an “attachment”.
// - 传输 'attachment' 路径对应的文件
// Typically, browsers will prompt the user for download.
// - 通常浏览器会提示用户下载
// By default, the `Content-Disposition` header “filename=” parameter
// is `path` (this typically appears in the browser dialog).
// - 默认情况下，会使用 Content-Disposition 头字段中 'filename=' 中的路径
// Override this default with the `filename` parameter.
// - 如果需要重写下载文件名可以使用 filename 可选参数

// When an error occurs or transfer is complete,
// the method calls the optional callback function `fn`.
// - 如果下载发生错误或传输完成，会调用 fn 可选参数
// This method uses `res.sendFile()` to transfer the file.
// - 这个方法传输文件会调用 res.sendFile() 方法

res.download("/report-12345.pdf");

res.download("/report-12345.pdf", "report.pdf");

res.download("/report-12345.pdf", "report.pdf", function (err) {
  if (err) {
    // 处理错误，但响应可能已经部分发送
    // 这时应该检查 res.headersSent
  } else {
    // 下载...
  }
});
```

### 3.5 res.end()

```js
// 结束响应
// res.end([data] [, encoding])

// Ends the response process.
// - 发送数据后结束响应
// This method actually comes from Node core,
// specifically the `response.end()` method of `http.ServerResponse`.
// - 这个方法来自于 Node HTTP 模块 http.ServerResponse 中的 response.end() 方法

// Use to quickly end the response without any data.
// If you need to respond with data,
// instead use methods such as `res.send()` and `res.json()`.

res.end();
res.status(404).end();
```

### 3.6 res.json()

```js
// 响应 JSON 格式
// res.json([body])

// Sends a JSON response.
// @发送一个 JSON 格式的响应
// This method sends a response (with the correct content-type)
// that is the parameter converted to a JSON string using `JSON.stringify()`.

// The parameter can be any JSON type,
// including object, array, string, Boolean, number, or null,
// and you can also use it to convert other values to JSON.

res.json(null);
res.json({ user: "tobi" });
res.status(500).json({ error: "message" });
```

### 3.7 res.jsonp()

```js
// 响应 JSONP 格式
// res.jsonp([body])

// Sends a JSON response with JSONP support.
// - 向一个支持 JSONP 的请求发送 JSON 响应。
// This method is identical to `res.json()`,
// except that it opts-in to JSONP callback support.
// - 这个方法等同于 res.json()，但会加入对 JSONP 的支持。

res.jsonp(null);
// => null

res.jsonp({ user: "tobi" });
// => { "user": "tobi" }

res.status(500).jsonp({ error: "message" });
// => { "error": "message" }

// By default, the JSONP callback name is simply `callback`.
// Override this with the `jsonp callback name` setting.

// ?callback=foo
res.jsonp({ user: "tobi" });
// => foo({ "user": "tobi" })

app.set("jsonp callback name", "cb");

// ?cb=foo
res.status(500).jsonp({ error: "message" });
// => foo({ "error": "message" })
```

### 3.8 res.redirect()

```js
// URL 重定向
// res.redirect([status,] path)

// Redirects to the URL derived from the specified `path`, with specified `status`,
// a positive integer that corresponds to an `HTTP status code`.
// - 将 URL 重定向到 path，并设置指定的状态码 status（如果指定）
// If not specified, `status` defaults to “302 “Found”.
// - 如果不指定状态码时，默认为 "302 Found"

res.redirect("/foo/bar");
res.redirect("http://example.com");
res.redirect(301, "http://example.com");
res.redirect("../login");
```

### 3.9 res.render()

```js
// 渲染视图
// res.render(view [, locals] [, callback])

// Renders a `view` and sends the rendered HTML string to the client. Optional parameters:
// - 渲染视图并将渲染后的 HTML 发送到客户端。可选参数：

// + locals, an object whose properties define local variables for the view.
// - 视图使用的本地变量对象
// + callback, a callback function.
// If provided, the method returns both the possible error and rendered string,
// but does not perform an automated response.
// When an error occurs, the method invokes next(err) internally.

// The `view` argument is a string that is the file path of the view file to render.
// This can be an absolute path, or a path relative to the views setting.
// If the path does not contain a file extension,
// then the view engine setting determines the file extension.
// If the path does contain a file extension,
// then Express will load the module for the specified template engine (via require())
// and render it using the loaded module’s __express function.

// 发送渲染后的视图
res.render("index");

// 如果指定了回调函数，则渲染后的 HTML 需要显式的发送
res.render("index", function (err, html) {
  res.send(html);
});

// 向视图传递一个本地变量
res.render("user", { name: "Tobi" }, function (err, html) {
  // ...
});
```

### 3.10 res.send()

```js
// 发送响应
// res.send([body])

// Sends the HTTP response.
// - 发送 HTTP 响应
// The `body` parameter can be a `Buffer` object, a `String`, an object, or an `Array`.

res.send(Buffer.from("whoop"));
res.send({ some: "json" });
res.send("<p>some html</p>");
res.status(404).send("Sorry, we cannot find that!");
res.status(500).send({ error: "something blew up" });

// This method performs many useful tasks for simple non-streaming responses:
// For example, it automatically assigns the `Content-Length` HTTP response header field (unless previously defined)
// and provides automatic HEAD and HTTP cache freshness support.
// - 这个方法自动做了很多简单有效的工作，如：自动添加 Content-Length 响应头，
// - 并自动添加 HTTP 缓存新鲜支持

// When the parameter is a `Buffer` object,
// the method sets the `Content-Type` response header field to “application/octet-stream”,
// unless previously defined as shown below:
// - 当发送一个 Buffer 数据时，Content-Type 响应头字段为 "application/octet-stream"，除非手动指定

res.set("Content-Type", "text/html");
res.send(Buffer.from("<p>some html</p>"));

// When the parameter is a `String`, the method sets the `Content-Type` to “text/html”:
// - 当发送一个字符串数据时，Content-Type 响应头字段会自动设置为 "text/html"

res.send("<p>some html</p>");

// When the parameter is an `Array` or `Object`, Express responds with the JSON representation:

res.send({ user: "tobi" });
res.send([1, 2, 3]);
```

### 3.11 res.sendStatus()

```js
// 设置响应状态
// res.sendStatus(statusCode)

// Sets the response HTTP status code to `statusCode`
// and send its string representation as the response body.
// - 设置 statusCodeHTTP 状态码，并响应一个状态描述信息

res.sendStatus(200); // equivalent to res.status(200).send('OK')
res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')

// If an unsupported status code is specified,
// the HTTP status is still set to `statusCode` and the string version of the code is sent as the response body.
// - 如果是未知的 HTTP 状态码，则发送的状态码与状态描述一样

res.sendStatus(9999); // equivalent to res.status(9999).send('9999')
```

### 3.12 res.set()

```js
// 设置 HTTP 响应头
// res.set(field [, value])

// Sets the response’s HTTP header `field` to `value`.
// - 设置 HTTP 响应头 field 的值为 value
// To set multiple fields at once, pass an object as the parameter.
// - 如果一次性设置多个头，可以传入一个设置对象

res.set("Content-Type", "text/plain");

res.set({
  "Content-Type": "text/plain",
  "Content-Length": "123",
  ETag: "12345",
});

// Aliased as `res.header(field [, value])`.
// - 这个方法是 res.header(field [, value]) 的
```

### 3.13 res.status()

```js
// 设置状态码
// res.status(code)

// Sets the HTTP status for the response.
// - 设置 HTTP 响应状态码
// It is a chainable alias of Node’s response.statusCode.

res.status(403).end();
res.status(400).send("Bad Request");
res.status(404).sendFile("/absolute/path/to/404.png");
```
