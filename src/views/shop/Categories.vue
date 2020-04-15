<template>
  <div id="categories">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树形表格-->
      <tree-table ref="treeTableRef" :data="cateList" :columns="columns">

      </tree-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      // 查询条件
      cateParams: {
        type: 3,
        pagesize: 5,
        pagenum: 1
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
          // width: '400px'
        }
      ]
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList () {
      var { data: res } = await this.$http.get('categories', { params: this.cateParams })
      if (res.meta.status !== 200) return this.$message.error(res.data.msg)
      console.log(res)
      // 数据列表赋值
      this.cateList = res.data.result
    }
  }
}
</script>

<style lang="less" scoped>
</style>
