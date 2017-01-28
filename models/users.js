var User = require('../lib/mongo').User;

module.exports = {
    // 注册一个用户  用数据库用户模型
    create: function create(user) {
    return User.create(user).exec();//将用户信息写入数据库，并注册
  },

     // 通过用户名获取用户信息
    getUserByName: function getUserByName(name) {
        return User
        //返回数据库中满足条件的第一个文档，或者在没有满足条件文档的情况下返回null。
          .findOne({ name: name })
          .addCreatedAt()
          .exec();//匹配满足条件的
    }
};  