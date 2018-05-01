<template>
  <div class="wrapper">
    <div class="content">

      <div class="contentsame">
        <div class="navname" style="margin-top: 25px;">{{ $route.meta.bread.name }}</div>
        <div class="detail-content-menu ">
          <el-form ref="form" class="app-type-content" :model="queryForm" label-width="80px" size="small">
            <el-form-item label="APP类别">
              <el-radio-group class="app-type" v-model="queryForm.categoryId">
                <span v-for="item in typeList" :key="item.categoryId" @click="typeListHandle(item)">
                  <el-radio-button :label="item.categoryId" :value="item.categoryId">{{ item.label }}</el-radio-button>
                </span>
              </el-radio-group>
              <div class="sub-type" v-show="queryForm.categoryId!=0">
                <el-checkbox-button class="fl" @change="allSelHandle" v-model="allSel">全部</el-checkbox-button>
                <el-checkbox-group class="fl" v-model="subIdArr">
                  <el-checkbox-button @change="subSelHandle" v-for="item in typeSubList" :label="item.subCategoryId" :key="item.subCategoryId">{{ item.label }}</el-checkbox-button>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item label="时间筛选">
              <el-radio-group class="date-type" v-model="queryForm.dateType">
                <el-radio-button label="1">周</el-radio-button>
                <el-radio-button label="2">月</el-radio-button>
              </el-radio-group>
              <el-date-picker v-model="week" v-show="queryForm.dateType==1" type="week" format="yyyy-WW" placeholder="选择周" :picker-options="{ disabledDate }" @change="dateHandle">
              </el-date-picker>

              <el-date-picker v-show="queryForm.dateType==2" v-model="month" type="month" format="yyyy-MM" placeholder="选择月" :picker-options="{ disabledDate }" @change="dateHandle" value-format="yyyyMM">
              </el-date-picker>
              <el-button type="success" @click="queryHandle" class="" size="small">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-content flowTable">
          <div class="table-content-header">
            <el-autocomplete class="fr search" size="small" style="display:inline-block;" v-model="queryForm.appname" :fetch-suggestions="querySearch" placeholder="输入您要查找的内容..." :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
          </div>
          <!-- v-loading.table-content-body="loading" -->
          <div class="table-con ">
            <template>
              <el-table :data="tableData" size="small" style="width: 100%" stripe>

                <el-table-column v-for="item,index of tableHeader" :key="index" :prop="item.column" :label="item.columnName" :fixed="index==0||index==1||index==2?true:false" align="center" :width="tableHeaderWidth[index]?tableHeaderWidth[index]:200">
                  <template slot-scope="scope">
                    <div v-if="index==0">
                      <div>{{scope.row[item.column]}}</div>
                    </div>
                    <div v-else-if="index==1">
                      <div>
                        <span class="logo"><img :src="scope.row.logo" alt=""></span>
                        <span style="display:inline-block; vertical-align:middle;width:60px;text-align:left;">{{scope.row[item.column]}}</span>
                        <span style="margin-left:20px" @click="dialogHandle(scope.row)" class="iconChart"></span>
                      </div>
                    </div>
                    <div v-else-if="index==2">
                      <div>{{scope.row[item.column]}}</div>
                    </div>
                    <div v-else>
                      <div style="border-bottom:1px solid #ebeef5">{{scope.row[item.column]}}</div>
                      <div>{{scope.row[item.uninstall]}}%</div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <el-footer>
              <el-row type="flex" justify="space-between" class="margintop">
                <el-button :plain="true" type="primary" @click="downloadData" size="small" class='btn-download'>
                  <i class="iconfont icon-download"></i>数据导出
                </el-button>
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="queryForm.pageNo" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </el-row>
            </el-footer>
          </div>
          <el-dialog title="图表" width="700px" :visible.sync="dialogTableVisible">
            <!-- <span class="chart-date">
                                        <el-select v-model="dateListVal" placeholder="请选择" @change="changeChart">
                                          <el-option v-for="item in dateList" :key="item.id" :value="item.id" :label="item.label">
                                          </el-option>
                                        </el-select>
                                      </span> -->
            <div class="chart-con">
              <div style="text-align:center">
                <span style="border:1px solid #ddd; padding:8px;">{{chartTile}}</span>
              </div>
              <ECharts style="width:700px;" :options="chartOption" theme="irs"></ECharts>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <!-- <div :class="clicked? 'blue-class':'red-class'" @click="clicked = !clicked"></div> -->
  </div>
