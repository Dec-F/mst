<template>
  <div class="wrapper">
    <div class="content">
      <div class="navname">{{ $route.meta.bread.name }}</div>
      <div class="menu">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <div class="grid-content bg-purple">
              <p style="color:#313B44">渠道名词</p>
            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 10px 0">
              <span style="color:#69C82C; font-size:60px;display: inline-block;vertical-align: middle;">·</span>
              <span style="color:#69C82C;display: inline-block;">行为分析</span>
            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">下载趋势</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内通过应用商店下载的设备用户数</el-col>
              </span>
            </div>
            <hr>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;    overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">新装趋势</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内通过应用商店有安装行为的设备用户数</el-col>
              </span>
            </div>
            <hr>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">活跃趋势</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内通过应用商店安装后有活跃行为的设备用户数</el-col>
              </span>
            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 10px 0">
              <span style="color:#69C82C; font-size:60px;display: inline-block;vertical-align: middle;">·</span>
              <span style="color:#69C82C;display: inline-block;">质量分析</span>
            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">新装人均次数</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内通过应用商店新装APP的人均次数</el-col>
              </span>
            </div>
            <hr>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">新装人均时长</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内通过应用商店新装APP的人均次时长</el-col>
              </span>
            </div>
            <hr>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">新装留存</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内通过应用商店新装APP在次日、三日、7日等活跃的设备用户</el-col>
              </span>
            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 10px 0">
              <span style="color:#69C82C; font-size:60px;display: inline-block;vertical-align: middle;">·</span>
              <span style="color:#69C82C;display: inline-block;">渠道画像</span>

            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">渠道画像</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内应用商店有下行为用户的画像</el-col>
              </span>
            </div>

          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <div class="grid-content bg-purple-light" style="color:#313B44">
              APP名词
            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 10px 0">
              <span style="color:#69C82C; font-size:60px;display: inline-block;vertical-align: middle;">·</span>
              <span style="color:#69C82C;display: inline-block;">行为分析</span>

            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">下载趋势</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内APP有下载行为的设备用户数</el-col>
              </span>
            </div>
            <hr>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">新装趋势</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内APP有安装行为设备用户数</el-col>
              </span>
            </div>
            <hr>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">活跃趋势</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内APP安装后有活跃行为的设备用户数</el-col>
              </span>
            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 10px 0">
              <span style="color:#69C82C; font-size:60px;display: inline-block;vertical-align: middle;">·</span>
              <span style="color:#69C82C;display: inline-block;">质量分析</span>

            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">新装人均次数</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内新装APP的人均次数</el-col>
              </span>
            </div>
            <hr>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">新装人均时长</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内新装APP的人均时长</el-col>
              </span>
            </div>
            <hr>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">新装留存</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内新装APP在次日、三日、7日等活跃的设备用户</el-col>
              </span>
            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 10px 0">
              <span style="color:#69C82C; font-size:60px;display: inline-block;vertical-align: middle;">·</span>
              <span style="color:#69C82C;display: inline-block;">APP画像</span>

            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">APP画像</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">本月/周内APP有新装行为的用户画像</el-col>
              </span>
            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 10px 0">
              <span style="color:#69C82C; font-size:60px;display: inline-block;vertical-align: middle;">·</span>
              <span style="color:#69C82C;display: inline-block;">深度分析</span>

            </div>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">同装分析</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">同时用户安装app的占比</el-col>
              </span>
            </div>
            <hr>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">活性流向</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">APP与上月/周相比活性（时间）降低，流向同类别APP的占比。</el-col>
              </span>
            </div>
            <hr>
            <div class="grid-content bg-purple" style="margin:20px 0 20px 0;display: flow-root;overflow: hidden;">
              <span style="color:#343434">
                <el-col :md="6" style="padding-left:0">卸载流向</el-col>
              </span>
              <span style="color:#989898">
                <el-col :md="18">APP卸载后，流向同类别APP的占比。</el-col>
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  name: 'download',
  components: {

  },
  data() {
    return {

    }
  },
  created() {



  },
  computed: {

  },
  watch: {
    $route() {
      this.init();
    }
  },
  methods: {
    // 初始化数据
    init() {

    }
  }
}
</script>

<style lang="less">
.el-radio-button__orig-radio:checked+.el-radio-button__inner {
  background: #69C72B;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item:hover {
  color: #69C72B;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
  color: #69C72B;
}

hr {
  border-top: 1px solid #E5E5E5;
}

.grid-content span {
  line-height: 24px
}
</style>
