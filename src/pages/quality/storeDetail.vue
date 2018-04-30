<template>
  <behaviorDetail :linkDetail='linkDetail':coverParams="coverParams" :tabs="tabs" :mergeCells="false" :fetchApi="fetchApi"></behaviorDetail>
</template>

<script>
import api from '@/api/api';
import behaviorDetail from '@/pages/behavior/storeDetail';
export default {
  components: {
    behaviorDetail
  },
  data() {
    console.log(1111);
    return {
      fetchApi: {
        all: api.findAppUse,
        classify: api.findAppChannelUse,
        allDownload:
          'http://113.200.91.81/mst/behavior/exportChannelTotalTrends1',
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
      linkDetail(row) {},
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