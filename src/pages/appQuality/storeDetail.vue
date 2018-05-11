<template>
  <div class="hide-tabs">
    <behaviorDetail :orderByMap='orderByMap' :openLink='true' :coverParams="coverParams" :tabs="tabs" :mergeCells="false" :fetchApi="fetchApi"></behaviorDetail>
  </div>
</template>

<script>
import api from '@/api/api';
import behaviorDetail from '@/pages/behavior/storeDetail';
import trendVue from '../../components/trend.vue';
export default {
  components: {
    behaviorDetail
  },
  data() {
    return {
      fetchApi: {
        all: api.findAppUse,
        allDownload: api.download.exportAppUse,
        allCharts: api.qlistAppEcharts
      },
      tabs: [
        {
          index: 0,
          name: 'all',
          label: '全部趋势',
          mergeCells: false
        }
      ],
      coverParams: {
        all: {
          trendType: this.$route.meta.bread.type
        }
      },
      orderByMap: this.$route.meta.orderByMap
    };
  },

  watch: {
    $route() {
      this.coverParams.all = {
        trendType: this.$route.meta.bread.type
      };
      this.orderByMap = this.$route.meta.orderByMap;
    }
  }
};
</script>
