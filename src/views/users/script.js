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
          r_id: '',
          uid: ''
        },
        roles: []
      };
    },
    // 组件创建完毕,能够访问data的成员
    created() {
      this.loadData();
    },
    methods: {
      // 分配用户角色(权限)
      async handleSetRole() {
        console.log(this.formRole);
        const { data } = await this.$http.put(`users/${this.formRole.uid}/role`, {
          rid: this.formRole.r_id
        });
        if (data.meta.status === 200) {
          this.setRoleDialogVisible = false;
          this.$message.success('权限分配成功 !');
        } else {
          this.$message.error('权限分配失败 !');
        }
      },
      // 查看分配角色(分配权限)
      async handleOpenSetRoleDialog(user) {
        this.setRoleDialogVisible = true;
        // 记录点击的用户的用户名和id
        this.formRole.username = user.username;
        this.formRole.uid = user.id;
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
