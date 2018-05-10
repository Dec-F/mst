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
        all: api.listAppTrendsSub,
        allDownload:
         api.download.exportAppTrendsSub,
       allCharts:api.listAppEchartsSub
      },
    };
  }
};
</script>
