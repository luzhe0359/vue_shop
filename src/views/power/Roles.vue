<template>
  <div id="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 角色添加 -->
      <el-row>
        <el-col>
          <el-button @click="addRoleDialogVisible = true" type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <!-- 权限 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 循环 -->
            <el-row :class="['bd-bottom', index1 === 0?'bd-top':'', 'v-center']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRightbyId(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二、三级权限 盒子-->
              <el-col :span="19">
                <!-- 二级权限 循环 -->
                <el-row :class="[index2 === 0?'':'bd-bottom', 'v-center']" v-for="(item2,index2) in item1.children" :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="8">
                    <el-tag type="success" closable @close="deleteRightbyId(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <!-- 三级权限 -->
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="deleteRightbyId(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column prop="level" label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoleInfo(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRoleInfo(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog title="权限分配" :visible.sync="setRightDialogVisible" @close="closeSetRightDialog" width="50%">
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :data="rightsList" :props="rightsListProps" show-checkbox node-key="id" :default-checked-keys="defKeys" default-expand-all></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" @close="addRoleDialogClosed" width="50%">
      <el-form :model="roleForm" :rules="roleFormRules" ref="roleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" @close="editRoleDialogClosed" width="50%">
      <el-form :model="editRoleForm" :rules="roleFormRules" ref="editRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setEditRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      roleList: [],
      // 用户权限 dialog 显示/隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树 子节点/节点名
      rightsListProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认勾选的树节点
      defKeys: [],
      // 当前将被分配 角色ID
      roleId: '',
      // 添加角色 dialog 显示/隐藏
      addRoleDialogVisible: false,
      // 添加角色 参数
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色 参数 校验
      roleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 编辑角色
      editRoleDialogVisible: false,
      // 添加角色 参数
      editRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 当前将被编辑 角色ID
      editRoleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    //  获取 角色列表
    async getRoleList () {
      var { data: res } = await this.$http.get('roles')
      // 判断 角色列表是否获取成功
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      // 成功后 渲染表格
      this.roleList = res.data
    },
    //  根据id 删除角色
    async deleteRightbyId (role, rightId) {
      var result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果点击取消，则不往下执行

      if (result !== 'confirm') return this.$message.info('取消了删除')
      var { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.$message.success(res.meta.msg)
      // 为权限重新赋值
      role.children = res.data
    },
    // 展示 权限分配 dialog
    async showSetRightDialog (role) {
      this.roleId = role.id
      var { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      // 获取权限列表
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.rightsList = res.data
      // 递归获取三级节点id
      this.getDefKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 监听 分配权限 dialog 关闭
    closeSetRightDialog () {
      // 权限 数组叠加 bug
      this.defKeys = []
    },
    //  通过递归的形式，获取角色所有三级权限id，并保存到 defKeys 数组中
    getDefKeys (node, arr) {
      // 如果当前node节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getDefKeys(item, arr)
      })
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        // 获取 全选、半选数组
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      // 角色 设置权限
      var { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.$message.success(res.meta.msg)
      // 修改后 更新数据列表
      this.getRoleList()
      this.setRightDialogVisible = false
    },
    // 添加角色 提交
    addRoleInfo () {
      this.$refs.roleFormRef.validate(async valid => {
        if (!valid) return this.$message.warning('请先填写角色信息')
        var { data: res } = await this.$http.post('roles', this.roleForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 添加成功 刷新用户列表
        this.getRoleList()
        this.addRoleDialogVisible = false
      })
    },
    // 添加角色 dialog 关闭
    addRoleDialogClosed () {
      // 清空 表单
      this.$refs.roleFormRef.resetFields()
    },
    // 删除 角色信息
    async delRoleInfo (id) {
      var result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果点击取消，则不往下执行
      if (result !== 'confirm') return this.$message.info('取消了删除')
      // 调取删除接口
      var { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 删除成功后，再次获取用户列表
      this.getRoleList()
    },
    // 编辑角色
    async editRoleInfo (id) {
      this.editRoleId = id
      // 根据角色id 查找对应信息
      var { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res)
      this.editRoleForm.roleName = res.data.roleName
      this.editRoleForm.roleDesc = res.data.roleDesc
      this.editRoleDialogVisible = true
    },
    // 编辑角色 提交
    setEditRole () {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return this.$message.warning('请先填写合法角色信息')
        var { data: res } = await this.$http.put('roles/' + this.editRoleId, this.editRoleForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

        this.$message.success('编辑成功')
        // 再次获取用户列表
        this.getRoleList()
        this.editRoleDialogVisible = false
      })
    },
    // 编辑角色 dialog 关闭
    editRoleDialogClosed () {
      // 清空 表单
      this.$refs.editRoleFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}

.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-top: 1px solid #eee;
}

.v-center {
  display: flex;
  align-items: center;
}
</style>
