const Sequelize = require('sequelize');
const Mysql = require('../lib/db'); //引入数据库配置信息

const Foo = Mysql.define('foo', { //Foo
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    // type:Sequelize.INET
}, {
    getterMethods: {
        fullName: function () {
            return this.firstname + ' ' + this.lastname
        }
    },
    setterMethods: {
        fullName: function (value) {
            var names = value.split(' ');

            this.setDataValue('firstname', names.slice(0, -1).join(' '));
            this.setDataValue('lastname', names.slice(-1).join(' '));
        },
    }
});
// Foo.create({ firstname: 'John Doe', lastname: 'senior engineer' })

// .then(function(foo) {
//     // console.log(foo); // John Doe (SENIOR ENGINEER)
   
// })
module.exports = Foo;