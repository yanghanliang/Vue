<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="订单管理" level2="订单分类"></my-breadcrumb>
        <el-table
          stripe
          border
          :data="tableData"
          style="width: 100%; margin-top: 15px; text-align: center;">
            <el-table-column
            type="index">
            </el-table-column>
            <el-table-column
                prop="order_number"
                label="订单编号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="order_price"
                label="订单价格"
                width="180">
            </el-table-column>
            <el-table-column
                prop="pay_status"
                label="是否付款">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.order_pay === '0'" type="danger">未付款</el-tag>
                    <el-tag v-else type="success">已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="is_send"
                label="是否发货">
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="下单时间">
                <template slot-scope="scope">
                    {{ scope.row.create_time | fmtDate('YYYY-MM-DD HH:mm')}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="190">
                <template slot-scope="scope">
                    <!-- 修改 -->
                    <el-button
                    @click="dialogFormVisible = true"
                    size="mini"
                    icon="el-icon-edit">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
            <el-form label-width="100px">
                <el-form-item label="省市区/县">
                    <el-cascader
                        style="width: 400px;"
                        expand-trigger="hover"
                        :options="options"
                        v-model="selectedOptions">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
// 导入数据模块
import data from './city_data2017_element';

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      options: [],
      selectedOptions: []
    };
  },
  created() {
    this.loadData();
    this.options = data;
  },
  methods: {
    async loadData() {
      const { data: { data: { goods: data } } } = await this.$http.get(`orders?pagenum=1&pagesize=10`);
      this.tableData = data;
    }
  }
};
</script>

<style>

</style>
