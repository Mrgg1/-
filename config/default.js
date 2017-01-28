module.exports = {
    port: 3001,
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge: 25900000000
    },
    mongodb: 'mongodb://localhost:27017/myblog1'
};