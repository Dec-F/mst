<template>
  <div class="trend">
    <div class="search">
      <searchSelect v-if="openSearch" :channels='searchData' @change='searchChange'></searchSelect>
    </div>
    <el-tabs type="border-card" @tab-click='tabClick' :value='actTab.name'>
      <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabs" :key="item.index">
        <el-table ref="table" :data="tableData" style="width: 100%;border-left:none" :span-method="arraySpanMethod" :row-class-name='rowClass' border @sort-change="changeSort">
          <template v-for="(th, index) in tableHeader">
            <el-table-column width="80" fixed prop="index" v-if="th.column === 'index'" :label="th.columnName" :key="index">
              <el-table-column width="80">
                <template slot-scope="scope">
                  <span :class="`top${scope.row.index<=3?scope.row.index:'Normal'}`">{{ scope.row.index }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column fixed v-if="th.column === 'name'" :label="th.columnName" :key="index" min-width="180">
              <el-table-column min-width="180">
                <template slot-scope="scope">
                  <div @click="linkDetail(scope.row)" :class="scope.row.name!=='合计'?'link':''">
                    <span class="logo"><img :src="scope.row.logo" alt=""></span>
                    <span class="item-name">{{ scope.row.name =((scope.row.name).split("-com"))[0]}}</span>
                    <span v-if="(scope.row.name!=='合计')" @click.stop="dialog2Table({type:1,payload:scope.row})" class="table-left"><img src="../../static/img/tableleft.png"></span>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column v-if="th.column === 'name'&&actTab.mergeCells">
              <el-table-column fixed :render-header="h=>h('div',{domProps:{className:'col-hidden'}})">
                <template slot-scope="scope">
                  <div>
                    <span>{{scope.row.typename}}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column :render-header="renderHeader" align="center" :sortable="false" v-if="th.column !== 'index' && th.column !== 'name'" :label="th.columnName" :key="index">
              <el-table-column sortable="custom" align="right" :prop="`${th.orderColumn}--${sub.column}`" :min-width="sub.columnName === '环比(%)' ? 100 : 150" :label="sub.columnName" v-for="(sub, index) in th.children" :key="sub.column">
                <template slot-scope="scope">
                  <p style="width:85%;float:left">{{ sub.columnName === '环比(%)' ? (!!scope.row[sub.column] ? (scope.row[sub.column]) : (scope.row[sub.column]===0?'0':'-')) : (!!scope.row[sub.column] ? (scope.row[sub.column]).toFixed(3) : (scope.row[sub.column]===0?'0':'-'))}}</p>
                  <p style="width:10%;float:left"><img v-show="sub.columnName !== '环比(%)' && (scope.row[sub.column]) !== null && scope.row[sub.status] !== null" v-if="scope.row[sub.status] == 1" :src="tableupImg">
                    <img v-show="sub.columnName !== '环比(%)' && (scope.row[sub.column]) !== null && scope.row[sub.status] !== null" v-if="scope.row[sub.status] == 2" :src="tabledownImg"></p>
                </template>
              </el-table-column>
            </el-table-column>
          </template>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <template v-if="dialogTableVisible">
      <el-dialog width='1000px' :title="chartData.chartTitle" :visible.sync="dialogTableVisible">
        <div class="chart-sub-title">
          <img class="app-icon" :src="chartIconSrc" alt=""> {{chartData.chartSubTitle}}
        </div>

        <div class="chart-con" v-loading.chart-con="chartData.chartloading">
          <bar-chart :chartData="chartData"></bar-chart>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import api from '@/api/api';
import { getOSAv } from '@/browser/browser';
import barChart from '@/components/barChart';
import { getOSAndBrowser } from '@/browser/browser';
import searchSelect from '@/components/SearchSelect/index';
export default {
  name: 'trend-com',
  components: {
    barChart,
    searchSelect
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
          mergeCells: true
        },
        {
          index: 2,
          name: 'download',
          label: '下载趋势',
          mergeCells: false
        },
        {
          index: 1,
          name: 'xinzhuang',
          label: '新装趋势',
          mergeCells: false
        },
        {
          index: 3,
          name: 'huoyue',
          label: '活跃趋势',
          labelContent: false
        }
      ]
    },
    mergeCells: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    },
    openSearch: {
      type: Boolean,
      default: false
    },
    resetOrder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableupImg: require('../../static/img/table-in-up.png'),
      tabledownImg: require('../../static/img/table-in-down.png'),
      pageSize: 10,
      currentPage: this.current,
      dialogTableVisible: false,
      appId: '',
      dateTypeVal: 1,
      startDate: null,
      endDate: null,
      flag: true,
      count: false,
      dateList: [],
      dateListVal: null,
      actTab: this.tabs[0],
      searchData: [],
      chartIconSrc: ''
    };
  },
  created() {
    const info = getOSAndBrowser();
    if (info.browser === 'Safari') {
      this.flag = false;
    } else {
      this.flag = true;
    }
    if (this.openSearch) {
      this.fetchSearchData();
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
    },
    resetOrder(val) {
      this.$refs.table.forEach(v => v.clearSort());
    }
  },
  methods: {
    fetchSearchData() {
      api.findSearchAppChannel().then(res => {
        this.searchData = res.data;
      });
    },
    searchChange(id) {
      this.$emit('search-change', id);
    },

    tabClick(tab, event) {
      this.actTab = this.tabs[tab.index];
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
              this.dialog2Table({ type: 2, payload: column });
            }
          }
        },
        [
          createElement('span', [column.label]),
          createElement('img', {
            attrs: {
              src: require('../../static/img/tabletop.png')
            }
          })
        ]
      );
    },
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

    //打开图表框
    dialog2Table(val) {
      this.$emit('open-chart', val);
      console.log(val.payload.logo);
      this.chartIconSrc = decodeURIComponent(val.payload.logo);
      this.dialogTableVisible = true;
    },

    changeSort(sort) {
      let { order, prop } = sort;
      order = order == 'descending' ? 'desc' : 'asc';
      this.$emit('change-sort', { order, prop });
    },
    linkDetail(item) {
      if (item.name == '合计') {
        return;
      }
      console.log(item);
      if (item.typename == '人均次数') {
        return;
      }
      if (item.typename == '人均时长') {
        return;
      }
      if (item.typename == '质量分析') {
        return;
      }
      this.$emit('link-page', item);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit('change-size', val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit('change-current', val);
    },
    rowClass({ row, rowIndex }) {
      if (!this.actTab.mergeCells) {
        if (rowIndex % 2 === 0) {
          return '';
        } else {
          return 'row-night';
        }
      }
      if (Math.floor(rowIndex / 3) % 2 === 0) {
        return 'row-light';
      } else {
        return 'row-night';
      }
    }
  }
};
</script>

