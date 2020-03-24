var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer  = require('multer');
let User = require('../models/user')
var {
	resSuccess,
	resError,
	getLocalIP
} = new require('../lib/util');


// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, 'public/images/');    
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);  
    }
});
// 创建文件夹
var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder); 
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = './public/images/';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });


/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});
/**
 * @api {post} /users/regest 用户注册
 * @apiDescription 用户注册
 * @apiName regest
 * @apiGroup users
 * @apiParam {string} username 用户名
 * @apiParam {string} password 密码
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *       "status" :200 
 *       "data" : "null",
 *       "msg" : "success"
 *  }
 * @apiSampleRequest http://localhost:8899/users/regest
 * @apiVersion 1.0.0
 * 
 */
//注册用户
router.post("/regest", (req, res, next) => {
	User.findCreateFind({
		defaults: {
			username: req.body.username,
			password: req.body.password
		},
		where: {
			username: req.body.username,
		}
	}).then((result) => {
		if (result[1]) {
			resSuccess(res, 200, null)
		} else {
			resError(res, 202, "用户已注册")
		}
	}).catch((e) => {
		resError(res, 500, e)
	})
})
/** 
 * @api {post} /users/login 用户登录
 * @apiDescription 登录
 * @apiName login
 * @apiGroup users
 * @apiParam {string} username 用户名
 * @apiParam {string} password 密码
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 * {
 * 		"result" : {
 *          "code" : "200",
 *          "msg" : "success"
 *      }
 * }
 * @apiSampleRequest http://localhost:8899/users/login
 * @apiVersion 1.0.0
*/
router.post("/login", (req, res, next) => {
	User.findOne({
		where: {
			username: req.body.username,
			password: req.body.password
		}
	}).then((result) => {
		if (result) {
			req.session.userName = req.body.username;
			req.session.userId = result.id
			resSuccess(res, 200, {
				id: result.id
			})
		} else {
			resError(res, 500, '账号或密码错误')
		}

	}).catch((e) => {
		resError(res, 500, e)
	})
})
/**
 * @api {post} /users/logout 退出登录
 * @apiDescription 用户退出登录
 * @apiName logout
 * @apiGroup users
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 * {
 * 		"result" : {
 *          "code" : "200",
 *          "msg" : "success"
 *      }
 * }
 * @apiSampleRequest http://localhost:8899/users/logout
 * @apiVersion 1.0.0
 */
router.get('/logout', async (req, res, next) => {
	req.session.userName = null; // 删除session
	req.session.userId = null
	resSuccess(res, 200, "已退出登录")
})
//修改用过密码
router.post('/upPassword', (req, res, next) => {
	User.update({
		password: req.body.password
	}, {
		where: {
			username: req.body.username
		}
	}).then((result) => {
		if (result[0]) {
			resSuccess(res, 200, "修改成功")
		} else {
			resError(res, 505, '修改失败')
		}

	}).catch(() => {
		resError(res, 500, e)
	})
})
// //删除用户
router.post('/delUserById', (req, res, next) => {

	User.destroy({
		where: {
			id: req.body.userId
		}
	}).then(function (result) {
		if (result) {
			resSuccess(res, 200, '成功')
		} else {
			resSuccess(res, 200, '失败')
		}
	}).catch(function (e) {
		resError(res, 500, e)
	})

})
//更新用户资料

/** 
 * @api {get} /users/findUserByid 用过id查找用户信息
 * @apiDescription 查找用户信息
 * @apiName findUserByid
 * @apiGroup users
 * @apiSuccess {json} result
 * @apiSampleRequest http://localhost:8899/users/findUserByid
 * @apiVersion 1.0.0
*/
router.get('/findUserByid', function (req, res, next) {
	var id = req.query.id
	if(id){
		User.findOne({
			where: {
				id: id
			}
		}).then(function (result) {
			if (result) {
				resSuccess(res, 200, result)
			} else {
				resSuccess(res, 500, "用户不存在")
			}
		}).catch(function (err) {
			resError(res, 500, err)
		})
	}else {
		resError(res, 500, '参数不能为空')
	}
	
})

/** 
 * @api {post} /users/saveFile 上传文件保存到本地
 * @apiDescription 上传文件保存到本地
 * @apiName saveFile
 * @apiGroup users
 * @apiParam {Binary} file 文件上传
 * @apiSuccess {json} result
 * @apiSuccess {Number} code 结果标识
 * @apiSuccess {String} message 结果说明
 * @apiSuccess {Object} data 结果数据
 * @apiSampleRequest http://localhost:8899/users/saveFile
 * @apiVersion 1.0.0
*/
router.post('/saveFile',upload.single('file'),(req, res, next)=>{
	var file = req.file;
	console.log(req.body.username)
	console.log(req.body.num)
    console.log('文件类型：%s', file.mimetype);
    console.log('原始文件名：%s', file.originalname);
    console.log('文件大小：%s', file.size);
	console.log('文件保存路径：%s', file.path);

	res.json({
		status:200,
		path:'http://localhost:8899/' + file.path.replace('public\\', '')
	})
})
module.exports = router;