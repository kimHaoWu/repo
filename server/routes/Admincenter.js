var express = require('express');
var router = express.Router();
var date = require("silly-datetime");
const path=require('path');
const db=require('../db/db');
const svgCaptcha = require('svg-captcha')
let request = require('request');
const fs=require('fs')
const moment=require('moment')
const multer=require('multer')
var multipart = require('connect-multiparty'); //在处理模块中引入第三方解析模块
var multipartMiddleware = multipart();

//账户登录
router.post('/login',function (req,res) {
    let {username,password}=req.body
    let sql="select * from work2adminuser where adminname=?";
    db.query(sql,[username],function (err,result) {
        if (err) throw error
        else {
            if (result.length==0){
                res.send({flag: 2,msg:"账号不存在"})
            }else if (result[0].password!=password) {
                res.send({flag: 2,msg:"密码错误"})
            }
            else {
                res.send({flag: 1,msg:"登录成功"})
            }
        }
    })
})
//图片上传
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, 'public/uploadimg/');
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);
    }
});
var createFolder = function (folder) {
    try {
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder);
    } catch (e) {
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }
};
var uploadFolder = './uploadimg';
createFolder(uploadFolder);
var upload = multer({ storage: storage });
router.post('/uploadFile', upload.single('file'), function (req, res, next) {
    var file = req.file;
    console.log('文件类型：%s', file.mimetype);
    console.log('原始文件名：%s', file.originalname);
    console.log('文件大小：%s', file.size);
    console.log('文件保存路径：%s', file.path);
    // 接收文件成功后返回数据给前端
    res.json({ res_code: '0', name: file.originalname, url: file.path });
});
//上传轮播图或者热门图片
router.post('/uploadFiletitle',function (req,res,next) {
    let {imgurl,tosrc,start}=req.body
    let imgurlList = imgurl.split(",");
    let tosrcList = tosrc.split(",");
    let imgurlList2 = imgurlList.filter(function (s) {
        return s && s.trim();
    });
    if (imgurlList2.length!=tosrcList.length){
        res.send({flag:2,msg:'链接数量与图片数量不符'})
    }else {
        let sql='insert into work2movies(imgurl,class,tosrc) values (?,?,?)'
        for (let i=0;i<imgurlList.length;i++){
            db.query(sql,[imgurlList[i],start,tosrcList[i]],function (err,result) {
                if (err) throw error
                else {
                    if (i==imgurlList.length-1){
                        res.send({flag:1,msg:'轮播图上传成功'})
                    }
                }
            })
        }
    }

})
//获得轮播图或者热门图片
router.post('/movies',function (req,res) {
    let {start}=req.body
    let sql='select * from work2movies where class=?'
    db.query(sql,[start],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//删除轮播图或热门图片
router.post('/moviesdel',function (req,res) {
    let {imgurl,start}=req.body
    let sql="delete from work2movies where imgurl=? and class=?"
    db.query(sql,[imgurl,start],function (err,result) {
        if (err) throw err
        else {
            res.send({flag:1,msg:'删除成功'})
        }
    })
})
//增加商品分类
router.post('/classadd',function (req,res) {
    let {bclass,xclass}=req.body
    console.log(bclass,xclass)
    let sql='insert into work2goodclass(bclass,xclass,label,value) values (?,?,?,?)'
    db.query(sql,[bclass,xclass,xclass,xclass],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'添加成功'})
        }
    })
})
//获得商品所有分类
router.get('/classget',function (req,res) {
    let sql='select * from work2goodclass'
    db.query(sql,[],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//删除某分类
router.post('/classdel',function (req,res) {
    let {classList}=req.body
    classList=classList.split(",");
    let aclass=classList[0]
    let bclass=classList[1]
    console.log(aclass,bclass)
    let sql='delete from work2goodclass where bclass=? and xclass=?'
    db.query(sql,[aclass,bclass],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'删除成功'})
        }
    })
})
//上架商品
router.post('/goodupload',function (req,res) {
    let goodid='88'+orderCode()
    let {goodimg,goodname,goodpic,goodclass,goodsize,goodstock,goodhot,goodstart,goodcontent}=req.body
    let sql='insert into work2good(goodid,goodimg,goodname,goodpic,goodclass,goodsize,goodstock,goodhot,goodstart,goodcontent) values (?,?,?,?,?,?,?,?,?,?)'
    db.query(sql,[goodid,goodimg,goodname,goodpic,goodclass,goodsize,goodstock,goodhot,goodstart,goodcontent],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'上架成功'})
        }
    })
})
//浏览所有商品
router.get('/goodall',function (req,res) {
    let sql='select * from work2good'
    db.query(sql,[],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//修改商品信息
router.post('/goodchange',function (req,res) {
    let {goodname,goodhot,goodpic,goodstart,goodcontent,goodstock,goodid,goodsize}=req.body
    console.log(goodname,goodhot,goodpic,goodstart,goodcontent,goodstock,goodsize,goodid)
    let sql='update work2good set goodname=?, goodhot=?, goodpic=?, goodstart=?, goodcontent=?, goodstock=?, goodsize=? where goodid=?'
    db.query(sql,[goodname,goodhot,goodpic,goodstart,goodcontent,goodstock,goodsize,goodid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'修改成功'})
        }
    })
})
//删除商品
router.post('/gooddel',function (req,res) {
    let {goodid}=req.body
    let sql='delete from work2good where goodid=?'
    db.query(sql,[goodid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'删除成功'})
        }
    })
})
//热门根据分类获得商品信息
router.post('/hotgoodget',function (req,res) {
    let {goodclass}=req.body
    let sql='select * from work2good where goodclass like "'+goodclass+'%" '
    db.query(sql,[goodclass],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
function orderCode() {
    var orderCode='';
    for (var i = 0; i < 3; i++) //3位随机数，用以加在时间戳后面。
    {
        orderCode += Math.floor(Math.random() * 10);
    }
    orderCode = new Date().getTime() + orderCode;  //时间戳，用来生成订单号。
    return orderCode;
}
module.exports = router;