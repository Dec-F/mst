<template>
  <div style="width: 100%; height: 100%;">
    <ECharts v-if="!empty" :options="options" theme="irs" style="width: 100%; height: 100%;"></ECharts>
    <div v-else class="channel-chart-empty">暂无数据</div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue';
import theme from '@/echarts/theme.json';
ECharts.registerTheme('irs', theme);
import 'echarts/lib/chart/bar';
import option from '@/echarts/echartTooltip'
import 'echarts/lib/component/tooltip';

const maxValue = 1;

export default {
  name: 'chartRadar',
  components: {
    ECharts
  },
  data() {
    return {
      empty: true,
      options: {}
    }
  },
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
  },
  watch: {
    'data': function() {
      if (this.data.length) {
        this.empty = false;
      } else {
        this.empty = true;
        return;
      }
      const xAxis = this.data.map(item => item.attrValue);
      const data = this.data.map(item => Math.round(item.attrRatio * 1000) / 1000);
      const options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            color: '#999999',
            decoration: 'none',
            fontFamily: 'Verdana, sans-serif',
            fontSize: 12,
          },
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E5E5',
          borderRadius: 4,
        },
        formatter: function(params) {
          let tooltip = ``;
          for (let i = 0; i < params.length; i++) {
            tooltip += `<div>
              <i style="${option.tipBodyCircle}background: ${params[i].color}"></i>
                      ${params[i].name}
                      ${name}:&nbsp;&nbsp;${(params[i].value).toFixed(3)}%
                    </div>`;
          }
          return tooltip
        },
        xAxis: {
          type: 'category',
          data: xAxis,
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
          axisLabel: {
            formatter: function(value) {
              return `${value}%`;
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f5f5f5'
            }
          }
        },
        series: [{
          data: data,
          type: 'bar',
          barWidth: 16
        }]
      };
      this.options = options;
    }
  },
  methods: {
  }
}

</script>
