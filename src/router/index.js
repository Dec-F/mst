import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
Vue.use(Router)
const login = resolve => require(['@/pages/login'], resolve);
const index = resolve => require(['@/pages/index'], resolve);
// FAQ
const faq = resolve => require(['@/pages/faq'], resolve);
//行为分析
const behaviorIndex = resolve => require(['@/pages/behavior/index'], resolve);
const behaviorStore = resolve => require(['@/pages/behavior/storeDetail'], resolve);
const behaviorApp = resolve => require(['@/pages/behavior/appDetail'], resolve);
//质量分析
const qualityIndex = resolve => require(['@/pages/quality/index'], resolve);
const qualityStore = resolve => require(['@/pages/quality/storeDetail'], resolve);
const qualityApp = resolve => require(['@/pages/quality/appDetail'], resolve);
const quality = resolve => require(['@/pages/quality/quality'], resolve);
const qualityKeep = resolve => require(['@/pages/quality/keepTrend'], resolve);
//渠道画像
const portrait = resolve => require(['@/pages/channel/channelPortrait'], resolve);
// app
const appBehaviorIndex = resolve => require(['@/pages/appBehavior/index'], resolve);
const appBehaviorStore = resolve => require(['@/pages/appBehavior/storeDetail'], resolve);
const appKeepTrend = resolve => require(['@/pages/appQuality/appKeepTrend'], resolve);
const uninstall = resolve => require(['@/pages/appBehavior/uninstall'], resolve);
//深度分析 流向分析
const flowTrend = resolve => require(['@/pages/deep/flowTrend'], resolve);
//同装分析
const sameTrend = resolve => require(['@/pages/deep/sameTrend'], resolve); //同装分析

