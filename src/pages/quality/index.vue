<template >
  <div class="hide-tabs">
    <behavior :tabs='tabs' :coverParams="coverParams" :mergeCells="false" :fetchApi="fetchApi"></behavior>
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
      this.coverParams.all = {
        type: this.$route.meta.bread.type
      };
    }
  }
};
</script>
<style lang="less">

</style>

