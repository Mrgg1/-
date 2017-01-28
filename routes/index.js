module.exports = function(app) {
  app.get('/',function(req, res){
    res.redirect('/posts');
  });

    // 将路由挂载至应用
//app.use('/', router)
  app.use('/signup', require('./signup'));
  app.use('/signin', require('./signin'));
  app.use('/signout', require('./signout'));
  app.use('/posts', require('./posts'));
 
  //404
  app.use(function (req, res){
    if(!res.headersSent) {//没有请求其上页面，则不存在res的响应
      res.render('404');//渲染错误页面
    } 
  });
};
