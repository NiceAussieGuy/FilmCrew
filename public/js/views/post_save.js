$(function () {
    var saveurl = window.location.href;
    var posts = AV.Object.extend("post");
    var tags = AV.Object.extend("tag");
    var newtag = 1;
    var code = "";
    var fileurls = [];
    var userlog, userid, queryobject, phonenumber, nickname
    if (saveurl.split("=").length-1> 1) {
        userlog = window.location.search.split('=')[1];
        code = userlog.split("&")[0];
    }
    dataLoad(function () {
        wx.ready(function () {
            wx.hideOptionMenu();
        });
        var aNav = document.getElementsByClassName("am-btn-extend");
       // aNav[0].className = "am-btn-extend am-btn am-round am-btn-primary";
        for (var i = 0; i < aNav.length; i++) {
            aNav[i].onclick = function () {
                for (var j = 0; j < aNav.length; j++) {
                    aNav[j].className = "am-btn-extend am-btn am-round";
                    this.className = "am-btn-extend am-btn am-round am-btn-primary";
                }
                console.log(this);
                newtag = ($(this).attr("value"));
            };
        }
    });
    $("#doc-ta-1").keydown(function () {
        setTimeout(function () {
            var aUserval = $("#doc-ta-1").val();
            if (aUserval.length > 140) {
                $(".usr-say-leg-2").html("<p>" + aUserval.length + "</p>").addClass("maxlegcss");
            } else {
                $(".usr-say-leg-2").html("<p>" + aUserval.length + "</p>").removeClass("maxlegcss");
            }
            if ($("#doc-ta-1").val() != "") {
                $("#usr-sbm-sub").removeClass("am-disabled");
            } else {
                if ($(".imgnav").length == 0){
                    $("#usr-sbm-sub").addClass("am-disabled");
                }
            }
        }, 100);
    });
    $("#usr-sbm-s").on("click", function () {
        var aimglength = $(".imgnav");
        var aUserval3 = $("#doc-ta-1").val();
        if (aUserval3 != "" || aimglength.length != "") {
            $("#modal-confirm").modal({
                onConfirm: function () {
                    savecontent()
                },
                onCancel: function () {
                    window.location.href = "post_index.html";
                }
            });
        } else {
            window.location.href = "post_index.html";
        }
    });
    $("#usr-sbm-sub").on("click", function () {
        var aUserval2 = $("#doc-ta-1").val();
        if(newtag==1){
            $("#my-alert2").modal();
        }else{
            if (aUserval2.length > 140) {
                $("#my-alert").modal();
            } else {
                savecontent()
            }
        }
    });
    $("#addimg").hide();
    var postc = new posts();
    var relation = postc.relation("imgs");

    $(".chooseImage").on("click", function () {
        wx.chooseImage({
            success: function (res) {
                var localIds = res.localIds;
                setTimeout(uploadIds(localIds,0),100);
            }
        });
    });

    //…………………………保存心情 和 tagkey………………………………
    function savecontent() {
        var query = new AV.Query(AV.User);
        query.get(userid, {
            success: function (user) {
                phonenumber = user.get('mobilePhoneNumber');
                if (phonenumber) {
                    var aUserval2 = $("#doc-ta-1").val();
                    var tag = new tags();
                    tag.id = newtag;
                    var postc = new posts();
                    postc.save({
                        content: aUserval2,
                        tagkey: tag,
                        relationimgs: fileurls,
                        username: user
                    }, {
                        success: function (object) {
                            window.location.href = "post_index.html"
                        }
                    });
                } else {
                    $('#my-prompt').modal({
                        onConfirm: function (e) {
                            //e.data
                            if (/^1[3|4|5|7|8]\d{9}$/.test(e.data)) {
                                var query = new AV.Query(AV.User);
                                query.get(userid, {
                                    success: function (user) {
                                        user.set('mobilePhoneNumber', e.data);
                                        user.save()
                                    }
                                }).then(function () {
                                    var aUserval2 = $("#doc-ta-1").val();
                                    var tag = new tags();
                                    tag.id = newtag;
                                    var postc = new posts();
                                    var user = AV.User.current();
                                    postc.save({
                                        content: aUserval2,
                                        tagkey: tag,
                                        relationimgs: fileurls,
                                        username: user
                                    }, {
                                        success: function (object) {
                                            window.location.href = "post_index.html"
                                        }
                                    });
                                });
                            } else {
                                alert("请输入正确的电话号码");
                            }
                        },
                        onCancel: function (e) {
                        }
                    });
                }
            }
        });
    }

//………………………………储备函数…………………………………………
    function dataLoad(callbak) {
        var appId, jslist, noncestr, signature, timestamp, jsApiList;
        $.post("http://fuwuhao.dianyingren.com/weixin/getJsConfig", {url: "" + saveurl + ""}, function (result) {
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
        });

        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        var tags = AV.Object.extend("tag");
        var query = new AV.Query(tags);
        query.find({
            success: function (results) {
                var tags = [];
               // newtag = results[0].id;
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var tagid = object.id;
                    var tagvalue = object.get('tagtitle');
                    var tag = {
                        key: tagid,
                        value: tagvalue
                    };
                    tags.push(tag);
                }
                var $tpl = $('#amz-tags');
                var source = $tpl.text();
                var template = Handlebars.compile(source);
                var data = {tags: tags};
                var html = template(data);
                $tpl.before(html);
                callbak();
            }
        });
        if (code != "") {
            $.post("http://fuwuhao.dianyingren.com/weixin/userSignUp", {code: code}, function (res) {
                queryobject = res;
                AV.User._logInWith("weixin", {
                    "authData": res,
                    success: function (user) {
                        userid = user.id;
                        queryobject = user.get("authData");
                        var query = new AV.Query(AV.User);
                        query.get(userid, {
                            success: function (user) {
                                user.set('nickname', res.nickname);
                                user.save()
                            }
                        });
                    },
                    error: function (err) {
                        console.dir(err);
                    }
                })
            });
        } else {
            var currentUser = AV.User.current();
            userid = currentUser.id;
            var query = new AV.Query(AV.User);
            query.get(userid, {
                success: function (user) {
                }
            });
        }
    }
    function uploadIds(localIds,index) {
        var idx=index;
        wx.uploadImage({
            localId: localIds[index] + "",
            isShowProgressTips: 1,
            success: function (img) {
                var imgserverId=img.serverId;
                $.ajax({
                    method: "POST",
                    url: "http://fuwuhao.dianyingren.com/weixin/uploadImage",
                    data: JSON.stringify({
                        serverId: imgserverId
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        var fileId = data.id;
                        var fileurl= data.url;
                        $("#addimg").show();
                        $("#usr-sbm-sub").removeClass("am-disabled");
                        fileurls.push(fileurl);
                        $("<div id=\"" + fileId + "\" class=\"imgnav\"><img src=\"" + localIds[index] + "\" alt=\"\"/><a id=\"destroy" + fileId + "\" class=\"am-icon-close \" value=\"" + fileId + "\"  \"></a></div>").prependTo("#imgwall");
                        $("#destroy" + fileId + "").on("click", function () {
                            fileurls.splice(jQuery.inArray(fileurl, fileurls), 1);
                            $("#" + fileId + "").remove();
                            if ($(".imgnav").length == 0) {
                                $("#addimg").hide();
                                if ($("#doc-ta-1").val() == ""){
                                    $("#usr-sbm-sub").addClass("am-disabled");
                                }
                            }
                        });
                        if(idx!=localIds.length-1){
                            idx+=1;
                            uploadIds(localIds,idx)
                        }
                    },
                    error: function (msg) {
                        alert(msg);
                    }
                });

            }
        });
    }
});



