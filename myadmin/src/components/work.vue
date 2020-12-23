<template>
    <div class="main">
      <div v-if="now==1">
        <div class="head">
          <h3><i class="el-icon-s-order"></i>To-Do</h3>
        </div>
        <div class="buttonList">
          <div>
            &nbsp
          </div>
          <div>
            <el-button @click="tostate()">待办按状态排序</el-button>
            <el-button @click="totime()">待办按事件排序(降序)</el-button>
            <el-button @click="to(2)">添加新事件</el-button>
          </div>
        </div>
        <div class="table">
          <table style="width: 100%">
            <tr >
              <td><h5>待办事件名称</h5></td>
              <td><h5>时间</h5></td>
              <td><h5>当前状态</h5></td>
              <td><h5>操作</h5></td>
            </tr>
            <tr v-for="v in List">
              <td>{{v.workname}}</td>
              <td>{{v.today}}</td>
              <td>{{v.state}}</td>
              <td>
                <el-button type="danger" @click="todel(v.workid)">删除</el-button>
                <el-button type="success" @click="took(v.workid)">完成</el-button>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div v-if="now==2">
        <div class="head">
          <h3><i class="el-icon-s-order"></i>增加新待办</h3>
        </div>
        <div class="add">
          <h4>待办事件名称</h4>
          <el-input placeholder="请输入" v-model="addworkname"></el-input>
        </div>
        <div class="buttonList">
          <div>
            &nbsp
          </div>
          <div>
            <el-button @click="to(1)">返回</el-button>
            <el-button @click="toadd()">提交</el-button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
    export default {
        name: "work",
      data(){
          return{
            now:1,
            List:[],
            addworkname:''
          }
      },
      methods:{
          start(){
            axios.get('http://localhost:3000/work/getall').then(result=>{
              this.List=result.data
            })

          },
        to(e){
            if (e==1){
              this.now=1
              this.start()
            }
            this.now=e
        },
        //添加事件
        toadd(){
            if (this.addworkname==''){
              this.$message({
                message: '请填写完整信息',
                type: 'error'
              })
            }else {
              axios.post('http://localhost:3000/work/addwork',{
                workname:this.addworkname
              }).then(result=>{
                let res=result.data
                if (res.flag==1){
                  this.$message({
                    message:res.msg,
                    type: 'success'
                  });
                  this.addworkname=''
                  this.to(1)
                } else {
                  this.$message({
                    message:res.msg,
                    type: 'error'
                  });
                }
              })
            }
        },
        //按时间排序(由大到小)
        totime(){
            if (this.List.length==0){
              this.$message({
                message: '数据为空，请添加数据',
                type: 'error'
              })
            } else {
              this.List=this.List.sort(function(a,b){
                return a.today < b.today ? 1 : -1
              })
            }
        },
        //按状态排序
        tostate(){
          if (this.List.length==0){
            this.$message({
              message: '数据为空，请添加数据',
              type: 'error'
            })
          } else {
            this.List=this.List.sort(function(a,b){
              return a.state < b.state ? 1 : -1
            })
          }
        },
        //删除某待办
        todel(e){
            let that=this
          this.$confirm('真要删除该条待办吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(e)
            axios.post('http://localhost:3000/work/del',{
              workid:e
            }).then(result=>{
              if (result.data.flag==1){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                that.start()
              }
            })
          }).catch(() => {});
        },
        //完成某待办
        took(e){
          axios.post('http://localhost:3000/work/ok',{
            workid:e
          }).then(result=>{
            if (result.data.flag==1){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.start()
            }
          })
        }
      },
      mounted() {
          this.start()
      }
    }
</script>

<style scoped>
  .main{
    width: 95%;
    margin: auto;
  }
  .head{
    border-bottom: #0062cc 1px solid;
  }
  .table{
    margin-top: 5px;
    border: 1px solid floralwhite;
  }
  .add{
    margin-top: 10px;
    width: 50%;
  }
</style>
