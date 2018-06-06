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
        unique-opened="true">
            <el-submenu index="1">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
                </template>
                <el-menu-item index="/users">
                <i class="el-icon-setting"></i>
                    用户列表
                </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
                </template>
                <el-menu-item index="1-1">
                <i class="el-icon-setting"></i>
                    角色列表
                </el-menu-item>
                <el-menu-item index="1-1">
                <i class="el-icon-setting"></i>
                    权限管理
                </el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
                </template>
                <el-menu-item index="1-1">
                <i class="el-icon-setting"></i>
                    商品列表
                </el-menu-item>
                <el-menu-item index="1-1">
                <i class="el-icon-setting"></i>
                    分类参数
                </el-menu-item>
                <el-menu-item index="1-1">
                <i class="el-icon-setting"></i>
                    商品分类
                </el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
                </template>
                <el-menu-item index="1-1">
                <i class="el-icon-location"></i>
                    订单列表
                </el-menu-item>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据统计</span>
                </template>
                <el-menu-item index="1-1">
                <i class="el-icon-setting"></i>
                    数据报表
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
