<template>
  <div class="index">
    <div class="nav">
      <div class="nav_head">
        <h4>移动渠道市场监测</h4>
        <p>StoreTracker</p>
      </div>
      <el-menu mode="vertical" :default-active="initPath" class="el-menu-vertical-demo" theme="dark" text-color="#8996a9" active-text-color="#fff" unique-opened>
        <el-menu-item-group v-for="(group, groupIndex) in navs" :key="group.title">
          <template slot="title">
            <i class="iconfont" :class="group.class"></i>
            <span>{{ group.title }}</span>
          </template>
          <template v-for="(nav, navIndex) in group.children">
            <el-submenu v-if="nav.children" :index="`${groupIndex}-${navIndex}`" :key="navIndex">
              <template slot="title">{{ nav.title }}</template>

              <el-menu-item v-for="(sub, subIndex) in nav.children" :key="sub.link" :index="sub.link">
                <router-link tag="span" :to="{path : sub.link}">{{ sub.title }}</router-link>
              </el-menu-item>
            </el-submenu>

            <el-menu-item v-else :index="nav.link" :key="navIndex">
              <router-link tag="span" :to="{path : nav.link}">{{ nav.title }}</router-link>
            </el-menu-item>
          </template>
        </el-menu-item-group>
      </el-menu>
      <div class="footer">
        <el-tooltip class="item" effect="dark" content="邮箱：ask@iresearch.com.cn" placement="top-start">
          <img src="../../static/img/email.png">
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="电话：400-026-2099" placement="top-start">
          <img src="../../static/img/tell.png">
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="名词解释" placement="top-start">
          <img src="../../static/img/help.png" @click="clickFn">
        </el-tooltip>
      </div>
    </div>
    <div class="content">
      <div class="breadcrumb">
      </div>
      <router-view v-if="isActive"></router-view>
    </div>
  </div>
</template>

<script>
import api from '@/api/api';
import search from '@/components/search';
export default {
  name: 'index',
  components: {
    search
  },
  data() {
    return {
      isActive: true,

      initPath: this.$route.path,

      navs: [
        // 渠道
        {
          title: '渠道',
          class: 'icon-leftmenu-icon1',
          children: [
            // 行为分析
            {
              title: '行为分析',
              children: [
                {
                  title: '行为趋势',
                  link: '/downloadTrend'
                }
              ]
            },
            // 质量分析
            {
              title: '质量分析',
              children: [
                {
                  title: '新装人均次数',
                  link: '/funnelTrend'
                },
                {
                  title: '新装人均时长',
                  link: '/frequencyTrend'
                },
                {
                  title: '新装留存',
                  link: '/keepTrend'
                }
              ]
            },
            // 渠道画像
            {
              title: '渠道画像',
              link: '/channelPortrait'
            }
          ]
        },
        // APP
        {
          title: 'APP',
          class: 'icon-leftmenu-icon2',
          children: [
            // 行为分析
            {
              title: '行为分析',
              children: [
                {
                  title: '行为趋势',
                  link: '/appdownloadTrend'
                },
                {
                  title: '卸载趋势',
                  link: '/unloadTrend'
                }
              ]
            },
            // 质量分析
            {
              title: '质量分析',
              children: [
                {
                  title: '新装人均次数',
                  link: '/appfunnelTrend'
                },
                {
                  title: '新装人均时长',
                  link: '/appdurationTrend'
                },
                {
                  title: '新装留存',
                  link: '/appkeepTrend'
                }
              ]
            },
            // APP画像
            {
              title: 'APP画像',
              link: '/appPortrait'
            },
            // 深度分析
            {
              title: '深度分析',
              children: [
                {
                  title: '流向分析',
                  link: '/flowTrend'
                },
                {
                  title: '同装分析',
                  link: '/sameTrend'
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    clickFn() {
      this.$router.push({ path: '/faq' });
    }
  },
  watch: {
    $route() {
      this.isActive = false;
      this.$nextTick(() => (this.isActive = true));
    }
  }
};
</script>

<style lang="less">
.index {
  > .nav {
    width: 200px;
    position: fixed;
    top: 30px;
    left: 0;
    height: 100%;
    overflow-y: auto;
    background-color: #323a45;
    .nav_head {
      text-align: center;
      padding-top: 40px;
      background: #232a32;
      width: 200px;
      padding-bottom: 40px;
      margin-bottom: 20px;
      h4:first-child {
        font-size: 20px;
        text-align: center;
        color: #fff;
        margin-bottom: 16px;
      }
      p:last-child {
        width: 140px;
        height: 25px;
        font-size: 13px;
        color: #69c72b;
        padding: 4px 10px;
        text-align: center;
        border: 1px solid #69c72b;
        border-radius: 15px;
        font-weight: 700;
        margin: 0 auto;
      }
    }
    .el-menu {
      background: none !important;
      border-right: none;
    }
    .el-menu-item-group {
      .el-menu-item-group__title {
        line-height: 45px;
        font-size: 14px;
        height: 45px;
        padding-left: 20px;
        color: rgb(136, 149, 168);
      }
      .el-menu-item {
        color: white;
        padding: 0;
        line-height: 45px;
        height: 45px;
        &:hover {
          background-color: #404c5a;
          color: #fff !important;
        }
        &:focus {
          background-color: #404c5a;
          color: #fff;
        }
        span {
          display: block;
          padding: 0px;
        }
        &.is-active {
          position: relative;
          background-color: #445954;
          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 3px;
            height: 100%;
            background-color: #69c72b;
          }
        }
      }
    }
  }
  .el-submenu__title,
  .el-menu-item {
    padding-left: 60px !important;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    color: rgb(136, 149, 168);
    padding: 0 20px;
    cursor: pointer;
    position: relative;
    transition: border-color 0.3s, background-color 0.3s, color 0.3s;
    box-sizing: border-box;
    white-space: nowrap;
  }
  .el-submenu__title:hover {
    background-color: #323a45;
    color: #fff !important;
  }
  .el-submenu .el-menu-item {
    background-color: #404c5a;
  }
  > .content {
    margin-left: 200px;
    background: #f7f7f7;
    > .breadcrumb {
      background: #fff;
      border-bottom: 1px solid #dbdee3;
      .el-breadcrumb {
        display: inline-block;
        line-height: 40px;
        vertical-align: middle;
      }
      .el-breadcrumb__item__inner,
      .el-breadcrumb__item__inner a {
        color: #647589;
      }
      .icon-dial {
        font-size: 12px;
      }
    }
  } // footer
  .footer {
    display: flex;
    margin: 30px auto;
    text-align: center;
    justify-content: center;
    img {
      cursor: pointer;
      width: 20px;
      height: 20px;
      display: block;
      margin: 0px 20px;
    }
  }
}

.item {
  margin: 4px;
  margin-left: -5px;
}

.left .el-tooltip__popper,
.right .el-tooltip__popper {
  padding: 8px 10px;
}
.hide-tabs .el-tabs__nav-wrap {
  display: none;
}
</style>
