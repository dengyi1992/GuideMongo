var crypto = require('crypto'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js'),
    Duobao = require('../models/duobao.js'),
    Ad_position = require('../models/Ad_position'),
    User = require('../models/user.js'),
    UA = require('../models/user_ad.js'),
    Ad = require('../models/Ad'),
    ManagerUser = require('../models/ManagerUser');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var multipart = require('connect-multiparty');
var config = require("../config.js");
var iconv = require('querystring');
var icon = require('querystring');
var multipartMiddleware = multipart();
var url = require("url");
var tencentyun = require('tencentyun');
/* GET home page. */
// router.get('/', function (req, res) {
//     //判断是否是第一页，并把请求的页数转换成 number 类型
//     var page = parseInt(req.query.p) || 1;
//     //查询并返回第 page 页的 10 篇文章
//     Post.getTen(null, page, function (err, posts, total) {
//         if (err) {
//             posts = [];
//         }
//         res.json({
//             posts: posts,
//             page: page,
//             isFirstPage: (page - 1) == 0,
//             isLastPage: ((page - 1) * 10 + posts.length) == total,
//             user: req.session.user
//
//         })
//
//     });
// });
router.get('/', function (req, res) {
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if (agentID) {
        res.sendFile(filePath + '/public/mobileindex.html');
    } else {
        res.sendFile(filePath + '/public/webindex.html');
    }
});
router.get('/publish', function (req, res) {
    if (!req.session.user) {
        res.send("<script>alert('未登录');window.location='login.html'</script>")
    } else {
        res.sendFile(filePath + '/public/publish.html');
    }
});
/**
 * 普通手机用户登录注册
 */
// router.post('/reg', checkNotLogin);
router.post('/reg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'],
        email = req.body.email,
        enterprise = req.body.enterprise;
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
        return res.json({'error': '两次输入的密码不一致!'});
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');

    var newUser = new User({
        name: name,
        password: password,
        email: email,
        user_collection: "",
        enterprise: enterprise,
        enterprisename: enterprise ? req.body.enterprisename : "",
        enterpriseid: enterprise ? req.body.enterpriseid : "",
        legalperson: enterprise ? req.body.legalperson : "",
        account: enterprise ? 5000 : 1000
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
        if (err) {
            return res.json({'error': err});
        }
        if (user) {
            return res.json({'error': '用户已存在!'});
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                res.json({'error': err});
            }
            req.session.user = newUser;//用户信息存入 session
            res.json({'success': '注册成功!'});
        });
    });
});


// router.get('/login', checkNotLogin);
// // router.get('/login', function (req, res) {
// //     res.render('login', {
// //         title: '登录',
// //         user: req.session.user,
// //         success: req.flash('success').toString(),
// //         error: req.flash('error').toString()
//     });
// });
router.post('/login', checkNotLogin);
router.post('/login', function (req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.get(req.body.name, function (err, user) {
        if (!user) {
            return res.json({'error': '用户不存在!'});
        }
        //检查密码是否一致
        if (user.password != password) {
            return res.json({'error': '密码错误!'});
        }
        //用户名密码都匹配后，将用户信息存入 session
        req.session.user = user;
        res.json({'success': '登陆成功!', 'coll': user.user_collection, 'account': user.account});
    });
});
/**
 * 广告主登录注册
 * enterprise:false
 enterprisename:
 enterpriseid:
 legalperson:
 */
