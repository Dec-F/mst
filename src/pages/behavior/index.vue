<template>
  <div class="wrapper">
    <div class="content">
      <div class="navname" v-if='!$route.params.storeName'>{{ $route.meta.bread.name }}</div>
      <el-tooltip class="item" v-if='!$route.params.storeName' effect="light" :content="$route.meta.bread.content" placement="right">
        <i class="el-icon-question"></i>
      </el-tooltip>
      <div class="navname" v-if='$route.params.storeName'><img :src="$route.query.icon" alt=""> {{ $route.params.storeName }}</div>
      <div class="menu">
        <date-picker v-if="startDate && endDate" :limit="dataLimitVal" :type="dateTypeVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate">
          <span>
            <el-button type="success" @click="submitData">确定</el-button>
          </span>
        </date-picker>
      </div>
      <div class="table-content">
        <div class="table-content-body" v-loading.body="loading">
          <trend :chartData='chartData' :resetOrder='resetOrder' :tabs='tabs' :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @link-page="linkDetail" @change-sort="changeSort" @change-size="handleSizeChange" @change-current="handleCurrentChange" :total="total" @tab-change="tabChange" @open-chart='fetchChartsData'></trend>
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
  download: 'download',
  xinzhuang: 'install',
  huoyue: 'active'
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
          all: api.listChannelTrends,
          allDownload: api.download.exportChannelTrends,
          allCharts: api.listChannelEcharts
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
    },
    orderByMap: {
      type: Object,
      default() {
        return {
          all: 'download_volume',
          download: 'download_volume',
          xinzhuang: 'install_volume',
          huoyue: 'active_volume'
        };
      }
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
      orderType: 'desc',
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
      chartData: {},
      resetOrder: false
    };
  },
  created() {
    this.fetchDate(1, true);
  },
  computed: {
    // filterData() {
    //   const val = this.inputVal;
    //   if (val) {
    //     return this.mediaList.filter(function(data) {
    //       return Object.keys(data).some(function(key) {
    //         return (
    //           String(data[key])
    //             .toLowerCase()
    //             .indexOf(val) > -1
    //         );
    //       });
    //     });
    //   }
    //   return this.mediaList;
    // }
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
      this.orderType = 'desc';
      this.orderColumn = '';
      this.tableHeader = [];
      this.fetchDate();
    },
    changeDateType(val) {
      this.dateTypeVal = val;
      this.dataLimitVal = 4;
      this.fetchDate(val === 'week' ? 1 : 2);
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
      this.orderBy = this.orderByMap[this.tabType];
      this.orderType = 'desc';
      this.sortbyDateTime = '';
      this.fetchTableData();
    },
    // 获取日期数据
    fetchDate(dateType = 1, isInit) {
      api
        .date({
          dateType
        })
        .then(res => {
          this.dateVal =
            dateType === 1
              ? moment(res.data.end).format('YYYYWW')
              : moment(res.data.end).format('YYYYMM');
          this.startDate = res.data.start;
          this.endDate = res.data.end;
          if (isInit) {
            this.fetchTableData();
          }
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
        limit: this.dataLimitVal,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderBy || this.orderByMap['all'],
        orderDate: this.sortbyDateTime,
        appId: parseInt(this.$route.params.storeId) || 0
      };
      if (this.tabType === 'all') {
        params.totalOrEach = 1;
        params.trendType = 'download';
      } else {
        params.totalOrEach = 0;
        params.trendType = typeMap[this.tabType];
      }
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

    },
    submitData() {
      this.count = false;
      this.currentPage = 1;
      this.orderType = 'desc';
      this.sortbyDateTime = '';
      // this.orderColumn = '';
      // this.orderBy = '';
      this.resetOrder = !this.resetOrder;
      this.fetchTableData();
    },
    // 导出数据
    downloadData() {
      let url=''
      let params = {};
      url=this.fetchApi.allDownload
      params = {
        // 发送请求
        date: this.dateVal,
        dateType: this.dateTypeVal === 'week' ? 1 : 2,
        limit: this.dataLimitVal,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderBy || this.orderByMap['all'],
        orderDate: this.sortbyDateTime,
        appId: parseInt(this.$route.params.storeId) || 0,
        token:sessionStorage.getItem('token')
      };
      if (this.tabType === 'all') {
        params.totalOrEach = 1;
        params.trendType = 'download';
      } else {
        params.totalOrEach = 0;
        params.trendType = typeMap[this.tabType];
      }
      params = Object.assign(params, this.coverParams.all);
      window.location.href = formatUrl(url, params);
    },
    //    获取图表数据
    fetchChartsData(val) {
      this.chartloading = true;
      // 发送请求
      let params = {
        // 发送请求
        date: this.dateVal,
        dateType: this.dateTypeVal === 'week' ? 1 : 2,
        limit: this.dataLimitVal,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderBy || this.orderByMap['all'],
        orderDate: this.sortbyDateTime,
        echartsDate: this.sortbyDateTime
      };
      if (val.type == 1) {
        if (this.$route.meta.rowId == 'cid') {
          (params.appId =
            val.type == 1 ? parseInt(this.$route.params.storeId) || '' : ''),
            (params.channelId =
              val.type == 1
                ? val.payload.id
                : parseInt(this.$route.params.storeId) || '');
        } else {
          params.appId = val.type == 1 ? val.payload.id : '';
          params.channelId = parseInt(this.$route.params.storeId) || '';
        }
      } else {
        // params.orderDate =
        //   val.payload.children &&
        //   val.payload.children[0] &&
        //   val.payload.children[0].property.split('--')[0];
        params.echartsDate =
          val.payload.children &&
          val.payload.children[0] &&
          val.payload.children[0].property.split('--')[0];
        if (this.$route.meta.storeId == 'appId') {
          params.appId = parseInt(this.$route.params.storeId);
          params.channelId = '';
        } else {
          params.channelId = val.type == 1 ? val.payload.id : '';
          params.appId = parseInt(this.$route.params.storeId) || '';
        }
      }
      if (this.tabType === 'all') {
        params.totalOrEach = 1;
        params.trendType = 'download';
      } else {
        params.totalOrEach = 0;
        params.trendType = typeMap[this.tabType];
      }
      params = Object.assign(params, this.coverParams.all);
      let title = '',
        subTitle = '';
      if (val.type === 1) {
        title = '当前渠道';
        subTitle = val.payload.name;
      } else {
        title = '趋势时间';
        subTitle = val.payload.label;
      }
      this.fetchApi.allCharts(params).then(res => {
        let data = res.data.echarts;
        this.chartData = {
          xAxis: data.xAxis,
          data: data.line,
          chartTitle: title,
          chartSubTitle: subTitle,
          legend: data.legend
        };
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
      sort.order = sort.order ? sort.order : 'desc';
      this.orderType = sort.order;
      if (sort.prop.indexOf('--') > -1) {
        let sortArr = sort.prop.split('--');
        this.sortbyDateTime = sortArr[0];
        console.log(this.sortbyDateTime, 111);
        this.orderColumn = sortArr[1];
        this.orderBy =
          sortArr[1].indexOf('count') > -1
            ? this.orderByMap[this.tabType]
            : 'ratio';
      }
      this.fetchTableData();
    },
    linkDetail(row) {
      if (!this.openLink) {
        return;
      }
      this.$router.push({
        path: `${this.$route.meta.bread.path}/storeDetail/${row.id}/${
          row.name
        }`,
        query: {
          icon: row.logo
        }
      });
      //console.log(row)
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
