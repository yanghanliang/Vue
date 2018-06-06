<template>
    <el-card class="box-card">
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-row>
            <el-col :span="24">
                <div>
                    <div style="margin-top: 15px;">
                    <el-input placeholder="请输入内容" v-model="searchKey" class="search" clearable>
                        <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <el-button type="primary" plain>添加用户</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table
            :data="tableData"
            stripe
            border
            style="width: 100%; margin-top: 15px;">
            <el-table-column
            type="index"
            width="50">
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                width="180">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话">
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="创建时间">
                <template slot-scope="scope">
                    {{ scope.row.create_time | fmtDate('YYYY-MM-DD HH:mm') }}
                </template>
            </el-table-column>
            <el-table-column
                label="用户状态">
                <template slot-scope="scope">
                    <el-switch
                    @change="handleChange(scope.row)"
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="190">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    icon="el-icon-edit">
                    <!-- 修改 -->
                    </el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete">
                    <!-- 删除 -->
                    </el-button>
                    <el-button
                    size="mini"
                    type="success"
                    icon="el-icon-check">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      searchKey: ''
    };
  },
  // 组件创建完毕,能够访问data的成员
  created() {
    this.loadData();
  },
  methods: {
    // 修改状态
    async handleChange(user) {
    //   this.$http.put('',)
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      const data = res.data;
      if (data.meta.status === 200) {
        this.$message.success('修改成功 !');
      } else {
        this.$message.error('修改失败 !');
      }
    },
    // 搜索功能
    handleSearch() {
      // 让页码为1
      this.pagenum = 1;
      this.loadData();
    },
    // 使用分页的方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // 当页码发生变化的时候执行
      // 修改当前页码, 重新获取数据列表
      this.pagenum = val;
      this.loadData();
      console.log(`当前页码: ${val}`);
    },
    async loadData() {
      // 获取登录以后的token
      const token = sessionStorage.getItem('token');
      //  axios发送请求的时候需要携带token
      this.$http.defaults.headers.common['Authorization'] = token;

      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchKey}`);
      const data = res.data;
      if (data.meta.status === 200) {
        // 设置总共多少条数据
        this.total = data.data.total;
        this.tableData = data.data.users;
      } else {
        this.$message.error('获取数据失败');
      }
    }
  }
};
</script>

<style>
.box-card {
    width: 100%;
    height: 100%;
}

.box-card .search {
    width: 300px;
}
</style>
