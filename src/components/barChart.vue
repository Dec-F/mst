<template>
  <div class="chart" style="padding: 20px">
    <ECharts :options="option" theme="irs"></ECharts>
  </div>
</template>

<script>
import optionTool from '@/echarts/echartTooltip';
import ECharts from 'vue-echarts/components/ECharts.vue';
import theme from '@/echarts/theme.json';
ECharts.registerTheme('irs', theme);
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/dataZoom'
export default {
  name: 'trend-chart',
  components: {
    ECharts
  },
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          xAxis: ['default'],
          data: [
            {
              name: 'default',
              data: [
                {
                  hb: 0,
                  value: 0
                },
                {
                  hb: 0,
                  value: 0
                },
                {
                  hb: 0,
                  value: 0
                }
              ]
            }
          ]
        };
      }
    }
  },
  mounted() {},
  watch: {
    chartData(data) {
      data.legend = data.legend || ['下载趋势', '新装趋势', '活跃趋势'];
      let series = data.legend.map((val, i) => {
        return {
          name: val,
          type: 'line',
          data: data.data.map(v => {
            return v.data[i].value;
          })
        };
      });
      this.option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        toolbox: {
          show: true,
          feature: {
            magicType: { type: ['line', 'bar'] }
          },
          right:'20'
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: data.xAxis
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        legend: {
          x: 'bottom',
          data: data.legend
        },
        series: series
      };
      console.log(this.option);
    }
  },
  data() {
    return {
      option: {}
    };
  }
};
</script>

<style>

</style>
