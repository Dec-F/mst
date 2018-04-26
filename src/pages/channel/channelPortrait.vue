<template>
  <div class="wrapper">
    <div class="content">
      <div class="navname">{{ $route.meta.bread.name }}</div>
      <el-row :gutter="20" style="background: white; height: 100px;padding-top: 30px">
        <el-col :span="7" :offset="2" style="border-right: 1px solid darkgray">
          <span class="chart-date">
            <span class="left">
              当前渠道：
            </span>
            <el-select v-model="dateListVal" placeholder="请选择" @change="changeChart">
              <el-option v-for="item in dateList" :key="item.id" :value="item.id" :label="item.label">
              </el-option>
            </el-select>
          </span>
        </el-col>
        <el-col :span="3" :offset="2">
          <el-button>时间选择</el-button>
        </el-col>
        <el-col :span="10">
          <!--</el-date-picker>
                                <el-date-picker v-model="value3" type="month" placeholder="选择月" @change-date="changeDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate">
                                </el-date-picker>-->
          <date-picker v-model="dateVal" :limit="dataLimitVal" :type="dateTypeVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate">
            <span>
              <el-button type="success" @click="submitData">确定</el-button>
            </span>
          </date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px; background:white">
        <el-col :span="24" style="background:#69c72b; height: 40px;">
          <div class="grid-content bg-purple" style="text-align: center;line-height: 40px;color: white;font-size: 18px;">画像洞察</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content " style="background: white">
            <div id="barchart3" style="height: 240px; margin-top: 60px"></div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content " style="background: white">
            <div id="barchart4" style="height: 240px; margin-top: 60px"></div>
          </div>
        </el-col>
        <el-col :span="5">
          <ECharts :options="option1" theme="irs"></ECharts>
        </el-col>
        <el-col :span="5">
          <ECharts :options="option2" theme="irs"></ECharts>
        </el-col>
        <el-col :span="5">
          <div id="myChart" style="height: 240px; margin-top: 60px"></div>
        </el-col>
        <el-col :span="5">
          <div id="myChart1" style="height: 240px; margin-top: 60px"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content " style="background: white">
            <div id="barchart" style="margin-top: 20px;height: 300px;background: white"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content " style="background:white">
            <div id="barchart1" style="margin-top: 20px; height: 300px;background: white"></div>
          </div>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import selectType from "@/components/appTypeMenu";
import datePicker from "@/components/datePicker.1";
import option from '@/echarts/echartTooltip'
import { formatLegend } from '@/echarts/echartFormat'
import ECharts from 'vue-echarts/components/ECharts.vue'
import theme from '@/echarts/theme.json'
ECharts.registerTheme('irs', theme)
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/radar'
import ElCol from "element-ui/packages/col/src/col";
export default {
  name: 'trend-chart',
  components: {
    ElCol,
    ECharts,
    datePicker,
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '年代体系'
        },
        tooltip: {},
        legend: {
          data: ['360手机助手'],
          x: "bottom"
        },
        radar: {
          // shape: 'circle',
          name: {
            "itemStyle": {
              "normal": {
                "borderWidth": "2"
              }
            },
          },
          indicator: [
            { name: '00后' ,max:100},
            { name: '90后',max:100},
            { name: '80后' ,max:100},
            { name: '70后' ,max:100},
            { name: '70前',max:100}

          ]
        },
        series: [{
          name: '',
          type: 'radar',
          itemStyle: {
            normal: {
              color: "#B2D234", // 图表中各个图区域的边框线拐点颜色
              lineStyle: {
                color: "#B2D234" // 图表中各个图区域的边框线颜色
              },
            }
          },
          data: [
            {
              value: [20, 30, 10, 30, 50, 50],
              name: '360手机助手'
            }
          ]
        }]
      });
      let myChart1 = echarts.init(document.getElementById('myChart1'))
      // 绘制图表
      myChart1.setOption({
        title: {
          text: '年龄段'
        },
        tooltip: {},
        legend: {
          data: ['360手机助手'],
          x: "bottom"
        },
        radar: {
          // shape: 'circle',
          name: {
            "itemStyle": {
              "normal": {
                "borderWidth": "2"
              }
            },
          },
          indicator: [
            { name: '20岁及以下', max: 6500 },
            { name: '20-30岁', max: 16000 },
            { name: '31-35岁', max: 30000 },
            { name: '36-40岁', max: 38000 },
            { name: '40岁以上', max: 52000 }

          ]
        },
        series: [{
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          itemStyle: {
            normal: {
              color: "#B2D234", // 图表中各个图区域的边框线拐点颜色
              lineStyle: {
                color: "#B2D234" // 图表中各个图区域的边框线颜色
              },
            }
          },
          data: [
            {
              value: [4300, 10000, 28000, 35000, 50000, 19000],
              name: '360手机助手'
            }
          ]
        }]
      });

      //        教育程度，收入水平
      let barchart = echarts.init(document.getElementById('barchart'), theme)
      barchart.setOption({
        title: { text: '教育程度' },
        itemStyle: {
          normal: {
            color: '#B2D233',
          }
        },
        tooltip: {},
        xAxis: {
          data: ["高中以下", "大学专科", "本科及以上"],
          splitLine: { show: true }
        },
        yAxis: {
          splitLine: { show: true }
        },
        series: [{
          name: '数值',
          type: 'bar',
          barWidth: 20,
          data: [70, 20, 36]
        }]
      });
      let barchart1 = echarts.init(document.getElementById('barchart1'), theme)
      barchart1.setOption({
        title: { text: '收入水平' },
        tooltip: {},
        itemStyle: {
          normal: {
            color: '#B2D233'
          }
        },
        xAxis: {
          data: ["低", "小康", "中高", "高"],
          splitLine: { show: true }
        },
        yAxis: {
          splitLine: { show: true }
        },
        series: [{
          name: '数值',
          type: 'bar',
          barWidth: 20,
          data: [30, 40, 36, 20]
        }]
      });
      let barchart3 = echarts.init(document.getElementById('barchart3'), theme)
      // 绘制图表
      barchart3.setOption({
        xAxis: {
          type: 'category',
          data: ['男']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120],
          type: 'bar',
          barWidth: 25
        }]

      });
      let barchart4 = echarts.init(document.getElementById('barchart4'), theme)
      // 绘制图表
      barchart4.setOption({
        xAxis: {
          type: 'category',
          data: ['女']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120],
          type: 'bar',
          barWidth: 25,
        }]

      });
    }
  },
  data() {
    return {
      option1: {},
      option2: {},
      option3: {},
      option4: {},
      value3: this.startDate,
      dateList: [],
      dateListVal: null,
      dateTypeVal: 'month',
      monthDateVal: '',
      startDate: null,
      endDate: null
    }
  },
  created() {
    this.fetchDate();
    const info = getOSAndBrowser();
    // console.log(info)
    if (info.browser === "Safari") {
      this.flag = false;
    } else {
      this.flag = true;
    }
  },
  method: {
    fetchDate() {
      api.date().then(res => {
        this.dateVal = res.data.end;
        this.startDate = res.data.start;
        this.endDate = res.data.end;
      });
    },
    changeDate(val) {
      this.dateVal = val;
    },
    changeMonthDate(val) {
      this.monthDateVal = val;
    },
  }
}
</script>

<style>

</style>
