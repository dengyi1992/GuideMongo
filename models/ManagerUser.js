/**
 * Created by deng on 16-4-18.
 */
var mongodb = require('./db');
var crypto = require('crypto');
var Duobao = require('./duobao');
function ManagerUser(user) {
    this.name = user.name;
    this.email=user.email;
    this.password = user.password;
    this.account = user.account;
};

module.exports = ManagerUser;

//存储用户信息
/**
 * state:0,1,2
 * 0正常，1冻结
 * @param callback
 */
ManagerUser.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
//要存入数据库的用户信息文档
    var user = {
        name: this.name,
        password: this.password,
        email: null,
        phone:null,
        state:0,
        account: parseInt(0),
        head: head
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('ManagerUsers', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(user, {
                safe: true
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

//读取用户信息
ManagerUser.get = function (name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('ManagerUsers', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};

/**
 *
 * @param name
 * @param adid
 * @param icons
 * @param callback
 */
ManagerUser.add_account = function (name, adid, icons, callback) {
    //打开数据库
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('ManagerUsers', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {

                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                var collection = db.collection('ManagerUsers');
                var wherestr = {"name": name};
                var updateStr = {$set: {"account": parseInt(user.account) + parseInt(icons)}};
                collection.update(wherestr, updateStr, function (err, result) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(err, result);

                })
            });
        });
    });
};
/**
 * 支付扣余额
 * @param name
 * @param cost
 * @param callback
 */
ManagerUser.pay = function (ordernumber, name, cost, callback) {
    //打开数据库
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('ManagerUsers', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {

                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                if (parseInt(user.account) < parseInt(cost)) {
                    return callback('余额不足...')
                }
                var collection = db.collection('ManagerUsers');
                var wherestr = {"name": name};
                var updateStr = {$set: {"account": parseInt(user.account) - parseInt(cost)}};
                collection.update(wherestr, updateStr, function (err, result) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    Duobao.pay(ordernumber, function (error) {
                        if (error) {
                            return callback(error.message);
                        }
                    });
                    callback(err, result);

                })

            });
        });
    });
};
ManagerUser.changePass = function (name, password, newpassword, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('ManagerUsers', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {

                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                var collection = db.collection('ManagerUsers');
                var wherestr = {"name": name, "password": password};
                var updateStr = {$set: {"password": newpassword}};
                collection.update(wherestr, updateStr, function (err, result) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(err, result);

                })
            });
        });
    });
};