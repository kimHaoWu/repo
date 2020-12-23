<template>
    <div class="row">
      <div class="aside col">
        <div class="header">
          <div class="header-1">
            <img src="../assets/img/header.png">
          </div>
          <div class="header-2">
            {{username}}
          </div>
        </div>
        <div class="menu-item" v-for="(v,index) in menu" @click="to(index+1)" :class="{on : index+1===now}">
          {{v}}
        </div>
      </div>
      <div class="main">
        <div v-if="now==0" style="margin-left: 5px">
          <h2>欢迎你{{username}}</h2>
        </div>
        <me v-if="now==1"></me>
        <work v-if="now==2"></work>

      </div>
    </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import work from '@/components/work'
  import me from '@/components/me'
    export default {
      beforeRouteEnter(to, from, next) {
        document.querySelector('body').setAttribute('style', 'margin:0;padding:0')
        next()
      },
      beforeRouteLeave(to, from, next) {
        document.querySelector('body').setAttribute('style', '')
        next()
      },
        name: "index",
      data(){
          return{
            username:'',
            menu:['个人信息','事件管理'],
            now:0
          }
      },
      components:{
        work,
        me
      },
      methods:{
          start(){
            this.username=Cookies.get('adminname')
            console.log(this.username)
            if (this.username==undefined){
              this.$message({
                message: '请登录',
                type: 'error'
              });
              location.href="#/"
            }
          },
        to(e){
            this.now=e
        }
      },
      mounted() {
          this.start()
      }
    }
</script>

<style scoped>
  .aside{
    width: 10%;
    border-right: 1px solid lightgray;
  }
  .main{
    width: 89%;
  ;
  }
  .aside .header{
    height: 100px;
    width: 100%;
  }
  .aside .header .header-1{
    margin: auto;
    margin-top: 10px;
    height: 50px;
    width: 50px;
  }
  .aside .header .header-2{
    text-align: center;
  }
  .aside .header .header-1 img{
    width: 100%;
    height: 100%;
  }
  .menu-item{
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-bottom: 1px solid lightgray;
    border-top: 1px solid lightgray;
  }
  .on{
    background-color: darkslateblue;
    opacity: 0.8;
    color: white;
  }
  .menu-item:hover{
    background-color: darkslateblue;
    opacity: 0.8;
    color: white;
  }
</style>
