const Sequelize = require('sequelize');//引入sequelize依赖
const mysql = {//本地mysql库信息配置
    host: process.env.HOST,//地址
    user: process.env.user,//用户名
    password: process.env.password,//密码
    database: process.env.database,//数据库名
    dialect: 'mysql'//数据库类型
};

const db = new Sequelize(mysql.database, mysql.user, mysql.password, {
    host: mysql.host,
    dialect: mysql.dialect,
    pool: {
        max: 10,//最大连接池
        min: 0,
        idle: 10000
    }
});//创建连接件程序

db.authenticate().then(function() {
    console.log("数据库连接成功!");
}).catch(function(err) {
    //数据库连接失败时打印输出
    console.error(err);
    throw err;
});

module.exports = db;//导出