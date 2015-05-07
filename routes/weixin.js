/**
 * Created by amberglasses on 15/3/30.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var webchat = require('wechat-enterprise');
var sign = require('./sign.js');
var request = require('request');
var fs = require('fs');
var AV = require('avoscloud-sdk').AV;
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
console.log(config);
var api = new webchat.API(config.corpId, config.secret, config.agentId, function (callback) {
    var currentDate = new Date();
    var expireTime = new Date().setDate(config["expireTime"]);

    // 比较是否过期，没过期直接返回token
    if (currentDate >= expireTime) {
        console.log('--------------------------------');
        console.log('-----------token超时------------');
        api.getAccessToken(function (err, token) {
            if (err) return callback(err);
            // 记录token值
            config["access_token"] = token.accessToken;
            // 记录下一次过期时间点
            config["expireTime"] = token.expireTime;
            console.log('-----------token重新获取------------');
            console.log(token);

            callback(null, token);
        });

    } else {
        console.log('-----------token未超时------------');
        console.log('-----------token已获取------------');
        console.log(config["access_token"]);

        callback(null, config["access_token"]);
    }
});

///* GET users listing. */
//router.get('/', function (req, res) {
//    console.log(req.query.echostr);
//    var echostr = req.query.echostr;
//    var crypt = new WXBizMsgCrypt(config.Token, config.EncodingAESKey, config.CorpID);
//    console.log("crypt: " + crypt);
//
//    var newechostr = crypt.decrypt(echostr);
//    console.log(newechostr);
//
//    res.end(newechostr.message);
//});

router.post('/getJsConfig', function (req, res) {
    console.log(config);
    var url = req.body.url;
    if (!url && url == "") {
        res.json("参数\"page\"不能为空！");
    }

    api.getLatestToken(function (err, token) {
        request.get({url: 'https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=' + token}, function (error,response,body) {
            if(err){
                return res.json(error);
            }
            var js_ticket = body.ticket;
            var sign_obj = sign(js_ticket, url);
            console.log(sign_obj);

            var js_config = {
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: config.corpId, // 必填，企业号的唯一标识，此处填写企业号corpid
                timestamp: sign_obj.timestamp, // 必填，生成签名的时间戳
                nonceStr: sign_obj.nonceStr, // 必填，生成签名的随机串
                signature: sign_obj.signature,// 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'chooseImage',
                    'previewImage',
                    'uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            };

            console.log('------------------------------');
            console.log(js_config);
            res.json(js_config);
        });
    });
});

router.post('/getAuthUrl', function (req, res) {
    var page = req.body.page;
    if (!page && page == "") {
        res.json("参数\"page\"不能为空！");
    }

    var url = api.getAuthorizeURL('http://crew.dianyingren.com/post_save.html', 'lijun2015', 'snsapi_userinfo');

    res.json({
        authUrl: url
    });
});

//router.post('/userSignUp', function (req, res) {
//    var code = req.body.code,
//        state = req.body.state;
//    if (!code && code == "") {
//        res.json("参数\"code\"不能为空！");
//    }
//
//    client.getAccessToken(code, function (err, result) {
//        //var accessToken = result.data.access_token;
//        var openid = result.data.openid;
//        client.getUser(openid, function (err, result) {
//            if (err) {
//                res.json(err);
//            }
//
//            res.json(result);
//        });
//    });
//});

router.post('/sendMessage', function (req, res) {
    api.send({
        "touser": "lijun|"
    }, {
        "msgtype": "text",
        "text": {
            "content": "Holiday Request For Pony(http://xxxxx)"
        },
        "safe": "0"
    }, function (err, result) {
        if (err) {
            res.json(err);
        }

        console.log(result);

        res.json(result);
    });

    //var userId = req.body.userId,
    //    postId = req.body.postId,
    //    text = "";
    //console.log(req.body);
    //if (!userId && userId == "") {
    //    res.json("参数\"userId\"不能为空！");
    //}
    //if (!postId && postId == "") {
    //    res.json("参数\"postId\"不能为空！");
    //}
    //
    //var post = AV.Object.extend('post');
    //var post_query = new AV.Query(post);
    //post_query.include("username");
    //post_query.get(postId, function (post) {
    //    console.log("post.get('username').get('authData')" + post.get('username').get('authData'));
    //    var openId = post.get('username').get('authData').weixin.openid;
    //    var query = new AV.Query(AV.User);
    //    query.get(userId, {
    //        success: function (user) {
    //            // Do stuff
    //            text = "活动提醒\n" +
    //            "有人报名了您发起的活动\n" +
    //            "\n" +
    //            "姓名:" + user.get("authData").weixin.nickname + "\n" +
    //            "联系方式:" + user.get("mobilePhoneNumber") + "\n" +
    //            "\n" +
    //            "<a href=\"http://fuwuhao.dianyingren.com/post_detail.html?id=" + postId + "\">点击查看详情</a>"
    //            "\n";
    //            console.log(user.get("authData").weixin);
    //            console.log(user.get("authData").weixin.openid);
    //
    //            api.sendText(openId, text, function (err, result) {
    //                if (err) {
    //                    res.json(err);
    //                }
    //
    //                console.log(result);
    //
    //                res.json(result);
    //            });
    //        }
    //    });
    //});

});

//router.post('/uploadImage', function (req, res) {
//    var serverId = req.body.serverId;
//    if (!serverId && serverId == "") {
//        return res.json("参数\"serverId\"不能为空！");
//    }
//
//    api.getMedia(serverId, function (err, result, response) {
//        if (err) {
//            return res.json("err:" + err);
//        }
//
//        var now = new Date();
//        var file = new AV.File(now.getTime() + ".png", result);
//        file.save().then(function (file) {
//            console.log(file);
//            //res.json("success");
//            // Execute any logic that should take place after the object is saved.
//            res.json({id: file.id, url: file.url()});
//        }, function (error) {
//            // The file either could not be read, or could not be saved to AV.
//            res.json({error: error.message});
//        });
//    });
//});
//router.get('/createMenu', function (req, res) {
//    var menu = {
//        "button": [{
//            "type": "view",
//            "name": "易生活",
//            "url": "http://fuwuhao.dianyingren.com/shop_index.html"
//        }, {
//            "type": "view",
//            "name": "邻里圈",
//            "url": "http://fuwuhao.dianyingren.com/post_index.html"
//        }, {
//            "type": "view",
//            "name": "个人中心",
//            "url": "http://fuwuhao.dianyingren.com/user_detail.html?code="
//        }]
//    };
//
//    api.createMenu(menu, function (err, result) {
//        if (err) {
//            res.json(err);
//        }
//
//        res.json(result);
//    });
//});
//
//router.get('/removeMenu', function (req, res) {
//
//    api.removeMenu(function (err, result) {
//        if (err) {
//            res.json(err);
//        }
//
//        res.json(result);
//    });
//});

module.exports = router;
