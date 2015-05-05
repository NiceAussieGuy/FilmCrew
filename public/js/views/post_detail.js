(function ($) {
    var saveurl = window.location.href;
    var number = "";
    var code = "";
    var relationuser = [];
    var marktags = ["约吃", "约玩", "约聊", "约运动"];
    var commentuserid;
    var userlog, userid, queryobject, nickname, phonenumber, usersid, postId, tagvalue, openid, postview, username, headimgurl, headUrl;
    if (saveurl.split("=").length - 1 > 1) {
        userlog = window.location.search.split('=')[2];
        code = userlog.split("&")[0];
        postview = window.location.search.split('=')[1].split("&")[0];
    } else {
        postview = window.location.search.split('=')[1];
    }
    loadwx();
    loading(function () {
        $(".close").hide();
        var currentUser = AV.User.current();
        if (currentUser) {
            usersid = currentUser.id;
            var authData = currentUser.get("authData");
            headUrl = authData.weixin.headimgurl
            $(".nullusershow").attr("src", headUrl);
            alert($(".nullusershow").attr("src"));
        }
        $(".replypublish").hide();
        var aclose =document.getElementsByClassName("close");
        alert(aclose.length)
        for(var i=0;i<aclose.length;i++){
            var commentuser=aclose[i].className.substr(14);
            alert(i)
            alert(commentuser)
            if(commentuser==commentuserid){
                alert("yin")
               aclose[i].className="close hide";
                    $(".hide").show();
            }else{
                    alert("xian")
                }
        }
        $(".hide").on("click",function(){
            var close = $(this).parent().attr("value");
            alert(close)
            destroycomment(close);
        });
        $(".reply").on("click", function () {
            $(".replypublish").hide();
            var reply = $(this).parent().attr("value");
            var $reply = $(this).parent().siblings("." + reply + "");
            if ($reply.attr("bshow") == 0) {
                $reply.show();
                $reply.attr("bshow", "1");
            } else {
                $reply.hide();
                $reply.attr("bshow", "0");
            }
            $(".reply").removeClass("reply");
        })
        $(".smpublish").on("click", function () {
            var currentUser = AV.User.current();
            if (currentUser) {
                alert(commentuserid);
                var comment = AV.Object.extend("comment");
                var post = AV.Object.extend("post");
                var relationcommentid = $(this).attr("value");
                var relationcommentusername = $(this).attr("username");
                var relationcommentcontent = $(this).attr("usersay");
                var relationcommentusershow = $(this).attr("usershow");
                var relationcommentuserid = $(this).attr("userid");
                console.log(relationcommentid + "$" + relationcommentusername + "$" + relationcommentcontent + "$" + relationcommentusershow)
                var publishsay = $(this).parent().siblings(".textarea").children().val();
                alert(publishsay);
                var posts = new post();
                posts.id = postview;
                var commentrelation = [];
                commentrelation.push({
                    commentid: relationcommentid,
                    commentusername: relationcommentusername,
                    commentcontent: relationcommentcontent,
                    commentuserid: relationcommentuserid,
                    commentusershow: relationcommentusershow
                });
                console.log(commentrelation);
                var comment = new comment();
                comment.save({
                    commentcontent: publishsay,
                    commentpost: posts,
                    commentuserid: commentuserid,
                    commentusername: nickname,
                    commentusershow: headUrl,
                    commentrelation: commentrelation
                }, {
                    success: function (comment) {
                        alert(comment.id)
                        $("textarea").val("");
                        loadingcomment(comment);
                        var query = new AV.Query(post);
                        query.get(postview, {
                            success: function (post) {
                                post.add("relationcomment", {id: comment.id});
                                post.save();
                            },
                            error: function (object, error) {
                                console.log(object);
                            }
                        });
                    }
                })
            } else {
                $.ajax({
                    method: "POST",
                    url: "http://fuwuhao.dianyingren.com/weixin/getAuthUrl",
                    data: JSON.stringify({
                        page: saveurl
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        window.location.href = data.authUrl;
                    },
                    error: function (msg) {
                        // alert(msg);
                    }
                });
            }
        })

        $("#maxpublish").on("click", function () {
            var currentUser = AV.User.current();
            if (currentUser) {
                var post = AV.Object.extend("post");
                var comment = AV.Object.extend("comment");
                var publishsay = $(this).parent().siblings(".textarea").children().val();
                if (publishsay) {
                    alert(publishsay)
                }
                var posts = new post();
                posts.id = postview;
                var coment = new comment();
                coment.save({
                    commentcontent: publishsay,
                    commentpost: posts,
                    commentusername: nickname,
                    commentuserid: commentuserid,
                    commentusershow: headUrl
                }, {
                    success: function (comment) {
                        var query = new AV.Query(post);
                        $("textarea").val("");
                        loadingcomment(comment);
                        query.get(postview, {
                            success: function (post) {
                                post.add("relationcomment", {id: comment.id});
                                post.save();
                            },
                            error: function (object, error) {
                                console.log(object);
                            }
                        });
                    }
                });
            } else {
                $.ajax({
                    method: "POST",
                    url: "http://fuwuhao.dianyingren.com/weixin/getAuthUrl",
                    data: JSON.stringify({
                        page: saveurl
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        window.location.href = data.authUrl;
                    },
                    error: function (msg) {
                        // alert(msg);
                    }
                });
            }
        });

        $(".imgpreview").on("click", function () {
            var cur = $(this).attr("src");
            var url = $(this).parent().attr("value");
            var arr = url.split(",");
            wx.previewImage({
                current: cur, // 当前显示的图片链接
                urls: arr// 需要预览的图片链接列表
            });
            event.stopPropagation();
        });
        $(".imgpreview").removeClass("imgpreview");

        $("#btnname").on("click", function () {
            var currentUser = AV.User.current();
            if (currentUser) {
                usersid = currentUser.id;
                var query = new AV.Query(AV.User);
                query.get(usersid, {
                    success: function (user) {
                        phonenumber = user.get('mobilePhoneNumber');
                    }
                });
                if (relationuser) {
                    for (var i = 0; i < relationuser.length; i++) {
                        if (relationuser[i].id == usersid) {
                            $(".usercontent").remove();
                            $(" <p class=\"usercontent am-sans-serif\">联系方式：" + number + "</p>").prependTo(".usercont");
                            $("#btnname").remove();
                            $(" <div id=\"btnname\"><button type=\"button\" class=\"am-btn am-btn-warning am-disabled\">已报名</button></div>").prependTo(".userphone");
                        }
                    }
                } else {
                    setTimeout(function () {
                        if (phonenumber) {
                            var imgurl = currentUser.get("authData").weixin.headimgurl;
                            $(".usercontent").remove();
                            $(" <p class=\"usercontent am-sans-serif\">联系方式：" + number + "</p>").prependTo(".usercont");
                            $("#btnname").remove();
                            $(" <div id=\"btnname\"><button type=\"button\" class=\"am-btn am-btn-warning am-disabled\">已报名</button></div>").prependTo(".userphone");
                            $(" <img src=\"" + imgurl + "\" value=\" " + usersid + "&" + phonenumber + " \" class=\"am-radius\">").appendTo("#headtle");
                            $.ajax({
                                method: "POST",
                                url: "http://fuwuhao.dianyingren.com/weixin/sendMessage",
                                data: JSON.stringify({
                                    userId: usersid,
                                    postId: postview
                                }),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (data) {
                                },
                                error: function (msg) {
                                }
                            });
                            //usersid  postId  openid
                            var post = AV.Object.extend("post");
                            var query = new AV.Query(post);
                            query.equalTo("objectId", postview);
                            query.get(postview, {
                                success: function (post) {
                                    post.add("relationuser", {id: usersid, url: imgurl, phonenumber: phonenumber});
                                    post.save();
                                },
                                error: function (object, error) {
                                    console.log(object);
                                }
                            });
                        } else {
                            $('#my-prompt').modal({
                                // relatedTarget: this,
                                onConfirm: function (e) {
                                    //e.data
                                    if (/^1[3|4|5|7|8]\d{9}$/.test(e.data)) {
                                        var query = new AV.Query(AV.User);
                                        query.get(usersid, {
                                            success: function (user) {
                                                user.set('mobilePhoneNumber', e.data);
                                                user.save()
                                            }
                                        });
                                    } else {
                                        alert("请输入正确的电话号码");
                                    }
                                },
                                onCancel: function (e) {
                                }
                            });
                        }
                    }, 100);
                }

            } else {
                $.ajax({
                    method: "POST",
                    url: "http://fuwuhao.dianyingren.com/weixin/getAuthUrl",
                    data: JSON.stringify({
                        page: saveurl
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        window.location.href = data.authUrl;
                    },
                    error: function (msg) {
                        // alert(msg);
                    }
                });
                //    $.post("http://fuwuhao.dianyingren.com/weixin/getAuthUrl",{page:saveurl}, function (res) {
                //        window.location.href = res.authUrl;
                //})
            }
        });
    });

    function loading(callbak) {
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        var load = 0 //ject.createWithoutData('className',id);
        var currentUser = AV.User.current();
        if (currentUser) {
            alert(currentUser.id)
            commentuserid = currentUser.id;
            var authData = currentUser.get("authData");
            nickname = authData.weixin.nickname
            headimgurl = authData.weixin.headimgurl
            load+=1
            if (load == 4) {
                callbak();
            }
        }else{
            load+=1
            if (load == 4) {
                callbak();
            }
        }

        var post = AV.Object.extend("post");
        var tags = AV.Object.extend("tags");
        var user = AV.Object.extend("User");
        var comment = AV.Object.extend("comment");
        var query = new AV.Query(post);
        query.include("tagkey");
        query.include("imgs");
        query.include("username");
        query.equalTo("objectId", postview);
        query.find({
            success: function (results) {
                var times = 0;
                var newtime = new Date().getTime();
                var tags = [];
                var imgpattern = "";
                var object = results[0];
                var content = object.get('content');
                var imgs = object.get('relationimgs');
                relationuser = object.get("relationuser");
                if (imgs) {
                    if (imgs.length == 1) {
                        imgpattern = "imgpatternone"
                    }
                    if (imgs.length == 2 || imgs.length == 4) {
                        imgpattern = "imgpatterntwo"
                    }
                    if (imgs.length >= 3 && imgs.length != 4) {
                        imgpattern = "imgpatternthree"
                    }
                }
                var otagkey = object.get("tagkey");
                number = object.get("username").get("mobilePhoneNumber");
                postId = object.get("username").id;
                openid = object.get("username").get("authData").weixin.openid;
                var ousername = object.get("username").attributes.authData.weixin;
                username = ousername.nickname;
                headimgurl = ousername.headimgurl;
                tagvalue = otagkey.get("tagtitle");
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
                        } else {
                            times = "刚刚"
                        }
                    }
                }
                // var tagvalue = object.get('tagkey');
                var opost = {
                    name: username,
                    titleimg: headimgurl,
                    usersay: content,
                    tag: tagvalue,
                    time: times,
                    img: imgs,
                    pattern: imgpattern,
                    relationuser: relationuser
                };
                tags.push(opost);
                var $tpl2 = $('#amz-tags');
                var source2 = $tpl2.text();
                var template2 = Handlebars.compile(source2);
                var data2 = {tags: tags};
                var html2 = template2(data2);
                $tpl2.before(html2);
                load += 1
                if (load == 4) {
                    callbak();
                }
                $(".userphone").hide();
                for (var i = 0; i < marktags.length; i++) {
                    if (marktags[i] == tagvalue) {
                        $(".userphone").show();
                    }
                }


                if (relationuser) {
                    var currentUser = AV.User.current();
                    if (currentUser) {
                        usersid = currentUser.id;
                        for (var i = 0; i < relationuser.length; i++) {
                            if (relationuser[i].id == usersid) {
                                $(".usercontent").remove();
                                $("<p id=\"usercontent\" class=\"usercontent am-sans-serif\">联系方式：" + number + "</p>").prependTo(".usercont");
                                $("#btnname").remove();
                                $(" <div id=\"btnname\"><button type=\"button\" class=\"am-btn am-btn-warning am-disabled\">已报名</button></div>").prependTo(".userphone");
                            }
                        }
                    }
                }
            }
        });
        //…………………………………………以下为加载评论………………………………
        var query = new AV.Query(post);
        query.equalTo("objectId", postview);
        query.find({
            success: function (post) {
                var object = post[0].get("relationcomment")
                if (object) {
                    var comment = AV.Object.extend("comment");
                    for (var i =0; i<object.length; i++) {

                        var query = new AV.Query("comment");
                        query.include("commentrelation");
                        query.include("commentuser");
                        query.equalTo("objectId", object[i].id);
                        query.find({
                            success: function (comment) {
                                var times = 0;
                                var newtime = new Date().getTime();
                                var oldtime = comment[0].createdAt.getTime();
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
                                        } else {
                                            times = "刚刚"
                                        }
                                    }
                                }
                                var commentid = comment[0].id;
                                var commentuserids = comment[0].get("commentuserid");
                                var commentusername = comment[0].get("commentusername");
                                var commentcontent = comment[0].get("commentcontent");
                                var commentusershow = comment[0].get("commentusershow");
                                var commentrelation = comment[0].get("commentrelation");
                                var comments = [];
                                var comment = {
                                    commentid: commentid,
                                    commentusername: commentusername,
                                    commentuserid:commentuserids,
                                    commentcontent: commentcontent,
                                    commentusershow: commentusershow,
                                    relation: commentrelation,
                                    times: times
                                }
                                comments.push(comment);
                                var $tpl3 = $('#comments');
                                var source3 = $tpl3.text();
                                var template3 = Handlebars.compile(source3);
                                var data3 = {comments: comments};
                                var html3 = template3(data3);
                                $tpl3.before(html3);
                                if ($(".commentlength").length == object.length) {
                                    load += 1
                                    if (load == 4) {
                                        callbak();
                                    }
                                }
                            }
                        })
                    }
                } else {
                    load += 1
                    if (load == 4) {
                        callbak();
                    }
                }
                // callbak();
            }
        })
        //……………………………………………………………………………………………
        if (code != "") {
            $.post("http://fuwuhao.dianyingren.com/weixin/userSignUp", {code: code}, function (res) {
                queryobject = res;
                nickname = res.nickname;
                alert(nickname)
                AV.User._logInWith("weixin", {
                    "authData": res,
                    success: function (user) {
                        userid = user.id;
                        commentuserid=userid
                        queryobject = user.get("authData");
                        var query = new AV.Query(AV.User);
                        query.get(userid, {
                            success: function (user) {
                                user.set('nickname', nickname);
                                user.save()
                            }
                        });
                        if (relationuser) {
                            var currentUser = AV.User.current();
                            if (currentUser) {
                                usersid = currentUser.id;
                                for (var i = 0; i < relationuser.length; i++) {
                                    if (relationuser[i].id == usersid) {
                                        $(".usercontent").remove();
                                        $("<p id=\"usercontent\" class=\"usercontent am-sans-serif\">联系方式：" + number + "</p>").prependTo(".usercont");
                                        $("#btnname").remove();
                                        $(" <div id=\"btnname\"><button type=\"button\" class=\"am-btn am-btn-warning am-disabled\">已报名</button></div>").prependTo(".userphone");
                                    }
                                }
                            }
                        }
                        load += 1
                        if (load == 4) {
                            callbak();
                        }
                    }
                })
            });
        } else {
            load += 1
            if (load == 4) {
                callbak();
            }
        }
    }
    function loadwx() {
        var appId, jslist, noncestr, signature, timestamp, jsApiList;
        $.get("http://fuwuhao.dianyingren.com/weixin/getJsConfig?page=post_index", function (result) {
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
    function loadingcomment(comment) {
        var times = 0;
        var newtime = new Date().getTime();
        var oldtime = comment.createdAt.getTime();
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
                } else {
                    times = "刚刚"
                }
            }
        }
        var commentid = comment.id;
        var commentusername = comment.get("commentusername");
        var commentcontent = comment.get("commentcontent");
        var commentusershow = comment.get("commentusershow");
        var commentrelation = comment.get("commentrelation");
        var comments = [];
        var comment = {
            commentid: commentid,
            commentusername: commentusername,
            commentuserid:commentuserid,
            commentcontent: commentcontent,
            commentusershow: commentusershow,
            relation: commentrelation,
            times: times
        }
        comments.push(comment);
        var $tpl3 = $('#comments');
        var source3 = $tpl3.text();
        var template3 = Handlebars.compile(source3);
        var data3 = {comments: comments};
        var html3 = template3(data3);
        $tpl3.before(html3);
        $(".replypublish").hide();
        $(".nullusershow").attr("src", headUrl);
        $(".reply").on("click", function () {
            $(".replypublish").hide();
            var reply = $(this).parent().attr("value");
            var $reply = $(this).parent().siblings("." + reply + "");
            if ($reply.attr("bshow") == 0) {
                $reply.show();
                $reply.attr("bshow", "1");
            } else {
                $reply.hide();
                $reply.attr("bshow", "0");
            }
            $(".reply").removeClass("reply");
        })
        $(".close").on("click",function(){
            var close = $(this).parent().attr("value");
            alert(close)
            destroycomment(close);
        })
        $(".smpublish").on("click", function () {
                alert(commentuserid);
                var comment = AV.Object.extend("comment");
                var post = AV.Object.extend("post");
                var relationcommentid = $(this).attr("value");
                var relationcommentusername = $(this).attr("username");
                var relationcommentcontent = $(this).attr("usersay");
                var relationcommentusershow = $(this).attr("usershow");
                var relationcommentuserid = $(this).attr("userid");
                var publishsay = $(this).parent().siblings(".textarea").children().val();
                alert(publishsay);
                var posts = new post();
                posts.id = postview;
                var commentrelation = [];
                commentrelation.push({
                    commentid: relationcommentid,
                    commentusername: relationcommentusername,
                    commentcontent: relationcommentcontent,
                    commentuserid: relationcommentuserid,
                    commentusershow: relationcommentusershow
                });
                var comment = new comment();
                comment.save({
                    commentcontent: publishsay,
                    commentpost: posts,
                    commentuserid: commentuserid,
                    commentusername: nickname,
                    commentusershow: headUrl,
                    commentrelation: commentrelation
                }, {
                    success: function (comment) {
                        alert(comment.id)
                        loadingcomment(comment);
                        var query = new AV.Query(post);
                        //query.equalTo("objectId", postview);
                        query.get(postview, {
                            success: function (post) {
                                post.add("relationcomment", {id: comment.id});
                                post.save();
                            },
                            error: function (object, error) {
                                console.log(object);
                            }
                        });
                    }
                })
        })
        $("#maxpublish").on("click", function () {
                alert(commentuserid);
                alert(nickname);
                alert(headimgurl);
                var post = AV.Object.extend("post");
                var comment = AV.Object.extend("comment");
                alert("haha")
                var publishsay = $(this).parent().siblings(".textarea").children().val();
                if (publishsay) {
                    alert(publishsay)
                }
                var posts = new post();
                posts.id = postview;
                var coment = new comment();
                coment.save({
                    commentcontent: publishsay,
                    commentpost: posts,
                    commentusername: nickname,
                    commentuserid: commentuserid,
                    commentusershow: headUrl
                }, {
                    success: function (comment) {
                        alert(comment.id)
                        var query = new AV.Query(post);
                        //query.equalTo("objectId", postview);
                        $("textarea").val("")
                        loadingcomment(comment);
                        query.get(postview, {
                            success: function (post) {
                                post.add("relationcomment", {id: comment.id});
                                post.save();
                            },
                            error: function (object, error) {
                                console.log(object);
                            }
                        });
                    }
                });
        });
    }
    function destroycomment(commentid){
        $(".destroy"+commentid+"").remove();
        var post = AV.Object.extend("post");
        var query = new AV.Query(post);
        //query.equalTo("objectId", postview);
        $("textarea").val("")
        query.get(postview, {
            success: function (post) {
                post.remove("relationcomment", {id: commentid});
                post.save();
            }
        });
        var comment = AV.Object.extend("comment");
        var query2 = new AV.Query(comment);
        query2.get(commentid,{
            success:function(comment){
                comment.destroy();
            }
        })
    }
})(jQuery);





