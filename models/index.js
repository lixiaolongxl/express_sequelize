const Mysql  = require('../lib/db');//引入数据库配置信息
var User = require('./user');//用户表
// var Project = require('./project');
// var Employee = require('./employee');
// var foo = require('./foo');
// var valiFoo = require('./valiFoo');


Mysql.sync({
    force: false,//是否清空数据库表
}).then(function() {
    console.log('表创建成功！');
});

module.exports = {
    User: User,
    // Project:Project,
    // Employee:Employee,
    // foo:foo,
    // valiFoo:valiFoo
};