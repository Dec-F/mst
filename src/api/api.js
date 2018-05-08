import fetch from '@/utils/fetch'

const api = {
  login(data) {
    return fetch({url: '/login/login', method: 'POST', data: data});
  },
  // 公共接口
  date(params) {
    return fetch({url: '/dateTime/getDateTime', method: 'GET', params: params});
  },
  // 留存时间接口
  findKeepDate(params) {
    return fetch({url: '/quality/findKeepDate', method: 'GET', params: params});
  },
  appType() {
    return fetch({url: 'category/getCategory', method: 'GET'});
  },
  // 搜索接口
  findSearchAppChannel(params) {
    return fetch({url: '/search/getSearch', method: 'GET', params: params});
  },
  // 行为分析—下载趋势二级页面
  findChannelAppTrend(params) {
    return fetch({url: '/behavior/listChannelTotalTrendsSub', method: 'GET', params: params});
  },
  // 行为分析—下载趋势二级页面（下载、新装、活跃）
  findAppChannelTrends(params) {
    return fetch({url: 'behavior/findEachChannelAppTrend', method: 'GET', params: params});
  },
  // 卸载趋势接口
  unloadTable(params) {
    return fetch({url: '/appBehavior/findUninstallAppList', method: 'GET', params: params});
  },
  // 图表接口
  getCharts(params) {
    return fetch({url: '/getchart', method: 'GET', params: params});
  },

  //渠道 模拟接口 行为分析第一页下载趋势接口
  downloadTrend(params) {
    return fetch({url: '/behavior/listChannelTotalTrends', method: 'GET', params: params});
  },
  //新装，下载，活跃
  eachTrend(params) {
    return fetch({url: '/behavior/findEachChannelTrend', method: 'GET', params: params});
  },
  // 质量分析一级页面
  findChannelUse(params) {
    return fetch({url: '/quality/findChannelUse', method: 'GET', params: params});
  },
  // 质量分析二级页面
  findChannelAppUse(params) {
    return fetch({url: '/quality/findChannelAppUse', method: 'GET', params: params});
  },
  findAppChannelUse(params) {
    return fetch({url: '/appQuality/findAppChannelUse', method: 'GET', params: params});
  },
  findAppUse(params) {
    return fetch({url: '/appQuality/findAppUse', method: 'GET', params: params});
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
 * app
 *
 *
 */
// 一级页面全部渠道接口
  appTotalTrends(params) {
    return fetch({url: '/appBehavior/listAppTotalTrends', method: 'GET', params: params});
  },
  // 一级页面下载新装活跃接口
  eachAppTrend(params) {
    return fetch({url: '/appBehavior/findEachAppTrend', method: 'GET', params: params});
  },
  // 二级页面全部接口
  appTotalTrendsSub(params){
    return fetch({url: '/appBehavior/listAppTotalTrendsSub', method: 'GET', params: params});
  },
  // 二级页面下载新装活跃接口
  eachAppTrendSub(params) {
    return fetch({url: '/appBehavior/findAppChannelTrend', method: 'GET', params: params});
  },
}

export default api;
