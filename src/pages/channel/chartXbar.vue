<template>
  <ECharts :options="options" theme="irs" style="width: 100%; height: 100%;"></ECharts>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue';
import theme from '@/echarts/theme.json';
ECharts.registerTheme('irs', theme);
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';

const maxValue = 1;

export default {
  name: 'chartRadar',
  components: {
    ECharts
  },
  data () {
    return {
    }
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return [];
      }
    },
  },
  computed: {
    'options': function () {
      const yAxis = this.data.map(item => item.attrValue);
      const data = this.data.map(item => item.attrRatio);
      const options = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip : {
          trigger: 'axis',
          axisPointer : {
            type : 'shadow'
          }
        },
        xAxis: {
          type: 'value',
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
        yAxis: {
          type: 'category',
          data: yAxis,
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
        series: [
          {
            barWidth: 16,
            type: 'bar',
            data: data
          }
        ]
      };
      return options;
    }
  },
  methods: {
  }
}

</script>
