<template>
  <div class="login">
      <el-form :model="form" label-width="80px" class="form" label-position="top">
          <h2>用户登录</h2>
          <el-form-item label="用户名" >
              <el-input v-model="form.username" autofocus="autofocus" placeholder='请输入用户名'></el-input>
          </el-form-item>
          <el-form-item label="密码">
              <el-input @keyup.enter.native="headleLogin" type="password" v-model="form.password" placeholder='请输入密码'></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="submit" @click="headleLogin">登录</el-button>
              <el-button>取消</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async headleLogin() {
      const res = await this.$http.post('login', this.form);
      const data = res.data;
      if (data.meta.status === 200) {
        sessionStorage.setItem('token', data.data.token);
        this.$message.success('登录成功 !');
        this.$router.push({
          name: 'home'
        });
      } else {
        this.$message.error('登录失败 !');
      }
    }
  }
};
</script>

<style>
  .form {
    width: 400px;
    height: 350px;
    margin: 0 auto;
    margin-top: 100px;
    border-radius: 10px;
    padding: 25px;
    text-align: left;
    background-color: #fff;
  }

  .login {
    width: 100%;
    height: 100%;
    text-align: center;
    overflow: hidden;
    background-color: #178488;
  }
</style>
