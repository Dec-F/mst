<template>
  <div class="wrapper">
    <div class="content" style="margin-top:0">
      <div class="navname" style="margin-top: 25px;">{{ $route.meta.bread.name }}</div>
      <div class="detail-content-menu">
        <el-col :span="24">
          <selectType :data="typeList" v-model="bigType" @change-big-type="changeBigType" @change-small-type="changeSmallType"></selectType>
        </el-col>
        <el-col :span="24">
          <date-picker v-if="startDate && endDate" :limit="dataLimitVal" :type="dateTypeVal" @change-date-type="changeDateType" @change-date-limit="changeDateLimit" @change-date="changeDate" @change-week-date="changeWeekDate" @change-month-date="changeMonthDate" :startDate="startDate" :endDate="endDate">
            <span>
              <el-button type="success" @click="submitData">确定</el-button>
            </span>
          </date-picker>
        </el-col>
      </div>
      <div class="table-content">
        <div class="table-content-body" v-loading.table-content-body="loading">
          <trend :openSearch='openSearch' :chartData='chartData' :tabs='tabs' :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @link-page="linkDetail" @change-sort="changeSort" @change-size="handleSizeChange" @change-current="handleCurrentChange" :total="total" @tab-change="tabChange" @open-chart='fetchChartsData' @search-change='searchChange'></trend>
        </div>
        <div class="table-content-header">
          <el-button :plain="true" type="primary" @click="downloadData" size="small" class='btn-download'>
            <i class="iconfont icon-download"></i>数据导出</el-button>
        </div>
      </div>
    </div>
    <div :class="clicked ? 'blue-class':'red-class'" @click="clicked = !clicked"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import api from '@/api/api';
