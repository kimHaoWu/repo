<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      isRouterAlive:true
    }
  },
  methods:{
    reload(){
      this.isRouterAlive=false
      this.$nextTick(function () {
        this.isRouterAlive=true
      })
    }
  }
}
</script>

<style>
  .row{
    display: flex;
    flex-direction: row;
    flex-wrap:  wrap
  }
  .col{
    display: flex;
    flex-direction: column;
  }
  .row-r{
    display: flex;
    flex-direction: row-reverse;
    flex-wrap:  wrap
  }
  .row-c{
    display: flex;
    justify-content:center;
  }
</style>
