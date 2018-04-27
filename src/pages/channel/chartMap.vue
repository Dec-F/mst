<template>
  <ECharts :options="options" theme="irs" style="width: 100%; height: 100%;"></ECharts>
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
      const data = this.data.map(item => {
        return {
          name: item.attrValue,
          value: item.attrRatio
        };
      });
      const options = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>{c}'
        },
        visualMap: {
          min: 0,
          max: 1,
          precision: 4,
          text:['高','低'],
          orient: 'horizontal',
          inRange: {
            color: ['#b5d337','#d6fa96']
          }
        },
        series: [
          {
            type: 'map',
            mapType: 'china', // 自定义扩展图表类型
            selectedMode: 'multipul',
            itemStyle:{
              normal:{label:{show:true}},
              emphasis:{label:{show:true}}
            },
            data: data,
            // 自定义名称映射
            // nameMap: {
            //     'Central and Western': '中西区',
            //     'Eastern': '东区',
            //     'Islands': '离岛',
            //     'Kowloon City': '九龙城',
            //     'Kwai Tsing': '葵青',
            //     'Kwun Tong': '观塘',
            //     'North': '北区',
            //     'Sai Kung': '西贡',
            //     'Sha Tin': '沙田',
            //     'Sham Shui Po': '深水埗',
            //     'Southern': '南区',
            //     'Tai Po': '大埔',
            //     'Tsuen Wan': '荃湾',
            //     'Tuen Mun': '屯门',
            //     'Wan Chai': '湾仔',
            //     'Wong Tai Sin': '黄大仙',
            //     'Yau Tsim Mong': '油尖旺',
            //     'Yuen Long': '元朗'
            // }
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
