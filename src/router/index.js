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
//质量分析
const qualityIndex = resolve => require(['@/pages/quality/index'], resolve);
const qualityStore = resolve => require(['@/pages/quality/storeDetail'], resolve);
const qualityKeep = resolve => require(['@/pages/quality/keepTrend'], resolve);
//渠道画像
const portrait = resolve => require(['@/pages/channel/channelPortrait'], resolve);
// app
const appBehaviorIndex = resolve => require(['@/pages/appBehavior/index'], resolve);
const appBehaviorStore = resolve => require(['@/pages/appBehavior/storeDetail'], resolve);
const appKeepTrend = resolve => require(['@/pages/appQuality/appKeepTrend'], resolve);
const uninstall = resolve => require(['@/pages/appBehavior/uninstall'], resolve);
const appQualityIndex = resolve => require(['@/pages/appQuality/index'], resolve);
const appQualityStore = resolve => require(['@/pages/appQuality/storeDetail'], resolve);
//深度分析 流向分析
const flowTrend = resolve => require(['@/pages/deep/flowTrend'], resolve);
//同装分析
const sameTrend = resolve => require(['@/pages/deep/sameTrend'], resolve);

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
            path: '/downloadTrend',
            content:"用户下载、新装、活跃行为趋势"
          },
          rowId:'cid'
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
          },
          rowId:'appId'
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
            path: '/unloadTrend',
            type: 1,
            content:"APP卸载后，流向同类别APP的占比。"
          },
          orderByMap: {
            all: 'uninstall_volume'
          },
          trendType:'uninstall',
          rowId:'appId'
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
            type: 'freq',
            content:"本月/周内通过应用商店新装APP的人均次数"
          },
          orderByMap: {
            all: 'use_freq'
          },
          rowId:'cid'
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
            type: 'freq'

          },
          orderByMap: {
            all: 'use_freq'
          },
          rowId:'appId'
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
            type: 'time',
            content:"本月/周内通过应用商店新装APP的人均次时长。"
          },
          orderByMap: {
            all: 'use_time'
          },
          rowId:'cid'
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
            type: 'time'
          },
          orderByMap: {
            all: 'use_time'
          },
          rowId:'appId'
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
            path: '/keepTrend',
            content:"本月/周内通过应用商店新装APP在次日、三日、7日等活跃的设备用户。"
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
            path: '/channelPortrait',
            content:"本月/周内应用商店有下行为用户的画像。"
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
            path: '/appdownloadTrend',
            content:"本月/周内应用商店有下行为用户的画像。"
          },
          rowId:'appId'
        }
      }, {
        path: '/appfunnelTrend',
        name: 'appfunnelTrend',
        component: appQualityStore,
        meta: {
          type: 'flow',
          bread: {
            name: '新装人均次数',
            path: '/appfunnelTrend',
            type: 'freq',
            content:"本月/周内新装APP的人均次数。"
          },
          orderByMap: {
            all: 'use_freq'
          },
          rowId:'appId'
        }
      }, {
        path: '/appfunnelTrend/storeDetail/:storeId/:storeName',
        name: 'appfunnelTrend',
        component: appQualityIndex,
        meta: {
          type: 'flow',
          bread: {
            name: '新装人均次数',
            path: '/appfunnelTrend',
            type: 'freq'
          },
          orderByMap: {
            all: 'use_freq'
          },
          rowId:'cid'
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
          },
          rowId:'cid',
          storeId:'appId'
        }
      }, {
        path: '/appdurationTrend',
        name: 'appdurationTrend',
        component: appQualityStore,
        meta: {
          type: 'flow',
          bread: {
            name: '新装人均时长',
            path: '/appdurationTrend',
            type: 'time',

          },
          orderByMap: {
            all: 'use_time'
          },
          rowId:'appId'
        }
      }, {
        path: '/appdurationTrend/storeDetail/:storeId/:storeName',
        name: 'appdurationTrend',
        component: appQualityIndex,
        meta: {
          type: 'flow',
          bread: {
            name: '新装人均时长',
            path: '/appdurationTrend',
            type: 'time'
          },
          orderByMap: {
            all: 'use_time'
          },
          rowId:'cid'
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
            path: '/appPortrait',
            content:"本月/周内APP有新装行为的用户画像"
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

  // 路由拦截
  //  if (to.matched.some(r => r.meta.requireAuth)) {   if
  // (localStorage.getItem('token')) {     next();   } else { window.location.href
  // = 'http://irv.iresearch.com.cn/iResearchDataWeb/?m=user&a=jump&pro=46'   } }
  // else {   next(); }



});

router.afterEach(() => {
  NProgress.done();
});

export default router
