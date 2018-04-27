<template>
  <div class="index">
    <el-container>
      <el-header>
        <h4 class="page__title">新装留存 <i class="el-icon-question"></i></h4>
      </el-header>
      <el-main>
        <el-card class="query-card" shadow="never">
          <el-form :inline="true" :model="queryForm" size="small">
            <el-row>
              <!-- app下拉菜单 -->
              <el-col :span="9">
                <el-form-item label="当前app">
                  <SearchSelect :channels="channels" @change="selectChange"
                      v-if="!channelFetching"></SearchSelect>
                </el-form-item>
              </el-col>
              <!-- 日期选择器 -->
              <el-col :span="12">
                <el-form-item label="时间选择">
                  <el-date-picker
                    v-loading="validDateFetching"
                    v-model="queryForm.date"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-value="queryForm.date"
                    :picker-options="{ disabledDate }"
                    unlink-panels>
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
            <el-table :data="keepData" header-row-class-name="table__header"
                style="width: 100%" v-if="tableHeader">
              <!-- 序号 -->
              <el-table-column :prop="tableHeader[0].column" :label="tableHeader[0].columnName"
                  width="50" align="center" fixed></el-table-column>
              <!-- 时间 -->
              <el-table-column :prop="tableHeader[1].column" :label="tableHeader[1].columnName"
                  width="150" align="center" fixed></el-table-column>
              <!-- 留存数据 -->
              <el-table-column v-for="col in tableHeader.slice(2)" :key="col.column"
                :formatter="keepFormatter" :prop="col.column" :label="col.columnName"
                align="center" width="200">
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-main>
      <el-footer>
        <el-row type="flex" justify="space-between">
          <el-button size="small" icon="el-icon-download"
              @click="exportKeep('channel')" v-if="keepData">导出表格</el-button>
          <el-pagination background layout="total, prev, pager, next"
            :total="pageData.total" @current-change="pageChange" v-if="pageData"></el-pagination>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import SearchSelect from '@/components/SearchSelect';
  import { findAppChannelCount, findKeepDate, findChannelKeep } from '@/api';
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
        tableHeader: null,
        keepData: null,
        pageData: null,
        keepDataFetching: false
      }
    },
    components: { SearchSelect },
    methods: {
      async channelFetch() {
        let self = this;
        let channelRes = await apiRequest(findAppChannelCount, ['app']);
        self.channelFetching = false;
        if(channelRes.status){
          self.channels = channelRes.result;
        }else{
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
        if(validDateRes.status){
          let { start, end } = validDateRes.result[0];
          self.validDate = { start, end };
          // 设定默认值
          self.queryForm.date = [start, end];
        }else{
          self.$message.error(validDateRes.result);
        }
      },
      // 禁选非法日期
      disabledDate(date) {
        let self = this, { start, end } = self.validDate;
        let startDate = new Date(start), endDate = new Date(end);
        return date > new Date(end) || date < startDate.setDate(startDate.getDate() - 1);
      },
      async queryKeep(pageNo) {
        let self = this, { id, date } = self.queryForm;
        let params = [id, date[0], date[1], pageNo];
        self.keepDataFetching = true;
        let queryRes = await apiRequest(findChannelKeep, params);
        self.keepDataFetching = false;
        if(queryRes.status){
          let { tableHeader, tableData, tablePage } = queryRes.result;
          self.tableHeader = tableHeader;
          self.keepData = tableData;
          self.pageData = tablePage;
        }else{
          self.$message.error(queryRes.result);
        }
      },
      keepFormatter(row, column, val, index){
        return Number(val).toFixed(2) + '%';
      },
      pageChange(curPage) {
        this.queryKeep(curPage);
      },
      exportKeep(type) {
        let { pageNo, pageSize } = this.pageData;
        location.href = `/mst/behavior/exportTrendExcel?type=${type}&pageNo=${pageNo}&pageSize=${pageSize}`;
      }
    },
    async beforeMount() {
      await this.channelFetch();
      await this.validDateFetch();
      this.queryKeep(1);
    }
  }
</script>

<style lang="less" scoped>
.el-header{
  display: flex;
  align-items: center;
  .page__title{
    padding-left: 10px;
    line-height: 1;
    border-left: 4px solid #69C72B;
    [class^=el-icon-]{
      color:#CCC;
    }
  }
}
.el-main{
  padding-top: 0;
  .el-col{
    text-align: center;
    & + .el-col:not(:last-child){
      border-left: 1px solid #DDD;
    }
  }
  .el-form--inline .el-form-item{
    margin: 0;
  }
  .table-card__title{
    font-size: 14px;
  }
  .table__header{
    background-color: #69C72B;
  }
}
</style>