import trendChart from '@/components/trendChart';
import trend from '@/components/trend';
import selectType from '@/components/appTypeMenu';
import datePicker from '@/components/datePicker';
import moment from 'moment';
import { formatUrl } from 'utils';
import $bus from 'utils/bus';
const typeMap = {
  download: 1,
  xinzhuang: 2,
  huoyue: 3
};
export default {
  name: 'detail',
  components: {
    trend,
    selectType,
    datePicker,
    trendChart
  },
  props: {
    fetchApi: {
      type: Object,
      default() {
        return {
          all: api.findChannelAppTrend,
          classify: api.findAppChannelTrends,
          allDownload:
            'http://113.200.91.81/mst/appBehavior/exportAppTotalTrendsSub',
          classifyDownload:
            'http://113.200.91.81/mst/appBehavior/exportAppChannelTrend'
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
      default: false
    },
    openSearch:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      // 类别选择
      bigType: 0,
      typeList: [],
      dateTypeVal: 'week',
      weekDateVal: '',
      monthDateVal: '',
      startDate: null,
      endDate: null,
      dataLimitVal: 4,
      clicked: false,
      isShow: true,
      loading: false,
      appTypeList: [],
      checkAll: false,
      checkedType: '',
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
      chartData: {},
      dateList: [],
      dateListVal: null,
      channelData: {},
      rankTableData: {},
      rankLoading: false,
      count: false,
      tabType: 'all',
      orderBy: '',
      sortbyDateTime: ''
    };
  },
  created() {
    this.fetchAppType();
    this.fetchDate();
  },
  watch: {
    $route(val) {
      this.fetchAppType();
      this.fetchDate();
    }
  },
  methods: {
    searchChange(id){
      this.fetchTableData(id)
    },
    tabChange(name) {
      this.tabType = name;
      this.tableData = [];
      console.log('change');
      $bus.$emit('clear-search')
      this.fetchTableData();
    },
    //    获取app类型
    fetchAppType() {
      api.appType().then(res => {
        res.data.typeList.unshift({ categoryId: 0, label: '全部' });
        this.typeList = res.data.typeList;
      });
    },
    //    切换大类
    changeBigType(val) {
      this.bigType = val;
    },
    //    切换小类
    changeSmallType(data) {
      this.checkedType = data;
    },
    changeDateType(val) {
      this.dateTypeVal = val;
      this.dataLimitVal = 4;
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
      this.monthDateVal = val;
    },

    //    获取时间数据
    fetchDate() {
      api.date().then(res => {
        this.dateVal = moment(res.data.end).format('YYYYWW');
        this.startDate = res.data.start;
        this.endDate = res.data.end;
        this.fetchTableData();
      });
    },
    //    获取表格数据
    fetchTableData(id) {
      this.loading = true;
      // 发送请求
      const params = {
        // 发送请求
        type: typeMap[this.tabType],
        date: this.dateVal,
        dateType: this.dateTypeVal === 'week' ? 1 : 2,
        limit: this.dataLimitVal,
        subCategoryId: this.checkedType,
        categoryId: this.bigType === 0 ? null : this.bigType,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.orderType,
        orderColumn: this.orderColumn,
        appId: id,
        channelId: parseInt(this.$route.params.storeId)||0,
        sortby: this.orderBy,
        sortbyDateTime: this.sortbyDateTime
      };
      const resHandler = res => {
        this.loading = false;
        this.count = true;
        this.tableHeader = res.data.tableHeader || [];
        this.tableData = res.data.tableData || [];
        if (res.data.dateTimes !== null) {
          this.dateList = res.data.dateTimes;
          this.dateListVal = res.data.dateTimes[0].id;
        } else {
          this.dateList = [];
          this.dateListVal = [];
        }
        this.total = res.data.tablePage.total;
      };
      //      请求
      if (this.tabType === 'all') {
        this.fetchApi
          .all(Object.assign(params, this.coverParams.all))
          .then(resHandler);
      } else {
        this.fetchApi
          .classify(Object.assign(params, this.coverParams.all))
          .then(resHandler);
      }
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
          sort: this.orderType === 'desc' ? 'desc' : '',
          sortby: this.orderBy,
          sortbyDateTime: this.sortbyDateTime,
          appId: this.$route.params.storeId
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
          orderColumn: this.orderColumn,
          appId: this.$route.params.storeId
        };
      }
      window.location.href = formatUrl(url, params);
    },
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
      let title = '',
        subTitle = '';
      if (val.type === 1) {
        title='当前应用'
        subTitle=val.payload.name
      }else{
        title='趋势时间'
        subTitle=val.payload.label
      }
      api.getCharts(params).then(res => {
        let data = res.data.echarts;
        this.chartData = {
          xAxis: data.xAxis,
          data: data.line,
          chartTitle: title,
          chartSubTitle:subTitle
        };
      });
    },
    submitData() {
      this.count = false;
      this.currentPage = 1;
      $bus.$emit('clear-search')
      this.fetchTableData();
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
      sort.order = sort.order ?  "asc" : 'desc';
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
.content {
  .detail-content-menu {
    border: 1px solid #ddd;
    background: #fff;
    overflow: hidden;
    width: 100%;
    .sub-btn {
      margin: 15px 0 0 0px;
    }

    .select-list {
      &.top {
        border-bottom: 1px solid #ddd;
      }
      .left,
      .right {
        padding: 15px 15px;
        margin: 5px 0;
        > span {
          margin-right: 15px;
        }
      }
      .left {
        width: 100px;
        float: left;
      }
      .right {
        overflow: hidden;
        .el-radio:first-child {
          display: block;
        }
        .el-checkbox {
          margin: 5px 15px 5px 0;
        }
        .el-checkbox + .el-checkbox {
          margin: 5px 15px 5px 0;
        }
        .el-checkbox-group {
          display: inline;
          float: left;
        }
        .el-radio {
          margin: 5px 15px 5px 0;
        }
        .el-radio + .el-radio {
          margin: 5px 15px 5px 0;
        }
      }
    }
  }
  .chart-date {
    position: relative !important;
    bottom: 10px !important;
    right: 0px !important;
  }
}

.tableHeader {
  padding: 10px;
  border: 1px solid #e3ecdf;
  border-bottom: none;
  background: #f9f9f9; // margin-top: 20px;
  text-align: left;
}

.topTable {
  .is-leaf,
  td {
    text-align: center !important;
  }
  .el-table th.is-leaf {
    border-bottom: 1px solid #e1eaf3 !important;
  }
  .el-table th.is-leaf,
  .el-table td {
    border: none;
    border-right: 1px solid #e1eaf3;
    height: 36px;
    background: #ffffff;
  }
  .el-table th > .cell {
    background: #ffffff;
    color: #64748a;
  }
}

.changeTime {
  text-align: left;
  margin-bottom: 10px;
  .el-input__inner {
    border-radius: 0;
    border: none;
    width: 210px;
  }
}
</style>
