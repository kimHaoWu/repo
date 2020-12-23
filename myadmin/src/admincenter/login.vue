<template>
    <div class="backimg col">

      <div class="row" style="width: 85%;margin: auto">
        <div style="width: 70%">&nbsp</div>
        <div class="loginwindow">
          <div class="loginwindow-1">
            登录
          </div>
          <div class="loginwindow-2">
            <label>账号：</label>
            <el-input v-model="username" placeholder="账号密码随便输入"></el-input>
            <label>密码：</label>
            <el-input show-password v-model="password"></el-input>
            <div>
              <el-button type="success" style="margin-top: 10px;width: 100%" @click="login">登录</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import Cookies from 'js-cookie'
    export default {
      beforeRouteEnter(to, from, next) {
        document.querySelector('body').setAttribute('style', 'margin:0;padding:0')
        next()
      },
      beforeRouteLeave(to, from, next) {
        document.querySelector('body').setAttribute('style', '')
        next()
      },
        name: "login",
      data(){
        return{
          username:'',
          password:''
        }
      },
      methods:{
        login(){
          axios.post('http://localhost:3000/work/login',{
            username:this.username,
            password:this.password
          }).then(result=>{
            console.log(result)
            let res=result.data
            if (res.flag==1){
              Cookies.set('adminname',this.username)
              this.$message({
                message: '登录成功',
                type: 'success'
              });
              location.href="#/index"
            }else {
              this.$message({
                message: res.msg,
                type: 'error'
              });
            }
          })
        },
      }
    }
</script>

<style scoped>
  .backimg{
    background-image: url("../assets/img/login.jpg");
    width: 100%;
    height: 721px;
    background-repeat:no-repeat;
    background-size: 100% 100%;
    background-size:cover;
  }
  .loginwindow{
    width: 30%;
    background-color: black;
    height: 300px;
    color: white;
    opacity:0.9
  }
  .loginwindow-1{
    padding-top: 15px;
    height: 36px;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    line-height: 36px;
    color: #FFFFFF;
  }
  .loginwindow-2{
    width: 80%;
    margin: auto;
    margin-top: 10px;
  }
</style>
