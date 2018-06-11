<template>
  <div class="login" v-loading="loading" element-loading-text="正在验证">
  </div>
</template>

<script>
import api from '@/api/api'
export default {
  name: 'login',
  data() {
    return {
      loading: true
    }
  },
  created() {
    // 不拦截
  this.$router.replace({	 
     name: 'index'
   });
  //  如果不拦截就注释掉以下代码
    // if (this.$route.query.token) {
    // sessionStorage.setItem('token', this.$route.query.token)
    //   const data = {
    //     token: this.$route.query.token
    //   }
    //   api
    //     .login(data)
    //     .then(res => {
    //       sessionStorage.setItem('token', this.$route.query.token)
    //       let redirect = decodeURIComponent(this.$route.query.redirect || '/')
    //       this.$router.replace({
    //         path: redirect
    //       })
    //     })
    //     .catch(error => {})
    // } else {
    //   window.location.href =
    //     'http://irv.iresearch.com.cn/iResearchDataWeb/?m=user&a=jump&pro=46'
    // }
      //  如果不拦截就注释掉以上代码
  }
}
</script>

<style>
.login {
  font-size: 22px;
  margin: 200px auto;
  text-align: center;
}
</style>
