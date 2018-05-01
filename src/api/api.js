import fetch from '@/utils/fetch'

const api = {
  login(data) {
    return fetch({url: '/login/login', method: 'POST', data: data});
  },
  // 公共接口
  date(params) {
    return fetch({url: '/dateTime/getDateTime', method: 'GET', params: params});
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
    return fetch({url: '/appQuality/findUninstallAppList', method: 'GET', params: params});
  },
  // 图表接口
  flowCharts(params) {
    return fetch({url: '/flowcharts', method: 'GET', params: params});
  },

  //渠道 模拟接口 行为分析第一页下载趋势接口
  downloadTrend(params) {
    return fetch({url: '/behavior/listChannelTotalTrends', method: 'GET', params: params});
  },
  //新装，下载，活跃
  eachTrend(params) {
    return fetch({url: '/behavior/findEachChannelTrend', method: 'GET', params: params});
  },
  // 质量分析
  findChannelUse(params) {
    return fetch({url: '/quality/findChannelUse', method: 'GET', params: params});
  },
  findChannelAppUse(params) {
    return fetch({url: '/quality/findChannelAppUse', method: 'GET', params: params});
  },
  findAppChannelUse(params) {
    return fetch({url: 'appQuality/findAppChannelUse', method: 'GET', params: params});
  },
  findAppUse(params) {
    return fetch({url: 'appQuality/findAppUse', method: 'GET', params: params});
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
    return fetch({url: '/sambarecharts', method: 'GET', params: params});
  },

  /**
 * app
 *
 *
 */
  appTotalTrends(params) {
    return fetch({url: '/appBehavior/listAppTotalTrends', method: 'GET', params: params});
  },
  eachAppTrend(params) {
    return fetch({url: '/appBehavior/findEachAppTrend', method: 'GET', params: params});
  }
}

export default api;
