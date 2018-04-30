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
          <trend :current="currentPage" :type="dateTypeVal" :tableData="tableData" :tableHeader="tableHeader" @link-page="linkDetail" @change-sort="changeSort" @change-size="handleSizeChange" @change-current="handleCurrentChange" :total="total" @tab-change="tabChange"></trend>
          <div class="table-content-header">
            <el-button :plain="true" type="primary" @click="downloadData" size="small" class='btn-download'>
              <i class="iconfont icon-download"></i>数据导出
            </el-button>
            <!-- <span>
            <span class="label">趋势图表：</span>
            <el-switch v-model="switchVal" on-text="" off-text="" on-color="#67C72B" off-color="#ccc">
            </el-switch>
          </span> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import pageMixin from '@/components/mixins/page.mixin.js';

export default {
  name: 'download',
  mixins: [pageMixin],
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
