<template>
  <el-card class="box-card">
      <!-- 面包屑 -->
       <my-breadcrumb level1="数据统计" level2="数据列表" style="margin-bottom: 15px;"></my-breadcrumb>

       <div ref="chart" style="width: 800px; height: 500px;"></div>
  </el-card>
</template>

<script>
// 导入图形化数据的模块
import echarts from 'echarts';

export default {
  data() {
    return {
      options: {}
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // 获取DOM 元素
      const myChart = echarts.init(this.$refs.chart);
      myChart.showLoading();

      const { data: { data } } = await this.$http.get('reports/type/1');
      console.log(data);
      const o = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      };
      this.options = {...data, ...o};
      this.options.xAxis[0].boundaryGap = false;
      console.log(this.options);
      myChart.setOption(this.options);
      myChart.hideLoading();
    }
  }
};
</script>

<style>

</style>
