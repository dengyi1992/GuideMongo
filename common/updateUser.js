/**
 * Created by deng on 16-6-5.
 */
var config = require("../config.js");
var mysql = require('mysql');

var conn = mysql.createConnection(config.database_info);
//用户注册
exports.insertUser=function (userInfo) {
    var insertUser='insert into users (name ,email ,pwd) values (?,?,?)' ;
    var insertParams=[userInfo.name,userInfo.email,userInfo.password];

    conn.query(insertUser,insertParams,function (err,rows,next) {
        if(err){
            console.log(err);
            return;
        }

    });
};
//用户信息更新
exports.updateUser=function () {

};
//用户账户变化
exports.updateUserWallet=function () {

};