<template>
  <div>
    <ECharts v-if="!empty" :options="options" theme="irs" style="width:100%; height:100%"></ECharts>
    <div v-else class="channel-chart-empty">暂无数据</div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue';
import theme from '@/echarts/theme.json';
ECharts.registerTheme('irs', theme);
import 'echarts/lib/chart/map';
import 'echarts/lib/component/tooltip';
import 'echarts/map/js/china';

export default {
  name: 'chartRadar',
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
      type: Array,
      default: function () {
        return [];
      }
    },
  },
  watch: {
    'data': function () {
      if (this.data.length) {
        this.empty = false;
      } else {
        this.empty = true;
        return;
      }
      const data = this.data.map((item, index) => {
        return {
          name: item.attrValue,
          value: Math.round(item.attrRatio * 1000) / 1000,
          itemStyle:{
            normal: {
              label: {
                show: true
              }
            },
            emphasis: {
              label: {
                show: true
              },
              areaColor: '#b2d233'
            }
          },
          label: {
            normal: {
              show: index < 6
            }
          }
        };
      });
      const max = this.data.reduce((prev, item) => Math.max(prev, item.attrRatio), Number.MIN_SAFE_INTEGER);
      const options = {
        tooltip: {
          trigger: 'item',
          textStyle: {
            color: '#999999',
            decoration: 'none',
            fontFamily: 'Verdana, sans-serif',
            fontSize: 12,
          },
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E5E5',
          borderRadius: 4,
          formatter: params => `${params.name}${params.value ? '<br />' + params.value : ''}%`
        },
        visualMap: {
          min: 0,
          max,
          itemWidth: 10,
          itemHeight: 100,
          precision: 4,
          text:['高','低'],
          orient: 'horizontal',
          inRange: {
            color: ['#f2f2f2','#b5d337']
          }
        },
        series: [
          {
            type: 'map',
            mapType: 'china',
            selectedMode: 'multipul',
            zoom: 1.2,
            itemStyle: {
              normal: {
                show: false,
                areaColor: '#e5e5e5',
                borderColor: '#fff',
                borderWidth: 1
              },
              emphasis:{
                show: false,
                areaColor: '#e5e5e5'
              }
            },
            label: {
              normal: {
                show: false,
                formatter: params => `{a|Top${params.dataIndex + 1}}{b|${params.name}}`,
                borderColor: '#c0c4c7',
                borderWidth: 1,
                rich: {
                  a: {
                    height: 20,
                    lineHeight: 20,
                    color: '#fff',
                    backgroundColor: 'rgba(0,0,0,.3)',
                    padding: [0, 10]
                  },
                  b: {
                    height: 20,
                    lineHeight: 20,
                    color: '#999',
                    backgroundColor: 'rgba(255,255,255,.8)',
                    padding: [0, 10]
                  }
                }
              },
              emphasis: {
                show: false
              }
            },
            data,
          }
        ]
      };
      this.options = options;
    }
  },
  methods: {
  }
}

</script>
