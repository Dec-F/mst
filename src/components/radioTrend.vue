<template>
  <div class="trend">
    <el-table :data="tableData" style="width: 100%;border-left:none" border @sort-change="changeSort" stripe>
      <el-table-column width="80" fixed v-for="(th, index) in tableHeader" v-if="th.column === 'index'" :label="th.columnName" :key="th.limit">
        <el-table-column width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.index === 1" class="top1">{{ scope.row.index }}</span>
            <span v-if="scope.row.index === 2" class="top2">{{ scope.row.index }}</span>
            <span v-if="scope.row.index === 3" class="top3">{{ scope.row.index }}</span>
            <span v-if="scope.row.index !== 1&& scope.row.index !==2 && scope.row.index !==3" class="topNormal">{{ scope.row.index }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column fixed v-for="(th, index) in tableHeader" v-if="th.column === 'name'" :label="th.columnName" :key="th.limit" min-width="180">
        <el-table-column min-width="180">
          <template slot-scope="scope">
            <div @click="linkDetail(scope.row)" class="link">
              <span class="logo"><img :src="scope.row.logo" alt=""></span>
              <span>{{ scope.row.name }}</span>
              <span @click="dialog2Table(scope.row.id)" class="table-left"><img src="../../dist/static/img/tableleft.png"></span>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :render-header="renderHeader" align="center" :sortable="false" v-for="(th, index) in tableHeader" v-if="th.column !== 'index' && th.column !== 'name'" :label="th.columnName" :key="th.limit">
        <el-table-column :render-header="renderHeader1" align="right" :min-width="sub.columnName === '环比(%)' ? 100 : 150" :label="sub.columnName" v-for="(sub, index) in th.children" :key="sub.column">
          <template slot-scope="scope">
            {{ sub.columnName === '环比(%)' ? (scope.row[sub.column] !== null ? (Number(scope.row[sub.column])*100) .toFixed(3) + '%' : '-') : (scope.row[sub.column] !== null ? (scope.row[sub.column]).toFixed(3) : '-') }}
            <img v-show="sub.columnName !== '环比(%)' && (scope.row[sub.column]) !== null && scope.row[sub.status] !== null" :src="scope.row[sub.status] === '1' ? tableupImg : tabledownImg">
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog title="图表" :visible.sync="dialogTableVisible">
      <!--<span class="chart-date">
        <el-select v-model="dateListVal" placeholder="请选择" @change="changeChart">
          <el-option v-for="item in dateList" :key="item.id" :value="item.id" :label="item.label">
          </el-option>
        </el-select>
      </span>-->
      <div class="chart-con" v-loading.chart-con="chartloading">
        <bar-chart :data="chartData" :xAxis="chartXAxis" :name="chartTitle"></bar-chart>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/api'
import { getOSAndBrowser } from "@/browser/browser";
import barChart from "@/components/barChart";
export default {
  name: "trend-com",
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
      default: "week"
    }
  },
  data() {
    return {
      tableupImg: require('../../dist/static/img/table-in-up.png'),
      tabledownImg: require('../../dist/static/img/table-in-down.png'),
      pageSize: 10,
      currentPage: this.current,
      dialogTableVisible: false,
      appId: "",
      dateTypeVal: 'week',
      startDate: null,
      endDate: null,
      flag: true,
    };
  },
  created() {
    const info = getOSAndBrowser();
    // console.log(info)
    if (info.browser === "Safari") {
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
    renderHeader(createElement, { column }) {
      return createElement("div", [
        createElement("span", [column.label]),
        createElement("img", {
          attrs: {
            src: require('../../dist/static/img/tabletop.png')
          }
        })
      ]);
    },
    renderHeader1(createElement, { column }) {
      return createElement("div", [
        createElement("span", [column.label]),
        createElement("img", {
          attrs: {
            src: require('../../dist/static/img/sort.png')
          }
        })
      ]);
    },
    fetchDate() {
      api.date().then(res => {
        this.dateVal = res.data.end;
        this.startDate = res.data.start;
        this.endDate = res.data.end;
        this.fetchTableData();
      });
    },

    //打开图表框
    dialog2Table(val) {
      this.appId = val; //发送ID
      this.fetchChartsData();
      this.dialogTableVisible = true;
    },
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
      });
    },

    changeSort(sort) {
      const sortData = {
        order: null,
        prop: null
      };
      if (sort.column) {
        sortData.order = sort.order;
        this.tableHeader.map(item => {
          if (item.columnName === sort.column.label) {
            sortData.prop = item.children[0].column;
          }
        });
      }
      console.log(sortData);
      this.$emit("change-sort", sortData);
    },
    linkDetail(item) {
      this.$emit("link-page", item);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit("change-size", val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit("change-current", val);
    }
  }
};
</script>

<style lang='less'>
.el-table tr:nth-child(2) {
  th {
    background-color: #f5f7fa !important;
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
  margin-right: 15px;
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

.cell>img {
  display: inline-block;
  margin-left: 20px;
  width: 10px;
  height: 20px;
  vertical-align: top;
}

.cell>div>img {
  width: 14px;
  display: inline-block;
  margin-left: 10px;
}

.el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
  border-right: none !important;
}
</style>
