/**
 * Created by deng on 16-6-5.
 */
var express = require('express');
var router = express.Router();
var upload = require('../common/upload');
var atry = require('../common/atry');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('通用接口');
});
router.post('/upload', upload.uploadfile);
router.get('/try', atry.try);
