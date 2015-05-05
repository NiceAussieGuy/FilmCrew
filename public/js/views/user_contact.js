(function ($) {
    var postview = window.location.search.split('?id=')[1];
    load(function () {
        var phonenum = "";
        var bnum = 0;
        $("#haederleft").on("click", function () {
            window.location.href = "user_detail.html?code=";
        });

        $('#phonenum').keydown(function () {
            setTimeout(function () {
                if ($('#phonenum').val() && /^1[3|4|5|7|8]\d{9}$/.test($('#phonenum').val())) {
                    bnum = 1;
                    phonenum = $('#phonenum').val();
                    $(".am-alert").alert('close');
                } else {
                    bnum = 0;
                    // $("#usr-sbm-sub").addClass("am-disabled");
                }
            }, 10);
        });
        $("#phone").keydown(function () {
            setTimeout(function () {
                if ($('#phonenum').val() != "") {
                    $("#usr-sbm-sub").removeClass("am-disabled");

                } else {
                    $("#usr-sbm-sub").addClass("am-disabled");
                }
            }, 20);
        });

        $("#usr-sbm-sub").on("click", function () {
            phonenum = $("#phonenum").val();
            if (bnum == 1) {
                var query = new AV.Query(AV.User);
                query.get(postview, {
                    success: function (user) {

                        user.set('mobilePhoneNumber', phonenum);
                        user.save().then(function () {
                            window.location.href = "user_detail.html?" + postview + "";
                        });
                    },
                    error: function (object, error) {
                        console.log(object);
                        // The object was not retrieved successfully.
                        // error is a AV.Error with an error code and description.
                    }
                });
            } else {
                $("<div class=\"am-alert am-alert-danger\" data-am-alert>\
            <button type=\"button\" class=\"am-close\">&times;</button>\
            请输入正确的手机号\
            </div>").appendTo($("#phone"));
            }
        });
    });
})(jQuery);

function load(callback) {
    var contacturl = window.location.href;
    var appId, jslist, noncestr, signature, timestamp, jsApiList;
    $.post("http://fuwuhao.dianyingren.com/weixin/getJsConfig", {url: "" + contacturl + ""}, function (result) {
        appId = result.appId;
        jslist = result.jsApiList;
        noncestr = result.nonceStr;
        signature = result.signature;
        timestamp = result.timestamp;
        jsApiList = result.jsApiList;

        wx.config({
            debug: result.debug,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appId, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: noncestr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名，见附录1
            jsApiList: jsApiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
            wx.hideOptionMenu();
        });
    });
    var id = window.location.search.split('?id=')[1];
    AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
    var query = new AV.Query(AV.User);
    query.get(id, {
        success: function (user) {
            $('#phonenum').attr("value", user.get("mobilePhoneNumber"));
            callback(null);
        },
        error: function (object, error) {
            callback(error);
        }
    })
}
