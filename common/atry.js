/**
 * Created by deng on 16-6-5.
 */
var querystring = require('querystring');
var util = require('util');
var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var iconv = require('iconv-lite')
var bodyParser = require('body-parser');
var config = require('../config.js');
var conn = mysql.createConnection(config.database_info);
conn.connect();


exports.try = function (req, res, next) {
    var file;
    if (req.query.file==undefined){
        file = config.upload.path_uploadpage + "a.json";
    }else {
        file = config.upload.path_uploadpage + req.query.file+".json";
    }

    fs.readFile(file, function (err, data) {
        if (err) {
            // console.log("读取文件fail " + err);
            res.json("读取文件fail " + err);
        }else
        {
            // 读取成功时
            // 输出字节数组
            console.log(data);
            // 把数组转换为gbk中文
            var str = iconv.decode(data, 'gbk');
            // console.log(str);
            res.json(JSON.parse(str));
        }
    });

};

