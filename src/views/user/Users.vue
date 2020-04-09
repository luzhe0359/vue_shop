<template>
  <div id="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索、添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" width='180px' :span="8" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogAddUserVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini">分配</el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="pageSizeChanged" @current-change="pageNumChanged" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogAddUserVisible" width="50%" @close="closeAddUserDialog">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var mobile = (rule, value, cb) => {
      const emailReg = /^1[3456789]\d{9}$/
      // 校验手机号 是否合法
      if (!emailReg.test(value)) cb(new Error())
      cb()
    }
    return {
      userList: [],
      // 用户列表 参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      // 添加用户 dialog 显示/隐藏
      dialogAddUserVisible: false,
      // 添加用户信息
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户信息 校验
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入合法邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobile, message: '手机号格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      var { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 用户列表赋值
      this.userList = res.data.users
      // 用户总数赋值
      this.total = res.data.total
    },
    // 每页条数改变时，触发
    pageSizeChanged (size) {
      this.queryInfo.pagesize = size
      // 改变页数后，再次获取用户列表
      this.getUserList()
    },
    // 页码改变时
    pageNumChanged (num) {
      this.queryInfo.pagenum = num
      this.getUserList()
    },
    // 改变用户状态
    async userStateChanged (userInfo) {
      var { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      // 判断是否修改成功
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    // 关闭 添加用户 dialog
    closeAddUserDialog () {
      // 添加用户表单重置
      this.$refs.addUserRef.resetFields()
    },
    // 添加用户信息
    addUserInfo () {
      this.$refs.addUserRef.validate(async valid => {
        // if (!valid) return

        var { data: res } = await this.$http.post('users', this.addUserForm)
        // 隐藏 dialog
        this.dialogAddUserVisible = false
        // 判断是否添加成功
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 如果添加成功 重新获取用户列表
        this.getUserList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;

  .el-row {
    margin-bottom: 15px;
  }

  .el-pagination {
    margin-top: 15px;
  }
}
</style>
