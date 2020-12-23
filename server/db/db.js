const mysql= require('mysql');
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'node'
});
////导出查询相关
//给异步函数一个函数参数来处理异步执行结果；

function query(sql,params,callback) {
    pool.getConnection(function (err,connection) {
        if (err) {
            console.log('数据库服务器连接出错:'+err)
            return
        }
        connection.query(sql,params,function (err,result) {
            if(err){
                console.log('数据库查询出错：'+err)
                return
            }
            callback(err,result)
            connection.release()
        })
    })
}
module.exports.query=query