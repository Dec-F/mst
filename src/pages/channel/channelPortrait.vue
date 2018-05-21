<template>
  <div class="wrapper">
    <div class="content">
      <div class="navname">{{ $route.meta.bread.name }}</div>
      <el-tooltip class="item" effect="light" :content="$route.meta.bread.content" placement="right">
        <i class="el-icon-question"></i>
      </el-tooltip>
      <div class="photo-card photo-card-con">
        <picker :type="$route.meta.type === 'channel' ? 'channel' : 'app'" @submit="submit"></picker>
      </div>
      <div class="photo-card">
        <h3 class="photo-card-title">画像洞察</h3>
        <div class="photo-card-con photo-sections photo-section1">
          <div class="photo-section" style="flex: 2;posiation:relative">
            <h4 class="photo-section-title"><font-awesome-icon class="photo-title-icon" icon="mars"/> 男女性别占比</h4>
            <div class="photo-section-con">
              <div class="gender-wrap">
                <div class="gender-section">
                  <div class="gender-side">
                    <img class="gender-img-m" src="../../assets/gender-m.jpg">
                    <span>男 <font-awesome-icon class="gender-icon" icon="mars" style="color: #b2d233"/></span>
                  </div>
                  <chart-gender class="photo-chart" style="width: 130px; height: 100%" :data="genderMRate"></chart-gender>
                </div>
                <div class="gender-section">
                  <div class="gender-side">
                    <img class="gender-img-f" src="../../assets/gender-f.jpg">
                    <span>女 <font-awesome-icon class="gender-icon" icon="venus" style="color: #1fc8f3"/></span>
                  </div>
                  <chart-gender class="photo-chart" style="width: 130px; height: 100%" type="female" :data="genderFRate"></chart-gender>
                </div>
              </div>
            </div>
            <div class="photo-section-footer" style="position: absolute;left: 35%;bottom:-18px;">男女性别占比</div>
          </div>
          <div class="photo-section">
            <h4 class="photo-section-title"><font-awesome-icon class="photo-title-icon" icon="chart-bar"/> 年代体系占比</h4>
            <div class="photo-section-con">
              <chart-radar class="photo-chart" style="height: 70%; margin-top: 15%" :data="ageRangeData"></chart-radar>
            </div>
            <div class="photo-section-footer">年代体系占比</div>
          </div>
          <div class="photo-section">
            <h4 class="photo-section-title"><font-awesome-icon class="photo-title-icon" icon="chart-bar"/> 年龄段占比</h4>
            <div class="photo-section-con">
              <chart-radar class="photo-chart" style="height: 70%; margin-top: 15%" :data="ageGroupData"></chart-radar>
            </div>
            <div class="photo-section-footer">年龄段占比</div>
          </div>
        </div>
      </div>
      <div class="photo-card">
        <div class="photo-card-con photo-sections photo-section2">
          <div class="photo-section">
            <h4 class="photo-section-title"><font-awesome-icon class="photo-title-icon" icon="map-marker-alt"/> Top6省份占比</h4>
            <div class="photo-section-con">
              <chart-map class="photo-chart" :data="provinceData"></chart-map>
            </div>
          </div>
          <div class="photo-section">
            <h4 class="photo-section-title"><font-awesome-icon class="photo-title-icon" icon="chart-bar"/>城市等级占比</h4>
            <div class="photo-section-con">
              <chart-xbar class="photo-chart" :data="cityData"></chart-xbar>
            </div>
          </div>
        </div>
      </div>
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="photo-card">
            <div class="photo-card-con photo-sections photo-section3">
              <div class="photo-section">
                <h4 class="photo-section-title"><font-awesome-icon class="photo-title-icon" icon="graduation-cap"/> 教育程度占比</h4>
                <div class="photo-section-con">
                  <chart-bar class="photo-chart" :data="educationData"></chart-bar>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="photo-card">
            <div class="photo-card-con photo-sections photo-section3">
              <div class="photo-section">
                <h4 class="photo-section-title"><font-awesome-icon class="photo-title-icon" icon="dollar-sign"/> 收入水平占比</h4>
                <div class="photo-section-con">
                  <chart-bar class="photo-chart" :data="incomeData"></chart-bar>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import picker from './picker';
