/**
 * Created by deng on 16-4-18.
 */
var mongodb = require('./db');
/**
 *
 * @param name 发布人
 * @param head 头像,暂时用第三方的
 * @param addesc 广告描述
 * @param imgurls 图片地址
 * @param tags 标签,暂定三个
 * @param icons 金币数量
 * @constructor
 *
 */
function Adp(ad_order, lat, lon) {
    this.ad_order = ad_order;
    this.lat = lat;
    this.lon = lon;
}
function getTailer() {
    var s = '';
    for (var i = 0; i < 4; i++) {
        s += parseInt(10 * Math.random());
    }
    return s;
}
module.exports = Adp;
//存储一篇文章及其相关信息
Adp.prototype.save = function (callback) {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    /**
     * addesc=req.body.addesc,
     ad_put_begintime=req.body.ad_put_begintime,
     ad_put_endtime=req.body.ad_put_endtime,
     budget=req.body.budget,
     sig_money=req.body.bucket,
     imgurls=req.body.imgurls,
     key=req.body.key,
     title=req.body.name,
     tags=req.body.tags,
     * @type {{orderno: *, name: *, head: *, time: {date: Date, year: number, month: string, day: string, minute: string}, addesc: *, tags: *, imgurls: *, icons: *, comments: Array, reprint_info: Array, pv: number, isPaid: boolean}}
     */
        //要存入数据库的文档
    var adp = {
            ad_order: this.ad_order,
            lat: this.lat,
            lon: this.lon,
            time: time
        };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('adps', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find({ad_order: adp.ad_order}).sort({
                time: -1
            }).toArray(function (err, docs) {
                if (err) {
                    return callback(err);//失败！返回 err
                }
                if (docs.length <= 0) {
                    //将文档插入 ads 集合
                    collection.insert(adp, {
                        safe: true
                    }, function (err) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//失败！返回 err
                        }
                        callback(null, adp.ad_order);//返回 err 为 null
                    });

                } else {
                    collection.update({
                        ad_order: adp.ad_order
                    }, adp, function (err) {
                        mongodb.close();
                        if (err) {
                            return callback(err);
                        }
                        callback(null, "更新成功");
                    });
                }


            });

        });
    });
};
Adp.getAll = function (callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('adps', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            //根据 query 对象查询文章
            collection.find().sort({
                time: -1
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }

                callback(null, docs);//成功！以数组形式返回查询的结果
            });
        });
    });
};

