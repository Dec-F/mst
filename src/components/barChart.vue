<template>
  <div class="chart" style="padding: 20px">
    <ECharts :options="option" theme="irs"></ECharts>
  </div>
</template>

<script>
import option from '@/echarts/echartTooltip'
import { formatLegend } from '@/echarts/echartFormat'
import ECharts from 'vue-echarts/components/ECharts.vue'
import theme from '@/echarts/theme.json'
ECharts.registerTheme('irs', theme)
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/bar'
export default {
  name: 'trend-chart',
  components: {
    ECharts
  },
  props: {
    data: Array,
    xAxis: Array,
    series: Array,
    name: String,
  },
  watch: {
    data(data) {
      this.option = {
        tooltip: {
          trigger: 'axis',
          extraCssText: option.extraCssText,
          textStyle: {
            fontSize: 12
          },
          formatter: function(params) {
            let tooltip = `<div style ="${option.tipHeaderCss}"> ${params[0].name}: ${params[0].value.toFixed(3) + '%'} </div>`;
            return tooltip
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: this.xAxis,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        legend: {
          x: 'bottom',
          data:['下载趋势', '新装趋势', '活跃趋势']
        },
        series: this.series
      }
    }
  },
  data() {
    return {
      option: {}
    }
  }
}
</script>

<style>

</style>