import chartGender from './chartGender';
import chartRadar from './chartRadar';
import chartMap from './chartMap';
import chartXbar from './chartXbar';
import chartBar from './chartBar';

const channelApi = '/mst/portrait/getChannelPortrait';
const appApi = '/mst/appPortrait/getAppPortrait';

export default {
  name: 'trend-chart',
  components: {
    picker,
    chartGender,
    chartRadar,
    chartMap,
    chartXbar,
    chartBar
  },
  data() {
    return {
      genderMRate: null,
      genderFRate: null,
      ageGroupData: [],
      ageRangeData: [],
      provinceData: [],
      cityData: [],
      educationData: [],
      incomeData: []
    }
  },
  computed: {
    type: function () {
      return this.$route.meta.type;
    },
    api: function () {
      return this.type === 'channel' ? channelApi : appApi;
    }
  },
  methods: {
    submit(data) {
      const params = {
        dateTime: data.date.replace('-', '')
      };
      if (this.type === 'channel') {
        params.channelId = data.option
      }
      if (this.type === 'app') {
        params.appId = data.option
      }
      this.loadData(params);
    },
    load (params, attr) {
      return axios.get(this.api, {
        params: {
          ...params,
          attrKey: attr
        }
      }).then(res => {
        if (!res.data || !res.data.data) return {};
        return res.data.data;
      });
    },
    loadData(params) {
      this.load(params, 'gender').then(data => {
        this.genderMRate = parseFloat(data.M && data.M.attrRatio);
        this.genderFRate = parseFloat(data.F && data.F.attrRatio);
      });
      this.load(params, 'age_group').then(data => {
        this.ageGroupData = data.seriesPieData || [];
      });
      this.load(params, 'age_range').then(data => {
        this.ageRangeData = data.seriesPieData || [];
      });
      this.load(params, 'province').then(data => {
        this.provinceData = data.seriesPieData || [];
      });
      this.load(params, 'city_level').then(data => {
        this.cityData = data.seriesPieData || [];
      });
      this.load(params, 'education_grade').then(data => {
        this.educationData = data.seriesPieData || [];
      });
      this.load(params, 'income_range').then(data => {
        this.incomeData = data.seriesPieData || [];
      });
    }
  }
}
</script>

<style scoped>
.photo-portrayal {
  font-size: 14px;
  color: #333;
}
.photo-title {
  line-height: 14px;
}
.photo-title:before {
  content: '\3000';
  display: inline-block;
  height: 14px;
  width: 4px;
  margin-right: 10px;
  background-color: #69c72b;
}
.photo-card {
  margin-bottom: 30px;
  border: 1px solid #e1eaf3;
  border-radius: 4px;
  background-color: #fff;
}
.photo-card-con {
  padding: 18px 16px;
}
.photo-card-title {
  height: 40px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #69c72b;
  color: #fff;
  line-height: 40px;
  text-align: center;
}
.photo-sections {
  display: flex;
  justify-content: justify;
}
.photo-section {
  flex: 1;
}
.photo-section-title {
  color: #525252;
  font-weight: bold;
}
.photo-section-footer {
  width: 114px;
  height: 30px;
  margin: 0 auto;
  border: 1px solid #e5e5e5;
  background-color: #f8f8f8;
  font-size: 12px;
  line-height: 30px;
  text-align: center;
}
.photo-section1 .photo-section-con {
  height: 330px;
}
.photo-section2 .photo-section-con {
  height: 460px;
}
.photo-section3 .photo-section-con {
  height: 430px;
}
.photo-chart {
  width: 100%;
  height: 100%;
  padding-top: 34px;
}
.photo-title-icon {
  margin-right: 0.5em;
}

.gender-wrap {
  display: flex;
  justify-content: space-around;
  height: 100%;
}
.gender-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: auto;
  height: 100%;
}
.gender-side {
  text-align: center;
}
.gender-side img {
  margin-bottom: 8px;
}
.gender-side span {
  position: relative;
}
.gender-icon {
  position: absolute;
  right: -1em;
}
.gender-img-f {
  display: block;
  width: 46px;
}
.gender-img-m {
  display: block;
  width: 32px;
}
</style>

<style>
.channel-chart-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
