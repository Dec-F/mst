<template>
  <el-dialog title="图表" :visible.sync="show" width="1120px">
    <div>
      <el-radio-group v-model="chartType" size="mini">
        <el-radio-button label="line">折线图</el-radio-button>
        <el-radio-button label="bar">柱状图</el-radio-button>
      </el-radio-group>
    </div>
    <div class="chart-con" v-loading.chart-con="loading">
      <ECharts :options="options" theme="irs" style="width: 1080px; height: 400px"></ECharts>
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

const apiConf = {
  'date': 'flowchart'
};
const formaterConf = {
  'date': function (chartData) {
    return {
      xAxis: chartData.xAxis,
      series: chartData.line.map(line => line.data[0].value),
      title: chartData.fromAppName
    };
  },
  'app': function (chartData) {
    return {
      xAxis: chartData.xAxis,
      series: chartData.line[0].data.map(data => data.value)
    };
  }
};

export default {
  name: 'radioTrendDialog',
  components: {
    ECharts
  },
  data () {
    return {
      loading: true,
      chartType: 'bar',
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
      this.fetchData(newParams.api, newParams.formater, newParams.data).then(_ => {
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
          axisLabel: {
            interval: 0
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
          splitLine: {
            lineStyle: {
              color: '#f5f5f5'
            }
          }
        },
        series: {
          data: this.chartData.series,
          type: this.chartType,
          barWidth: 16
        }
      };
      return options;
    }
  },
  methods: {
    fetchData(apiName, formater, data) {
      return api[apiName](data).then(res => {
        const formatData = formaterConf[formater](res.data.echarts);
        this.chartData = formatData;
      });
    },
  }
}

</script>
