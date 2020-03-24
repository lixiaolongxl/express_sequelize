var express = require('express');
var router = express.Router();

var GeTui = require('../GETUI_SDK/GT.push');
var Target = require('../GETUI_SDK/getui/Target');
var SingleMessage = require('../GETUI_SDK/getui/message/SingleMessage');
var NotificationTemplate = require('../GETUI_SDK/getui/template/NotificationTemplate');

//别名推送方式
//var ALIAS = '';
// http的域名
var HOST = 'http://sdk.open.api.igexin.com/apiex.htm';
var APPID = 'SH7S52HnaO9hxEEcvsMs66';                
var APPKEY = 'FTEOcZ0KnJ9x8u9hYaESK8';            
var MASTERSECRET = 'e78mpJyywaAhy1mVtdp5eA';

var CID = '20e9bdae3cf6dd39103885fc8823389f';

var gt = new GeTui(HOST, APPKEY, MASTERSECRET);

function pushMessageToSingle(){
    var template = TransmissionTemplateDemo();
    //单推消息体
    var message = new SingleMessage({
        isOffline: true,                        //是否离线
        offlineExpireTime: 3600 * 12 * 1000,    //离线时间
        data: template                          //设置推送消息类型
    });
    //接收方
    var target = new Target({
        appId: APPID,
        clientId: CID
        //alias:ALIAS
    });

    target.setAppId(APPID).setClientId(CID);

    gt.pushMessageToSingle(message, target, function(err, res){
        if(err != null && err.exception != null && err.exception instanceof  RequestError){
            var requestId = err.exception.requestId;
            console.log(err.exception.requestId);
            //发送异常重传
            gt.pushMessageToSingle(message,target,requestId,function(err, res){
                console.log(err);
                console.log(res);
                
            });
        }

        console.log(">>>>>>>>>>>>>>>>");
        console.log(res);
    })

}
function TransmissionTemplateDemo(){
    var template =  new NotificationTemplate({
        // appId: APPID,
        // appKey: APPKEY,
        // transmissionType: 1,
        // transmissionContent: `{
        //     title:李小龙,
        //     dis:测试描述,
        //     type:3
        // }`
        appId: APPID,
        appKey: APPKEY,
        title: '请填写通知标题',
        text: '请填写通知内容',
        // logoUrl: 'http://wwww.igetui.com/logo.png',
        isRing: true,
        isVibrate: true,
        isClearable: false,
        transmissionType: 2,
        transmissionContent: '测试离线2'
    });
    //iOS推送需要设置的pushInfo字段
    //var payload = new APNPayload();
    //var alertMsg = new SimpleAlertMsg();
    //alertMsg.alertMsg="AlertMsg";
    //payload.alertMsg = alertMsg;
    //payload.badge=5;
    //payload.contentAvailable =1;
    //payload.category="ACTIONABLE";
    //payload.sound="test1.wav";
    //payload.customMsg.payload1="payload";
    //template.setApnInfo(payload);
    return template;
}


router.get('/', function (req, res, next) {

    gt.connect(function () {
        pushMessageToSingle();
    });

    
})
module.exports = router;
