var express = require('express');
var router = express.Router();
const qiniu = require("qiniu");

var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;


/* GET home page. */
router.get('/index', function (req, res, next) {
	// res.render('index', { title: 'ExpressTest' });
	if (req.session.userName) { //判断session 状态，如果有效，则返回主页，否则转到登录页面
		res.json({
			status: 200,
			msg: 'success',
			data: req.session.userName,
			id:req.session.userId
		})
	} else {
		res.json({
			status: 403,
			msg: '登录超时'
		})
	}
	// http://q7dctlcne.bkt.clouddn.com/test.png
});
router.get('/qiniu', function (req, res, next) {
	//qiniu文件上传
	var accessKey = 'tpTfD5s92KmTuhac_wx4JaCDUh0fb-gKywRE0Mci';
	var secretKey = 'JaqtmkzwMi5hdifrM3WxFZcAfJqzYVhiPbz4lXyH';
	var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
	var bucket='lxlimages';
	var options = {
		scope: bucket,
	  };

	var putPolicy = new qiniu.rs.PutPolicy(options);
	//获取上传uploadToken
	var uploadToken=putPolicy.uploadToken(mac);
	// console.log(uploadToken)
	  


	var localFile = "public/images/1584112380522-450_800.jpg";
	var formUploader = new qiniu.form_up.FormUploader(config);
	var putExtra = new qiniu.form_up.PutExtra();
	var key='test1.png';
	formUploader.putFile(uploadToken,key,localFile,putExtra,function(respErr,respBody, respInfo){
		if (respErr) {
			throw respErr;
		}
		if (respInfo.statusCode == 200) {
			// console.log(respBody);
			res.send({
				status:200,
				uploadToken:uploadToken,
				respBody:respBody,
				msg:'成功'
			})
		  } else {
			
			res.send({
				status:200,
				respBody:respInfo,
				msg:'失败'
			})
		  }
	})
});

module.exports = router;