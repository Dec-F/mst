<template>
  <behaviorDetail :openLink='true' :mergeCells="true" :fetchApi="fetchApi"></behaviorDetail>
</template>

<script>
import api from '@/api/api';
import behaviorDetail from '@/pages/behavior/storeDetail';
export default {
  components: {
    behaviorDetail
  },
  data() {
    return {
      fetchApi: {
        all: api.appTotalTrends,
        classify: api.eachAppTrend,
        allDownload:
          'http://113.200.91.81/mst/appBehavior/exportAppTotalTrends',
        classifyDownload:
          'http://113.200.91.81/mst/appBehavior/exportEachAppTrend'
      },
    };
  }
};
</script>