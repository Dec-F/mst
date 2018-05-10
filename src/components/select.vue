<template>
  <div class="selectIndex">
     <img class="select__icon-cur" :src="logo">
    <el-autocomplete placeholder="请输入您所要查找的内容..." v-model="searchKey" @select="handleSelect" :fetch-suggestions="querySearch" value-key="name"></el-autocomplete>
  </div>
</template>

<script>
import $bus from 'utils/bus';
export default {
  name: 'selectIndex',
  data() {
    return {
      id: '',
      logo: '',
      searchKey: ''
    };
  },
  props: {
    channels: {
      type: Array,
      default() {
        return [
          {
            id: '',
            name: ''
          }
        ];
      }
    }
  },
  created () {
     $bus.$on('clear-search',()=>{
       this.id=''
       this.logo=''
       this.searchKey=''
     })
  },
  methods: {
    querySearch(queryString, cb) {
      let self = this,
        { channels } = self;
      let results = queryString
        ? channels.filter(self.createFilter(queryString))
        : [];
      cb(results);
    },
    createFilter(queryString) {
      return item => {
        return item.name.toLowerCase().includes(queryString.toLowerCase());
      };
    },
    handleSelect(item) {
      this.id = item.id;
    }
  },
  beforeMount() {
    this.id = this.channels[0] && this.channels[0].id;
    this.searchKey = this.channels[0] && this.channels[0].name;
  },
  watch: {
    id: function(cur) {
      try {
        this.logo = this.channels.find(item => item.id === cur).logo;
        this.$emit('change', this.id);
      } catch (err) {}
      console.log(this.logo)
    }
  }
};
</script>

<style lang="less" scoped>
.selectIndex {
  position: relative;
}

.select__icon-cur {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  max-height: 33px;
  padding: 5px;
  border-radius: 50%;
  z-index: 1;
}
</style>
