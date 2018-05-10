<template>
  <behaviorDetail :orderByMap='orderByMap' :openLink='true' :mergeCells="true" :fetchApi="fetchApi"></behaviorDetail>
</template>

<script>
import api from '@/api/api';
import behaviorDetail from '@/pages/behavior/storeDetail';
export default {
  components: {
    behaviorDetail
  },
  data() {
    console.log(this.$route.meta.orderByMap,1111);
    console.log(11111);
    return {
      fetchApi: {
        all: api.listAppTrends,
        allDownload: api.download.exportAppTrends,
        allCharts: api.listAppEcharts
      },
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
