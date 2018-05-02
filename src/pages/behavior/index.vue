<template>
  <div class="wrapper">
    <div class="content">
      <div class="navname">{{ $route.meta.bread.name }}</div>
      <div class="menu">
        <date-picker v-if="startDate && endDate" :limit="dataLimitVal" :type="dateTypeVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate">
          <span>
            <el-button type="success" @click="submitData">确定</el-button>
          </span>
        </date-picker>
      </div>
      <div class="table-content">
        <div class="table-content-body" v-loading.body="loading">
          <el-collapse-transition>
            <trend-chart :show="switchVal" :data="chartData" :xAxis="chartXAxis"></trend-chart>
          </el-collapse-transition>
          <trend :chartData='chartData' :tabs='tabs' :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @link-page="linkDetail" @change-sort="changeSort" @change-size="handleSizeChange" @change-current="handleCurrentChange" :total="total" @tab-change="tabChange" @open-chart='fetchChartsData'></trend>
          <div class="table-content-header">
            <el-button :plain="true" type="primary" @click="downloadData" size="small" class='btn-download'>
              <i class="iconfont icon-download"></i>数据导出
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api';
import trend from '@/components/trend';
import datePicker from '@/components/datePicker';
import search from '@/components/search';
import moment from 'moment';
import { formatUrl } from 'utils';
const typeMap = {
  download: 1,
  xinzhuang: 2,
  huoyue: 3
};
export default {
  name: 'download',
  components: {
    trend,
    datePicker,
    search
  },
  props: {
    fetchApi: {
      type: Object,
      default() {
        return {
          all: api.downloadTrend,
          classify: api.eachTrend,
          allDownload:
            'http://113.200.91.81/mst/behavior/exportChannelTotalTrends',
          classifyDownload:
            'http://113.200.91.81/mst/behavior/exportEachChannelTrend'
        };
      }
    },

    tabs: {
      type: Array
    },
    coverParams: {
      type: Object,
      default() {
        return {
          all: {},
          classify: {}
        };
      }
    },
    openLink: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      searchValue: '',
      dateTypeVal: 'week',
      startDate: null,
      endDate: null,
      dataLimitVal: 4,
      dateVal: '',
      switchVal: false,
      currentPage: 1,
      pageSize: 10,
      orderColumn: '',
      orderType: 'descending',
      total: null,
      tableData: [],
      tableHeader: [],
      chartXAxis: [],
      searchData: [],
      searchId: null,
      searchType: null,
      searchLoading: false,
      count: false,
      tabType: 'all',
      orderBy: '',
      sortbyDateTime: '',
      chartData: {}
    };
  },
  created() {
    this.fetchDate();
  },
  computed: {
    filterData() {
      const val = this.inputVal;
      if (val) {
        return this.mediaList.filter(function(data) {
          return Object.keys(data).some(function(key) {
            return (
              String(data[key])
                .toLowerCase()
                .indexOf(val) > -1
            );
          });
        });
      }
      return this.mediaList;
    }
  },
  watch: {
    $route() {
      this.init();
    }
  },
  methods: {
    // 初始化数据
    init() {
      this.count = false;
      this.switchVal = false;
      this.dateTypeVal = 'week';
      this.dataLimitVal = 4;
      this.currentPage = 1;
      this.pageSize = 10;
      this.orderType = 'descending';
      this.orderColumn = '';
      this.tableHeader = [];
      this.fetchDate();
    },
    changeDateType(val) {
      this.dateTypeVal = val;
    },
    changeDateLimit(val) {
      this.dataLimitVal = val;
    },
    changeDate(val) {
      this.dateVal = val;
    },
    changeWeekDate(val) {
      this.dateVal = val;
    },
    changeMonthDate(val) {
      this.dateVal = val;
    },
    tabChange(name) {
      this.tabType = name;
      this.tableData = [];
      this.fetchTableData();
    },
    // 获取日期数据
    fetchDate() {
      api.date().then(res => {
        this.dateVal = moment(res.data.end).format('YYYYWW');
        this.startDate = res.data.start;
        this.endDate = res.data.end;
        this.fetchTableData();
      });
    },
    // 获取表格数据
    fetchTableData() {
      this.loading = true;
      // 请求参数
      const params = {
        // 发送请求
        date: this.dateVal,
        dateType: this.dateTypeVal === 'week' ? 1 : 2,
        type: typeMap[this.tabType],
        limit: this.dataLimitVal,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn,
        sortby: this.orderBy,
        sortbyDateTime: this.sortbyDateTime
      };
      if (this.tabType === 'all') {
        this.fetchApi
          .all(Object.assign(params, this.coverParams.all))
          .then(res => {
            this.loading = false;
            this.count = true;
            this.tableHeader = res.data.tableHeader || [];
            this.tableData =
              (res.data.tableSum || []).concat(res.data.tableData) || [];
            this.total = res.data.tablePage.total;
          });
      } else {
        this.fetchApi
          .classify(Object.assign(params, this.coverParams.classify))
          .then(res => {
            this.loading = false;
            this.count = true;

            this.tableHeader = res.data.tableHeader || [];

            this.tableData = res.data.tableData || [];
            this.total = res.data.tablePage.total;
          });
      }
    },
    submitData() {
      this.count = false;
      this.currentPage = 1;
      this.fetchTableData();
    },
    // 导出数据
    downloadData() {
      let url = '';
      let params = {};
      if (this.tabType === 'all') {
        url = fetchApi.allDownload;
        params = {
          dateTime: this.dateVal,
          dateType: this.dateTypeVal,
          limit: this.dataLimitVal,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          sort: this.orderType === 'descending' ? 'desc' : '',
          sortby: this.orderBy,
          sortbyDateTime: this.sortbyDateTime
        };
      } else {
        url = fetchApi.classifyDownload;
        params = {
          type: typeMap[this.tabType],
          date: this.dateVal,
          dateType: this.dateTypeVal,
          limit: this.dataLimitVal,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderType: this.orderType,
          orderColumn: this.orderColumn
        };
      }
      window.location.href = formatUrl(url, params);
    },
    //    获取图表数据
    fetchChartsData(val) {
      this.chartloading = true;
      // 发送请求
      const params = {
        // 发送请求
        date: this.dateVal,
        dateType: this.dateTypeVal === 'week' ? 1 : 2,
        type: typeMap[this.tabType] || 1,
        limit: this.dataLimitVal,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn,
        sortby: this.orderBy,
        sortbyDateTime: this.sortbyDateTime
      };
      api.getCharts(params).then(res => {
        let data = res.data.echarts;
        this.chartData={
          xAxis:data.xAxis,
          data:data.line,
          chartTitle:'应用趋势'
        }
      });
    },
    handleSearch(val) {
      if (val.length) {
        this.searchData.filter(item => {});
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.count === true) {
        this.fetchTableData();
      }
    },
    changeSort(sort) {
      ///f:  hack.  elementUI切换排序连续点击进入默认状态是 会传入null
      if (!sort.order || !sort.prop) {
        return;
      }
      sort.order = sort.order ? sort.order : 'descending';
      this.orderType = sort.order;
      if (sort.prop.indexOf('--') > -1) {
        let sortArr = sort.prop.split('--');
        this.sortbyDateTime = sortArr[0];
        this.orderColumn = sortArr[1];
        this.orderBy =
          sortArr[1].indexOf('count') > -1 ? 'download_volume' : 'ratio';
      }
      this.fetchTableData();
    },
    linkDetail(row) {
      if (!this.openLink) {
        return;
      }
      this.$router.push({
        path: `${this.$route.meta.bread.path}/storeDetail/${row.id}/${row.name}`
      });
    }
  }
};
</script>

<style lang="less">
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: #69c72b;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item:hover {
  color: #69c72b;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #69c72b;
}
</style>
