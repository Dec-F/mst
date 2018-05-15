<template>
  <div class="chart" style="padding: 20px" >
    <ECharts :options="option" theme="irs"></ECharts>
  </div>
</template>

<script>
import option from '@/echarts/echartTooltip'
import ECharts from 'vue-echarts/components/ECharts.vue';
import theme from '@/echarts/theme.json';
ECharts.registerTheme('irs', theme);
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/dataZoom';
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
  mounted() { },
  watch: {
    chartData(data) {
      if (!data.data) {
        return;
      }
      data.legend = data.legend || ['下载趋势', '新装趋势', '活跃趋势'];
      let series = data.legend.map((val, i) => {
        return {
          name: val,
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.1
          },
          data: data.data.map(v => {
            return v.data[i] && v.data[i].value;
          })
        };
      });
      this.option = {
        tooltip: {
          trigger: 'axis',
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
            let tooltip = `<div> ${params[0].name} </div>`;
            for (let i = 0; i < params.length; i++) {
              tooltip += `<div>
              <i style="${option.tipBodyCircle}background: ${params[i].color}"></i>
                      ${params[i].seriesName}
                      ${name}:&nbsp;&nbsp;${(params[i].value).toFixed(3)}
                    </div>`;
            }
            return tooltip
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '15%',
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
            magicType: {
              type: ['line', 'bar'],
              iconStyle: {
                borderColor: '#69c72b'
              },
              emphasis: {
                iconStyle: {
                  borderColor: '#69c72b'
                },
              }
            }
          },

          right: '3%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: data.xAxis,
          axisLabel: {
            interval: 0,
            rotate:30
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        legend: {
          bottom: 0,
          data: data.legend,
          tooltip: {
            show: true
          }
        },

        series: series
      };
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
