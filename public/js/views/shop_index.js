(function ($) {
    loadwx(function () {
        $(".shopcontent").css("color","#e0690c");
        loading(function () {
            $(".shopcontent").on("click", function () {
                $(this).css("color","#e0690c");
                var shopid = $(this).attr("value");
                window.location.href = "shop_content.html?id=" + shopid;
            });

            $("#users").on("click", function () {
                $("#users").on("click", function () {
                    window.location.href = "user_detail.html?code=";
                });
            });
        });
    });

    function loading(callbak) {
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        //ject.createWithoutData('className',id);
        var load = 0;
        var shop = AV.Object.extend("shop");
        var query = new AV.Query(shop);
        query.equalTo("type","周边小店");
        query.find({
            success: function (arry) {
                console.log(arry);
                var shops = [];
                for (var i = 0; i < arry.length; i++) {
                    var object = arry[i];
                    shopid = object.id;
                    shopname = object.get("shopname");
                    shoptel = object.get("shoptel");
                    logo = object.get("logo");
                    var shop = {
                        id: shopid,
                        name: shopname,
                        tel: shoptel,
                        logo: logo
                    };
                    shops.push(shop);
                    console.log(shops);
                }
                var $tpl = $('#shop');
                var source = $tpl.text();
                var template = Handlebars.compile(source);
                var data = {shops: shops};
                var html = template(data);
                $tpl.before(html);
                load+=1
                if (load == 2) {
                    callbak();
                }
            }
        });
        query.equalTo("type","物业管理");
        query.find({
            success: function (arry) {
                console.log(arry);
                var shops = [];
                for (var i = 0; i < arry.length; i++) {
                    var object = arry[i];
                    shopid = object.id;
                    shopname = object.get("shopname");
                    shoptel = object.get("shoptel");
                    logo = object.get("logo");
                    var shop = {
                        id: shopid,
                        name: shopname,
                        tel: shoptel,
                        logo: logo
                    };
                    shops.push(shop);
                    console.log(shops);
                }
                var $tpl = $('#shop2');
                var source = $tpl.text();
                var template = Handlebars.compile(source);
                var data = {shops: shops};
                var html = template(data);
                $tpl.before(html);
                load+=1
                if (load == 2) {
                    callbak();
                }
            }
        });
    }

    function loadwx(callback) {
        var debug, appId, jslist, noncestr, signature, timestamp, jsApiList;
        $.ajax({
            method: "POST",
            url: "http://fuwuhao.dianyingren.com/weixin/getJsConfig",
            data: JSON.stringify({
                url: window.location.href
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                debug = result.debug;
                appId = result.appId;
                jslist = result.jsApiList;
                noncestr = result.nonceStr;
                signature = result.signature;
                timestamp = result.timestamp;
                jsApiList = result.jsApiList;
                wx.config({
                    debug: debug,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: appId, // 必填，公众号的唯一标识
                    timestamp: timestamp, // 必填，生成签名的时间戳
                    nonceStr: noncestr, // 必填，生成签名的随机串
                    signature: signature,// 必填，签名，见附录1
                    jsApiList: jsApiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {
                    wx.onMenuShareTimeline({
                        title: '万科三联书社',
                        link: window.location.href,
                        imgUrl: 'http://fuwuhao.dianyingren.com/imgs/wankelife.jpg',
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: '万科三联书社',
                        desc: '悦读 悦心 悦生活',
                        link: window.location.href,
                        type: 'link',
                        imgUrl: 'http://fuwuhao.dianyingren.com/imgs/wankelife.jpg',
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                    callback();
                })
            },
            error: function (msg) {
               // alert(msg);
            }
        });
    }
})(jQuery);


