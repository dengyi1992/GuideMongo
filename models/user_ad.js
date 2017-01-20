/**
 * Created by deng on 17-1-20.
 */
var mongodb = require('./db');
/**
 * 用户领取记录
 * @param user_uuid
 * @param ad_uuid
 * @constructor
 */
function UA(user_uuid, ad_uuid, amount) {
    this.user_uuid = user_uuid;
    this.ad_uuid = ad_uuid;
    this.amount = amount;
}
module.exports = UA;
//存储用户信息
UA.prototype.save = function (callback) {
    //打开数据库
    var userUuid = this.user_uuid;
    var adUuid = this.ad_uuid;
    var amount = parseInt(this.amount);
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback("服务器出了个小差");
        }
        //读取 posts 集合
        db.collection('user_ad', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback("服务器出了个小差");
            }
            //根据 query 对象查询文章
            collection.find({
                user_uuid: userUuid,
                ad_uuid: adUuid
            }).sort({
                time: -1
            }).toArray(function (err, docs) {
                if (err) {
                    mongodb.close();
                    return callback("服务器出了个小差");//失败！返回 err
                }
                if (docs.length > 0) {
                    mongodb.close();
                    return callback("已经领取过该广告")
                }
                var ua = {
                    user_uuid: userUuid,
                    ad_uuid: adUuid,
                    amount: amount
                };
                //将用户数据插入 users 集合
                collection.insert(ua, {
                    safe: true
                }, function (err, ua) {
                    if (err) {
                        mongodb.close();
                        return callback("服务器出了个小差");//错误，返回 err 信息
                    }
                    db.collection('ads', function (err, collection) {
                        if (err) {
                            mongodb.close();
                            return callback("服务器出了个小差");
                        }
                        collection.update({
                            uuid: userUuid
                        }, {
                            $inc: {icons: -amount}
                        }, function (err) {

                            if (err) {
                                mongodb.close();
                                return callback("服务器出了个小差");
                            }
                            db.collection('users', function (err, collection) {
                                if (err) {
                                    mongodb.close();
                                    return callback("服务器出了个小差");
                                }
                                collection.update({
                                    uuid: userUuid
                                }, {
                                    $inc: {account: amount}
                                }, function (err) {
                                    mongodb.close();

                                    if (err) {
                                        return callback("服务器出了个小差");
                                    }
                                    callback(null, "成功领取金币");

                                })
                            })
                        });
                    });
                });
            });
        });
    });
};