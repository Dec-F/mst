<template>
  <el-dialog title="图表" :visible.sync="show">
    <div class="chart-con" v-loading.chart-con="loading">
      <ECharts :options="options" theme="irs" style="width: 1200px; height: 400px"></ECharts>
    </div>
  </el-dialog>
</template>

<script>
import api from '@/api/api'
import ECharts from 'vue-echarts/components/ECharts.vue';
import theme from '@/echarts/theme.json';
ECharts.registerTheme('irs', theme);
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';

const maxValue = 1;

export default {
  name: 'radioTrendDialog',
  components: {
    ECharts
  },
  data () {
    return {
      loading: true,
      chartData: {
        series: []
      }
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  watch: {
    'params': function (newParams) {
      if (!newParams.api) return;
      this.loading = true;
      this.fetchData(newParams.api, newParams.data).then(_ => {
        this.loading = false;
      });
    },
    'show': function (newShow) {
      this.$emit('update:show', newShow);
    }
  },
  computed: {
    'options': function () {
      const title = this.chartData.title;
      const options = {
        tooltip : {
          trigger: 'axis',
          axisPointer : {
            type : 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.chartData.xAxis,
          axisLine: {
            lineStyle: {
              color: '#bbb',
              width: 2
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f5f5f5'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#f5f5f5'
            }
          },
          // axisLabel: {
          //   formatter: function (value) {
          //     return `${value * 100}%`;
          //   }
          // },
          splitLine: {
            lineStyle: {
              color: '#f5f5f5'
            }
          }
        },
        series: this.chartData.series.map(item => {
          return {
            data: item,
            type: 'bar',
            barWidth: 16
          }
        })
      };
      return options;
    }
  },
  methods: {
    fetchData(apiName, data) {
      return api[apiName](data).then(res => {
        const chartData = res.data.echarts;
        const series = [[], [], []];
        chartData.line.forEach(line => {
          line.data.forEach((item, index) => {
            series[index].push(item.value);
          });
        });
        this.chartData = {
          xAxis: chartData.xAxis,
          series,
          title: chartData.fromAppName
        }
      });
    },
  }
}

</script>
