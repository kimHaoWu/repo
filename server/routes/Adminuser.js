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
    let sql="select * from myshopusercenter where username=?";
    db.query(sql,[username],function (err,result) {
        if (err) throw error
        else {
            if (result.length==0){
                res.send({flag: false,msg:"账号不存在"})
            }else if (result[0].userpassword!=password) {
                res.send({flag: false,msg:"密码错误"})
            }
            else {
                res.send({flag: true,msg:"登录成功"})
            }
        }
    })
})
//账户注册
router.post('/reg',function (req,res) {
    let {username,dianpuid,userpassword}=req.body
    console.log(username,dianpuid,userpassword)
    let checkusername='select * from myshopusercenter where username=?'
        db.query(checkusername,[username],function (err,result) {
            if (err) throw error
            else {
                if (result.length!=0){
                    res.send({flag:5,msg:'用户名已存在！'})
                } else {
                    let check='select * from myshopshops where dianpuid=?'
                    db.query(check,[dianpuid],function (err,result) {
                        if (err) throw error
                        else {
                            if (result.length==0){
                                res.send({flag:5,msg:'店铺id错误！请联系管理员12346789'})
                            } else {
                                console.log(result)
                                let sql='insert into myshopusercenter(username,userpassword,dianpuid) values (?,?,?)'
                                db.query(sql,[username,userpassword,dianpuid],function (err,result2) {
                                    if (err) throw error
                                    else {
                                        res.send({flag:1,msg:'申请成功！'})
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })



})
//商家用户登录获取店铺id
router.post('/usergetid',function (req,res) {
    let {username}=req.body
    let sql='select * from myshopusercenter where username=?'
    db.query(sql,[username],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//验证码
router.get('/imgcode', function(req, res)  {
    const captcha = svgCaptcha.create({
        noise: 3, // 干扰线条的数量
        background: '#ff5033' // 背景颜色
    });
    // 将图片的验证码存入到 session 中
    req.session.img_code = captcha.text.toLocaleUpperCase()
    console.log(req.session.img_code)// 将验证码装换为大写
    res.type('svg');
    res.send(captcha.data);
})

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

//上传轮播图
router.post('/uploadFiletitle',function (req,res,next) {
    let {imgurl,url}=req.body
    dianpuimg2=imgurl.replace(/\\/g,"\/")
    let start=1 //状态1为轮播图 2为宣传视频 3为简介
    let sql='insert into myshopmovies(imgsrc,url,start) values (?,?,?)'
    db.query(sql,[imgurl,url,start],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'轮播图上传成功'})
        }
    })
})
//获得轮播图
router.get('/movies',function (req,res) {
    let start=1
    let sql='select * from myshopmovies where start=?'
    db.query(sql,[start],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
    console.log('ok')
})
//删除轮播图
router.post('/moviesdel',function (req,res) {
    let {imgurl}=req.body
    let start=1
    let sql="delete from myshopmovies where imgsrc=? and start=?"
    db.query(sql,[imgurl,start],function (err,result) {
        if (err) throw err
        else {
            res.send({flag:1,msg:'删除成功'})
        }
    })
})
//获得主页播放视频
router.get('/getvideo',function (req,res) {
    let start=2
    let sql='select * from myshopmovies where start=?'
    db.query(sql,[start],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//上传主页播放视频
router.post('/addvideo',function (req,res) {
    let {newurl}=req.body
    let start=2
    let sql='update myshopmovies set url=? where start=?'
    db.query(sql,[newurl,start],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'上传成功'})
        }
    })
})
//获得主页简介
router.get('/getcontent',function (req,res) {
    let start=3
    let sql='select * from myshopmovies where start=?'
    db.query(sql,[start],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//修改主页简介
router.post('/addcontent',function (req,res) {
    let {newcontent}=req.body
    let start=3
    let sql='update myshopmovies set content=? where start=?'
    db.query(sql,[newcontent,start],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'修改成功'})
        }
    })
})
//获取申请店铺的表单
router.get('/getdianpureg',function (req,res) {
    let sql='select * from myshopsubfrom'
    db.query(sql,[],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//完成申请店铺的表单
router.post('/finishdianpureg',function (req,res) {
    let {messid}=req.body
    let start='已查阅'
    let sql='update myshopsubfrom set start=? where messid=?'
    db.query(sql,[start,messid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'已修改状态'})
        }
    })
})
//关于我们设置
router.post('/aboutus',function (req,res) {
    let {start}=req.body
    //start=1为获取当前内容，2为修改当前内容
    if (start==1){
        let sql='select * from myshopaboutus'
        db.query(sql,[],function (err,result) {
            if (err) throw error
            else {
                res.send(result)
            }
        })
    }else if (start==2) {
        let {content}=req.body
        let sql='update myshopaboutus set content=?'
        db.query(sql,[content],function (err,result) {
            if (err) throw error
            else {
                res.send({flag:1,msg:'已修改当前内容'})
            }
        })
    }else {
        let {phone,imgsrc}=req.body
        let sql='update myshopaboutus set phone=?,imgsrc=?'
        dianpuimg2=imgsrc.replace(/\\/g,"\/") //修改成小程序可见图片
        db.query(sql,[phone,dianpuimg2],function (err,result) {
            if (err) throw error
            else {
                res.send({flag:1,msg:'已修改当前内容'})
            }
        })
    }
})
//删除处理过后的申请店铺表单
router.post('/deldianpureg',function (req,res) {
    let {messid}=req.body
    let sql='delete from myshopsubfrom where messid=?'
    db.query(sql,[messid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'删除成功'})
        }
    })
})
//上传店铺
router.post('/dianpuadd',function (req,res) {
    let {dianpuname,dianpuclass,dianpuway,dianpuphone,dianpured,dianpuimg,dianpucontent}=req.body
    console.log(dianpuname,dianpuclass,dianpuway,dianpuphone,dianpured,dianpuimg)
    dianpuimg2=dianpuimg.replace(/\\/g,"\/") //修改成小程序可见图片
    let dianpuid=orderCode()
    let sql='insert into myshopshops(dianpuid,dianpuimg,dianpuname,dianpuclass,dianpuway,dianpured,dianpuphone,dianpucontent) values (?,?,?,?,?,?,?,?)'
    db.query(sql,[dianpuid,dianpuimg2,dianpuname,dianpuclass,dianpuway,dianpured,dianpuphone,dianpucontent],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'店铺上架成功'})
        }
    })
})
//获得所有店铺列表
router.get('/getdianpuall',function (req,res) {
    let sql='select * from myshopshops'
    db.query(sql,[],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//获得店铺详情页
router.post('/dianpufix',function (req,res) {
    let {fixnum}=req.body
    let sql='select * from myshopshops where dianpuid=?'
    db.query(sql,[fixnum],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//修改店铺详情页
router.post('/dianputofix',function (req,res) {
    let {dianpuid,dianpuname,dianpuclass,dianpuway,dianpured,dianpuphone,dianpuimg,dianpucontent}=req.body
    console.log(dianpuid,dianpuname,dianpuclass,dianpuway,dianpured,dianpuphone,dianpuimg,dianpucontent)
    dianpuimg2=dianpuimg.replace(/\\/g,"\/")
    let sql='update myshopshops set dianpuname=?,dianpuclass=?,dianpuway=?,dianpured=?,dianpuphone=?,dianpuimg=?,dianpucontent=? where dianpuid=?'
    db.query(sql,[dianpuname,dianpuclass,dianpuway,dianpured,dianpuphone,dianpuimg2,dianpucontent,dianpuid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'店铺修改成功'})
        }
    })
})
//删除店铺
router.post('/dianputodel',function (req,res) {
    let {dianpuid}=req.body
    let sql='delete from myshopshops where dianpuid=?'
    db.query(sql,[dianpuid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'删除成功，其相应的商品已下架'})
        }
    })
})
//获得所有申请消息
router.get('/getallreg',function (req,res) {
    let sql='select * from myshopreg'
    db.query(sql,[],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//获得消息的详细信息
router.post('/getreg',function (req,res) {
    let {messid}=req.body
    let sql='select * from myshopreg where messid=?'
    db.query(sql,[messid],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//同意或拒绝商家提交的申请
router.post('/regno',function (req,res) {
    let {messid,state,List}=req.body
    if (state==2){
        let {whyno}=req.body
        if (whyno.length==0){
            whyno='已与客户协商，客户稍后整改'
        }
        let sql='update myshopreg set messstate=2,whyno=? where messid=?'
        db.query(sql,[whyno,messid],function (err,result) {
            if (err) throw error
            else {
                res.send({flag:1,msg:'已将该申请状态改为未通过'})
            }
        })
    } else if (state==1) {
        let sql='update myshopshops set dianpuname=?,dianpuclass=?,dianpuway=?,dianpuphone=?,dianpuimg=?,dianpured=?,dianpucontent=? where dianpuid=?'
        db.query(sql,[List.dianpuname,List.dianpuclass,List.dianpuway,List.dianpuphone,List.dianpuimg,List.dianpured,List.dianpucontent,List.dianpuid],function (err,result) {
            if (err) throw error
            else {
                let sql2='update myshopreg set messstate=1 where messid=?'
                db.query(sql2,[messid],function (err,result) {
                    if (err) throw error
                    else {
                        res.send({flag:1,msg:'已通过该申请，并已修改内容'})
                    }
                })
            }
        })
    }else {
        let sql='update myshopshops set dianpured=1 where dianpuid=?'
        db.query(sql,[List.dianpuid],function (err,result) {
            if (err) throw error
            else {
                let sql2='update myshopreg set messstate=1 where messid=?'
                db.query(sql2,[messid],function (err,result) {
                    if (err) throw error
                    else {
                        res.send({flag:1,msg:'已通过该申请，并已修改内容'})
                    }
                })
            }
        })
    }
})
//商家获得店铺信息
router.post('/getmyselt/:e',function (req,res) {
    let dianpuid=req.params.e
    let sql='select * from myshopshops where dianpuid=?'
    db.query(sql,[dianpuid],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })

})
//商家提交修改店铺信息申请
router.post('/usermyseltfix',function (req,res) {
    let {regclass}=req.body
    var myDate = new Date();
    let day=myDate.toLocaleDateString(); //申请日期
    let messid='00'+orderCode()  //申请id
    let messstate=0 //申请状态 0为未处理 1为申请通过 2为不通过
    if (regclass==1){
        let {dianpuid,dianpuname,dianpuclass,dianpuway,dianpured,dianpuphone,dianpuimg,dianpucontent,why}=req.body
        dianpuimg2=dianpuimg.replace(/\\/g,"\/")
        let title='店铺信息修改申请'  //申请类型
        let sql='insert into myshopreg(title,dianpuid,dianpuphone,day,dianpuname,dianpuclass,dianpuimg,dianpuway,messid,messstate,dianpucontent,why,dianpured) values (?,?,?,?,?,?,?,?,?,?,?,?,?)'
        db.query(sql,[title,dianpuid,dianpuphone,day,dianpuname,dianpuclass,dianpuimg2,dianpuway,messid,messstate,dianpucontent,why,dianpured],function (err,result) {
            if (err) throw error
            else {
                res.send({flag:1,msg:'申请提交成功'})
            }
        })
    }else {
        let {dianpuid,dianpuphone,dianpuname,dianpuclass}=req.body
        let title='店铺热门申请'  //申请类型
        let sql='insert into myshopreg(title,dianpuid,dianpuphone,day,dianpuname,dianpuclass,messid,messstate) values (?,?,?,?,?,?,?,?)'
        db.query(sql,[title,dianpuid,dianpuphone,day,dianpuname,dianpuclass,messid,messstate],function (err,result) {
            if (err) throw error
            else {
                res.send({flag:1,msg:'申请提交成功'})
            }
        })
    }




})
//商家提交推广店铺申请
router.post('/redchange/:e',function (req,res) {
    let dianpuid=req.params.e
    console.log(dianpuid)
    let title='店铺推广申请'
    let today = date.format(new Date(),'YYYY-MM-DD');
    let messnum='02'+orderCode()
    let se='select * from myshopshops where dianpuid=?'
    db.query(se,[dianpuid],function (err,result) {
        if (err) throw error
        else {
            let dianpuphone=result[0].dianpuphone
            let messstate=0
            let sql='insert into myshopreg(title,dianpuid,date,dianpuphone,messnum,messstate) values (?,?,?,?,?,?)'
            db.query(sql,[title,dianpuid,today,dianpuphone,messnum,messstate],function (err,result) {
                if (err) throw error
                else {
                    res.send({flag:true,msg:'申请提交成功'})
                }
            })
        }
    })
})
//商家获取所有的消息
router.post('/usergetmess',function (req,res) {
    let {dianpuid}=req.body
    console.log(dianpuid)
    let sql='select * from myshopreg where dianpuid=?'
    db.query(sql,[dianpuid],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//商家删除消息记录
router.post('/userdelmess',function (req,res) {
    let {messid}=req.body
    sql='delete from myshopreg where messid=? '
    db.query(sql,[messid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'删除/撤销申请成功'})
        }
    })
})
//商家商品总览
router.post('/usergetallgoods',function (req,res) {
    let {dianpuid}=req.body
    let sql='select * from myshopgoods where dianpuid=?'
    db.query(sql,[dianpuid],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//商家上架商品
router.post('/useraddgood',function (req,res) {
    let goodid='88'+orderCode()
    let {dianpuid, goodimg, goodname, goodclass, goodred, goodpic, goodstock, goodstart, goodcontent}=req.body
    goodimg2=goodimg.replace(/\\/g,"\/")
    let sql='insert into myshopgoods(goodid,dianpuid, goodimg, goodname, goodclass, goodred, goodpic, goodstock, goodstart, goodcontent) values (?,?,?,?,?,?,?,?,?,?)'
    db.query(sql,[goodid,dianpuid, goodimg2, goodname, goodclass, goodred, goodpic, goodstock, goodstart, goodcontent],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'上架成功'})
        }
    })

})
//商家查看商品详情
router.post('/usergetgood',function (req,res) {
    let {goodid}=req.body
    let sql='select * from myshopgoods where goodid=?'
    db.query(sql,[goodid],function (err,result) {
        if (err) throw  error
        else {
            res.send(result)
        }
    })
})
//商家修改商品
router.post('/goodtofix',function (req,res) {

    let {goodid, goodimg, goodname, goodclass, goodred, goodpic, goodstock, goodstart, goodcontent}=req.body
    goodimg2=goodimg.replace(/\\/g,"\/")
    let sql='update myshopgoods set goodimg=?, goodname=?, goodclass=?, goodred=?, goodpic=?, goodstock=?, goodstart=?, goodcontent=? where goodid=?'
    db.query(sql,[goodimg2, goodname, goodclass, goodred, goodpic, goodstock, goodstart, goodcontent,goodid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'修改成功'})
        }
    })

})
//商家删除商品
router.post('/userdelgood',function (req,res) {
    let {goodid}=req.body
    let sql='delete from myshopgoods where goodid=? '
    db.query(sql,[goodid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'删除成功'})
        }
    })
})
//商家获取自己创建的分类
router.post('/usergetclass',function (req,res) {
    let {dianpuid}=req.body
    let sql='select * from myshopuserclass where dianpuid=?'
    db.query(sql,[dianpuid],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//商家增加或删除分类
router.post('/userchangeclass',function (req,res) {
    let {state}=req.body
    //1为添加 2为输出
    if (state==1){
        let {dianpuid,newclass}=req.body
        let sql='insert into myshopuserclass(classname,dianpuid) values (?,?)'
        db.query(sql,[newclass,dianpuid],function (err,result) {
            if (err) throw error
            else {
                res.send({flag:1,msg:'新增分类成功'})
            }
        })

    } else {
        let {dianpuid,seleclass}=req.body
        let sql='delete from myshopuserclass where classname=? and dianpuid=?'
        db.query(sql,[seleclass,dianpuid],function (err,result) {
            if (err) throw error
            else {
                res.send({flag:true,msg:'删除分类成功'})
            }
        })
    }
})
//商家获取所有订单信息
router.post('/usergetorder',function (req,res) {
    let {dianpuid}=req.body
    let checkgoodsql='select * from myshopgoods where dianpuid=?'
    let goodList=[]
    let end=[]
    db.query(checkgoodsql,[dianpuid],function (err,result) {
        if (err) throw error
        else {
            console.log(result.length)
            for (let i=0;i<result.length;i++){
                goodList.push(result[i].goodid)
            }
            let sql='select * from myshoporders where find_in_set(?,goodid)'
            for (let i=0;i<goodList.length;i++){
                db.query(sql,[goodList[i]],function (err,result) {
                    for( let j in result)
                    {
                        end.push(result[j]);
                    }
                    console.log(end.length)

                    if (i+1==goodList.length){
                        let orderidList=[]
                        for (let k=0;k<end.length;k++){
                            orderidList.push(end[k].orderid)
                            if (k+1==end.length){
                                orderidList=Array.from(new Set(orderidList))
                                console.log(orderidList.length)
                                let sql2='select * from myshoporders where orderid=?'
                                let endList=[]
                                for (let l=0;l<orderidList.length;l++){
                                    db.query(sql2,[orderidList[l]],function (err,result) {
                                            endList.push(result[0]);
                                        if (l+1==orderidList.length){
                                            console.log(endList.length)
                                            res.send(endList)
                                        }
                                    })

                                }
                            }
                        }
                    }
                })
            }

        }
    })
})
//商家获取订单中属于自己的商品信息
router.post('/usergetordermess',function (req,res) {
    let {dianpuid,goodList}=req.body
    goodList = goodList.split(",");
    console.log(dianpuid,goodList)
    let end=[]
    let sql='select * from myshopgoods where dianpuid=? and goodid=?'
    for (let i=0;i<goodList.length;i++){
        db.query(sql,[dianpuid,goodList[i]],function (err,result) {
            if (err) throw error
            else {
                end.push(result[0])
                if (i+1==goodList.length){
                    res.send(end)
                }
            }
        })
    }
})
//商家完成发货
router.post('/userfinishorder',function (req,res) {
    let {orderid,kuaidinumber}=req.body
    console.log(orderid,kuaidinumber)
    let start='已发货'
    let sql='update myshoporders set start=?,kuaidinumber=? where orderid = ?'
    db.query(sql,[start,kuaidinumber,orderid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'修改完成'})
        }
    })
})
//商家关闭订单
router.post('/userdelorder',function (req,res) {
    let {orderid,delwhy}=req.body
    let start='订单已关闭'
    let sql='update myshoporders set start=?,delwhy=? where orderid = ?'
    db.query(sql,[start,delwhy,orderid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'订单已关闭'})
        }
    })
})
//时间戳加6位随机数
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
