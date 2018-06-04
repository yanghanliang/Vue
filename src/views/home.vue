<template>
  <el-container class="container">
    <el-header class="header">Header</el-header>
    <el-container class="container">
      <el-aside class="aside" width="200px">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
};
</script>

<style scoped>
.container {
    height: 100%;
}

.header {
    color: #fff;
    background-color: #000;
}

.aside {
    color: #fff;
    background-color: #555;
}

.main {
    background-color: #fff;
}
</style>
