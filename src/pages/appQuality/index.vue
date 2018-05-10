<template>
  <div class="hide-tabs">
    <behavior :orderByMap='orderByMap' :tabs='tabs' :openLink='false' :coverParams="coverParams" :mergeCells="false" :fetchApi="fetchApi"></behavior>
  </div>
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
        all: api.findAppChannelUse,
        allDownload: api.download.exportAppChannelUse,
        allCharts: api.listAppEchartsSub
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
