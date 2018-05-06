<template>
  <div class="hide-tabs">
    <behaviorDetail :coverParams="coverParams" :tabs="tabs" :mergeCells="false" :fetchApi="fetchApi"></behaviorDetail>
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
        all: api.findChannelAppUse,
        allDownload:
          'http://113.200.91.81/mst/behavior/quality/exportChannelAppUse'
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