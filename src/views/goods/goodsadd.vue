<template>
    <el-card class="box-card">
        <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
        <el-alert
            style="margin-top: 15px;"
            title="添加商品信息"
            type="info"
            center
            :closable="false"
            show-icon>
        </el-alert>
        <!-- 步骤条 -->
        <el-steps
          class="steps"
          :active="Number(active)"
          align-center
          finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        </el-steps>
        <!-- tab切换 -->
        <el-tabs v-model="active" tab-position="left" style="height: 200px; overflow: auto;">
            <el-tab-pane name="0" label="基本信息">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="商品名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <el-cascader
                            expand-trigger="hover"
                            :options="defaultProps"
                            v-model="selectedOptions"
                            @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane name="1" label="商品参数">商品参数</el-tab-pane>
            <el-tab-pane name="2" label="商品属性">商品属性</el-tab-pane>
            <el-tab-pane name="3" label="商品图片">商品图片</el-tab-pane>
            <el-tab-pane name="4" label="商品内容">
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: '0',
      form: {

      },
      // 层级下拉框的数据源
      options: [],
      // 层级下拉框的数据源配置
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 绑定到层级下拉框上的数据
      selectedOptions: []
    };
  },
  created() {
    this.loadOptions();
  },
  methods: {
    // 层级下拉框选中内容发生变化的时候执行
    handleChange() {
      // 判断当前是否选中内容发生变化的时候执行
      // 如果不是三级分类,此时提示,并清空
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择上级分类,商品只能添加到三级分类');
        this.selectedOptions.length = 0;
      }
    },
    // 加载层级下拉框的数据
    async loadOptions() {
      const { data: resData } = await this.$http.get('categories?type=3');
      this.defaultProps = resData.data;
      console.log(resData.data);
    }
  }
};
</script>

<style scoped>
.el-steps--horizontal {
    margin: 15px 0;
}
</style>
