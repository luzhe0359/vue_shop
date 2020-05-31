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
        <!-- 动态参数列表 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" plain size="mini" :disabled="isBtnDisabled">添加参数</el-button>
          <!-- table 区域 -->
          <el-table :data="manyList" border style="width: 100%">
            <el-table-column type="expand">

            </el-table-column>
            <el-table-column type="index" label="#" width="180">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名" width="180">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click.native.prevent="deleteRow(scope.row.attr_id)" size="mini">
                  修改
                </el-button>
                <el-button @click.native.prevent="deleteRow(scope.row.attr_id)" type="danger" icon="el-icon-delete" size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性列表 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" plain size="mini" :disabled="isBtnDisabled">添加属性</el-button>
          <!-- table 区域 -->
          <el-table :data="onlyList" border style="width: 100%">
            <el-table-column type="expand">

            </el-table-column>
            <el-table-column type="index" label="#" width="180">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名" width="180">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click.native.prevent="deleteRow(scope.row.attr_id)" size="mini">
                  修改
                </el-button>
                <el-button @click.native.prevent="deleteRow(scope.row.attr_id)" type="danger" icon="el-icon-delete" size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
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
      activeName: 'many',
      // 静态属性
      onlyList: [],
      // 动态参数
      manyList: []
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
    },
    cateId () {
      if (this.cascaderValue.length === 3) {
        return this.cascaderValue[2]
      }
      return null
    }
  },
  methods: {
    // 级联选择器改变
    handleChange () {
      this.getParamsList()
    },
    async getParamsList () {
      // 判断, 不是选择第三级，清空选中项value
      if (this.cascaderValue.length !== 3) {
        this.cascaderValue = []
        return
      }
      // 根据动态参数/静态属性 获取表格数据
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      if (this.activeName === 'only') {
        this.onlyList = res.data
      } else {
        this.manyList = res.data
      }
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
      this.getParamsList()
    }
  }
}
</script>

<style lang="less" scoped>
.goodCate {
  margin: 15px 0;
}
</style>
