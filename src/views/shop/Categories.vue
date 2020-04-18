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
      <tree-table class="tree-table" ref="treeTableRef" :data="cateList" :columns="columns" border :selection-type="false" :expand-type="false" show-index index-text="#">
        <!-- 是否有效 -->
        <template slot="isok" scope="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color:#67C23A;font-size:16px;"></i>
          <i v-else class="el-icon-error" style="color:red;font-size:16px;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" type="success">{{scope.row.cat_name}}</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="warning">{{scope.row.cat_name}}</el-tag>
          <el-tag v-else type="success">{{scope.row.cat_name}}</el-tag>

        </template>
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
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
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
.tree-table {
  margin: 15px 0;
}
</style>
