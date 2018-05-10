
<template>
<el-container>
  <el-aside width="200px">
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
    <el-radio-button :label="false">展开</el-radio-button>
    <el-radio-button :label="true">收起</el-radio-button>
  </el-radio-group> -->
    <el-menu :router="true" :default-active="activePath" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      :collapse="isCollapse">
      <el-menu-item index="index">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <!-- <el-menu-item index="3">
      <i class="el-icon-setting"></i>
      <span slot="title">导航四</span>
    </el-menu-item> -->
    </el-menu>
  </el-aside>
  <el-main>
    <router-view></router-view>
  </el-main>
</el-container>

</template>

<script>
// import HelloWorld from "./components/HelloWorld";
// var config = require('../config')
// if (!process.env.NODE_ENV) {
//   process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
// }


export default {
  name: "App",
  data() {
    return {
      isCollapse: false,
      activePath: ""
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    updateActivePath(routerObj) {
        this.activePath = routerObj.name
    //   console.log(routerObj.name);
    }
  },
  watch: {
    $route(to, from) {
      //   console.log(to,from)
      this.updateActivePath(to);
    }
  },
  mounted() {
    // alert(this.$store.getters.isLogined());
    if(!this.$store.getters.isLogined()){
      alert('未登录')
      this.$router.push('/login')
    }
    this.updateActivePath(this.$route);
  }
  //   ,
  // beforeRouteEnter(to, from, next){
  //     console.log(to,from)
  //     next()
  // }
};
</script>
<style>
li.el-menu-item {
    text-align: left;
}
.el-menu{
    border-right:0;
}
</style>
