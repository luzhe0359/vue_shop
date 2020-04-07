<template>
  <el-container id="home">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边导航栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 展开折叠按钮 -->
        <div class="toggleMenu" @click="isCollapse = !isCollapse">|||</div>
        <!-- 导航栏 -->
        <el-menu class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="$route.path">
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menusList" :key="item.id" :index="item.id + ''">
            <template slot="title">
              <!-- 图标 -->
              <i :class="menuIcons[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="itemChild in item.children" :key="itemChild.id" :index="'/' + itemChild.path">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{itemChild.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 侧边内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menusList: [],
      menuIcons: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  async created () {
    // 获取侧边导航
    var { data: res } = await this.$http.get('menus')
    console.log(res)
    this.menusList = res.data
  },
  methods: {
    // 退出，清空 token，跳转至登录页
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
#home {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: #fff;
  padding-left: 0;

  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;

  // 展开折叠菜单
  .toggleMenu {
    width: 100%;
    font-size: 16px;
    color: #fff;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }

  .el-menu {
    // 去除菜单右侧边框
    border-right: none;

    .iconfont {
      margin-right: 10px;
    }
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
