<template>
  <behaviorDetail :openLink='true'  :mergeCells="false" :fetchApi="fetchApi"></behaviorDetail>
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
        all: api.findAppUse,
        classify: api.findAppChannelUse,
        allDownload:
          'http://113.200.91.81/mst/behavior/exportChannelTotalTrends1',
        classifyDownload:
          'http://113.200.91.81/mst/behavior/exportEachChannelTrend'
      },
    };
  }
};
</script>