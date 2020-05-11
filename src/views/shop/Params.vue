<template>
  <div id="params">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon>
      </el-alert>
      <el-row class="goodCate">
        <!-- 商品分类 级联选择器 -->
        <el-col>
          选择商品分类：
          <el-cascader v-model="cascaderValue" :options="options" :props="cascaderProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="params">
          <el-button type="primary" plain size="mini" :disabled="isBtnDisabled">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="proterty">
          <el-button type="primary" plain size="mini" :disabled="isBtnDisabled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 级联选择器 list
      options: [],
      // 级联选择器 选中项
      cascaderValue: [],
      // 级联选择器 配置项
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // tab 激活项
      activeName: 'params'
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    // 禁用按钮 返回true , 否则返回false
    isBtnDisabled () {
      if (this.cascaderValue.length !== 3) {
        return true
      }
      return false
    }
  },
  methods: {
    // 级联选择器改变
    handleChange () {

    },
    // 获取级联选择器列表
    async getCateList () {
      var { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.options = res.data
    },
    // tab 点击
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="less" scoped>
.goodCate {
  margin: 15px 0;
}
</style>
