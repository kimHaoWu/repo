var express = require('express');
var router = express.Router();
const path=require('path');
const db=require('../db/db');
let request = require('request');
//登录
router.post('/login',function (req,res) {
    let {username,password}=req.body
    res.send({flag: 1,msg:"登录成功"})
    // let sql="select * from work2adminuser where adminname=?";
    // db.query(sql,[username],function (err,result) {
    //     if (err) throw error
    //     else {
    //         if (result.length==0){
    //             res.send({flag: 2,msg:"账号不存在"})
    //         }else if (result[0].password!=password) {
    //             res.send({flag: 2,msg:"密码错误"})
    //         }
    //         else {
    //             res.send({flag: 1,msg:"登录成功"})
    //         }
    //     }
    // })
})
//增加新待办
router.post('/addwork',function (req,res) {
    let {workname}=req.body
    let check='select * from testwork where workname=?'
    db.query(check,[workname],function (err,result) {
        if (result.length!=0){
            res.send({flag: 2,msg:"待办事件名字重复"})
        } else {
            let workid='88'+orderCode()
            var myDate = new Date();
            let day=myDate.toLocaleDateString(); //申请日期
            let state='未完成'
            let sql='insert into testwork(workid,workname,today,state) values (?,?,?,?)'
            db.query(sql,[workid,workname,day,state],function (err,result) {
                if (err) throw error
                else {
                    res.send({flag: 1,msg:"增加成功"})
                }
            })
        }
    })
})
//获取所有待办
router.get('/getall',function (req,res) {
    let check='select * from testwork'
    db.query(check,[],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//删除某待办
router.post('/del',function (req,res) {
    let {workid}=req.body
    console.log(workid)
    let sql='delete from testwork where workid=? '
    db.query(sql,[workid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag: 1,msg:"删除成功"})
        }
    })
})
//完成某待办
router.post('/ok',function (req,res) {
    let {workid}=req.body
    let state='完成'
    let sql='update testwork set state=? where workid=?'
    db.query(sql,[state,workid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag: 1,msg:"完成"})
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