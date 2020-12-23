var express = require('express');
var router = express.Router();
const path=require('path');
const db=require('../db/db');
const svgCaptcha = require('svg-captcha')
let request = require('request');

router.post('/login',function (req,res) {
  console.log(req.body)
  let code=req.body.code
  console.log('code'+code)
  var url='https://api.weixin.qq.com/sns/jscode2session?appid=wxe393be6ef5f6e695&secret=8a428c0102c3feaddf500158a001a8c5&js_code='+code+'&grant_type=authorization_code'
  request(url,(err,response,body)=>{
    var session = JSON.parse(body)
    if (session.openid){
      var token='user_'+new Date().getTime()
      console.log(session.openid,session.session_key)
      let checkusersql='select * from work3user where openid=?'
      db.query(checkusersql,[session.openid],function (err,result) {
        if (err) throw error
        console.log(result)
        if (result.length==0){
          let sql='insert into work3user(openid,session_key,token) values (?,?,?)'
          db.query(sql,[session.openid,session.session_key,token],function (err,result) {
            if (err) throw error
            else {
              console.log('添加用户成功')
              res.send(token)
            }
          })
        }else {
          console.log('用户已存在，返回其token值')
          res.json(result)
        }
      })
    }
  })
})


module.exports = router;
