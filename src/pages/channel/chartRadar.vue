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
import 'echarts/lib/chart/radar';
import 'echarts/lib/component/tooltip';

export default {
  name: 'chartRadar',
  components: {
    ECharts
  },
  data () {
    return {
      empty: false,
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
      const maxValue = this.data.reduce((prev, item) => prev + parseFloat(item.attrRatio), 0);
      const indicator = this.data.map(item => {
        return {
          name: item.attrValue,
          max: maxValue
        };
      });
      const options = {
        tooltip : {
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
        radar: {
          indicator: indicator.length ? indicator : [{}],
          // name: {
          //   formatter: name => `{a|${name}}`,
          //   rich: {
          //     a: {
          //       color: 'red',
          //       width: 36
          //     }
          //   }
          // }
        },
        series: [{
          type: 'radar',
          data: [
            {
              value: this.data.map(item => Math.round(item.attrRatio * 1000) / 1000),
              tooltip: {
                formatter: this.data.map(item => `${item.attrValue}: ${Math.round(item.attrRatio * 1000) / 1000}`).join('<br>')
              }
            }
          ]
        }]
      };
      this.options = options;
    }
  },
  methods: {
  }
}

</script>
