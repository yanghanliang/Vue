<template>
  <el-card class="box-card">
      <my-breadcrumb level1="商品管理" level2="分类参数"></my-breadcrumb>
        <!-- 提示 -->
        <el-alert
            class="alert"
            title="注意 ! 只允许为第三级分类设置参数"
            type="warning"
            center
            :closable="false"
            show-icon>
        </el-alert>

        <el-row>
            <el-col :span="24">
                请选择商品分类:
                <el-cascader
                    @change="handleChange"
                    expand-trigger="hover"
                    :options="options"
                    :props="{ label: 'cat_name', value: 'cat_id'}"
                    v-model="selectedOptions">
                </el-cascader>
            </el-col>
        </el-row>

        <!-- v-model 绑定的是 激活的 tab-pane 的 name 属性的值 -->
         <!-- @tab-click="handleClick" -->
        <el-tabs v-model="activeName" @tab-click="handleClick" style="height: 330px;">
            <el-tab-pane label="动态参数" name="many">
                <el-button :disabled="isDisabled" type="primary">添加动态参数</el-button>
                <!-- 表格 -->
                <el-table
                  :data="dynamicParams"
                  style="width: 100%">
                     <!-- type="expand" -->
                    <el-table-column
                        type="expand"
                        width="40">
                        <template slot-scope="scope">
                            <el-tag
                                v-for="(item, index) in scope.row.params"
                                :key="index"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(scope.row, index)">
                                {{ item }}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="inputVisible"
                                v-model="inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                            </el-input>
                            <el-button
                                v-else class="button-new-tag"
                                size="small"
                                @click="showInput">
                                添加
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        type="index"
                        width="40">
                    </el-table-column>
                    <el-table-column
                        prop="attr_name"
                        label="商品参数"
                        width="180">
                    </el-table-column>
                    <el-table-column
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
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- 静态参数 -->
            <el-tab-pane label="静态参数" name="only">
                <el-button :disabled="isDisabled" type="primary">添加动态参数</el-button>
                <el-table
                   height="400px"
                  :data="staticParams"
                  style="width: 100%">
                    <el-table-column
                        type="index"
                        width="40">
                    </el-table-column>
                    <el-table-column
                        prop="attr_name"
                        label="属性名称"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="attr_vals"
                        label="属性值"
                        width="180">
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      activeName: 'many',
      dynamicParams: [],
      staticParams: [],
      isDisabled: true,
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.loadOptions();
  },
  methods: {
    // 切换tab是触发
    handleClick() {
      this.loadTableData();
    },
    // 点击标签 关闭按钮 删除当前标签
    async handleClose(row, index) {
      // 界面上的处理
      row.params.splice(index, 1);
      console.log(row.params);
      // 准备url上需要的id
      const catId = row.cat_id;
      const attrId = row.attr_id;
      // 准备请求的数据
      const putData = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.params.join(',')
      };

      // 让数据一致
      row.attr_vals = putData.attr_vals;
      // 发送请求
      const url = `categories/${catId}/attributes/${attrId}`;
      const { data: { meta: { status } } } = await this.$http.put(url, putData);
      if (status === 200) {
        this.$message.success('删除成功 !');
      }
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //  添加标签
    async handleInputConfirm(row) {
      if (this.inputValue.length === 0) {
        return;
      }
      row.params.push(this.inputValue);
      // 情况文本框, 显示按钮 ,隐藏文本框
      this.inputValue = '';
      this.inputVisible = false;

      // 准备put的数据
      const catId = row.cat_id;
      const attrId = row.attr_id;
      const putData = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.params.join(',')
      };
      row.attr_vals = putData.attr_vals;
      // 发送请求
      const url = `categories/${catId}/attributes/${attrId}`;
      const { data: { meta: {status} } } = await this.$http.put(url, putData);
      if (status === 200) {
        this.$message.success('更新成功');
      }
    },
    // 层级下拉框, 发生改变
    handleChange() {
      // 判断当前是否选择的是3级分类
      // 如果选择的是三级分类,那么按钮可用
      if (this.selectedOptions.length === 3) {
        // 可用
        this.isDisabled = false;
        this.loadTableData();
      } else {
        // 不可用
        this.isDisabled = true;
      }
    },
    // 加载层级下拉框的数据
    async loadOptions() {
      const { data: { data, meta: { status, msg } } } = await this.$http.get('categories?type=3');
      if (status === 200) {
        this.options = data;
      } else {
        this.$message.error(msg);
      }
    },
    // 加载表格数据
    async loadTableData() {
      // this.activeName ---> many only
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择三级分类');
        return;
      }
      const { data: { data, meta: { status } } } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${this.activeName}`);

      if (status === 200) {
        if (this.activeName === 'many') {
          this.dynamicParams = data;
          // 将动态参数的 attr_vals 转换成数组
          // 在动态参数对象上增加一个属性, 记录数组 params
          this.dynamicParams.forEach((item) => {
            const arr = item.attr_vals.trim().split(',').length === 0 ? [] : item.attr_vals.trim().split(',');
            // 动态给对象, 增加的成员, 数据绑定会有问题
            this.$set(item, 'params', arr);
          });
        } else {
          this.staticParams = data;
        }
      }
    }
  }
};
</script>

<style scoped>
.alert {
    margin: 15px 0;
}

.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
