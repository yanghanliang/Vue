<template>
    <el-form :model="form" label-width="80px" class="form" label-position="top">
        <h2>用户登录</h2>
        <el-form-item label="活动名称" >
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="活动名称">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
            <el-button>取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            form: {

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
</style>
