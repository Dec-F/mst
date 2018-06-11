<template>
  <div class="index">
    <el-container>
      <el-header>
        <h4 class="page__title">新装留存
          <el-tooltip class="item" effect="light" content="本月/周内新装APP在次日、三日、7日等活跃的设备用户" placement="right">
            <i class="el-icon-question" style="margin-left: 5px;"></i>
          </el-tooltip>
        </h4>
      </el-header>
      <div class="keepBox">
        <el-main>
          <el-card class="query-card" shadow="never">
            <el-form :inline="true" :model="queryForm" size="small">
              <el-row>
                <!-- app下拉菜单 -->
                <el-col :span="9">
                  <el-form-item label="当前APP">
                    <selectIndex :channels="channels" @change="selectChange" v-if="!channelFetching"></selectIndex>
                  </el-form-item>
                </el-col>
                <!-- 日期选择器 -->
                <el-col :span="12">
                  <el-form-item label="时间选择">
                    <el-date-picker v-loading="validDateFetching" v-model="queryForm.date" type="daterange" value-format="yyyyMMdd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-value="defaultDate" :picker-options="{ disabledDate }" unlink-panels>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" size="mini" @click="queryKeep(1)">查询</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
          <!-- 留存数据 表格 -->
          <el-card class="table-card" shadow="never">
            <div slot="header">
              <span class="table-card__title">留存数据</span>
            </div>
            <div class="table-card__body" v-loading="keepDataFetching">
              <el-table :data="keepData" header-row-class-name="table__header" style="width: 100%" v-if="tableHeader">
                <!-- 序号 -->
                <el-table-column :prop="tableHeader[0].column" :label="tableHeader[0].columnName" width="50" align="center" fixed></el-table-column>
                <!-- 时间 -->
                <el-table-column :prop="tableHeader[1].column" :label="tableHeader[1].columnName" width="150" align="center" fixed></el-table-column>
                <!-- 留存数据 -->
                <el-table-column v-for="col in tableHeader.slice(2)" :key="col.column" :formatter="keepFormatter" :prop="col.column" :label="col.columnName" align="center">
                </el-table-column>
              </el-table>
            </div>
            <el-footer>
              <el-row type="flex" justify="space-between">
                <el-button size="small" @click="exportKeep('channel')" v-if="keepData">
                  <i class="iconfont icon-download" style="padding-left: 0;"></i>数据导出</el-button>
                <el-pagination background layout="total, prev, pager, next,jumper" :total="pageData.total" @current-change="pageChange" v-if="pageData"></el-pagination>
              </el-row>
            </el-footer>
          </el-card>
        </el-main>
      </div>

    </el-container>
  </div>
</template>

