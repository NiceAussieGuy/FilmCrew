(function ($) {
    load(function (err, user) {
        var buliding;
        $("#doc-select-2").change(function () {
            $("#usr-sbm-sub").removeClass("am-disabled");});
        $("#doc-select-2").change(function () {
            $("#usr-sbm-sub").removeClass("am-disabled");});
        $("#wxnum").keydown(function (){
            setTimeout(function () {
                $("#usr-sbm-sub").removeClass("am-disabled");
            }, 100);
        });
        $('#wxnum').val(user.get("housenumber"));

        $("#haederleft").on("click", function () {
            window.location.href = "user_detail.html?code=";
        });
        $("#doc-select-1").change(function () {
            $("#usr-sbm-sub").removeClass("am-disabled");
            $(".starthomes").remove();
            var home = AV.Object.extend("home");
            var query2 = new AV.Query(home);
            query2.equalTo("objectId", $(this).val());
            query2.find({
                success: function (results) {
                    var oldbuilding = results[0].get("building");
                    var buildings = [];
                    for (var j = 0; j < oldbuilding.length; j++) {
                        var building = {
                            names: oldbuilding[j]
                        }
                        buildings.push(building);
                    }
                    var $buildings = $('#buildings');
                    var source2 = $buildings.text();
                    var template2 = Handlebars.compile(source2);
                    var data2 = {buildings: buildings};
                    var html2 = template2(data2);
                    $buildings.before(html2);

                }
            })
        });

        $("#usr-sbm-sub").on("click", function () {
            var home = AV.Object.extend("home");
            var query = new AV.Query(home);
            query.equalTo("objectId", $("#doc-select-1").val());
            query.find({
                success: function (results) {
                    buliding = results[0].get("homename");
                    var floorname = $("#doc-select-2").val();
                    var housenumber = $("#wxnum").val();
                    var query = new AV.Query(AV.User);
                    query.get(user.id, {
                        success: function (user) {
                            user.set('buliding', buliding);
                            user.set('floorname', floorname);
                            user.set('housenumber', housenumber);
                            user.save().then(function () {
                                window.location.href = "user_detail.html?code=";
                            });
                        },
                        error: function (object, error) {
                            console.log(object);
                            // The object was not retrieved successfully.
                            // error is a AV.Error with an error code and description.
                        }
                    });
                }
            })

        })
    });

})(jQuery);

function load(callback) {
    var address = window.location.href;
    var appId, jslist, noncestr, signature, timestamp, jsApiList;
    $.post("http://fuwuhao.dianyingren.com/weixin/getJsConfig", {url: "" + address + ""}, function (result) {
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
    AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");

    var postview = window.location.search.split('=')[1];
    var query = new AV.Query(AV.User);
    query.get(postview, {
        success: function (user) {
            var home = AV.Object.extend("home");
            var query = new AV.Query(home);
            query.find({
                success: function (res) {
                    homeval = res[0].id;
                    var homes = [];
                    for (var i = 0; i < res.length; i++) {
                        var object = res[i];
                        var homename = object.get("homename");
                        var homeid = object.id;
                        var building = object.get("building");
                        var home = {
                            name: homename,
                            id: homeid,
                            selected: ""
                        };
                        if (user.get("buliding") == homename) {
                            home.selected = "selected";
                        }
                        homes.push(home);
                    }
                    var $tpl = $('#homes');
                    var source = $tpl.text();
                    var template = Handlebars.compile(source);
                    var data = {homes: homes};
                    var html = template(data);
                    $tpl.before(html);

                    var homename = "";
                    if (user.get("buliding")) {
                        homename =user.get("buliding");
                    } else {
                        homename = "孙爽嘉园";
                    }
                    var home = AV.Object.extend("home");
                    var query2 = new AV.Query(home);
                    query2.equalTo("homename", homename);
                    query2.find({
                        success: function (results) {
                            var home = results[0];
                            var oldbuilding = home.get("building");
                            var buildings = [];
                            for (var j = 0; j < oldbuilding.length; j++) {
                                var building = {
                                    names: oldbuilding[j],
                                    selected: ""
                                };
                                if (user.get("floorname") == oldbuilding[j]) {
                                    building.selected = "selected";
                                }
                                buildings.push(building);
                            }
                            var $buildings = $('#buildings');
                            var source2 = $buildings.text();
                            var template2 = Handlebars.compile(source2);
                            var data2 = {buildings: buildings};
                            var html2 = template2(data2);
                            $buildings.before(html2);
                            callback(null, user);
                        },
                        error: function (error) {
                        }
                    });
                }
            });

        }
    });

}