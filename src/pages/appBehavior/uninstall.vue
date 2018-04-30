<template>
  <behaviorDetail :coverParams="coverParams" :tabs="tabs" :openLink='false' :mergeCells="false" :fetchApi="fetchApi"></behaviorDetail>
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
        allDownload:
          'appQuality/exportUninstallAppList'
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
  }
};
</script>
