<template>
  <div class="trend">
    <div class="search">
      <searchSelect v-if="openSearch" :channels='searchData' @change='searchChange'></searchSelect>
    </div>
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
              <el-table-column min-width="180" fixed class-name='box-sd'>
                <template slot-scope="scope">
                  <div @click="linkDetail(scope.row)" class="link">
                    <span class="logo"><img :src="scope.row.logo" alt=""></span>
                    <span>{{ scope.row.name }}</span>
                    <span @click.stop="dialog2Table({type:1,payload:scope.row})" class="table-left"><img src="../../dist/static/img/tableleft.png"></span>
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
    <template v-if="dialogTableVisible">
      <el-dialog width='100%' :title="chartData.chartTitle" :visible.sync="dialogTableVisible">
        <div class="chart-sub-title">
          <i class="app-icon" :style="chartIconStyle"></i> {{chartData.chartSubTitle}}</div>
        <!--<span class="chart-date">
                  <el-select v-model="dateListVal" placeholder="请选择" @change="changeChart">
                    <el-option v-for="item in dateList" :key="item.id" :value="item.id" :label="item.label">
                    </el-option>
                  </el-select>
                </span>-->
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
          index: 1,
          name: 'xinzhuang',
          label: '新装趋势',
          mergeCells: false
        },

        {
          index: 2,
          name: 'download',
          label: '下载趋势',
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
      count: false,
      dateList: [],
      dateListVal: null,
      actTab: this.tabs[0],
      searchData: [],
      chartIconStyle: {}
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

    //打开图表框
    dialog2Table(val) {
      this.$emit('open-chart', val);
      this.chartIconStyle = {
        backgroundImage: `url(${val.payload.icon})`
      };
      this.dialogTableVisible = true;
    },

    changeSort(sort) {
      let { order, prop } = sort;
      order = order == 'descending' ? 'desc' : 'asc';
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
.chart-sub-title {
  position: absolute;
  top: 20px;
  left: 120px;
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
  background-color: rgba(0, 0, 0, 0);
  box-shadow: 3px 0px 10px 0px rgba(0, 0, 0, 0.2);
}

.el-tabs__content {
  overflow: inherit;
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

.logo {
  float: left;
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

.el-table--border tr td:nth-child(n + 1) {
  border-right: none;
}

.el-table--border th {
  border-right: none;
}

.cell {
  text-align: center; // padding-left: 40px;
}

.cell>img {
  display: inline-block;
  margin-left: 20px;
  width: 7px;
  height:16px;
  vertical-align: middle;
  float: right;
}

.cell>div>img {
  width: 14px;
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
  width: 80px;
  height: 20px;
}

.trend {
  position: relative;
  .searchSelect {
    position: absolute;
    z-index: 111;
    right: 0;
    height: 40px;
    text-align: right;
    .el-input__inner {
      height: 39px;
    }
  }
}
</style>
