import fetch from '@/utils/fetch'

const api = {
  login(data) {
    return fetch({url: '/irviews/validToken', method: 'POST', data: data});
  },
  // 公共接口
  date(params) {
    return fetch({url: '/dateTime/getDateTime', method: 'GET', params: params});
  },
  // 留存时间接口
  findKeepDate(params) {
    return fetch({url: '/quality/findKeepDate', method: 'GET', params: params});
  },
  //画像时间接口
  getPortraitTime(params) {
    return fetch({url: '/dateTime/getPortraitTime', method: 'GET', params: params});
  },
  appType() {
    return fetch({url: 'category/getCategory', method: 'GET'});
  },
  // 搜索接口
  findSearchAppChannel(params) {
    return fetch({url: '/search/getSearch', method: 'GET', params: params});
  },
  // 渠道  质量分析一级页面
  findChannelUse(params) {
    return fetch({url: '/quality/findChannelUse', method: 'GET', params: params});
  },
  // 渠道  质量分析一级页面图表
  qlistChannelEcharts(params) {
    return fetch({url: '/quality/listChannelEcharts', method: 'GET', params: params});
  },

  // 渠道  质量分析二级页面
  findChannelAppUse(params) {
    return fetch({url: '/quality/findChannelAppUse', method: 'GET', params: params});
  },
  //  渠道 质量分析二级页面图表
  listChannelAppEcharts(params) {
    return fetch({url: '/quality/listChannelAppEcharts', method: 'GET', params: params});
  },
  // app 质量分析二级页面
  findAppChannelUse(params) {
    return fetch({url: '/appQuality/findAppChannelUse', method: 'GET', params: params});
  },
  // app 质量分析二级页面图表
  qlistAppEchartsSub(params) {
    return fetch({url: '/appQuality/listAppEchartsSub', method: 'GET', params: params});
  },
  //  app 质量分析一级页面
  findAppUse(params) {
    return fetch({url: '/appQuality/findAppUse', method: 'GET', params: params});
  },
  // app 质量分析一级页面图表
  qlistAppEcharts(params) {
    return fetch({url: '/appQuality/listAppEcharts', method: 'GET', params: params});
  },
  // 深度分析 同装
  flowTable(params) {
    return fetch({url: '/depth/findSimulTrend', method: 'GET', params: params});
  },
  // 流向
  findFlowTrend(params) {
    return fetch({url: '/depth/findFlowTrend', method: 'GET', params: params});
  },
  // 同装echarts接口
  sambarecharts(params) {
    return fetch({url: '/depth/getSimulEcharts', method: 'GET', params: params});
  },
  // 流向echarts接口
  flowBarecharts(params) {
    return fetch({url: '/depth/getFlowEcharts', method: 'GET', params: params});
  },

  /**
   * 渠道行为趋势api
   *
   *
   */

  // 渠道行为分析--行为分析--一级页面--全部趋势和各个趋势
  listChannelTrends(params) {
    return fetch({url: 'behavior/listChannelTrends', method: 'GET', params: params});
  },
  // 渠道行为分析--行为分析--二级页面--全部趋势和各个趋势
  listChannelTrendsSub(params) {
    return fetch({url: '/behavior/listChannelTrendsSub', method: 'GET', params: params});
  },
  // 渠道行为分析--下载趋势--一级页面-按日期和渠道展示图表
  listChannelEcharts(params) {
    return fetch({url: '/behavior/listChannelEcharts', method: 'GET', params: params});
  },
  // 渠道行为分析--下载趋势--二级页面-按日期和APP展示图表
  listChannelEchartsSub(params) {
    return fetch({url: '/behavior/listChannelEchartsSub', method: 'GET', params: params});
  },

  /**
   * APP行为趋势api
   *
   *
   */

  // APP行为分析--下载趋势--一级页面--全部趋势和各个趋势
  listAppTrends(params) {
    return fetch({url: '/appBehavior/listAppTrends', method: 'GET', params: params});
  },
  // APP行为分析--下载趋势--二级页面--全部趋势和各个趋势
  listAppTrendsSub(params) {
    return fetch({url: '/appBehavior/listAppTrendsSub', method: 'GET', params: params});
  },
  //APP行为分析--下载趋势--一级页面--按日期和APP展示图表
  listAppEcharts(params) {
    return fetch({url: '/appBehavior/listAppEcharts', method: 'GET', params: params});
  },
  // APP行为分析--下载趋势--二级页面--按日期和渠道展示图表
  listAppEchartsSub(params) {
    return fetch({url: '/appBehavior/listAppEchartsSub', method: 'GET', params: params});
  },
  // APP行为分析--下载趋势--二级页面--按日期和渠道展示图表
  exportAppTrendsSub(params) {
    return fetch({url: '/appBehavior/exportAppTrendsSub', method: 'GET', params: params});
  },

  // 卸载趋势接口
  unloadTable(params) {
    return fetch({url: '/appBehavior/listAppUninstall', method: 'GET', params: params});
  },
  // 卸载趋势 图表
  listUninstallEcharts(params) {
    return fetch({url: '/appBehavior/listUninstallEcharts', method: 'GET', params: params});
  },

  download: {
    // 渠道行为分析--下载趋势--一级页面--全部趋势和各个趋势
    exportChannelTrends: 'http://113.200.91.62:8080/mst/behavior/exportChannelTrends',

    // 渠道行为分析--下载趋势--二级页面--全部趋势和各个趋势
    exportChannelTrendsSub: 'http://113.200.91.62:8080/mst/behavior/exportChannelTrendsSub',

    // APP行为分析--下载趋势--一级页面--全部趋势和各个趋势
    exportAppTrends: 'http://113.200.91.62:8080/mst/appBehavior/exportAppTrends',

    // APP行为分析--下载趋势--二级页面--全部趋势和各个趋势
    exportAppTrendsSub: 'http://113.200.91.62:8080/mst/appBehavior/exportAppTrendsSub',

    // 质量分析----渠道--   一级页面导出
    exportChannelUse: 'http://113.200.91.62:8080/mst/quality/exportChannelUse',
    // 质量分析----渠道--   二级页面导出
    exportChannelAppUse: 'http://113.200.91.62:8080/mst/quality/exportChannelAppUse',
    // 质量分析-----APP --   一级页面导出
    exportAppUse: 'http://113.200.91.62:8080/mst/appQuality/exportAppUse',
    // 质量分析-----APP --   二级页面导出
    exportAppChannelUse: 'http://113.200.91.62:8080/mst/appQuality/exportAppChannelUse',

    // 卸载   -----  导出接口
    exportUninstall: 'http://113.200.91.62:8080/mst/appBehavior/exportUninstall'

  }
}

export default api;
