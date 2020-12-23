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

router.post('/uploadFile',function (req,res,next) {
    upload(req,res,function (err) {
        if(err){
            console.log(err)
            return
        }else{
            let imgPath=[];
            req.files.forEach(function (i) {
                //imgPath.push((i.path).replace('public\\',''))
                imgPath.push((i.path).replace('public',''))
            })
            // imgPath=imgPath.toString()
            // let content=req.body.content;
            // let sql=`insert into news21(title,imgPath) values (?,?)`
            // db.query(sql,[content,imgPath],function (err,result) {
            //     if(err){
            //         console.log(err)
            //         return
            //     }else{
            //         res.json({flag:true,msg:'上传成功'})
            //     }
            // })
            res.send(imgPath)
        }
    })
})

//储存图片本地路径
router.post('/uploadFiletitle',function (req,res,next) {
    upload(req,res,function (err) {
        if(err){
            console.log(err)
            return
        }else{
            let imgPath=[];
            req.files.forEach(function (i) {
                imgPath.push((i.path).replace('public\\',''))
                //imgPath.push((i.path).replace('public',''))
            })
            imgPath=imgPath.toString()
            let src=req.body.href
            let where=req.body.wherea
            if (where==1 || where==3){
                let sql='insert into shopbanner(imgPath,href,way) values (?,?,?)'
                console.log('到达2')
                db.query(sql,[imgPath,src,where],function (err,result) {
                    if (err) throw error
                    else {
                        res.json({flag:true,msg:'图片上传成功title'})
                    }
                })
            } else{
                let sql='select * from shopbanner where way=?'
                db.query(sql,[where],function (err,result) {
                    if (err) throw error
                    else {
                        if (result.length==0){

                            let sql2='insert into shopbanner(imgPath,href,way) values (?,?,?)'
                            console.log('到达2-1')
                            db.query(sql2,[imgPath,src,where],function (err,result) {
                                if (err) throw error
                                else {
                                    res.json({flag:true,msg:'图片上传成功title'})
                                }
                            })
                        } else {
                            console.log(result.length)
                            let sql2='update shopbanner set imgPath=?,href=? where way=?'
                            console.log('到达2-2')
                            db.query(sql2,[imgPath,src,where],function (err,result) {
                                if (err) throw error
                                else {
                                    console.log('OKKKKKKKKKKKK')
                                    res.json({flag:true,msg:'图片上传成功title'})
                                }
                            })
                        }
                    }
                })

            }


            // let sql=`insert into bigworktitlepic(author,imgPath,title) values (?,?,?)`
            // db.query(sql,[author,imgPath,title],function (err,result) {
            //     if(err){
            //         console.log(err)
            //         return
            //     }else{
            //         res.json({flag:true,msg:'图片上传成功title'})
            //     }
            // })
        }
    })
})

router.post('/add',function (req,res,next) {
    upload(req,res,function (err) {
        if (err){
            console.log("11"+err)
        } else {
            let sql="select * from bigworktuijian where title=?"
            db.query(sql,[req.body.title],function (err,result) {
                if (result.length==0){
                    let sql1='insert into bigworktuijian(title,main,author) values (?,?,?)'
                    db.query(sql1,[req.body.title,req.body.content,req.body.username],function (err,result) {
                        if (err){
                            console.log(err)
                            return
                        } else {
                            res.json(result)
                        }
                    })
                } else {
                    res.send({flag: false,msg:"标题重复"})
                }
            })
        }
    })
})

router.get('/banner/:num',function (req,res) {
    let num=req.params.num
    console.log(num)
    if (num==3){
        let sql="select  * from shopbanner  where way=? limit 1, 2"
        db.query(sql,[num],function (err,result) {
            if (err) throw err
            else {
                res.json(result)
            }
        })
    }else if (num==1){
        let sql="select  * from shopbanner  where way=? limit 0, 3"
        db.query(sql,[num],function (err,result) {
            if (err) throw err
            else {
                res.json(result)
            }
        })
    }
    else {
        let sql="select  * from shopbanner  where way=? "
        db.query(sql,[num],function (err,result) {
            if (err) throw err
            else {
                res.json(result)
            }
        })
    }

})

router.get('/delete',function (req,res) {
    let sql='TRUNCATE TABLE shopbanner;'
    db.query(sql,[],function (err,result) {
        if (err) throw err
        else {
            res.json({flag:true,msg:'全部删除成功'})
        }
    })
})

router.get('/title/:username',function (req,res) {
    let author=req.params.username
    console.log(author)
    let sql="select * from bigworktuijian where author=?"
    db.query(sql,[author],function (err,result) {
        if (err) throw err
        else {
            res.json(result)
        }
    })
})

router.get('/del/:currentTitle',function (req,res) {
    let title=req.params.currentTitle
    console.log(title)
    let sql="delete from bigworktuijian where title=?"
    db.query(sql,[title],function (err,result) {
        if (err) throw err
        else {
            if (result){
                let sql2="delete from bigworktitlepic where title=?"
                db.query(sql2,[title],function (err,result) {
                    res.json({flag:true,msg:'删除成功'})
                })
            } else {
                res.json({flag:false,msg:'删除失败'})
            }
        }
    })

})

router.get('/update/:title',function (req,res) {
    let title=req.params.title
    let sql="select * from bigworktuijian where title=?"
    db.query(sql,[title],function (err,result) {
        if (err) throw err
        else {
            res.send(result)
        }
    })
})

router.post('/uu',function (req,res,next) {
    upload(req,res,function (err) {
        if (err){
            console.log(err)
        } else {
            let sql='update bigworktuijian set main=? where title=?'
            db.query(sql,[req.body.content,req.body.title],function (err,result) {
                if (err){
                    console.log(err)
                    return
                } else {
                    res.json(result)
                }
            })
        }
    })
})

module.exports = router;