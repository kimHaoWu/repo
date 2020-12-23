var express = require('express');
var router = express.Router();
const path=require('path');
const db=require('../db/db');

router.get('/tuijian/:pageIndex/:pageSize',function (req,res) {
    console.log(req.params)
    let pageIndex=parseInt(req.params.pageIndex)
    let pageSize=parseInt(req.params.pageSize)
    let pos=(pageIndex-1)*pageSize
    let sql='select *from bigworktitlepic order by title desc limit ? , ?'
    db.query(sql,[pos,pageSize],function (err,result) {
        if (err) throw err;
        else {
            res.json(result)
        }
    })
})

router.get('/a',function (req,res,next) {
    let sql='select count(*) as totalCount from bigworktitlepic'
    console.log(sql)
    db.query(sql,null,function (err,result) {
        if (err){
            console.log(err)
            return
        } else {
            console.log(result)
            res.json(result)
        }
    })
})


module.exports = router;