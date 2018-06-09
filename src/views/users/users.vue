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

                    <el-button @click="addUsers" type="primary" plain>添加用户</el-button>
                    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible">
                        <el-form ref="addUserForm" :model="form" :rules="rules" label-width="100px">
                            <el-form-item label="用户名" prop="username">
                            <el-input v-model="form.username" autofocus="autofocus" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                            <el-input v-model="form.password" type="password" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱">
                            <el-input v-model="form.email" type="email" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号">
                            <el-input v-model="form.mobile" type="mobile" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="cancel('addUserForm')">取 消</el-button>
                            <el-button type="primary" @click="handleAdd">确 定</el-button>
                        </div>
                    </el-dialog>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="tableData"
            stripe
            :border="true"
            height="300"
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
                    <!-- 修改 -->
                    <el-button
                    @click="handleEdit(scope.row)"
                    size="mini"
                    icon="el-icon-edit">
                    </el-button>
                    <!-- 删除 -->
                    <el-button
                    @click="handleDelete(scope.row.id)"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete">
                    </el-button>
                    <!-- 分配权限 -->
                    <el-button
                    @click="handleOpenSetRoleDialog(scope.row)"
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
        <!-- 修改用户信息 -->
        <el-dialog title="修改用户" :visible.sync="editUserDialogVisible">
            <el-form ref="editUserForm" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="用户名" prop="username">
                <el-input disabled v-model="form.username" autofocus="autofocus" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                <el-input v-model="form.email" type="email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                <el-input v-model="form.mobile" type="mobile" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editUserDialogVisible = false;">取 消</el-button>
                <el-button type="primary" @click="handleUpdata">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配角色 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible">
        <el-form :model="formRole" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="formRole.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限">
            <el-select v-model="formRole.r_id">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.roleName"
              :value="role.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRoleDialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: 0, // 总条数
      searchKey: '',
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      setRoleDialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      loading: true,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      formRole: {
        username: '',
        r_id: ''
      },
      roles: []
    };
  },
  // 组件创建完毕,能够访问data的成员
  created() {
    this.loadData();
  },
  methods: {
    // 分配角色
    async handleOpenSetRoleDialog(user) {
      this.setRoleDialogVisible = true;
      this.formRole.username = user.username;
      // 发送请求, 获取所有的角色
      const { data } = await this.$http.get('roles');
      this.roles = data.data;
      // 根据用户的id 去请求用户对象,目的是获取角色的id
      const { data: data1 } = await this.$http.get(`users/${user.id}`);
      this.formRole.r_id = data1.data.rid;
    },
    // 修改数据
    async handleUpdata() {
      const { data } = await this.$http.put(`users/${this.form.id}`, {
        email: this.form.email,
        mobile: this.form.mobile
      });

      if (data.meta.status === 200) {
        this.$message.success('修改成功 !');
        this.loadData();
        this.editUserDialogVisible = false;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 点击修改,打开对话框,填入数据
    handleEdit(data) {
      this.editUserDialogVisible = true;
      this.form = data;
    },
    // 删除用户
    handleDelete(id) {
      this.$confirm('您是否确定删除此条数据 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 删除操作
        const { data } = await this.$http.delete(`users/${id}`);
        if (data.meta.status === 200) {
          // 删除成功
          this.$message.success('删除成功 !');
          this.pagenum = 1;
          // 重新加载数据
          this.loadData();
        } else {
          // 删除失败
          this.$message.error(data.meta.msg);
        }
      });
    },
    // 点击
    cancel(addUserForm) {
      this.$refs[addUserForm].clearValidate();
      this.addUserDialogVisible = false;
    },
    // 添加用户
    async handleAdd() {
      // 验证表单
      this.$refs.addUserForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请完善内容 !');
          return;
        }
        const { data } = await this.$http.post('users', this.form);
        console.log(data.meta.status);
        if (data.meta.status === 201) {
          // 隐藏对话框
          this.addUserDialogVisible = false;
          // 重新渲染页面
          this.loadData();
          // 提示
          this.$message.success(data.meta.msg);
          // 清空原来的表单
          for (let key in this.form) {
            this.form[key] = '';
          }
        } else {
          // 提示
          this.$message.error(data.meta.msg);
        }
      });
    },
    // 修改状态
    async handleChange(user) {
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
    // 页面加载的方法
    async loadData() {
      // 显示加载效果
      this.loading = true;
      // 获取登录以后的token
      const token = sessionStorage.getItem('token');
      //  axios发送请求的时候需要携带token
      this.$http.defaults.headers.common['Authorization'] = token;

      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchKey}`);
      // 请求已经结束
      // 隐藏加载效果
      this.loading = false;

      const data = res.data;
      if (data.meta.status === 200) {
        // 设置总共多少条数据
        this.total = data.data.total;
        this.tableData = data.data.users;
      } else {
        this.$message.error('获取数据失败');
      }
    },
    async addUsers() {
      this.addUserDialogVisible = !this.addUserDialogVisible;
      // const res = await this.$http.post('http://127.0.0.1:8888/api/private/v1/users', )
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
