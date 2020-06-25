<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="left">
          <img src="@/assets/logo.png" alt class="logo">
          <span>美丽共享联盟</span>
        </div>
        <el-button type="info" @click="login">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="collapse?'64px':'200px'">
          <div class="zk" @click="open">| | |</div>
          <el-menu
            background-color="#373d41"
            text-color="#fff"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="collapse"
            :collapse-transition="false"
            :router="true"
            :default-active="active"
          >
            
            <el-submenu :index="item.id + ''" v-for="(item,index) in list" :key="index">
              <template slot="title">
                <i class="el-icon-s-fold"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item
                :index="'/home/' + items.path"
                v-for="(items,indexs) in item.children"
                :key="indexs"
                @click="saveStatus('/home/' + items.path)"
              >
                <template slot="title">
                  <span>{{items.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      list: [],
      collapse: false,
      active:''
    };
  },
  created() {
    this.getMenuList();
    this.active = sessionStorage.getItem('active') || '/home/users';
    console.log(this.active)
  },
  methods: {
    saveStatus(active){
      sessionStorage.setItem('active',active)
      this.active = active
    },
    open() {
      this.collapse = !this.collapse;
    },
    login() {
      sessionStorage.clear();
      this.$router.push("/login");
      this.$message({
        message: "退出成功",
        type: "success"
      });
    },
    // 获取菜单
    async getMenuList() {
      const { data: res } = await this.$axios.get("menus");
      this.list = res.data;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style lang="less" scoped>
.el-main{
  background-color: #E9EDF1;
  height: calc(100vh - 60px) !important;
}
.zk {
  width: 100%;
  text-align: center;
  cursor: pointer;
  font-size: 10px;
  line-height: 24px;
  background-color: #4a5064;
}
.el-menu {
  border: none;
}
.home,
.el-container {
  height: 100%;
  // span{
  //   color:#FFF;
  // }
}
.el-header {
  background-color: #373d41;
}
.el-aside {
  background-color: #373d41;
}
.zk{
  color:#FFF;
}
.el-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.logo {
  width: 50px;
  height: 50px;
  margin-right: 8px;
}
.left {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
}
</style>

