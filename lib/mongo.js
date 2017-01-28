var config = require('config-lite');//读取config中数据文件
var Mongolass = require('mongolass');//数据库驱动
var mongolass = new Mongolass();   //创建数据库实例，可以使用数据库方法
mongolass.connect(config.mongodb);//连接mongodb数据库地址

var moment = require('moment');   //时间格式化
var objectIdToTimestamp = require('objectid-to-timestamp');   //根据 ObjectId 生成时间戳

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) { 
        results.forEach(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});



exports.User = mongolass.model('User', {
    name: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },  //头像
    gender: { type: 'string', enum: ['m', 'f', 'x'] },  //性别
    bio: { type: 'string' }  //文章
});
exports.User.index({ name: 1 }, { unique: true }).exec();//根据用户名找到用户，用户名全局唯一
//exec()  返回一个数组，其中存放匹配的结果。如果未找到匹配，则返回值为 null。
//index() 方法创建name键的唯一索引.

exports.Post = mongolass.model('Post', {
    author: { type: Mongolass.Types.ObjectId },//时间戳 作者
    title: { type: 'string' },
    content: { type: 'string' },
    pv: { type: 'number' }//页面浏览量
});
exports.Post.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表

//每个文档都有唯一的"_id"值，来确保集合里面每个文档都能被唯一标识 _id=ObjectId(时间地点数字串)  _id=-1降序
//ObjectId可以生成时间戳  24 位长的 ObjectId 前 4 个字节是精确到秒的时间戳


exports.Comment = mongolass.model('Comment', {
    author: { type: Mongolass.Types.ObjectId },
    content: { type: 'string' },
    postId: { type: Mongolass.Types.ObjectId }   //文章Id，关联文章模板
});
exports.Comment.index({ postId: 1, _id: 1 }).exec();//通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Comment.index({ author: 1, _id: 1 }).exec();// ͨ通过用户 id 和留言 id 删除一个留言