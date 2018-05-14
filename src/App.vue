<template>
  <div id="app">
    <router-view v-if="isActive"></router-view>
  </div>
</template>
<script>
export default {
  name: 'app',
  data() {
    return {
      isActive: true
    };
  },
  watch: {
    $route() {
      this.isActive = false;
      this.$nextTick(() => (this.isActive = true));
    }
  }
};
</script>
