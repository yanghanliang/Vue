<template>
    <el-card class="box-card">
        <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
        <el-row class="categorie_add">
            <el-col :span="24">
                <el-button type="primary" @click="handleShowAddDialog">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <template>
        <el-table
            v-loading="loading"
            :data="tableData"
            height="350px"
            style="width: 100%;">
            <el-tree-grid
            prop="cat_name"
            label="分类名称"
            treeKey="cat_id"
            parentKey="cat_pid"
            levelKey="cat_level"
            :indentSize="20"></el-tree-grid>
            <el-table-column
            label="级别"
            prop="cat_level">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_level === 0">第一级</span>
                    <span v-else-if="scope.row.cat_level === 1">第二级</span>
                    <span v-else-if="scope.row.cat_level === 2">第三级</span>
                </template>
            </el-table-column>
            <el-table-column
            label="是否有效"
            prop="cat_deleted">
                <template slot-scope="scope">
                    <span>{{ scope.row.cat_deleted ? '无效' : '有效' }}</span>
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <!-- 修改 -->
                    <el-button
                    @click="handleEdit(scope.row)"
                    size="mini"
                    icon="el-icon-edit">
                    </el-button>
                    <!-- 删除 -->
                    <el-button
                    @click="handleDelete(scope.row.cat_id)"
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
        </template>
        <!-- 分页 -->
         <el-pagination
            style="margin-top: 15px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <!-- 添加分类 -->
        <el-dialog title="添加商品分类" :visible.sync="addDialogFormVisible">
        <el-form :model="form" label-position="right"  label-width="100px">
            <el-form-item label="分类名称">
            <el-input style="width:300px;" v-model="form.cat_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类">
                <el-cascader
                    placeholder="默认添加一级分类"
                    id="clear"
                    change-on-select
                    clearable
                    expand-trigger="hover"
                    :options="options"
                    :props="defaultProps"
                    v-model="selectedOptions">
                </el-cascader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
        </el-dialog>
        <!-- 修改分类 -->
        <el-dialog title="修改商品分类" :visible.sync="editDialogFormVisible">
        <el-form :model="form" label-position="right"  label-width="100px">
            <el-form-item label="分类名称">
            <el-input style="width:300px;" v-model="form.cat_name" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="EditDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleUpdata">确 定</el-button>
        </div>
        </el-dialog>
    </el-card>
</template>

<script>
// 导入tree-colum组件
import ElTreeGrid from 'element-tree-grid';

export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      loading: true,
      addDialogFormVisible: false,
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: 0,
        id: -1
      },
      options: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 绑定层级下拉框
      selectedOptions: [],
      editDialogFormVisible: false,
      formEdit: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 修改分类数据
    async handleUpdata() {
      const {data} = await this.$http.put(`categories/${this.form.id}`, {cat_name: this.form.cat_name});
      if (data.meta.status === 200) {
        this.$message.success('修改成功 !');
        this.loadData();
        this.editDialogFormVisible = false;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 获取要分类的数据
    handleEdit(val) {
      this.editDialogFormVisible = true;
      this.form.id = val.cat_id;
      this.form.cat_name = val.cat_name;
    },
    // 删除分类
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该数据! 是否继续 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 删除分类数据
        const {data: resData} = await this.$http.delete(`categories/${id}`);
        if (resData.meta.status === 200) {
          this.$message.success(resData.meta.msg);
          this.loadData();
        } else {
          this.$message.error(resData.meta.msg);
        }
      });
    },
    // 添加分类
    async handleAdd() {
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0;
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0];
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1];
      }
      this.form.cat_level = this.selectedOptions.length;

      // 发送请求,添加数据
      const { data: resData } = await this.$http.post('categories', this.form);
      if (resData.meta.status === 201) {
        this.$message.success('添加成功');
        this.loadData();
        this.addDialogFormVisible = false;
        this.form.cat_name = '';
      } else {
        this.$message.error(resData.meta.msg);
      }
    },
    async handleShowAddDialog() {
      this.addDialogFormVisible = true;
      // 加载层级的数据
      const { data: resData } = await this.$http.get('categories?type=2');
      this.options = resData.data;
    },
    // 加载数据
    async loadData() {
      this.loading = true;
      const { data: resData } = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false; // 关闭加载的效果
      this.tableData = resData.data.result;
      // 获取总条数
      this.total = resData.data.total;
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.loadData();
    }
  },
  components: {
    'el-tree-grid': ElTreeGrid
  }
};
</script>

<style scoped>
.box-card {
    height: 490px;
}
.categorie_add {
    margin-top: 15px;
}
</style>
