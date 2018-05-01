<template>
  <behavior  :openLink='false' :mergeCells="false"  :fetchApi="fetchApi"></behavior>
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
        all: api.appTotalTrendsSub,
        classify: api.eachAppTrendSub,
        allDownload:
          'http://113.200.91.81/mst/appBehavior/exportAppTotalTrendsSub',
        classifyDownload:
          'http://113.200.91.81/mst/appBehavior/exportAppChannelTrend'
      }
    };
  }
};
</script>
