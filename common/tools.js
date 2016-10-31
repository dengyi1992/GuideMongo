/**
 * Created by deng on 16-6-5.
 */
var bcrypt = require('bcryptjs');
var moment = require('moment');
var ManagerUser = require('../models/ManagerUser');
var Ad = require('../models/Ad');

moment.locale('zh-cn'); // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

};

exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function (str, callback) {
    bcrypt.hash(str, 10, callback);
};

exports.bcompare = function (str, hash, callback) {
    bcrypt.compare(str, hash, callback);
};

exports.pay = function (name, order, callback) {
    ManagerUser.get(name, function (nerr, user) {
        if (nerr) {
            return callback(nerr);
        }
        Ad.getByOrder(order, function (oerr, ad) {
            if (oerr) {
                return callback(oerr);
            }
            if (ad.icons > user.account) {
                return callback(null, '余额不足，请充值！')
            }
            {
                Ad.UpdatePayByOrder(order, function (err1, msg1) {
                    if (err1) {
                        return callback(err1);
                    }
                    ManagerUser.updateAccountsByName(name, ad.icons, function (err2, msg2) {
                        if (err2)return callback(err2);
                        callback(null,"支付成功")
                    })
                });


            }
        })
    })
};