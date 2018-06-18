<template>
    <el-card class="box-cart">
       <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
        <!-- 搜索 -->
        <el-row>
            <el-col :span="24">
                <div>
                    <div style="margin-top: 15px;">
                    <el-input placeholder="请输入内容" v-model="searchKey" class="search" clearable>
                        <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <el-button style="margin-top: 15px;" @click="$router.push({name: 'goodsadd'})" type="primary" plain>添加商品</el-button>
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
                prop="goods_name"
                label="商品名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="goods_price"
                label="商品价格(元)"
                width="180">
            </el-table-column>
            <el-table-column
                prop="goods_weight"
                label="商品重量">
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="创建时间">
                <template slot-scope="scope">
                    {{ scope.row.create_time | fmtDate('YYYY-MM-DD HH:mm') }}
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
            style="margin-top: 15px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[10, 20, 30, 40]"
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
      searchKey: '',
      addUserDialogVisible: false,
      loading: true,
      form: {

      },
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 10
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    },
    async loadData() {
      this.loading = true;
      const { data } = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      this.tableData = data.data.goods;
      this.total = data.data.total;
    },
    addUsers() {

    },
    handleSearch() {

    }
  }
};
</script>

<style scoped>
.search {
    width: 300px;
}
</style>
