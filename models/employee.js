const Sequelize = require('sequelize');
const Mysql  = require('../lib/db');//引入数据库配置信息

const Employee = Mysql.define('employee', {//Employee
        name:  {
            type: Sequelize.STRING,
            allowNull: false,
            get: function()  {
                var title = this.getDataValue('title');
                // 'this' allows you to access attributes of the instance
                return this.getDataValue('name') + ' (' + title + ')';
            },
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            set: function(val) {
                this.setDataValue('title', val.toUpperCase());
            }
        }
    });
    // Employee.create({ name: 'John Doe', title: 'senior engineer' })
    // .then(function(employee) {
    //     console.log(employee.get('name')); // John Doe (SENIOR ENGINEER)
    //     console.log(employee.get('title')); // SENIOR ENGINEER
    // })
module.exports = Employee;