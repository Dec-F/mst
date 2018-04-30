<template>
  <behavior  :openLink='false' :mergeCells="false" :fetchApi="fetchApi"></behavior>
</template>

<script>
import api from '@/api/api';
import behavior from '@/pages/behavior/index';
export default {
  components: {
    behavior
  },
  data() {
    return {
      fetchApi: {
        all: api.eachAppTrend,
        classify: api.appTotalTrends,
        allDownload:
          'http://113.200.91.81/mst/behavior/exportChannelTotalTrends1',
        classifyDownload:
          'http://113.200.91.81/mst/behavior/exportEachChannelTrend'
      }
    };
  }
};
</script>
