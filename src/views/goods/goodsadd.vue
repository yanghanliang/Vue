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
        <el-form ref="form" :model="form" label-width="80px" label-position="top">
            <el-tabs @tab-click="handleTabClick" v-model="active" tab-position="left" style="height: 300px; overflow: auto;">
                <el-tab-pane name="0" label="基本信息">
                        <el-form-item label="商品名称">
                            <el-input v-model="form.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格">
                            <el-input v-model="form.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量">
                            <el-input v-model="form.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量">
                            <el-input v-model="form.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader
                                clearable
                                expand-trigger="hover"
                                :options="options"
                                v-model="selectedOptions"
                                :props="defaultProps"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="1" label="商品参数">
                    <el-form-item
                      v-for="item in dynamicsParams"
                      :key="item.attr_id"
                      :label="item.attr_name">
                        <el-checkbox-group
                          v-model="item.attr_vals">
                            <el-checkbox
                                v-for="val in item.attr_vals"
                                :key="val"
                                border
                                :label="val">
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="2" label="商品属性">
                    <el-form-item
                      v-for="item in staticParams"
                      :key="item.attr_id"
                      :label="item.attr_name">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="3" label="商品图片">
                    <!-- action 需要注意
                    必须是全部路径
                    必须设置token -->
                    <el-upload
                        action="http://localhost:8888/api/private/v1/upload"
                        :headers="tokenHeader"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane name="4" label="商品内容">
                    <el-button @click="handleAdd">添加商品</el-button>
                    <quill-editor v-model="form.goods_introduce"></quill-editor>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';

// require styles
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: '0',
      form: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        pics: [],
        // 富文本框
        goods_introduce: '',
        attrs: []
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
      selectedOptions: [],
      checkList: [],
      // 动态参数
      dynamicsParams: [],
      // 静态参数
      staticParams: [],
      // 设置token
      tokenHeader: {
        'Authorization': sessionStorage.getItem('token')
      }
    };
  },
  created() {
    this.loadOptions();
  },
  methods: {
    // 添加商品
    async handleAdd() {
      // 转被数据
      this.form.goods_cat = this.selectedOptions.join(',');
      // 所有的分类参数
      // this.dynamicsParams  this.staticParams;
      const arr1 = this.dynamicsParams.map((item) => {
        // item.attr_vals = item.attr_vals.join(',');
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });

      const arr2 = this.staticParams.map((item) => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });

      // 获取所有选择的分类参数[{ attr_id: 1, attr_value: xxx }]
      this.form.attrs = [...arr1, ...arr2];

      // 发送请求
      const { data: { meta: { status, msg } } } = await this.$http.post('goods', this.form);
      if (status === 201) {
        this.$message.success('添加成功 !');
        this.$router.push({
          name: 'goods'
        });
      } else {
        this.$message.error(msg);
      }
    },
    // 图片上传成功
    handleSuccess(res) {
      const { meta, data } = res;
      if (meta.status === 200) {
        // 当上传成功
        this.$message.success('图片上传成功');
        this.form.pics.push({
          'pic': data.tmp_path
        });
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 移除文件
    handleRemove(file) {
      // 把pics数组中对应的该图片 移除
      // 根据file中tmp_path的路径, 找到数组对应要删除的对象的索引
      const index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path;
      });
      // 删除
      this.form.pics.splice(index, 1);
      console.log(this.form.pics);
    },
    // tab 被选中时触发
    async handleTabClick() {
      // 判断当前的tab栏是否是,商品参数||商品属性
      if (this.active === '1' || this.active === '2') {
        if (this.selectedOptions.length !== 3) {
          // 如果是商品参数, 要判断层级下拉中, 是否选中的三级分类
          // 如果没有选中三级分类, 要提示用户选择三级分类
          this.$message.warning('请选择三级分类,商品只能添加到三级分类中 !');
          return;
        }

        const sel = this.active === '1' ? 'many' : 'only';

        // 如果选择了三级分类,发送请求获取数据,并展示出来
        const { data: resData } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`);
        // 获取到数据后将字符串转换成数组
        if (this.active === '1') {
          // 动态参数
          this.dynamicsParams = resData.data;
          this.dynamicsParams.forEach((item) => {
            item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',');
          });
        } else if (this.active === '2') {
          // 静态参数
          this.staticParams = resData.data;
        }
      };
    },
    // 层级下拉框选中内容发生变化的时候执行
    handleChange() {
      // 判断当前是否选中内容发生变化的时候执行
      // 如果不是三级分类,此时提示,并清空
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择三级分类,商品只能添加到三级分类中 !');
        this.selectedOptions.length = 0;
      }
    },
    // 加载层级下拉框的数据
    async loadOptions() {
      const { data: resData } = await this.$http.get('categories?type=3');
      this.options = resData.data;
    }
  }
};
</script>

<style scoped>
.box-card {
    width: 100;
    height: 100;
}

.el-steps--horizontal {
    margin: 15px 0;
}
</style>
