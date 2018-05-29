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
import option from '@/echarts/echartTooltip'

export default {
  name: 'chartGender',
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
      type: Number,
    },
    type: {
      type: String,
      default: 'male'
    }
  },
  watch: {
    'data': function() {
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
          max: 100,
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
          itemStyle: {
            normal: {
              color: isMale ? '#b2d233' : '#1fc8f3'
            }
          },
          data: [Math.round(this.data * 1000) / 1000],
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
