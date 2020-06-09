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
          <el-button @click="showAddCateDialog" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树形表格-->
      <tree-table class="tree-table" ref="treeTableRef" :data="cateList" :columns="columns" border :selection-type="false" :expand-type="false" show-index index-text="#">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color:#67C23A;font-size:16px;"></i>
          <i v-else class="el-icon-error" style="color:red;font-size:16px;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">{{scope.row.cat_name}}</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success">{{scope.row.cat_name}}</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="warning">{{scope.row.cat_name}}</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation">
          <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="cateParams.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="cateParams.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 添加分类 -->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" @close="addCateDialogClosed" width="50%">
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader v-model="selectValue" ref="cascaderRef" :options="parentCateList" :props="selectProps" @change="handleChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </div>
      </el-dialog>
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
      total: 0,
      // table
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
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      // 添加分类 展示隐藏
      addCateDialogVisible: false,
      // 添加参数
      addCateForm: {
        // 商品名
        cat_name: '',
        // 商品 父级id
        cat_pid: 0,
        // 商品等级
        cat_level: 0
      },
      // 添加分类 校验
      addCateRules: {
        cat_name: [
          { required: true, message: '请输人角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 级联选择器 父级分类数据
      parentCateList: [],
      // 级联选择器 props
      selectProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 级联选择器 选中的 父级ID数组
      selectValue: []
    }
  },
  created () {
    this.getCateList()
  },
  watch: {
    selectValue () {
      if (this.$refs.cascaderRef) {
        this.$refs.cascaderRef.dropDownVisible = false // 监听值发生变化就关闭它
      }
    }
  },
  methods: {
    // 获取分类列表
    async getCateList () {
      var { data: res } = await this.$http.get('categories', { params: this.cateParams })
      if (res.meta.status !== 200) return this.$message.error(res.data.msg)
      // 数据列表赋值
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 页数改变
    handleSizeChange (size) {
      this.cateParams.pagesize = size
      this.getCateList()
    },
    // 页码改变
    handleCurrentChange (num) {
      this.cateParams.pagenum = num
      this.getCateList()
    },
    // 展示添加分类 dialog
    showAddCateDialog () {
      // 获取父级分类
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 关闭添加分类
    addCateDialogClosed () {
      // 对整个表单进行重置
      this.$refs.addCateFormRef.resetFields()
    },
    // 获取父级分类列表数据
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.data.msg)
      // 数据列表赋值

      this.parentCateList = res.data
    },
    // 级联选择器 改变
    handleChange (value) {
      console.log(value)
      console.log(this.selectValue)
    },
    // 添加分类提交
    addCate () {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        this.addCateForm.cat_pid = this.selectValue[this.selectValue.length - 1]
        this.addCateForm.cat_level = this.selectValue.length

        var { data: res } = await this.$http.post('categories', this.addCateForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)

        this.$message.success(res.meta.msg)
        // 关闭 dialog 对话框
        this.addCateDialogVisible = false
        // 刷新列表
        this.getCateList()
        this.selectValue = []
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin: 15px 0;
}

.el-cascader {
  width: 100%;
}
</style>