router.post('/ManagerReg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'],
        email = req.body.email,
        enterprise = req.body.enterprise;
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
        return res.json({'error': '两次输入的密码不一致!'});
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');

    var newUser = new User({
        name: name,
        password: password,
        email: email,
        user_collection: "",
        enterprise: enterprise,
        enterprisename: enterprise ? req.body.enterprisename : "",
        enterpriseid: enterprise ? req.body.enterpriseid : "",
        legalperson: enterprise ? req.body.legalperson : "",
        account: enterprise ? 1000 : 10
    });

    //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
        if (err) {
            return res.json({'error': err});
        }
        if (user) {
            return res.json({'error': '用户已存在!'});
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                // res.json({'error': err});
                res.write("<script type='application/javascript'> alert(err)</script>")
            }
            req.session.user = newUser;//用户信息存入 session
            res.json({'success': '注册成功!'});

        });
    });
});
router.post('/ManagerLogin', checkNotLogin);
router.post('/ManagerLogin', function (req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.get(req.body.name, function (err, user) {
        if (!user) {
            return res.json({'error': '用户不存在!'});
        }
        //检查密码是否一致
        if (user.password != password) {
            return res.json({'error': '密码错误!'});
        }
        //用户名密码都匹配后，将用户信息存入 session
        req.session.user = user;
        res.json({'success': '登陆成功!', 'coll': user.user_collection, 'account': user.account});
    });
});
router.post('/changepass', function (req, res) {
    //检验用户两次输入的密码是否一致
    if (req.body.newpassword != req.body["newpassword-repeat"]) {
        return res.json({'error': '两次输入的密码不一致!'});
    }
    if (req.body.newpassword === req.body.password) {
        return res.json({'error': '原密码应与修改密码不一致'});

    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var md5 = crypto.createHash('md5'),
        newpassword = md5.update(req.body.newpassword).digest('hex');

    //检查用户是否存在
    User.changePass(req.body.name, password, newpassword, function (err, result) {
        if (err) {
            return res.json({'error': err});
        }
        res.json({'success': '修改成功'});
    });
});
/**
 * 积分领取
 */

router.post('/collectpoints', checkLogin);
router.post('/collectpoints', function (req, res) {
    var user_uuid = req.session.user.uuid;
    var adUuid = req.body.ad_uuid;
    Ad.findByUuid(adUuid, function (err, amount) {
        if (err) {
            return res.json({'error': err});
        }
        var ua = new UA(user_uuid, adUuid, amount);
        ua.save(function (err, msg) {
            if (err) {
                return res.json({'error': err});
            }
            res.json({"success": "领取成功"});
        })

    });
});

/**
 * 我的上传
 */
router.get('/post', checkLogin);
router.get('/post', function (req, res) {

    var currentUser = req.session.user;
    Post.getAllByName(currentUser.name, function (err, docs) {
        if (err) {
            res.json({"error": err});
            return;
        }
        res.json({"success": docs});
    });

});
/**
 * 发布信息
 * 有待加入
 * 一个查重
 * 机制
 */
router.post('/post', checkLogin);
router.post('/post', function (req, res) {

    var currentUser = req.session.user,
        tags = [req.body.tag1, req.body.tag2, req.body.tag3],
        post = new Post(currentUser.name, currentUser.head, req.body.addesc, req.body.adurl, req.body.imgurl, tags, req.body.icons);
    post.save(function (err) {
        if (err) {
            return res.json({'error': err});
        }
        res.json({'success': '发布成功'});
    })
});
/**
 * 获取所有信息
 */
router.get('/api', function (req, res) {
    Post.getAll(function (err, docs) {
        if (err) {
            return res.json({'error': err});
        }
        res.json({'success': docs});
    });
});
router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
    req.session.user = null;
    res.json({'success': '登出成功!'});
});
/**
 * 文件上传
 * 加入了是否登录检测
 */

router.post('/upload', checkLogin);
router.post('/upload', multipartMiddleware, function (req, res) {
    // var newname = utility.md5(filename + String((new Date()).getTime())) + path.extname(filename);
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        imgname = md5.update(req.files.filename.name + String((new Date()).getTime())).digest('hex');
    var exname = req.files.filename.name.substring(req.files.filename.name.lastIndexOf('.') + 1);
    var des_file = config.upload.path + imgname + "." + exname;
    try {
        fs.readFile(req.files.filename.path + "", function (err, data) {
            fs.writeFile(des_file, data, function (err) {
                var response;
                if (err) {
                    console.log(err);
                } else {
                    response = {
                        'success': '上传成功',
                        'imgurl': config.address + "images/" + imgname + "." + exname
                    };
                }
                console.log(response);
                res.end(JSON.stringify(response));
            });
        });
    } catch (e) {
        res.json({'error': e.toString()});
    }

    //已经可以做进一步处理 req.files

});
/**
 * 发布广告
 */
