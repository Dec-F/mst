<template>
  <ECharts :options="options" theme="irs" style="width: 100%; height: 100%;"></ECharts>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue';
import theme from '@/echarts/theme.json';
ECharts.registerTheme('irs', theme);
import 'echarts/lib/chart/radar';
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
      const indicator = this.data.map(item => {
        return {
          name: item.attrValue,
          max: maxValue
        };
      });
      const options = {
        grid: {
          containLabel: true,
        },
        tooltip : {},
        radar: {
          indicator: indicator.length ? indicator : [{}]
        },
        series: [{
          type: 'radar',
          data : [
            {
              value : this.data.map(item => parseFloat(item.attrRatio)),
            }
          ]
        }]
      };
      return options;
    }
  },
  methods: {
  }
}

</script>
