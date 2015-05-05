(function ($) {
    var userid=window.location.search.split('=')[1];
    var skx = -5;
    var postview,contentlength;
    loadwx();
    $("#arrow").hide();
    loading(function(){

        var adoremove = document.getElementsByClassName("doremove");
        if(adoremove.length<5){
            $("#load").hide();
        }
        if(adoremove.length==0){
            $("hr").remove();
            $(" <div id=\"null\"><p class=\"am-sans-serif\">暂时没有发表评论</p></div>").prependTo("#content");
        }
        $(".Publish").on("click", function () {
            postview = $(this).attr("value");
        });
        //$("#users").on("click", function () {
        //    window.location.href = "user_detail.html";
        //});
        $(".imgpreview").on("click",function(){
            var cur= $(this).attr("src");
            var  url=$(this).parent().attr("value");
            var arr=url.split(",");
            wx.previewImage({
                current:cur, // 当前显示的图片链接
                urls:arr// 需要预览的图片链接列表
            });
            event.stopPropagation();
        });
        $(".imgpreview").removeClass("imgpreview");
    });
    $("#foots").on("click", function () {
        var currentUser = AV.User.current();
        if (currentUser) {
            window.location.href = "post_save.html?code=";
        } else {
            $.get("http://fuwuhao.dianyingren.com/weixin/getAuthUrl?page=post_save", function (res) {
                window.location.href = res.authUrl;
            })
        }
    });
    $(window).scroll(function () {
        var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var newheight = window.screen.availHeight;
        if (scrollTop > 800) {
            $("#arrow").show().addClass("am-animation-fade");
        } else {
            $("#arrow").hide();
            $("#arrow").hide().removeClass("am-animation-fade");
        }
        if (scrollTop + newheight + 200 >= htmlHeight) {
            loading(function(){
                $(".Publish").on("click", function () {
                    postview = $(this).attr("value");
                });
                //$("#users").on("click", function () {
                //    window.location.href = "user_detail.html";
                //});
                $(".imgpreview").on("click",function(){
                    var cur= $(this).attr("src");
                    var  url=$(this).parent().attr("value");
                    var arr=url.split(",");
                    wx.previewImage({
                        current:cur, // 当前显示的图片链接
                        urls:arr// 需要预览的图片链接列表
                    });
                    event.stopPropagation();
                });
                $(".imgpreview").removeClass("imgpreview");
            });
        }
    });

    $(".seecontent").on("click",function(){
        window.location.href = "post_detail.html?id=" + postview + "";
    });
    $(".destroy").on("click",function(){

        destroy(postview);
    });

    function loading(callbak) {
        var useerpost = window.location.href;
        var appId, jslist, noncestr, signature, timestamp, jsApiList;
        $.post("http://fuwuhao.dianyingren.com/weixin/getJsConfig", {url: "" + useerpost + ""}, function (result) {
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
        //ject.createWithoutData('className',id);
        var post = AV.Object.extend("post");
        var tags = AV.Object.extend("tags");
        var user = AV.Object.extend("User");
        var newtime = new Date().getTime();
        var query2 = new AV.Query(user);
        query2.equalTo("objectId",userid);
        query2.find({
            success: function (res) {
                var query = new AV.Query(post);
                query.equalTo("username", res[0]);
                query.count({
                    success: function (skip) {
                        contentlength=skip;
                        var newtime = new Date().getTime();
                        query.descending("createdAt");
                         skx+=5;
                        if(skx>=skip){
                            $("#load").remove();
                        }
                        query.limit(5).skip(skx);
                        query.descending("createdAt");
                        query.include("tagkey")
                        query.include("imgs")
                        query.include("username")
                        query.equalTo("username", res[0]);
                        query.find({
                            success: function (arry) {
                                var times = 0;
                                var tags = [];
                                var imgpattern="";
                                for (var i = 0; i < arry.length; i++) {
                                    var object = arry[i];
                                    console.log(object);
                                    var avalue = object.id;
                                    var content = object.get('content');
                                    var imgs = object.get('relationimgs');
                                    if(imgs){
                                        if(imgs.length==1){
                                            imgpattern="imgpatternone"
                                        }
                                        if(imgs.length==2||imgs.length==4){
                                            imgpattern="imgpatterntwo"
                                        }
                                        if(imgs.length>=3 && imgs.length!=4){
                                            imgpattern="imgpatternthree"
                                        }
                                    }
                                    var otagkey = object.get("tagkey");
                                    var ousername = object.get("username").attributes.authData.weixin;
                                    var username = ousername.nickname;
                                    var headimgurl=ousername.headimgurl;
                                    var tagvalue = otagkey.get("tagtitle");
                                    var oldtime = object.createdAt.getTime();
                                    var publishtime = newtime - oldtime;
                                    var day = parseInt(publishtime / 86400000);
                                    if (day > 0) {
                                        times = day + "天前"
                                    } else {
                                        var hours = parseInt(publishtime / 3600000);
                                        if (hours > 0) {
                                            times = hours + "小时前";
                                        }
                                        else {
                                            var minute = parseInt(publishtime / 60000);
                                            if (minute > 0) {
                                                times = minute + "分钟前"
                                            }else{
                                                times="刚刚"
                                            }
                                        }
                                    }

                                    var opost = {
                                        name: username,
                                        titleimg:headimgurl,
                                        usersay: content,
                                        tag: tagvalue,
                                        time: times,
                                        value: avalue,
                                        img: imgs,
                                        pattern: imgpattern
                                    };
                                    tags.push(opost);
                                }
                                var $tpl = $('#usercontent');
                                var source = $tpl.text();
                                var template = Handlebars.compile(source);
                                var data = {tags: tags};
                                var html = template(data);
                                $tpl.before(html);
                                callbak();
                            }
                        });
                    }
                });
            }
        });

    }



    function destroy(postid){
        var destroylength = document.getElementsByClassName("doremove");
        var post = AV.Object.extend("post");
        var query = new AV.Query(post);
        query.equalTo("objectId",postid);
        query.find({
            success:function(res){
                var destroyid= res[0].id;
                res[0].destroy({
                    success: function(myObject) {
                        $("#"+destroyid+"").remove();
                        if(destroylength.length<5){
                            $("#load").hide();
                        }
                        if(destroylength.length==0){
                            $("hr").remove();
                            $(" <div id=\"null\"><p class=\"am-sans-serif\">暂时没有发表评论</p></div>").prependTo("#content");
                        }
                    }
                });
            }
        });
    }
    function loadwx(){
        var appId, jslist, noncestr, signature, timestamp, jsApiList;
        $.get("http://fuwuhao.dianyingren.com/weixin/getJsConfig?page=post_index", function (result) {
            console.log(result);
            appId = result.appId;
            jslist = result.jsApiList;
            noncestr = result.nonceStr;
            signature = result.signature;
            timestamp = result.timestamp;
            jsApiList = result.jsApiList;
            wx.config({
                debug: false,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: noncestr, // 必填，生成签名的随机串
                signature: signature,// 必填，签名，见附录1
                jsApiList: jsApiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        });
    }


})(jQuery);


