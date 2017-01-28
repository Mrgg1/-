var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function(req, res, next) {
  // 清空 session 中用户信息，session（服务器）不存在该用户，下次请求，不再响应该用户，不再保持状态
  req.session.user = null;
  req.flash('success', '登出成功');
  // 登出成功后跳转到主页
  res.redirect('/posts');
});

module.exports = router;
