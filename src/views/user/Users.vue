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
            <el-button slot="append" icon="el-icon-search" @click="searchUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#">
        </el-table-column>
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
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUserInfo(scope.row.id)">删除</el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRoleDialog(scope.row)">分配</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="pageSizeChanged" @current-change="pageNumChanged" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户信息 -->
    <el-dialog title="添加用户信息" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户信息 -->
    <el-dialog title="编辑用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogVisible" @close="roleDialogClosed" width="50%">
      <div>
        <p>当前用户: {{userInfo.username}}</p>
        <p>当前角色: {{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="roleVlaue" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    var checkMobile = (rule, value, cb) => {
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
      addDialogVisible: false,
      // 添加用户信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户信息 校验
      addFormRules: {
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
          { validator: checkMobile, message: '手机号格式不正确', trigger: 'blur' }
        ]
      },
      // 控制 编辑用户 dialog 显示/隐藏
      editDialogVisible: false,
      // 编辑 用户信息
      editForm: {},
      // 编辑 用户信息 校验
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入合法邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, message: '手机号格式不正确', trigger: 'blur' }
        ]
      },
      // 控制 角色分配 lialog 隐藏/显示
      roleDialogVisible: false,
      // 用户分配角色
      userInfo: {},
      // 所有角色列表
      roleList: [],
      // 当前选中的 角色value
      roleVlaue: ''
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
    searchUserList () {
      this.queryInfo.pagenum = 1
      this.getUserList()
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
    addDialogClosed () {
      // 添加用户表单重置
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户信息
    addUserInfo () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.warning('请先填写用户信息')
        var { data: res } = await this.$http.post('users', this.addForm)

        // 判断是否添加成功
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 隐藏 dialog
        this.addDialogVisible = false
        // 如果添加成功 重新获取用户列表
        this.getUserList()
      })
    },
    // 展示 编辑用户 dialog
    async showEditDialog (id) {
      var { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 展示 dialog
      this.editDialogVisible = true
      this.editForm = res.data
    },
    // 关闭 编辑用户 dialog
    editDialogClosed () {
      // 添加用户表单重置
      this.$refs.editFormRef.resetFields()
    },
    // 编辑 用户信息
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        var { data: res } = await this.$http.put('users/' + this.editForm.id, { id: this.editForm.id, email: this.editForm.email, mobile: this.editForm.mobile })

        // 判断是否编辑成功
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 隐藏 dialog
        this.editDialogVisible = false
        // 如果添加成功 重新获取用户列表
        this.getUserList()
      })
    },
    // 删除 用户信息
    async delUserInfo (id) {
      var result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果点击取消，则不往下执行
      if (result !== 'confirm') return this.$message.info('取消了删除')
      // 调取删除接口
      var { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 删除成功后，再次获取用户列表
      this.getUserList()
    },
    // 展示 分配角色
    async showRoleDialog (userInfo) {
      this.userInfo = userInfo
      // 获取所有角色列表
      var { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.roleList = res.data
      this.roleDialogVisible = true
    },
    // 分配角色 确定
    async allotRole () {
      // 判断是否 选择角色
      if (!this.roleVlaue) return this.$message.error('请先选择角色')
      var { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.roleVlaue })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 关闭 分配权限 dialog
      this.roleDialogVisible = false
      this.getUserList()
    },
    roleDialogClosed () {
      // 重置 当前选中的角色
      this.roleVlaue = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
