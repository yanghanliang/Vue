<template>
  <el-container class="container">
    <el-header class="header">
        <el-row>
        <el-col :span="4">
            <div class="grid-content bg-purple logo">
                <img src="/static/images/yasuo.jpg" alt="">
            </div>
        </el-col>
        <el-col :span="16">
            <div class="grid-content bg-purple-light title">
                电商后台管理
            </div>
        </el-col>
        <el-col :span="4">
            <div class="logout" @click="logout">
                <a href="#">退出登录</a>
            </div>
        </el-col>
        </el-row>
    </el-header>
    <!-- 下 -->
    <el-container class="container">
        <!-- 左 -->
      <el-aside class="aside" width="200px">
        <el-menu
        :router="true"
        default-active="2"
        class="menu"
        :unique-opened="true">
            <el-submenu
              v-for="item1 in menus"
              :key="item1.id"
              :index="item1.id + ''">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item1.authName }}</span>
                </template>
                <el-menu-item
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  :index="'/' + item2.path">
                <i class="el-icon-setting"></i>
                    {{ item2.authName }}
                </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  beforeCreate() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      // 跳转会登录页面并且提示
      this.$router.push({
        name: 'login'
      });
      this.$message.error('请先登录 !');
    }
  },
  created() {
    this.loadData();
  },
  data() {
    return {
      menus: []
    };
  },
  methods: {
    // 退出
    logout() {
      // 删除token
      sessionStorage.removeItem('token');
      // 跳转到登录页面
      this.$router.push({
        name: 'login'
      });
      this.$message.success('退出成功 !');
    },
    // 获取菜单数据
    async loadData() {
      const { data: resData } = await this.$http.get('menus');
      this.menus = resData.data;
    }
  }
};
</script>

<style scoped>
.container {
    height: 100%;
}

.header {
    padding: 0;
    color: #fff;
    line-height: 60px;
    text-align: center;
    background-color: #000;
}

.header .logo {
    width: 100%;
    height: 60px;
    text-align: left;
}

.header .logo img {
    height: 100%;
}

.header .title {
    font-size: 20px;
}

.header .logout a {
    color: #fff;
    text-decoration: none;
}

.aside {
    color: #fff;
    background-color: #555;
}

.aside .menu {
    height: 100%;
}

.main {
    background-color: rgb(155, 163, 167);
}
</style>
