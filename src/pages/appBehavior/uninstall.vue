<template>
  <div class="hide-tabs">
    <behaviorDetail :orderByMap='orderByMap' :coverParams="coverParams" :tabs="tabs" :openLink='false' :mergeCells="false" :fetchApi="fetchApi"></behaviorDetail>
  </div>
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
        all: api.unloadTable,
        allDownload: api.download.exportUninstall,
        allCharts: api.listUninstallEcharts
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
      },
      orderByMap: this.$route.meta.orderByMap
    };
  }
};
</script>
