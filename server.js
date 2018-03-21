// 基础依赖
let express = require('express'),
    app = express();

// 上传文件依赖
let formidable = require('formidable'),
    http = require('http'),
    util = require('util');

// 静态文件
app.use(express.static('public'));

let per = 0;

// 上传接口
app.post('/upload', function (req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        let form = new formidable.IncomingForm();

        form.uploadDir = "./dir";
        form.maxFileSize = 2000 * 1024 * 1024;// Limits the size 2000MB
        // 每次上传时初始化0
        per = 0;
        form.on('progress', function (bytesReceived, bytesExpected) {
            per = parseInt(bytesReceived / bytesExpected * 100);
            console.log(per + "%");
            if (bytesReceived === bytesExpected) {
                // console.log("finish");
            }
        });
        form.parse(req, function (err, fields, files) {
            let data = null;
            if (err) {
                data = {
                    "code": 1,
                    "msg": "服务器错误"
                }
            } else {
                data = {
                    "code": 0,
                    "msg": "上传成功"
                };
            }
            res.writeHead(200, { 'content-type': 'text/plain;charset=utf-8' });
            res.end(JSON.stringify(data));
        });
    }
});

// 轮训
app.post('/progress', function(req, res) {
    res.writeHead(200, { 'content-type': 'text/plain;charset=utf-8' });
    res.end(JSON.stringify(per));
});

app.listen(3000);