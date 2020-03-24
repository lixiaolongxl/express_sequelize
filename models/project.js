const Sequelize = require('sequelize');
const Mysql = require('../lib/db'); //引入数据库配置信息

const Project = Mysql.define('project', { //project
    flag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    myDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    title: { type: Sequelize.STRING, allowNull: true},
    // 添加唯一（unique）约束后插入重复值会报错
    // unique属性可以是boolean 或 string类型
    // 如果为多个字段添加了相同的字符串那么将会是一个符合唯一键
    someUnique: {type: Sequelize.STRING, unique: true},
    uniqueOne: { type: Sequelize.STRING,  unique: 'compositeIndex'},
    uniqueTwo: { type: Sequelize.INTEGER, unique: 'compositeIndex'},
    //美爵对象
    states: {
        type:   Sequelize.ENUM,
        values: ['active', 'pending', 'deleted'],
        defaultValue:'active'
    }
    

}, {
    tableName: 'project', //表名
    timestamps: true, //默认情况下，Sequelize会将createdAt和updatedAt的属性添加到模型中，以便您可以知道数据库条目何时进入数据库以及何时被更新。请注意，如果您使用Sequelize迁移，则需要将createdAt和updatedAt字段添加到迁移定义中
    freezeTableName: true // 默认false修改表名为复数，true不修改表名，与数据库表名同步
});

module.exports = Project;