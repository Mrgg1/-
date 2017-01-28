var express = require('express');//web 框架
var path = require('path');//文件路径
var session = require('express-session');//session 中间件
var MongoStore = require('connect-mongo')(session);//将 session 存储于 mongodb，结合 express-session 使用
var flash = require('connect-flash');//页面通知提示的中间件，基于 session 实现
var config = require('config-lite');//读取配置文件  读取config中配置文件
var routes = require('./routes');//引用路由文件
var pkg = require('./package');//全局配置
var winston = require('winston');//日志  如成功日志，错误日志，可用于后期调试
var expressWinston = require('express-winston');//基于 winston 的用于 express 的日志中间件

  
var app = express();
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));
//session 中间件，设置cookie和数据库中session
app.use(session({
  name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}));
// flash 中间价，用来显示通知
app.use(flash());

//处理表单与文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtensions: true
}));

//设置模板全局变量/常量，基于pkg,oackage.json文件中设置
app.locals.blog = {
  title: pkg.name,  
  description: pkg.description
};

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});


//正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/sussess.log'
    })
  ]
}));

//错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
})); 

//错误页面
app.use(function (err, req, res, next){
  res.render('error', {
    error: err
  });
});

 
routes(app);//将路由引入


//error page
app.use(function (err, req, res, next){
  res.render('error', {
    error: err
  });
});

if(module.parent) {//返回引用该模块的模块,如果有其他文件引用，则把app传出去
  module.exports = app;
} else {
  app.listen(config.port, function(){ //监听config文件中的端口，启动程序
    console.log(`${pkg.name} listening on port ${config.port}`);
  });
}