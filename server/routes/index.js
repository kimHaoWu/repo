var express = require('express');
var router = express.Router();
const path=require('path');
const db=require('../db/db');
let request = require('request');
var async = require('async');
var step = require('step');

//主页获取轮播图
router.get('/getmovies', function(req, res, next) {
  let sql='select * from myshopmovies'
  db.query(sql,[],function (err,result) {
    if (err) throw error
    else {
      res.send(result)
    }
  })
});

//获得热门店铺
router.get('/getalldianpu',function (req,res,next) {
  let nowclass=req.query.class
  console.log(nowclass)
  let sql='select * from myshopshops'
  db.query(sql,[],function (err,result) {
    if (err) throw error
    else {
      res.send(result)
    }
  })
})
//获得详细店铺内容
router.get('/getdianpu',function (req,res) {
  let dianpuid=req.query.dianpuid
  let sql='select * from myshopshops where dianpuid=?'
  db.query(sql,[dianpuid],function (err,result) {
    if (err) error
    else {
      res.send(result)
    }
  })
})
//获得商铺分类
router.get('/getdianpuclass',function (req,res) {
  let dianpuid=req.query.dianpuid
    console.log(dianpuid)
  let sql='select * from myshopuserclass where dianpuid=?'
  db.query(sql,[dianpuid],function (err,result) {
    if (err) throw error
    else {
      res.send(result)
    }
  })
})
//获得该商铺所有商品
router.get('/getallgood',function (req,res) {
  let dianpuid=req.query.dianpuid
  let sql='select * from myshopgoods where dianpuid=?'
  db.query(sql,[dianpuid],function (err,result) {
    if (err) throw error
    else {
      res.send(result)
    }
  })

})
//获得商品详情
router.get('/getgood',function (req,res) {
  let goodid=req.query.goodid
  let sql='select * from myshopgoods where goodid=?'
  db.query(sql,[goodid],function (err,result) {
    if (err) throw error
    else {
      res.send(result)
    }
  })
})
//添加商品到购物车
router.get('/inserttocar',function (req,res) {
  let goodid=req.query.goodid
  let token=req.query.token
  let number=req.query.number
  let check='select * from myshopgoodcar where goodid=?'
  db.query(check,[goodid],function (err,result) {
      if (err) throw error
      else {
          if (result.length!=0){
              let sql='update myshopgoodcar set number=number+? where goodid = ?'
              db.query(sql,[number,goodid],function (err,result) {
                  if (err) throw error
                  res.send({flag:true,msg:'商品已存在'})
              })
          } else {
              //根据商品id获得商品信息
              let now=0
              let sql0='select * from myshopgoods where goodid=?'
              db.query(sql0,[goodid],function (err,result) {
                  if (err) throw error
                  else {
                      now=1
                      console.log(result[0].goodname,now)
                      if (now=1){
                          let sql='insert into myshopgoodcar(token,goodid,goodname,goodpic,goodimg,number) values (?,?,?,?,?,?)'
                              db.query(sql,[token,goodid,result[0].goodname,result[0].goodpic,result[0].goodimg,number],function (err,re) {
                                  if (err) throw error
                                  else {
                                      res.send({flag:true,msg:'增加购物车成功'})
                                  }
                              })
                      }
                  }
              })
          }
      }
  })


})
//用户获取自己的购物车
router.get('/getgoodcar',function (req,res) {
  let token=req.query.token
  let sql='select * from myshopgoodcar where token=?'
  db.query(sql,[token],function (err,result) {
    if (err) throw error
    res.send(result)
  })
})
//购物车加减商品
router.get('/adorsub',function (req,res) {
    let goodid=req.query.goodid
    let state=req.query.state
    let token=req.query.token
    //state=1时为加，为2时为减
    if (state==1){
        let sql='update myshopgoodcar set number=number+1 where goodid = ?'
        db.query(sql,[goodid],function (err,result) {
            if (err) throw error
            res.send({flag:true,msg:'修改成功'})
        })
    }else {
        let sql='update myshopgoodcar set number=number-1 where goodid = ?'
        db.query(sql,[goodid],function (err,result) {
            if (err) throw error
            res.send({flag:true,msg:'修改成功'})
        })
    }


})
//删除购物车内商品
router.get('/delgoodcar',function (req,res) {
    let goodid=req.query.goodid
    let token=req.query.token
    let  goodid2=JSON.parse(goodid)
    let sql='delete from myshopgoodcar where goodid=? and token=?'
    for (let i=0;i<goodid2.length;i++){
        db.query(sql,[goodid2[i],token],function (err,result) {
            if (err) throw error
        })
    }
    res.send({flag:true,msg:'删除成功'})

})
//获取商品信息以确定订单
router.get('/getorder',function (req,res) {
    let goodid=req.query.goodid
    let token=req.query.token
    let orderid='44'+orderCode()
    console.log(orderid)
    var myDate = new Date();
    let day=myDate.toLocaleDateString();
    let strat=0
    console.log(orderid,goodid,token,day,strat)
    let sql='insert into myshoporders(orderid,goodid,token,day,start) values (?,?,?,?,?)'
    db.query(sql,[orderid,goodid,token,day,strat],function (err,result) {
        if (err) throw error
        res.send(orderid)

    })
})
//获取订单的商品信息
router.get('/getordermess',function (req,res) {
        let orderid=req.query.orderid
        let token=req.query.token
        let goodList=[]
        let sql='select * from myshoporders where orderid=?'
        db.query(sql,[orderid],function (err,result) {
            if (err) throw error
            let goodids=result[0].goodid
            var array = goodids.replace(/\"/g, "");
            array=array.replace(/\[|]/g, '' )
            array=array.split(",");
            console.log(array)
            for (let i=0;i<=array.length;i++){
                let sql2='select * from myshopgoodcar where goodid=? and token=?'
                db.query(sql2,[array[i],token],function (err,result) {
                    if (err) throw error
                    goodList.push(result[0])
                    if (i==array.length){
                        console.log(goodList)
                        res.send(goodList)
                    }
                })
            }

        })


})
//获取用户收货地址
router.get('/getuserhome',function (req,res) {
    let token=req.query.token
    let sql='select * from myshopuser where token=?'
    db.query(sql,[token],function (err,result) {
        if (err) throw error
        else {
            res.send(result)
        }
    })
})
//检查商品与库存
router.get('/checknumber',function (req,res) {
    let goodid=req.query.goodid
    let goodidList=goodid.split(",")
    let sql='select * from myshopgoods where goodid=?'
    let endList=[]
    let start=0
    for (let i=0;i<=goodidList.length;i++){
        db.query(sql,[goodidList[i]],function (err,result) {
            if (err) throw error
            else {
                endList.push(result[0])
            }
            if (i==goodidList.length) {
             res.send(endList)
            }
        })

    }

})
//确认订单
router.get('/ordersure',function (req,res) {
    let number=req.query.number
    let goodid=req.query.goodid
    let token=req.query.token
    let orderid=req.query.orderid
    let home=req.query.home
    let other=req.query.remarks
    let phone=req.query.phone
    let username=req.query.username
    // let goodidList=goodid.split(",")
    let sql='update myshoporders set goodid=?,home=?,other=?,phone=?,username=?,number=?,start=1 where orderid = ?'
    db.query(sql,[goodid,home,other,phone,username,number,orderid],function (err,result) {
        if (err) throw error
        else {
            let sql2='update myshopgoods set goodstock=goodstock-? where goodid = ?'
            let goodidList=goodid.split(",")
            let numberList=number.split(",")
            for (let i=0;i<goodidList.length;i++){
                db.query(sql2,[numberList[i],goodidList[i]],function (err,result) {
                    if (i+1==goodidList.length){
                        let sql3='delete from myshopgoodcar where goodid=? and token=?'
                        for (let j=0;j<goodidList.length;j++){
                            db.query(sql3,[goodidList[j],token],function (err,result) {
                                if (j+1==goodidList.length){
                                    res.send({flag:1,msg:'下单成功'})
                                }
                            })
                        }
                    }
                })
            }
        }
    })
})
//用户获取自己的所有订单
router.get('/getorderall',function (req,res) {
    let token=req.query.token
    let sql='select * from myshoporders where token=?'
    db.query(sql,[token],function (err,result) {
        if (err) throw error
        else {
            console.log(result)
            let r1 =result
            let goodid=[]
            for (let i=0;i<r1.length;i++){
                goodid.push(r1[i].goodid)
                r1[i].goodList=[]
                if (i+1==r1.length){
                    goodid = goodid.toString()
                    let goodidList=goodid.split(",")
                    goodidList=Array.from(new Set(goodidList))
                    let sql2='select * from myshopgoods where goodid=?'
                    let reList=[]
                    console.log(goodidList.length)
                    for (let j=0;j<goodidList.length;j++){
                        db.query(sql2,[goodidList[j]],function (err,re) {
                            if (err) throw error
                            else {
                                reList.push(re[0])
                                if (j+1==goodidList.length){
                                    console.log(reList.length)
                                    console.log(r1.length)
                                    let wo=0
                                    for (let k=0;k<reList.length;k++){
                                        for (let l=0;l<r1.length;l++) {
                                            let pan=r1[l].goodid.indexOf(reList[k].goodid) != -1
                                            if (pan==true){
                                                r1[l].goodList.push(reList[k])
                                                console.log(reList[k].goodid,r1[l].goodid)
                                                // console.log(r1[l])
                                            }else {
                                                console.log('no'+reList[k].goodid)
                                            }
                                            if (l+1==r1.length){
                                                wo=1
                                            }
                                        }
                                        if (k+1==reList.length &&wo==1) {
                                            res.send(r1)
                                        }
                                    }
                                }
                            }
                        })
                    }

                }
            }
        }
    })
})
//用户确认收货
router.get('/usersureorder',function (req,res) {
    let orderid=req.query.orderid
    let start='已收货'
    console.log(orderid)
    let sql='update myshoporders set start=? where orderid = ?'
    db.query(sql,[start,orderid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'确认收货成功'})
        }
    })

})
//用户删除已关闭或已收货的订单
router.get('/userdelorder',function (req,res) {
    let orderid=req.query.orderid
    let sql='delete from myshoporders where orderid=?'
    db.query(sql,[orderid],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'删除成功'})
        }
    })
})
//用户管理配送地址
router.get('/usersethome',function (req,res) {
    let token=req.query.token
    let sql='select * from myshopuser where token=?'
    db.query(sql,[token],function (err,result) {
        if (err) throw error
        else {
            let homeList=result[0].home.split(",")
            res.send(homeList)
        }
    })
})
//用户删除某一地址
router.get('/userdelhome',function (req,res) {
    let list=req.query.list
    console.log(list)
    let token=req.query.token
    let sql='select * from myshopuser where token=?'
    db.query(sql,[token],function (err,result) {
        if (err) throw error
        else {
            let homelist=result[0].home.split(",")
            let newhomelist=[]
            for (let i=0;i<homelist.length;i++){
                if (homelist[i]!=list){
                    newhomelist.push(homelist[i])
                }
                if (i+1==homelist.length){
                    console.log(newhomelist.toString())
                    let sql2='update myshopuser set home=? where token = ?'
                    db.query(sql2,[newhomelist.toString(),token],function (err,result) {
                        if (err) throw error
                        else {
                            res.send({flag:1,msg:'删除成功'})
                        }
                    })
                }
            }
        }
    })

})
//用户添加地址
router.get('/useraddnewhome',function (req,res) {
    let newhome=req.query.newhome
    let token=req.query.token
    let sql='select * from myshopuser where token=?'
    db.query(sql,[token],function (err,result) {
        if (err) throw error
        else {
            let homelist=result[0].home.split(",")
            homelist.push(newhome)
            let sql2='update myshopuser set home=? where token = ?'
            db.query(sql2,[homelist.toString(),token],function (err,re) {
                if (err) throw error
                else {
                    res.send({flag:1,msg:'添加成功'})
                }
            })
        }
    })
})
//用户提交申请加盟表
router.post('/usersubfrom',function (req,res) {
    // let username=req.query.username
    // let phone=req.query.phone
    // let shopabout=req.query.shopabout
    // let dianpuname=req.query.dianpuname
    // // let companyname=req.query.companyname
    // // let companymoney=req.query.companymoney
    // // let companyabout=req.query.companyabout
    let {username,phone,shopabout,dianpuname,companyname,companymoney,companyabout}=req.body
    var myDate = new Date();
    let day=myDate.toLocaleDateString(); //申请日期
    let messid='99'+orderCode()  //申请id
    let start='未处理'
    let sql='insert into myshopsubfrom(username,phone,shopabout,dianpuname,companyname,companymoney,companyabout,day,messid,start) values (?,?,?,?,?,?,?,?,?,?)'
    db.query(sql,[username,phone,shopabout,dianpuname,companyname,companymoney,companyabout,day,messid,start],function (err,result) {
        if (err) throw error
        else {
            res.send({flag:1,msg:'提交成功'})
        }
    })

})
function orderCode() {
    var orderCode='';
    // for (var i = 0; i < 3; i++) //3位随机数，用以加在时间戳后面。
    // {
    //     orderCode += Math.floor(Math.random() * 10);
    // }
    orderCode = new Date().getTime() + orderCode;  //时间戳，用来生成订单号。
    return orderCode;
}

function getday(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var getday=''
    // console.log(year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second);
    // console.log(year+''+month+''+day+''+hour+''+minute+''+second);
    for (var i = 0; i < 3; i++) //3位随机数，用以加在时间戳后面。

    getday =year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second;
    return getday
}
module.exports = router;
