<template>
  <div class="searchSelect">
    <img class="select__icon-cur" :src="icon">
    <el-select popper-class="search__select" v-model="id" filterable
        placeholder="当前渠道" default-first-option>
      <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id">
        <img class="option__icon fl" :src="item.icon">
        <span class="option__name fl">{{ item.name }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'searchSelect',
    data() {
      return {
        id: null,
        icon: null
      }
    },
    props: {
      channels: {
        type: Array,
        default: []
      }
    },
    beforeMount() {
      this.id = this.channels[0].id;
    },
    watch: {
      'id': function (cur) {
        this.icon = this.channels.find(item => item.id === cur).icon;
        this.$emit('change', cur);
      }
    }
  }
</script>

<style lang="less" scoped>
.searchSelect{
  position: relative;
}
.select__icon-cur{
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
