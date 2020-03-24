const Sequelize = require('sequelize');
const Mysql = require('../lib/db'); //引入数据库配置信息

const valiFoo = Mysql.define('valiFoo', { //Foo
    foo: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true,
        }
    }
}, {
    classMethods: {
        method1: function () {
            return this.foo
        }
    },
    instanceMethods: {
        getfoo: function () {
            return this.foo
        }
    }
    
});

// console.log(valiFoo.method1())
// console.log(valiFoo.build().method2())

//同步表
// valiFoo.sync()
// valiFoo.create({
//     foo: '1094519437@qq.com'
// }).then(function(res){

// })

// .then(function (foo) {
//     // console.log(foo); // John Doe (SENIOR ENGINEER)

// }).catch(function (err) {
//     throw err
// })
module.exports = valiFoo;