<style lang='less'>
.row-light {
  background-color: #fff;
}

.row-night td {
  background-color: #fafafa;
}

.chart-sub-title {
  position: absolute;
  top: 11px;
  left: 150px;
  color: #69c72b;
  .app-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    vertical-align: middle;
  }
}

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
  background-color: rgba( 0,
  0,
  0,
  0); // box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
}

.el-tabs__content {
  overflow: inherit;
}

.el-table tr:nth-child(2) {
  th {
    background-color: #e1f4d6 !important;
    border-bottom: 1px solid #bde6a2;
    padding: 0px;
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

.link {
  display: block;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.logo {
  float: left;
}

.item-name {
  float: left;
  margin-left: 10px;
  width: 100px;
}

.table-left {
  display: inline-block;
  margin-right: 20px;
  z-index: 3;
  position: absolute;
  right: 0px;
  img {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
}

@media screen and (min-width: 1400px) {
  .table-left {
    right: 0px;
  }
}

#pane-all .el-table--border tr:nth-child(3n-2) td:first-child {
  border-right: none;
}

#pane-download .el-table--border tr td:first-child {
  border-right: none;
}

#pane-xinzhuang .el-table--border tr td:first-child {
  border-right: none;
}

#pane-huoyue .el-table--border tr td:first-child {
  border-right: none;
}

.el-table--border th {
  border-right: none;
}

.cell {
  text-align: center; // padding-left: 40px;
}

.cell>p>img {
  display: inline-block;
  margin-right: 20px;
  width: 7px;
  height: 16px;
  vertical-align: middle;
  float: right;
}

.cell>div>img {
  width: 14px;
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
  width: 70px;
  height: 21px;
}

.trend {
  position: relative;
  border: 1px solid #dcdfe6;
  .el-tabs__item {
    height: 45px;
  }
  .el-tabs--border-card {
    border: none;
    box-shadow: none;
    -webkit-box-shadow: none;
    .el-tabs__header {
      height: 44px;
    }
  }
  .el-table--border td:first-child .cell {
    padding-left: 0px;
  }
  .el-table .cell,
  .el-table th div {
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  .searchSelect {
    position: absolute;
    z-index: 111;
    right: 20px;
    height: 30px;
    text-align: right;
    .el-input__inner {
      height: 38px;
      width: 260px;
      border-bottom: 1px solid #dbdee3;
      background: #f5f7fa;
    }
    .el-icon-search {
      line-height: 35px;
    }
  }
}

.el-dialog__header {
  border-bottom: 1px solid #e2e9f3;
  padding: 13px 20px 10px;
  background: #f8f8f8;
  .el-dialog__title {
    border: 1px solid rgb(221, 221, 221) !important;
    padding: 6px 10px;
    line-height: 24px;
    font-size: 14px;
    color: #63738c;
    background: #fff;
  }
  .el-dialog__title::before {
    content: '\E636';
    font-family: 'iconfont' !important;
    padding-right: 10px;
    color: #e2e9f3;
  }
}

.el-table__body tr.hover-row>td {
  background-color: transparent;
}
</style>
