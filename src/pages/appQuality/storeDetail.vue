<template>
  <behaviorDetail :openLink='true' :coverParams="coverParams" :tabs="tabs" :mergeCells="false" :fetchApi="fetchApi"></behaviorDetail>
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
        classify: api.findAppChannelUse,
        allDownload:
          'http://113.200.91.81/mst/behavior/exportChannelTotalTrends',
        classifyDownload:
          'http://113.200.91.81/mst/behavior/exportEachChannelTrend'
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
          type: this.$route.meta.bread.type
        }
      }
    };
  },
  watch: {
    $route() {
      console.log(this.$route);
      this.coverParams.all = {
        type: this.$route.meta.bread.type
      };
    }
  }
};
</script>