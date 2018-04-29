<template>
  <div class="wrapper">
    <div class="content">
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
            <el-date-picker v-model="week" v-show="queryForm.dateType==1" type="week" format="yyyy 第 WW 周" placeholder="选择周" @change="dateHandle">
            </el-date-picker>
            <el-date-picker v-show="queryForm.dateType==2" v-model="queryForm.date" type="month" format="yyyy 第 MM 月" placeholder="选择月" @change="dateHandle" value-format="yyyyMM">
            </el-date-picker>
            <el-button type="success" @click="queryHandle" class="" size="small">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-content flowTable">
        <div class="table-content-header">
          <el-button :plain="true" type="primary" @click="downloadData" size="small" class='btn-download'>
            <i class="iconfont icon-download"></i>数据导出
          </el-button>
          <el-input
            class="fr"
            size="small"
            style = "display:inline-block; width:180px;"
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            @keyup.13.native="enterQueryHandle">
          </el-input>
        </div>
        <!-- v-loading.table-content-body="loading" -->
        <div class="table-con ">
          <template>
            <el-table :data="tableData" size="small" style="width: 100%">
              <el-table-column v-for="item,index of tableHeader" :key="index" :prop="item.column" :label="item.columnName" :fixed="index==0||index==1||index==2?true:false" align="center" width="150">
                <el-table-column align="center" width="150">
                  <template slot-scope="scope">
                    <div v-if="index==0">
                      <div>{{scope.row[item.column]}}</div>
                    </div>
                    <div v-else-if="index==1">
                      <div>
                        <span class="logo"><img :src="scope.row.logo" alt=""></span>
                        <span style="display:inline-block; vertical-align:middle;width:60px;text-align:left;">{{scope.row[item.column]}}</span>
                        <span style="margin-left:20px" @click="dialogHandle(item)" class="iconChart"></span>
                      </div>
                    </div>
                    <div v-else-if="index==2">
                      <div>{{scope.row[item.column]}}</div>
                    </div>
                    <div v-else>
                      <div style="border-bottom:1px solid #ebeef5">{{scope.row[item.column]}}</div>
                      <div class="table-con-line">
                        <span class="fl">{{scope.row[item.uninstall]}}%</span>
                        <span class="fl">{{scope.row[item.activity]}}%</span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </template>
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="queryForm.pageNo" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <el-dialog title="图表" width="700px" :visible.sync="dialogTableVisible">
          <div class="chart-con">
            <ECharts  style="width:700px;" :options="chartOption" theme="irs"></ECharts>
          </div>
        </el-dialog>
      </div>
    </div>
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
        text:'' //文本搜索

      },
      week: '',
      total: 0, //表格总条数
      // 表格数据
      tableData: [],
      // 表头数据
      tableHeader: [],
      chartData1: [],
      chartData2: [],
      chartData3: [],
      chartXAxis: [],
      chartOption: {},
      dialogTableVisible: false,
      startDate: null,
      endDate: null,

    };
  },
  created() {
    this.fetchAppType();
    this.fetchDate();
  },
  computed: {

  },
  watch: {
    'queryForm.dateType': function() {
      this.queryForm.date = ''
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
      let params = {id:item}
      api.findFlowTrend(params).then(res => {
        console.log(res)
        if (res.resCode == 200) {
          this.chartXAxis = ["迷你世界","贪吃蛇大作战","钢琴块2-别踩白块儿2","天天爱消除","天天爱连线"]  //res.XAxis
          this.chartData1 = [3.278689,3.278689,1.639344,1.639344,1.639344] //res.data1
          this.chartData2 = [1.278689,3.178689,2.639344,4.639344,5.639344] //res.data2
          this.chartOption = {
            legend: {
              data: ['下载趋势', '新装趋势']
            },
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
              data: this.chartXAxis
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
              barGap: 0,
              data: this.chartData1
            }, {
              name: '新装趋势',
              type: 'bar',
              data: this.chartData2
            },]
          }
        }
        
      });
    },
    // 获取app类型数据
    fetchAppType() {
      api.appType().then(res => {
        res.data.typeList.unshift({ categoryId: 0, label: "全部" });
        this.typeList = res.data.typeList;
      });
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
      return year + week
    },

    // 初始化
    fetchDate() {
      api.date().then(res => {
        this.dateVal = res.data.end;
        this.startDate = res.data.start;
        this.endDate = res.data.end;
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
        // console.log(res)
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
.margintop {
  margin: 40px 0 40px 0;
}

.content {
  .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-right: none;
  }
  .is-group .cell {
    border-right: 1px solid #ebeef5;
  }
  .table-con .el-table .cell {
    padding-left: 0;
    padding-right: 0; // border-right:1px solid #ebeef5;
  }
  .table-con .el-table td {
    // padding: 0
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
    color: #fff;
    font-size: 14px;
  }
  .table-con .is-group tr:nth-of-type(2) th {
    // padding: 0;
    background: #e1f4d7;
    color: #65768A;
    border-bottom: none;
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
    .sub-type {
      margin-top: 10px;
      overflow: hidden;
      padding: 10px;
      background-color: #F9F9F9;
      border: 1px dashed #E3EAF4;
      .el-checkbox-button__inner {
        border: 1px solid rgba(0, 0, 0, 0);
        background: none;
        font-size: 13px;
      }
      .el-checkbox-button__inner:hover {
        color: #69C72B
      }
      .el-checkbox-button.is-checked .el-checkbox-button__inner {
        background: none;
        border: 1px solid #69c72b;
        box-shadow: 0px 0 0 0 #69C72B;
        border-radius: 3px;
        color: #69C72B
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
.el-button--small,
.el-button--small.is-round {
  padding: 9px 40px;
}
</style>
