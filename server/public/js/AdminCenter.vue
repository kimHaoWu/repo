<template>
    <div class="adminCenter">
        <div class="navbar navbar-duomi navbar-static-top" role="navigation">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a class="navbar-brand" href="#" id="logo">商城信息管理系统
                    </a>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-2 le">
                    <nav class="navbar bg-light">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <button type="button" class="btn btn-outline-primary" data-toggle="collapse" data-target="#Comodity" @click="Cli(0)">欢迎你<span class="iconfont">&#xe6fd;</span></button>
                                <div class="collapse navbar-collapse " id="Comodity">
                                    <ul class="navbar-nav" v-for="i,index in ButtonList">
                                        <li class="nav-item">
                                            <button type="button" class="btn btn-outline-secondary" @click="Cli(index+1)" >{{i.name}}<span class="iconfont">&#xe761;</span></button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>

                    </nav>
                </div>
                <div class="col-md-10">
                    <div class="Welcome" v-if="nowNum==0">
                        <h1>欢迎你</h1>
                        <h3>
                            <a href="/">返回商城主页</a>
                        </h3>
                    </div>
                    <admin-indexchange v-if="nowNum==1"></admin-indexchange>
                    <admin-goodsall v-if="nowNum==2"></admin-goodsall>
                    <admin-goodupload v-if="nowNum==3"></admin-goodupload>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import  AdminIndexchange from '@/components/admin/AdminIndexchange'
    import  AdminGoodsall from '@/components/admin/AdminGoodsall'
    import  AdminGoodupload from '@/components/admin/AdminGoodupload'


    export default {
        name: "AdminCenter",
        components:{
            AdminIndexchange,
            AdminGoodsall,
            AdminGoodupload
        },
        data(){
            return{
                nowNum:'0',
                ButtonList:[
                    {name:"主页修改"},
                    {name:"商品总览"},
                    {name:"商品上架"},
                    {name:"订单管理"},
                    {name:"用户总览"},
                    {name:"软文总览"},
                    {name:"软文发布"}
                ]
            }
        },
        methods:{
            Cli(index){
                this.nowNum=index
            }
        }

    }
</script>

<style scoped>
    .container-fluid:nth-child(1){
        background-image: url("../../assets/img/AdminBanner_02.gif");
    }
    .le li{

    }
    .le li button{
        margin-top: 10px;
        width: 110px;
    }
    .Welcome a{
        color: black;
    }

</style>