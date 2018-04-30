<template>
  <behavior :tabs='tabs' :coverParams="coverParams" :mergeCells="false" :fetchApi="fetchApi"></behavior>
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
        all: api.findAppUse,
        classify: api.eachTrend,
        allDownload:
          'http://113.200.91.81/mst/behavior/exportChannelTotalTrends1',
        classifyDownload:
          'http://113.200.91.81/mst/behavior/exportEachChannelTrend'
      },
      tabs: [
        {
          index: 0,
          name: 'all',
          label: '全部趋势',
          mergeCells:false
        }
      ],
      coverParams:{
        all:{
          type:this.$route.meta.bread.type
        }
      }
    };
  },
  
  watch:{
    '$route'(){
      this.coverParams.all={
        type:this.$route.meta.bread.type
      }
    }
  }
};
</script>