// Vue.use(Router) const $route = {};
const routes = [
  {
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/',
    name: 'index',
    component: index,
    redirect: '/downloadTrend',
    meta: {
      requireAuth: true
    },
    children: [
      // faq
      {
        path: '/faq',
        name: 'faq',
        component: faq,
        meta: {
          type: 'faq',
          bread: {
            name: '帮助-指标解释',
            path: '/faq'
          }
        }
      },
      // 行为分析 --- 行为趋势
      {
        path: '/downloadTrend',
        name: 'download',
        component: behaviorIndex,
        meta: {
          type: 'download',
          bread: {
            name: '行为趋势',
            path: '/downloadTrend'
          }
        }
      }, {
        path: '/downloadTrend/storeDetail/:storeId/:storeName',
        name: 'downloadStoreDetail',
        component: behaviorStore,
        meta: {
          type: 'download',
          bread: {
            name: '行为趋势',
            path: '/downloadTrend'
          }
        }
      },
      // 行为分析 --- 安装趋势
      {
        path: '/installTrend',
        name: 'install',
        component: behaviorIndex,
        meta: {
          type: 'install',
          bread: {
            name: '安装趋势',
            path: '/installTrend'
          }
        }
      }, {
        path: '/installTrend/storeDetail/:storeId/:storeName',
        name: 'installStoreDetail',
        component: behaviorStore,
        meta: {
          type: 'install',
          bread: {
            name: '安装趋势',
            path: '/installTrend'
          }
        }
      }, {
        path: '/installTrend/appDetail/:appId/:appName',
        name: 'installAppDetail',
        component: behaviorApp,
        meta: {
          type: 'install',
          bread: {
            name: '安装趋势',
            path: '/installTrend'
          }
        }
      },
      // 行为分析 --- 活跃趋势
      {
        path: '/activeTrend',
        name: 'active',
        component: behaviorIndex,
        meta: {
          type: 'active',
          bread: {
            name: '活跃趋势',
            path: '/activeTrend'
          }
        }
      }, {
        path: '/activeTrend/storeDetail/:storeId/:storeName',
        name: 'activeStoreDetail',
        component: behaviorStore,
        meta: {
          type: 'active',
          bread: {
            name: '活跃趋势',
            path: '/activeTrend'
          }
        }
      }, {
        path: '/activeTrend/appDetail/:appId/:appName',
        name: 'activeAppDetail',
        component: behaviorApp,
        meta: {
          type: 'active',
          bread: {
            name: '活跃趋势',
            path: '/activeTrend'
          }
        }
      },
      // 行为分析 --- 卸载趋势
      {
        path: '/unloadTrend',
        name: 'unload',
        component: uninstall,
        meta: {
          type: 'unload',
          bread: {
            name: '卸载趋势',
            path: '/unloadTrend'
          }
        }
      },
      // 质量分析 -- 频次/时长趋势
      {
        path: '/funnelTrend',
        name: 'funnel',
        component: qualityIndex,
        meta: {
          type: 'funnel',
          bread: {
            name: '新装人均次数',
            path: '/funnelTrend',
            type: 1
          }
        }
      }, {
        path: '/funnelTrend/storeDetail/:storeId/:storeName',
        name: 'funnelStoreDetail',
        component: qualityStore,
        meta: {
          type: 'funnel',
          bread: {
            name: '新装人均次数',
            path: '/funnelTrend',
            type: 1
          }
        }
      }, {
        path: '/funnelTrend/appDetail/:storeId/:appId/:appName',
        name: 'funnelAppDetail',
        component: qualityApp,
        meta: {
          type: 'funnel',
          bread: {
            name: '漏斗趋势',
            path: '/funnelTrend'
          }
        }
      },
      // 质量分析 -- 频次趋势
      {
        path: '/frequencyTrend',
        name: 'frequency',
        component: qualityIndex,
        meta: {
          type: 'freq',
          bread: {
            name: '新装人均时长',
            path: '/frequencyTrend',
            type: 2
          }
        }
      }, {
        path: '/frequencyTrend/storeDetail/:storeId/:storeName',
        name: 'frequencyStoreDetail',
        component: qualityStore,
        meta: {
          type: 'funnel',
          bread: {
            name: '新装人均时长',
            path: '/frequencyTrend',
            type: 2
          }
        }
      }, {
        path: '/frequencyTrend/appDetail/:storeId/:appId/:appName',
        name: 'funnelAppDetail',
        component: qualityApp,
        meta: {
          type: 'funnel',
          bread: {
            name: '漏斗趋势',
            path: '/frequencyTrend'
          }
        }
      },
      // 质量分析 -- 时长趋势 质量分析--留存
      {
        path: '/keepTrend',
        name: 'keepTrend',
        component: qualityKeep,
        meta: {
          type: 'keep',
          bread: {
            name: '留存趋势',
            path: '/keepTrend'
          }
        }
      },
      //渠道画像
      {
        path: '/channelPortrait',
        name: 'channelPortrait',
        component: portrait,
        meta: {
          type: 'channel',
          bread: {
            name: '用户画像分析',
            path: '/channelPortrait'
          }
        }
      },
      // app
      {
        path: '/appdownloadTrend',
        name: 'appdownloadTrend',
        component: appBehaviorIndex,
        meta: {
          type: 'download',
          bread: {
            name: '行为趋势',
            path: '/appdownloadTrend'
          }
        }
      }, {
        path: '/appfunnelTrend',
        name: 'appfunnelTrend',
        component: qualityStore,
        meta: {
          type: 'flow',
          bread: {
            name: '新装人均次数',
            path: '/appfunnelTrend'
          }
        }
      },
      //二级页面
      {
        path: '/appdownloadTrend/storeDetail/:storeId/:storeName',
        name: 'appdownloadTrend',
        component: appBehaviorStore,
        meta: {
          type: 'download',
          bread: {
            name: '行为趋势',
            path: '/appdownloadTrend'
          }
        }
      }, {
        path: '/appfunnelTrend/appDetail/:appId/:appName',
        name: 'appfunnelTrend',
        component: qualityIndex,
        meta: {
          type: 'flow',
          bread: {
            name: '新装人均次数',
            path: '/appfunnelTrend'
          }
        }
      }, {
        path: '/appdurationTrend',
        name: 'appdurationTrend',
        component: qualityStore,
        meta: {
          type: 'flow',
          bread: {
            name: '新装人均时长',
            path: '/appdurationTrend'
          }
        }
      }, {
        path: '/appdurationTrend/appDetail/:appId/:appName',
        name: 'appdurationTrend',
        component: qualityIndex,
        meta: {
          type: 'flow',
          bread: {
            name: '新装人均时长',
            path: '/appdurationTrend'
          }
        }
      }, {
        path: '/appKeepTrend',
        name: 'appKeepTrend',
        component: appKeepTrend,
        meta: {
          type: 'keep',
          bread: {
            name: '留存趋势',
            path: '/appkeepTrend'
          }
        }
      },
      //APP画像
      {
        path: '/appPortrait',
        name: 'appPortrait',
        component: portrait,
        meta: {
          type: 'app',
          bread: {
            name: '用户画像分析',
            path: '/appPortrait'
          }
        }
      }, {
        path: '/flowTrend',
        name: 'flowTrend',
        component: flowTrend,
        meta: {
          type: 'flow',
          bread: {
            name: '流向分析',
            path: '/flowTrend'
          }
        }
      }, {
        path: '/sameTrend',
        name: 'sameTrend',
        component: sameTrend,
        meta: {
          type: 'simul',
          bread: {
            name: '同装分析',
            path: '/sameTrend'
          }
        }
      }
    ]
  }
]

const router = new Router({mode: 'history', base: '/web/', routes: routes});

//路由拦截
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();

  // 路由拦截 if (to.matched.some(r => r.meta.requireAuth)) {   if
  // (localStorage.getItem('token')) {     next();   } else {
  // window.location.href =
  // 'http://irv.iresearch.com.cn/iResearchDataWeb/?m=user&a=jump&pro=46'   } }
  // else {   next(); }
});

router.afterEach(() => {
  NProgress.done();
});

export default router