router.post('/postNew', checkLogin);
router.post('/postNew', function (req, res) {
    var currentUser = req.session.user,
        addesc = req.body.addesc,
        ad_put_begintime = req.body.ad_put_begintime,
        ad_put_endtime = req.body.ad_put_endtime,
        budget = req.body.budget,
        sig_money = req.body.sig_money,
        imgurls = req.body["imgurls[]"],
        imgs = imgurls;
    if(typeof req.body["imgurls[]"]=="string"){
        imgs=[req.body["imgurls[]"]]
    }

    var key = req.body.key,
        title = req.body.name,
        tags = req.body["tags[]"],
        read = req.body.read,
        ad = new Ad(currentUser.name, currentUser.head, addesc, ad_put_begintime, ad_put_endtime, budget, sig_money, imgs, key, title, tags, read);
    ad.save(function (err, order) {
        if (err) {
            return res.json({'error': err});
        }
        res.json({status: "success", 'success': '发布成功', 'orderno': order});
    });
});
router.get('/ad_detail', function (req, res) {
    Ad.getByOrder(req.query.adorder, function (err, data) {
        if (err) {
            return res.json({'error': err});
        }
        res.json({status: "success", 'success': '获取成功', 'data': data});
    })
})
router.post('/mpostNew', checkLogin);
router.post('/mpostNew', function (req, res) {
    var currentUser = req.session.user,
        addesc = req.body.addesc,
        ad_put_begintime = req.body.ad_put_begintime,
        ad_put_endtime = req.body.ad_put_endtime,
        budget = req.body.budget,
        sig_money = req.body.sig_money,
        imgurls = req.body["imgurls"],
        key = req.body.key,
        title = req.body.name,
        tags = req.body["tags"],
        read = req.body.read,
        ad = new Ad(currentUser.name, currentUser.head, addesc, ad_put_begintime, ad_put_endtime, budget, sig_money, imgurls, key, title, tags, read);
    ad.save(function (err, order) {
        if (err) {
            return res.json({'error': err});
        }
        res.json({status: "success", 'success': '发布成功', 'orderno': order});
    });
});
router.get('/getAds', function (req, res) {
    var tag = req.query.tag;
    var page = req.query.page;
    if (tag) {
        Ad.getAllByTag(tag, page, function (err, data, total) {
            if (err) {
                return res.json({success: false})
            }
            res.json({success: true, data: data, page: page, total: total});
        })
    } else {
        Ad.getTen(page, function (err, data, total) {
            if (err) {
                return res.json({success: false})
            }
            res.json({success: true, data: data, page: page, total: total});
        })
    }


});
router.post('/postPay', checkLogin);
router.post('/postPay', function (req, res) {
    var currentUser = req.session.user;
    var order = req.body.order;

});
/**
 * 搜索
 */
// router.get('/search', function (req, res) {
//     Duobao.search(req.query.keyword, function (err, posts) {
//         if (err) {
//             req.flash('error', err);
//             return res.redirect('/');
//         }
//         res.render('search', {
//             title: "SEARCH:" + req.query.keyword,
//             posts: posts,
//             user: req.session.user,
//             success: req.flash('success').toString(),
//             error: req.flash('error').toString()
//         });
//     });
// });
// router.get('/links', function (req, res) {
//     res.render('links', {
//         title: '友情链接',
//         user: req.session.user,
//         success: req.flash('success').toString(),
//         error: req.flash('error').toString()
//     });
// });
/**
 * 收藏
 */
router.get('/collection', checkLogin);
router.get('/collection', function (req, res) {
    //检查用户是否存在
    User.get(req.session.user.name, function (err, user) {
        if (!user) {
            return res.json({'error': '用户不存在!'});
        }
        res.json({'success': '查到收藏', 'coll': user.user_collection});
    });
});
//router.post('/collection_c', checkLogin);
router.post('/collection_c', function (req, res) {
    User.collection_c(req.body.name, req.body.coll, function (err, result) {
        if (err) {
            return res.json({'error': err});
        }
        res.json({'success': '收藏成功'});
    });
});
router.post('/add_account', function (req, res) {
    User.add_account(req.body.name, req.body.adid, req.body.icons, function (err, result) {
        if (err) {
            return res.json({'error': err});
        }
        res.json({'success': '领取成功'});
    });
});
router.get('/wahhh', function (req, res) {
    res.json({success: "恭喜你连上服务器了"});

});
/**
 * 夺宝
 */
router.get('/duobao', checkLogin);
router.get('/duobao', function (req, res, next) {
    var user = req.session.user;
    var goodsid = req.query.goodsid;
    var timestamp = Date.parse(new Date());
    var charactors = "1234567890";
    var value = '', i;
    for (var j = 1; j <= 4; j++) {
        i = parseInt(10 * Math.random());
        value = value + charactors.charAt(i);
    }
    var odernumber = timestamp + value;
    var neworder = new Duobao(user.name, goodsid, odernumber, false);
    neworder.save(function (err) {
        if (err) {
            return res.json({err: err})
        }
        return res.json({success: '抢购成功', order: odernumber})
    });
});
/**
 * 支付
 */