</template>

<script>
import api from "@/api/api";
// import barChart from "@/components/barChart";
// import trend from '@/components/flow'
// import selectType from "@/components/appTypeMenu";
// import datePicker from "@/components/datePicker";
// import search from "@/components/search";

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
  name: "detail",
  components: {
    // search,
    // barChart,
    ECharts
  },
  data() {
    return {
      bigTypeItem: [],
      typeList: [], //app类型数据
      typeSubList: [], //app类型数据
      allSel: false,
      subIdArr: [],
      queryForm: {
        categoryId: '0', //大类id
        subCategoryId: '',
        dateType: '1',  //1/2周或者月
        date: '',//时间
        pageNo: 1, //分页
        pageSize: 10, //条数
        orderType: 'descending', //排序类型

      },
      week: '',
      month: '',
      total: 0, //表格总条数
      // 表格数据
      tableData: [],
      // 表头数据
      tableHeader: [],
      tableHeaderWidth: {
        0: 80,
        1: 160,
        2: 80
      },
      chartData1: [],
      chartData2: [],
      chartData3: [],
      chartXAxis: [],
      chartOption: {},
      chartTile: '',
      dialogTableVisible: false,
      startDate: null,
      endDate: null,
      searchData: []


    };
  },
  created() {
    this.fetchAppType();
    this.fetchDate();
  },
  computed: {

  },
  watch: {
    'queryForm.dateType': function(val) {
      console.log(val)
      if (val == 2) {
        this.month = new Date(this.endDate)
      }
    },
    $route(val) {
      this.init();
    }
  },
  methods: {
    allSelHandle(val) {
      if (val) {
        this.subIdArr = []
        this.bigTypeItem.forEach((item) => {
          this.subIdArr.push(item.subCategoryId)
        })
      } else {
        this.subIdArr = []
      }
    },
    subSelHandle(val) {
      if (!val) {
        this.allSel = false
      }
    },
    // 时间选择事件
    dateHandle(val) {
      if (this.queryForm.dateType == 1) {
        this.queryForm.date = this.getWeekNumber(val)
      }
    },
    // 查询按钮
    queryHandle() {
      this.queryForm.pageNo = 1
      if (this.queryForm.dateType == 2) {
        let date = new Date(this.month)
        let year = date.getFullYear()
        let month = date.getMonth() + 1 + ''
        if (month.length == 1) {
          month = 0 + month
        }
        let yearMM = year + month
        this.queryForm.date = yearMM
      }
      this.fetchTableData()
    },
    // 查询按钮
    enterQueryHandle() {
      this.fetchTableData()
    },

    // app类别点击事件
    typeListHandle(item) {
      this.bigTypeItem = item.children
      let id = item.categoryId
      if (id == 0) {
        this.typeSubList = []
      } else {
        this.typeSubList = item.children
      }
    },

    // 分页
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchTableData()
    },
    // 表格弹出
    dialogHandle(item) {
      this.dialogTableVisible = true
      this.queryForm.id = item.id
      api.sambarecharts(this.queryForm).then(res => {
        console.log(res)
        if (res.resCode == 200) {
          this.chartXAxis = res.data.xAxis
          this.chartData1 = res.data.ratios
          this.chartData2 = [1.278689, 3.178689, 2.639344, 4.639344, 5.639344] //res.data2
          this.chartOption = {
            // legend: {
            //   data: ['下载趋势',]
            // },
            tooltip: {
              trigger: 'axis',
              // extraCssText: 'fds',
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
              data: ['总费用', '房租', '水电费', '交通费', '伙食费', '日用品数']
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value}%'
              }
            },
            series: [{
              name: '下载趋势',
              type: 'bar',
              barWidth: '40px',
              data: this.chartData1
            }]
          }
        }

      });
    },
    disabledDate(date) {
      const start = this.startDate
      const end = this.endDate
      return !this.dateInRange(date, start, end);
    },
    dateInRange(val, start, end) {
      const valDateStamp = new Date(val).getTime();
      const startDateStamp = new Date(start).getTime();
      const endDateStamp = new Date(end).getTime();
      return valDateStamp > startDateStamp && valDateStamp < endDateStamp;
    },

    // 获取app类型数据
    fetchAppType() {
      api.appType().then(res => {
        res.data.typeList.unshift({ categoryId: 0, label: "全部" });
        this.typeList = res.data.typeList;
      });
      api.findSearchAppChannel().then(res => {
        if (res.resCode == 200) {
          this.searchData = res.data
          this.searchData.forEach((item) => {
            item.value = item.name
          })
        }
      });
    },
    querySearch(queryString, cb) {
      var restaurants = this.searchData;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      if (!results.length) {
        results = [{ value: "暂无数据" }]
      }
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      if (item.id) {
        this.queryForm.appid = item.id
        this.fetchTableData()
      }
      this.queryForm.appid = ''
      this.queryForm.appname = ''
    },
    // 获取当前时间周方法
    getWeekNumber(src) {
      var date = new Date(src.getTime());
      date.setHours(0, 0, 0, 0);
      // Thursday in current week decides the year.
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
      // January 4 is always in week 1.
      var week1 = new Date(date.getFullYear(), 0, 4);
      let year = date.getFullYear() + ''
      let week = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
      week = week + ''
      if (week.length == 1) {
        week = 0 + '' + week
      }
      return year + week
    },

    // 初始化
    fetchDate() {
      api.date().then(res => {
        this.dateVal = res.data.end;
        this.startDate = res.data.start;
        this.endDate = res.data.end;
        this.week = new Date(this.endDate)
        if (this.queryForm.dateType == 1) {
          this.queryForm.date = this.getWeekNumber(this.week)
        }
        this.fetchTableData();
      });
    },
    // 获取表格数据
    fetchTableData() {
      this.loading = true;
      this.queryForm.subCategoryId = this.subIdArr.join(',')
      api.findFlowTrend(this.queryForm).then(res => {
        this.queryForm.pageNo = res.data.tablePage.pageNo
        this.total = res.data.tablePage.total
        this.loading = true;
        this.count = true;
        if (res.data.tableHeader !== null) {
          this.tableHeader = res.data.tableHeader;
        } else {
          this.tableHeader = [];
        }
        if (res.data.tableData !== null) {
          this.tableData = res.data.tableData;
        } else {
          this.tableData = [];
        }
      });
    },

    // 导出数据
    downloadData() {
      // const params = {
      //   // 发送请求
      //   type: this.$route.meta.type,
      //   date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
      //   dateType: this.dateTypeVal,
      //   limit: this.dataLimitVal,
      //   subCategoryId: this.checkedType,
      //   categoryId: this.bigType === 0 ? null : this.bigType,
      //   pageNo: this.currentPage,
      //   pageSize: this.pageSize,
      //   orderType: this.orderType,
      //   orderColumn: this.orderColumn,
      //   queryId: this.searchId,
      //   queryType: this.searchType
      // }

      var path = "http://113.200.91.81/mst/deep/exportAppDeepsExcel?";
      var paras1 =
        "type=" +
        this.$route.meta.type +
        "&" +
        "date=" +
        (this.dateTypeVal === "week" ? this.weekDateVal : this.monthDateVal) +
        "&" +
        "dateType=" +
        this.dateTypeVal +
        "&" +
        "limit=" +
        this.dataLimitVal +
        "&";
      var paras2 =
        "subCategoryId=" +
        this.checkedType +
        "&" +
        "categoryId=" +
        (this.bigType === 0 ? null : this.bigType) +
        "&";

      var paras3 =
        "pageNo=" +
        this.currentPage +
        "&" +
        "pageSize=" +
        this.pageSize +
        "&" +
        "orderType=" +
        this.orderType +
        "&" +
        "orderColumn=" +
        this.orderColumn;
      // "queryId=" + this.searchId + "&" +
      // "queryType=" + this.searchType;
      // window.location.href = path + paras1 + paras2 + paras3;

      if (this.bigType == 0) {
        window.location.href = path + paras1 + paras3;
      } else {
        window.location.href = path + paras1 + paras2 + paras3;
      }
    },
  }
};
</script>