<script>
import selectIndex from '@/components/select';
import { parseTime } from '@/utils';
import { findAppChannelCount, findKeepDate, findAppKeep } from '@/api';
import { apiRequest } from '@/utils';
export default {
  name: 'index',
  data() {
    return {
      channels: null,
      channelFetching: true,
      validDate: null,
      validDateFetching: true,
      queryForm: {
        id: null,
        date: null
      },
      defaultDate: null,
      tableHeader: null,
      keepData: null,
      pageData: null,
      keepDataFetching: false
    }
  },
  components: { selectIndex },
  methods: {
    async channelFetch() {
      let self = this;
      let channelRes = await apiRequest(findAppChannelCount);
      self.channelFetching = false;
      if (channelRes.status) {
        let channelsData = channelRes.result.filter(item => item.type === 'app');
        self.channels = channelsData;
      } else {
        self.$message.error(channelRes.result);
      }
    },
    selectChange(id) {
      this.queryForm.id = id
    },
    async validDateFetch() {
      let self = this;
      let validDateRes = await apiRequest(findKeepDate);
      self.validDateFetching = false;
      if (validDateRes.status) {
        let { start, end } = validDateRes.result[0];
        // 设定可选日期范围
        self.validDate = { start, end };
        // 设定默认值
        let startDate = new Date(end), endDate = new Date(end);
        startDate.setDate(startDate.getDate() - 30);
        self.defaultDate = [startDate, endDate];
        // 表单数据
        let startDateStr = parseTime(startDate, '{y}-{m}-{d}');
        let endDateStr = parseTime(endDate, '{y}-{m}-{d}');
        self.queryForm.date = [startDateStr, endDateStr];
      } else {
        self.$message.error(validDateRes.result);
      }
    },
    // 禁选非法日期
    disabledDate(date) {
      let self = this, { start, end } = self.validDate;
      let startDate = new Date(start), endDate = new Date(end);
      return date > endDate || date < startDate.setDate(startDate.getDate() - 1);
    },
    async queryKeep(pageNo) {
      let self = this, { id, date } = self.queryForm;
      let params = [id, date[0], date[1], pageNo];
      self.keepDataFetching = true;
      let queryRes = await apiRequest(findAppKeep, params);
      self.keepDataFetching = false;
      if (queryRes.status) {
        let { tableHeader, tableData, tablePage } = queryRes.result;
        self.tableHeader = tableHeader;
        self.keepData = tableData;
        self.pageData = tablePage;
      } else {
        self.$message.error(queryRes.result);
      }
    },
    keepFormatter(row, column, val, index) {
      // 没有数据的情况显示"-"
      return val ? Number(val).toFixed(2) + '%' : '-';
    },
    pageChange(curPage) {
      this.queryKeep(curPage);
    },
    exportKeep(type) {
      let { pageNo, pageSize } = this.pageData;
      let startTime = this.queryForm.date[0];
      let endTime = this.queryForm.date[1];
      let { id } = this.queryForm;
      location.href = `/mst/appQuality/exportAppKeep?appId=${id}&pageNo=${pageNo}&pageSize=${pageSize}&startTime=${startTime}&endTime=${endTime}`;
    }
  },
  async beforeMount() {
    await this.channelFetch();
    await this.validDateFetch();
    this.queryKeep(1);
  }
}
</script>

<style lang="less" >
.el-header {
  display: flex;
  align-items: center;
  .page__title {
    padding-left: 10px;
    line-height: 1;
    border-left: 4px solid #69C72B;
    [class^=el-icon-] {
      color: #CCC;
    }
  }
}

.keepBox {
  .el-range-editor--small .el-range-separator {
    padding: 2px 0px !important;
    width: 5%;
    height: 17px;
    color: #fff !important;
    background: #69C72B;
    border-radius: 2px;
    line-height: 15px;
    font-size: 12px;
  }
  .el-range-editor--small.el-input__inner {
    border: none;
  }
  .el-date-table td span {
    border-radius: none
  }

  .el-date-editor .el-range-input :first-child {
    text-align: right !important;
  }


  .el-main {
    padding-top: 0;
    .el-col {
      text-align: center;
      &+.el-col:not(:last-child) {
        border-left: 1px solid #DDD;
      }
    }
    .el-form--inline .el-form-item {
      margin: 0;
    }
    .table-card__title {
      font-size: 14px;
    }
    .table__header {
      background-color: #69C72B;
    }
  }



  .el-form-item__label {
    width: 100px !important;
    background: #F2F2F2 !important;
    padding-right: 0px !important;
    color: #303A44 !important;
    padding-right: 0 !important;
    vertical-align: text-bottom !important;
    text-align: center;
  }

  .table-card .el-card__body {
    padding: 0;
  }

  .el-table th {
    background: #69C72B;
    color: #fff;
  }

  .el-table--border th:first-child .cell {
    padding-left: 0;
    padding-right: 0;
  }

  .el-table th>.cell {
    border-right: 1px solid #fff;
  }

  .el-table th:nth-child(2)>.cell {
    // border-right: none;
  }

  .el-table__fixed,
  .el-table__fixed-right {
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 4px 0 18px #e6e7e8;
    overflow-x: hidden;
  }
}

.margintop {
  margin-top: 40px;
}

.selectIndex .el-input__inner {
  padding-left: 33px;
  border: 0 none;
}

.exportData {
  width: 120px;
  height: 30px;
  font-size: 14px;
  color: #64728D;
  padding: 5px 0px;
}

.el-tooltip__popper.is-light[x-placement^=right] .popper__arrow {
  border-right-color: #69C72B;
}
</style>
