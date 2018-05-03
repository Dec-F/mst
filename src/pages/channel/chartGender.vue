<template>
  <div>
    <ECharts v-if="!empty" :options="options" theme="irs" style="width: 100%; height: 100%;"></ECharts>
    <div v-else class="channel-chart-empty">暂无数据</div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue';
import theme from '@/echarts/theme.json';
ECharts.registerTheme('irs', theme);
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';

export default {
  name: 'chartGender',
  components: {
    ECharts
  },
  data () {
    return {
      empty: true,
      options: {}
    }
  },
  props: {
    data: {
      type: Number,
    },
    type: {
      type: String,
      default: 'male'
    }
  },
  watch: {
    'data': function () {
      if (isNaN(this.data)) {
        this.empty = true;
        return;
      } else {
        this.empty = false;
      }
      const isMale = this.type === 'male';
      const options = {
        grid: {
          containLabel: true,
        },
        tooltip : {
          trigger: 'axis',
          axisPointer : {
            type : 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: [isMale ? '男性' : '女性'],
          splitLine: {
            lineStyle: {
              color: '#f5f5f5'
            }
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#bbb',
              width: 2
            }
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 1,
          axisLine: {
            lineStyle: {
              color: '#f5f5f5'
            }
          },
          axisLabel: {
            formatter: function (value) {
              return `${value * 100}%`;
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f5f5f5'
            }
          }
        },
        series: [{
          itemStyle: {
            normal: {
              color: isMale ? '#b2d233' : '#1fc8f3'
            }
          },
          // data: this.data,
          data: [0.5],
          barWidth: 16,
          type: 'bar'
        }]
      };
      this.options = options;
    }
  },
  methods: {
  }
}

</script>
