const express = require('express');
const router = express.Router();
const path=require('path');
const db=require('../db/db');
const fs=require('fs')
const moment=require('moment')
const multer=require('multer')


let uploadDir=`./public/upload/${moment().format('YYYYMMDD')}`
fs.mkdirSync(uploadDir,{
    recursive:true
})
const storage=multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,uploadDir)
    },
    filename:function (req,file,cb) {
        cb(null,Date.now()+'-'+file.originalname)
    }
})

let upload=multer({
    storage:storage
}).array('pic')

//admin获取商品列表
router.get('/all',function (req,res) {
    let sql='select * from shopgoods'
    db.query(sql,[],function (err,result) {
        if (err) throw err
        else {
            res.send(result)
        }
    })
})


//admin上架商品
router.post('/add',function (req,res,next) {
    upload(req,res,function (err) {
        if (err){
            console.log("11"+err)
        } else {
            let {Goodid,Goodname,Goodpri,Goodstock,Goodclass,content}=req.body
            //缩略图获取
            let imgPath=[];
            req.files.forEach(function (i) {
                imgPath.push((i.path).replace('public\\',''))
            })
            imgPath=imgPath.toString()
            let ID=Getoder(Goodid)
            console.log(ID)
            let sql="select * from shopgoods where GoodId=?"
            db.query(sql,[ID],function (err,result) {
                if (result.length==0){
                    let sql2='insert into shopgoods(GoodId,GoodName,GoodImg,GoodPri,GoodStock,GoodDetli,GoodClass) values (?,?,?,?,?,?,?)'
                    db.query(sql2,[ID,Goodname,imgPath,Goodpri,Goodstock,content,Goodclass],function (err,result) {
                        if (err) throw error
                        else {
                            res.send({flag:true,msg:'上架成功'})
                        }
                    })
                } else {
                    let newID=Getoder(ID)
                    let sql2='insert into shopgoods(GoodId,GoodName,GoodImg,GoodPri,GoodStock,GoodDetli,GoodClass) values (?,?,?,?,?,?,?)'
                    db.query(sql2,[newID,Goodname,imgPath,Goodpri,Goodstock,content,Goodclass],function (err,result) {
                        if (err) throw error
                        else {
                            res.send({flag:true,msg:'上架成功'})
                        }
                    })
                }
            })
        }
    })
})

//更新商品
router.post('/update',function (req,res) {
    upload(req,res,function (err) {
        if (err){
            console.log("11"+err)
        } else {
            let {Goodid,Goodname,Goodpri,Goodstock,Goodclassend,content}=req.body
            //缩略图获取
            let imgPath=[];
            req.files.forEach(function (i) {
                imgPath.push((i.path).replace('public\\',''))
            })
            imgPath=imgPath.toString()
            let sql='update shopgoods set GoodName=?,GoodImg=?,GoodPri=?,GoodStock=?,GoodDetli=?,GoodClass=?  where GoodId=?'
            db.query(sql,[Goodname,imgPath,Goodpri,Goodstock,content,Goodclassend,Goodid],function (err,result) {
                if (err) throw error
                else {
                    res.send({flag:true,msg:'更新成功'})
                }
            })

        }
    })
})

//下架商品
router.post('/del/:e',function (req,res) {
    let Goodid=req.params.e
    console.log(Goodid+'ee')
    let sql="delete from shopgoods where GoodId=?"
    db.query(sql,[Goodid],function (err,result) {
        if (err) throw err
        else {
            res.send({flag:true,msg:'下架成功'})
        }
    })
})
//修改商品详细
router.post('/getlist/:Goodid',function (req,res) {
    let Goodid=req.params.Goodid
    let sql="select * from shopgoods where GoodId=?"
    db.query(sql,[Goodid],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})

//商品列表根据条件获得商品
router.get('/usergetgoods/:Mainkey',function (req,res) {
    let key=req.params.Mainkey
    let nkey='%'+key+'%'
    console.log(nkey)
    let sql="select * from shopgoods where  (GoodClass like ? or GoodName like ?)"
    db.query(sql,[nkey,nkey],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })

})

router.get('/getgooddeli/:GoodId',function (req,res) {
    let ID=req.params.GoodId
    console.log(ID)
    let sql='select * from shopgoods where  GoodId = ?'
    db.query(sql,[ID],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})

//获取6位随机数生成单号
function Getoder(a){
    for (i=0;i<3;i++){
        a += Math.floor(Math.random() * 10);
    }
    outTradeNo =String(a)

    return outTradeNo
}
module.exports = router;