<style lang="less">
.fl {
  float: left;
}

.fr {
  float: right;
}

.hidden {
  overflow: hidden
}

.contentsame {
  .table-con .el-table .cell {
    padding-left: 0;
    padding-right: 0
  }
  .table-con .el-table td {
    padding: 0
  }
  .table-con-line span {
    position: relative;
    display: inline-block;
    width: 50%;
  }
  .table-con-line span:first-child:before {
    position: absolute;
    content: "";
    right: 0;
    top: 9px;
    height: 10px;
    width: 1px;
    background: #ddd
  }
  .table-con .is-group tr:nth-of-type(1) th {
    background: #69C72B;
    color: #fff
  }
  .table-con .is-group tr:nth-of-type(2) th {
    padding: 0;
    background: #e1f4d7;
  }

  .table-con .is-group.has-gutter tr:nth-of-type(2) th .cell:before {
    content: "卸载流向";
    display: block;
    float: left;
    width: 50%;
  }
  .table-con .is-group.has-gutter tr:nth-of-type(2) th .cell:after {
    content: "同装流向";
    display: block;
    float: left;
    width: 50%;
  }
  .table-con .is-group.has-gutter tr:nth-of-type(2) th:nth-of-type(1) .cell:before,
  .table-con .is-group.has-gutter tr:nth-of-type(2) th:nth-of-type(2) .cell:before,
  .table-con .is-group.has-gutter tr:nth-of-type(2) th:nth-of-type(3) .cell:before {
    content: "";
  }
  .table-con .is-group.has-gutter tr:nth-of-type(2) th:nth-of-type(1) .cell:after,
  .table-con .is-group.has-gutter tr:nth-of-type(2) th:nth-of-type(2) .cell:after,
  .table-con .is-group.has-gutter tr:nth-of-type(2) th:nth-of-type(3) .cell:after {
    content: "";
  }


  .detail-content-menu {
    border: 1px solid #ddd;
    background: #fff;
    overflow: hidden;
    padding: 20px 10px;
    .app-type {
      .el-radio-button__inner {
        border: none;
        font-size: 14px;
        height: 25px;
      }
      .el-radio-button__inner:hover {
        color: #69C72B
      }
      .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        background: #69C72B;
        box-shadow: -1px 0 0 0 #69C72B;
        border-radius: 3px;
        color: #fff
      }
    }
    .app-type span {
      width: 86px;
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 5px;
    }
    .sub-type {
      margin-top: 10px;
      overflow: hidden;
      padding-top: 10px;
      background-color: #F9F9F9;
      border: 1px dashed #E3EAF4;
      .el-checkbox-button {
        min-width: 86px;
        text-align: center;
        display: inline-block;
        margin-right: 20px;
        margin-bottom: 10px;
      }
      .el-checkbox-button__inner {
        border: 1px solid rgba(0, 0, 0, 0);
        background: none;
        font-size: 14px;
        padding: 7px 15px;
      }
      .el-checkbox-button__inner:hover {
        color: #69C72B
      }
      .el-checkbox-button.is-checked .el-checkbox-button__inner {
        background: none;
        border: 1px solid #69c72b;
        box-shadow: 0px 0 0 0 #69C72B;
        border-radius: 3px;
        color: #69C72B;
        min-width: 86px;
      }
      .el-checkbox-group {
        display: inline-block;
        width: 810px !important;
      }
    }
    .date-type {
      .el-radio-button__inner:hover {
        color: #69C72B
      }
      .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        background: #69C72B;
        border: 1px solid #69c72b;
        box-shadow: 0px 0 0 0 #69C72B;
        color: #fff
      }
    }
    .el-button--success {
      width: 120px;
      height: 30px;
      line-height: 5px;
      vertical-align: middle;
      float: right
    }
  }
  .el-table__header tr th {
    background: #69C72B;

    color: #fff;
    .cell {
      border-right: 1px solid #fff;
    }
  }
  .table-content-header {
    overflow: hidden;
  }
  .el-table__header tr th:nth-child(3) .cell {
    border-right: none;
  }
  .el-table__row td {
    // padding: 0
    .cell {
      div {
        div {
          padding: 5px;
        }
      }
    }
  }
  .el-table__body-wrapper.is-scrolling-left~.el-table__fixed,
  .el-table__body-wrapper.is-scrolling-none~.el-table__fixed,
  .el-table__body-wrapper.is-scrolling-none~.el-table__fixed-right,
  .el-table__body-wrapper.is-scrolling-right~.el-table__fixed-right {
    box-shadow: 4px 0 18px #e6e7e8;
  }
  .search {
    display: inline-block;
    width: 300px;
    .el-input__inner {
      height: 32px;
      line-height: 32px;
      width: 300px;
      border: none;
      background: #f9f9f9;
      border-bottom: 1px solid #ddd;
    }
  }
}

.iconChart {
  width: 24px;
  height: 24px;
  display: inline-block;
  background: url(../../assets/iconChart.png) no-repeat;
  vertical-align: middle;
  margin: 0 5px;
}
</style>
