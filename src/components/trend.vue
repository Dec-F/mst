<template>
  <div class="trend">
    <el-tabs type="border-card" @tab-click='tabClick' :value='actTab.name'>
      <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabs" :key="item.index">
        <el-table :data="tableData" style="width: 100%;border-left:none" :span-method="arraySpanMethod" border @sort-change="changeSort">
          <template v-for="(th, index) in tableHeader">
            <el-table-column width="80" fixed prop="index" v-if="th.column === 'index'" :label="th.columnName" :key="index">
              <el-table-column width="80">
                <template slot-scope="scope">
                  <span :class="`top${scope.row.index<=3?scope.row.index:'Normal'}`">{{ scope.row.index }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column v-if="th.column === 'name'" :label="th.columnName" :key="index" min-width="180">
              <el-table-column min-width="180" class-name='box-sd'>
                <template slot-scope="scope">
                  <div @click="linkDetail(scope.row)" class="link">
                    <span class="logo"><img :src="scope.row.logo" alt=""></span>
                    <span>{{ scope.row.name }}</span>
                    <span @click.stop="dialog2Table(scope.row.id)" class="table-left"><img src="../../dist/static/img/tableleft.png"></span>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column v-if="th.column === 'name'&&actTab.mergeCells">
              <el-table-column :render-header="h=>h('div',{domProps:{className:'col-hidden'}})">
                <template slot-scope="scope">
                  <div>
                    <span>{{scope.row.typename}}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column :render-header="renderHeader" align="center" :sortable="false" v-if="th.column !== 'index' && th.column !== 'name'" :label="th.columnName" :key="index">
              <el-table-column sortable="custom" align="right" :prop="`${th.columnName}--${sub.column}`" :min-width="sub.columnName === '环比(%)' ? 100 : 150" :label="sub.columnName" v-for="(sub, index) in th.children" :key="sub.column">
                <template slot-scope="scope">
                  {{ sub.columnName === '环比(%)' ? (scope.row[sub.column] !== null ? (Number(scope.row[sub.column])*100) .toFixed(3) + '%' : '-') : (scope.row[sub.column] !== null ? (scope.row[sub.column]).toFixed(3) : '-') }}
                  <img v-show="sub.columnName !== '环比(%)' && (scope.row[sub.column]) !== null && scope.row[sub.status] !== null" :src="scope.row[sub.status] === '1' ? tableupImg : tabledownImg">
                </template>
              </el-table-column>
            </el-table-column>
          </template>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog title="当前渠道" :visible.sync="dialogTableVisible">
      <!--<span class="chart-date">
            <el-select v-model="dateListVal" placeholder="请选择" @change="changeChart">
              <el-option v-for="item in dateList" :key="item.id" :value="item.id" :label="item.label">
              </el-option>
            </el-select>
          </span>-->
      <div class="chart-con" v-loading.chart-con="chartloading">
        <bar-chart :data="chartData" :xAxis="chartXAxis" :legend="chartLegend" :series="chartSeries"></bar-chart>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/api';
import { getOSAv } from '@/browser/browser';
import barChart from '@/components/barChart';
import { getOSAndBrowser } from '@/browser/browser';
export default {
  name: 'trend-com',
  components: {
    barChart
  },
  props: {
    tableData: Array,
    tableHeader: Array,
    total: Number,
    current: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: 'week'
    },
    tabs: {
      type: Array,
      default: () => [
        {
          index: 0,
          name: 'all',
          label: '全部趋势',
          mergeCells:true
        },
        {
          index: 1,
          name: 'xinzhuang',
          label: '新装趋势',
          mergeCells:false
        },

        {
          index: 2,
          name: 'download',
          label: '下载趋势',
          mergeCells:false
        },

        {
          index: 3,
          name: 'huoyue',
          label: '活跃趋势',
          labelContent:false
        }
      ]
    },
    mergeCells: {
      type: Boolean,
      default:true
    }
  },
  data() {
    return {
      tableupImg: require('../../dist/static/img/table-in-up.png'),
      tabledownImg: require('../../dist/static/img/table-in-down.png'),
      pageSize: 10,
      currentPage: this.current,
      dialogTableVisible: false,
      appId: '',
      dateTypeVal: 1,
      startDate: null,
      endDate: null,
      flag: true,
      chartXAxis: [],
      chartSeries: [],
      chartTitle: null,
      chartLegend: {},
      chartloading: false,
      count: false,
      dateList: [],
      dateListVal: null,
      chartData: [],
      actTab: this.tabs[0]
    };
  },
  created() {
    this.fetchDate();
    const info = getOSAndBrowser();
    if (info.browser === 'Safari') {
      this.flag = false;
    } else {
      this.flag = true;
    }
  },
  watch: {
    $route() {
      this.pageSize = 10;
      this.currentPage = 1;
    },
    tableHeader(data) {
      // 切换时间类型排序会保留的bug
      data.map(item => {
        item.limit = item.limit + this.type;
      });
    },
    current(val) {
      this.currentPage = val;
    },
    tableHeader(val) {
      if (val.length > 0) {
        this.flag = true;
      }
    }
  },
  methods: {
    tabClick(tab, event) {
      this.actTab =this.tabs[tab.index];
      this.$emit('tab-change', tab.name);
    },
    renderHeader(createElement, { column }) {
      return createElement(
        'div',
        {
          domProps: {
            className: 'link'
          },
          on: {
            click: () => {
              console.log(column);
              this.dialog2Table();
            }
          }
        },
        [
          createElement('span', [column.label]),
          createElement('img', {
            attrs: {
              src: require('../../dist/static/img/tabletop.png')
            }
          })
        ]
      );
    },
    // renderHeader1(createElement, { column }) {
    //   return createElement('div', [
    //     createElement('span', [column.label]),
    //     createElement('img', {
    //       attrs: {
    //         src: require('../../dist/static/img/sort.png')
    //       }
    //     })
    //   ]);
    // },
    // 单元格合并
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.actTab.mergeCells) {
        return;
      }
      if (columnIndex <= 1) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    fetchDate() {
      api.date().then(res => {
        this.dateVal = res.data.end;
        this.startDate = res.data.start;
        this.endDate = res.data.end;
        // this.fetchTableData();
      });
    },

    //打开图表框
    dialog2Table(val) {
      this.appId = val; //发送ID
      this.fetchChartsData();
      this.dialogTableVisible = true;
    },
    //    获取图表数据
    fetchChartsData() {
      this.chartloading = true;
      // 发送请求
      const params = {
        // 发送请求
        //date: this.dateTypeVal === 'week' ? this.weekDateVal : this.monthDateVal,
        date: this.dateListVal,
        appId: this.appId,
        dateType: this.dateTypeVal,
        type: this.$route.meta.type,
        subCategoryId: this.checkedType,
        categoryId: this.bigType === 0 ? null : this.bigType
      };
      api.flowCharts(params).then(res => {
        this.chartloading = false;
        this.chartXAxis = res.data.xAxis;
        this.chartData = res.data.ratios;
        this.chartTitle = res.data.fromAppName;
        this.chartLegend = res.data.legend;
        this.chartSeries = res.data.series;
      });
    },

    changeSort(sort) {
      const { order, prop } = sort;
      this.$emit('change-sort', { order, prop });
    },
    linkDetail(item) {
      this.$emit('link-page', item);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit('change-size', val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit('change-current', val);
    }
  }
};
</script>

<style lang='less'>
.box-sd {
  position: relative;
}
.box-sd::after {
  content: '';
  display: inline-block;
  height: 144px;
  width: 1px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0);
  box-shadow: 3px 0px 10px 0px rgba(0, 0, 0, 0.2);
}
.el-table tr:nth-child(2) {
  th {
    background-color: #e1f4d6 !important;
    border-bottom: 1px solid #bde6a2;
    padding: 2px;
  }
}

.el-table tr:nth-child(1) {
  th {
    background-color: #69c72b !important;
    color: white;
  }
}

.el-table tr .el-table_1_column_5_column_6 {
  border-right: 1px solid #ebeef5 !important;
}

.el-table th div {
  line-height: 20px !important;
  box-sizing: border-box;
  white-space: nowrap;
}

.table-left {
  display: inline-block;
  text-align: right;
  float: right;
  img {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
}

.cell {
  text-align: center; // padding-left: 40px;
}

.cell > img {
  display: inline-block;
  margin-left: 20px;
  width: 10px;
  height: 20px;
  vertical-align: top;
}

.cell > div > img {
  width: 14px;
  display: inline-block;
  margin-left: 10px;
}
</style>
