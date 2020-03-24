const Sequelize = require('sequelize');
const Mysql  = require('../lib/db');//引入数据库配置信息

const User = Mysql.define('user', {//创建一个User对象，info是表名
        id: {
            field: 'id',//对应数据库的名字
            primaryKey: true,//自增
            type: Sequelize.INTEGER,//类型
            autoIncrement: true,
        },
        username: {
            field: 'username',
            type: Sequelize.STRING(16),
        },
        password: {
            field: 'password',
            type: Sequelize.STRING(16),
            allowNull: false,
        },
        ip:{
            field:'ip',
            type:Sequelize.STRING,
            validate:{
                isIP: true,
            }
        },
        email:{ //邮箱
            field:'email',
            type:Sequelize.STRING,
            validate:{
                isEmail: true,
            }
        },
        picture:{ //用户头像
            field:'picture',
            type:Sequelize.STRING,
        },
        birthday:{ //生日
            field:'birthday',
            type:Sequelize.STRING,
        },
        age:{
            field:'age',
            type:Sequelize.INTEGER,
            defaultValue:0,
            validate:{
                min: 0, max: 100
            }
        },
        phone:{
            field:"phone",
            type:Sequelize.STRING,
            validate:{
                isPhone:function(value){
                    var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
                    if(value){
                        return false;
                    }
                    if(!phoneReg.test(value)){
                        throw new Error('请输入正确的手机号');
                    }else {
                        return true;
                    }
                }
            }
        },
        address:{
            field:"address",
            type:Sequelize.STRING,
            defaultValue:''
        },
        gender:{
            field:'gender',
            type:Sequelize.BOOLEAN,
            defaultValue:true //默认男
        }

    });



module.exports = User;