router.get('/pay', checkLogin);
router.get('/pay', function (req, res, next) {
    var user1 = req.session.user;
    var odernumber = req.query.odernumber;
    Duobao.getOrder(odernumber, function (err, duobao) {
        if (err) {
            return res.json({error: err})
        }
        if (duobao) {
            if (duobao.payed) {
                return res.json({error: '已经支付过了'})
            } else {
                User.pay(odernumber, user1.name, 10, function (err, result) {
                    if (err) {
                        return res.json({error: err})
                    }
                    return res.json({success: '支付成功'})
                })
            }
        } else {
            res.json({error: '该订单号不存在'})
        }

    });


});
router.get('/com/try', function (req, res, next) {
    var file;
    if (req.query.file == undefined) {
        file = config.upload.url + "a.json";
    } else {
        file = config.upload.url + req.query.file + ".json";
    }

    fs.readFile(file, function (err, data) {
        if (err) {
            // console.log("读取文件fail " + err);
            res.json("读取文件fail " + err);
        } else {
            // 读取成功时
            // 输出字节数组
            console.log(data);
            // 把数组转换为gbk中文
            var str = icon.decode(data, 'gbk');
            // console.log(str);
            res.json(JSON.parse(str));
        }
    });
});
router.get('/tx/img', function (req, res, next) {
    var urlinfo = url.parse(req.url, true), type = 'upload';
    if (urlinfo.query && urlinfo.query.type) {
        type = urlinfo.query.type;
    }
    //请将下面的bucket, projectId, secretId和secretKey替换成开发者自己的项目信息
    var bucket = 'guide',
        projectId = '10035266',
        userid = 0,
        secretId = 'AKIDKYtGh72TL4d0Atx1HLJ4f5KMCqLiLB9w',
        secretKey = 'kIfrxrY8dzDF7pMiuxpV3QbaO0a3KPL5';
    tencentyun.conf.setAppInfo(projectId, secretId, secretKey);
    var error = false;
    switch (type) {
        case 'upload':
            var fileid = 'guide' + Math.round(+new Date()),
                expired = Math.round(+new Date() / 1000) + 999,
                uploadurl = tencentyun.imagev2.generateResUrlV2(bucket, userid, fileid),
                sign = tencentyun.auth.getAppSignV2(bucket, fileid, expired);
            ret = {'sign': sign, 'url': uploadurl};
            break;
        case 'stat':
            if (!urlinfo.query || !urlinfo.query.fileid) {
                error = true;
            } else {
                var fileid = decodeURIComponent(urlinfo.query.fileid),
                    otherurl = tencentyun.imagev2.generateResUrlV2(bucket, userid, fileid),
                    ret = {'url': otherurl};
            }
            break;
        case 'del':
        case 'copy':
            if (!urlinfo.query || !urlinfo.query.fileid) {
                error = true;
            } else {
                var fileid = decodeURIComponent(urlinfo.query.fileid),
                    otherurl = tencentyun.imagev2.generateResUrlV2(bucket, userid, fileid, type),
                    sign = tencentyun.auth.getAppSignV2(bucket, fileid, 0);
                ret = {'sign': sign, 'url': otherurl};
            }
            break;
        case 'download':
            if (!urlinfo.query || !urlinfo.query.fileid) {
                error = true;
            } else {
                var fileid = decodeURIComponent(urlinfo.query.fileid),
                    expired = Math.round(+new Date() / 1000) + 999,
                    sign = tencentyun.auth.getAppSignV2(bucket, fileid, expired);
                ret = {'sign': sign};
            }
            break;
        default:
            break;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    if (error) {
        res.end({'error': 'params error'});
    } else {
        res.end(JSON.stringify(ret));
    }
});
router.get('/adposition', function (req, res, next) {
    Ad_position.getAll(function (err, data) {
        if (err) {
            return res.json({success: false, msg: err})
        }
        res.json({success: true, msg: "成功", data: data})
    })
});
router.post('/adposition', checkLogin);
router.post('/adposition', function (req, res, next) {
    var currentUser = req.session.user;
    var adp = new Ad_position(req.body.adorder, req.body.lat, req.body.lon, currentUser);
    adp.save(function (err, data) {
        if (err) {
            return res.json({success: false, msg: err})
        }
        res.json({success: true, msg: "成功", data: data})
    })
});
router.use(function (req, res) {
    res.render("404");
});
function checkLogin(req, res, next) {
    if (!req.session.user) {
        /**
         * 此处要加retrun
         * 不然next（）会继续执行下一条
         */
        return res.json({status: "error", 'error': '未登录!'});
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        return res.json({status: "success", 'error': '已登录!'});
    }
    next();
}

module.exports = router;
