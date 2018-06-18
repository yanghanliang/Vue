<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <el-row>
      <el-col :span="24" class="add_role">
        <el-button plain>添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
     <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      style="width: 100%">
      <!-- 展开之后 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级权限 -->
          <el-row
            v-for="item in scope.row.children"
            :key="item.id"
            @close="handleClose(scope.row, item)"
            style="margin-bottom: 15px;">
            <el-col :span="4">
              <el-tag closable>{{ item.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row
                v-for="item2 in item.children"
                :key="item2.id">
                <!-- 二级权限 -->
                <el-col :span="4">
                  <el-tag
                    closable
                    style="margin-bottom: 5px;"
                    @close="handleClose(scope.row, item2)"
                    type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-row>
                     <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      type="danger"
                      @close="handleClose(scope.row, item3)"
                      style="margin-right: 10px; margin-bottom: 5px;">{{ item3.authName }}</el-tag>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 如果没有权限做一个提示 -->
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">
              当前角色没有分配角色
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色管理"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
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
            @click="handleShowSetRightsDialog(scope.row)"
            size="mini"
            type="success"
            icon="el-icon-check">
            </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible">
      <el-tree
        default-expand-all
        show-checkbox
        :data="treeData"
        node-key="id"
        ref="tree"
        :default-checked-keys="checkedKeys"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRights">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
      ],
      loading: false,
      inputVisible: false,
      setRightsDialogVisible: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中节点的id
      checkedKeys: [],
      // 点击分配权限的时候.记录当前的角色
      currentRoleId: -1
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载角色列表
    async loadData() {
      const { data: resData } = await this.$http.get('roles');
      const { data, meta } = resData;
      if (meta.status === 200) {
        // 成功
        this.tableData = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 删除角色对应的权限
    async handleClose(role, rights) {
      const { data: resData } = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`);
      const { data, meta } = resData;
      if (meta.status === 200) {
        // 删除成功
        this.$message.success('删除成功 !');
        role.children = data;
      } else {
        // 删除失败
        this.$message.error(meta.msg);
      }
    },
    // 显示权限的对话框
    async handleShowSetRightsDialog(role) {
      this.setRightsDialogVisible = true;
      // 获取tree的数据
      const { data: resData } = await this.$http.get('rights/tree');
      const { data } = resData;
      this.treeData = data;
      // 记录当前角色id
      this.currentRoleId = role.id;

      // 获取当前角色的所有权限
      function getCheckedKeys (role) {
        const arr = [];
        (function fn(role) {
          role.children.forEach((item) => {
            arr.push(item.id);
            if (item.children) {
              fn(item);
            }
          });
        })(role);
        return arr;
      }
      this.checkedKeys = getCheckedKeys(role);
    },
    // 设置当前角色的权限
    async handleSetRights() {
      // 调用tree内部封装的方法
      const arr1 = this.$refs.tree.getCheckedKeys();
      const arr2 = this.$refs.tree.getHalfCheckedNodes();
      const arr3 = arr1.concat(arr2).join(',');
      // 发送请求
      const { data: resData } = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: arr3
      });
      if (resData.meta.status === 200) {
        this.$message.success('权限分配成功 !');
        this.setRightsDialogVisible = false;
        this.loadData();
      } else {
        this.$message.error(resData.meta.msg);
      }
    }
  }
};
</script>

<style scoped>
.box-card {
  width: 100%;
  height: 100%;
  padding: 0;
}
.add_role {
  margin: 15px 0;
}

table i {
  color:rgb(11, 124, 124);
}
</style>
