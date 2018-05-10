<template>
  <div class="wrapper">
    <div class="content">
      <div class="contentflow">
        <div class="navname" style="margin-top: 25px;padding: 0px 10px 0px 10px;">{{ $route.meta.bread.name }}
          <el-tooltip class="item" effect="light" content="APP与上月/周相比活性（时间）降低，流向同类别APP的占比。" placement="right">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
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

              <el-date-picker v-model="week" v-show="queryForm.dateType==1" type="week" format="yyyy 第 WW 周" placeholder="选择周" :picker-options="{ disabledDate }" @change="dateHandle">
              </el-date-picker>

              <el-date-picker v-show="queryForm.dateType==2" v-model="month" type="month" format="yyyy 第 MM 月" placeholder="选择月" :picker-options="{ disabledDate }" @change="dateHandle" value-format="yyyyMM">
              </el-date-picker>
              <el-button type="success" @click="queryHandle" class="" size="small">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-content flowTable">
          <div class="table-content-header">
            <div class="searchSelect">
              <el-autocomplete class="fr search" size="small" style="display:inline-block;" v-model="queryForm.appname" :fetch-suggestions="querySearch" placeholder="输入您要查找的内容..." :trigger-on-focus="false" @select="handleSelect" prefix-icon="el-icon-search"></el-autocomplete>
            </div>
          </div>
          <!-- v-loading.table-content-body="loading" -->
          <div class="table-con ">
            <template>
              <el-table :data="tableData" size="small" style="width: 100%" stripe>
                <el-table-column v-for="item,index of tableHeader" :key="index" :prop="item.column" :label="item.columnName" :fixed="index==0||index==1||index==2?true:false" align="center" :width="tableHeaderWidth[index]?tableHeaderWidth[index]:200">
                  <el-table-column align="center" :width="tableHeaderWidth[index]?tableHeaderWidth[index]:200">
                    <template slot-scope="scope">
                      <div v-if="index==0">
                        <div>{{scope.row[item.column]}}</div>
                      </div>
                      <div v-else-if="index==1">
                        <div>
                          <span class="logo"><img :src="scope.row.logo" alt="" style="width: 30px;height: 30px;"></span>
                          <span style="display:inline-block; vertical-align:middle;width:60px;text-align:left;line-height: 35px;">{{scope.row[item.column]}}</span>
                          <span style="margin-left:20px" @click="dialogHandle(scope.row)" class="iconChart"></span>
                        </div>
                      </div>
                      <div v-else-if="index==2">
                        <div>{{scope.row[item.column]}}</div>
                      </div>
                      <div v-else>
                        <div style="border-bottom:1px solid #ebeef5">{{scope.row[item.column]}}</div>
                        <div class="table-con-line">
                          <span class="fl">{{scope.row[item.uninstall].toFixed(3)}}%</span>
                          <span class="fl">{{scope.row[item.activity].toFixed(3)}}%</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
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
          <el-dialog title="当前渠道" width="1000px" :visible.sync="dialogTableVisible">
            <div class="chart-con">
              <div style="position: absolute;top: 17px;left: 133px;">
                <span><img :src="chartLogo" alt="" style="width: 30px;height: 30px;"></span>
              </div>
              <div style="position: absolute;top: 20px;left: 175px;">
                <span style="color:#69C72B">{{chartTile}}</span>
              </div>
              <ECharts style="width:900px;" :options="chartOption" theme="irs"></ECharts>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
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
        categoryId: '', //大类id
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
      chartLogo: '',
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
      this.queryForm.queryId = ''
      this.queryForm.pageNo = 1
      if (this.queryForm.dateType == 2) {
        let date = new Date(this.month)

        let year = date.getFullYear()
        let month = date.getMonth()
        if (month.length == 1) {
          month = 0 + month
        }
        let yearMM = year + month
        this.queryForm.date = yearMM
                console.log(yearMM)
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
      if (id == '') {
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
      this.queryForm.appId = item.id
      console.log(item)
      api.flowBarecharts(this.queryForm).then(res => {
        console.log(res)
        if (res.resCode == 200) {
          this.chartXAxis = res.data.xAxis
          this.chartData1 = res.data.ratios
          this.chartData2 = res.data.ratios1
          this.chartTile = res.data.fromAppName
          this.chartLogo = res.data.logo
          this.chartOption = {
            legend: {
              data: ['卸载流向', '同装流向',],
              orient: 'horizontal', // 'vertical'
              x: 'center', // 'center' | 'left' | {number},
              y: 'bottom', // 'center' | 'bottom' | {number}
            },
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
                let tooltip = `<div> ${params[0].name}: ${params[0].value.toFixed(3) + '%'} </div>`;
                return tooltip
              }
            },
            toolbox: {
              show: true,
              feature: {
                magicType: { show: true, type: ['line', 'bar'] },
              }
            },
            grid: {
              left: '3%',
              right: '3%',
              bottom: '10%',
              containLabel: true,
            },
            xAxis: {
              data: this.chartXAxis
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value}%'
              }
            },
            series: [{
              name: '卸载流向',
              type: 'bar',
              barGap: 0,
              barWidth: '20px',
              data: this.chartData1
            }, {
              name: '同装流向',
              type: 'bar',
              barWidth: '20px',
              data: this.chartData2
            },]
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
        res.data.typeList.unshift({ categoryId: '', label: "全部" });
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
        this.queryForm.queryId = item.id
        this.queryForm.appname = item.name
        this.fetchTableData()
      }
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
        this.queryForm.appname = ''
      });
    },

    // 导出数据
    downloadData() {
      var path = "http://113.200.91.62:8080/mst/depth/exportFlowTrend?";
      var paras1 = "categoryId=" + (this.queryForm.categoryId) + "&"+"subCategoryId="
                 +(this.queryForm.subCategoryId) +"&" +"dateType=" +(this.queryForm.dateType)+"&"
                 + "date=" +(this.queryForm.date) +"&"+"pageNo="+ (this.queryForm.pageNo)
                 +"&" +"pageSize=" +(this.queryForm.pageSize) +"&"+ "appId="+(this.queryForm.appId)
        window.location.href = path + paras1 ;

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

.contentflow {
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: none;
  }
  .is-group .cell {
    border-right: 1px solid #ebeef5;
  }
  .is-group tr th:nth-child(3) .cell {
    border-right: none;
  }
  .table-content-header {
    background: #f9f9f9;
    border: 1px solid #e2e9f3;
    padding: 8px 20px;
  }
  .table-con {
    padding: 20px 20px;
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
    // padding: 0;
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
  .el-table tr:nth-child(2) {
    th {
      background-color: #e1f4d6 !important; // border-bottom: 1px solid #bde6a2;
      padding: 2px;
    }
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

  .el-dialog__header {
    border-bottom: 1px solid #E2E9F3;
    background: #F8F8F8;
    .el-dialog__title {
      border: 1px solid rgb(221, 221, 221) !important;
      padding: 6px 10px;
      line-height: 24px;
      font-size: 14px;
      color: #63738C;
      background: #fff;
    }
    .el-dialog__title::before {
      content: "\E636";
      font-family: "iconfont" !important;
      padding-right: 10px;
      color: #E2E9F3
    }
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
      margin-right: 20px;
      .el-radio-button__inner:hover {
        color: #69C72B;
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
      float: right;
    }
  }
  .table-content-header {
    overflow: hidden;
  }
  .table-con .el-table .cell {
    padding-left: 0;
    padding-right: 0; // border-right:1px solid #ebeef5;
  }
  .table-con .el-table td {
    // padding: 0
    .cell {
      div {
        div {
          padding: 5px;
        }
      }
    }
  }
  .el-table__row td {
    padding: 0;
  }

  .table-con-line {
    display: list-item;
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
      height: 39px;
      width: 300px;
      border: none;
      background: #f9f9f9;
      border-bottom: 1px solid #ddd;
    }
  }
}

.margintop {
  margin-top: 40px;
  .is-plain {
    bottom: 0
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

// 搜索框
.searchSelect {
  position: relative;
  z-index: 111;
  height: 40px;
  text-align: right;
  float: right;
}

.select__icon-cur {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  max-height: 33px;
  padding: 5px;
  border-radius: 50%;
  z-index: 1;
}
</style>
