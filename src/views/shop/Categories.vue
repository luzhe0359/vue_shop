<template>
  <div id="categories">
    <div>面包屑封装</div>
    <el-breadcrumb class="breadcrumb-container" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in levelList" :key="item.path" :to="item.path">{{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>

  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  created () {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb () {
      console.log(this.$route)
      let matched = this.$route.matched.filter(item => item.name)
      console.log(matched)
      const first = matched[0]
      if (first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()) {
        matched = [{ path: '/dashboard', meta: { title: 'dashboard' } }].concat(matched)
      }
      this.levelList = matched
    }
  }
}
</script>

<style lang="less" scoped>
</style>
