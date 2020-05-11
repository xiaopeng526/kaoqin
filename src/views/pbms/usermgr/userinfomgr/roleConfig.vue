<template>
  <div>
    <el-dialog :visible.sync="showRoleConfigCom" :append-to-body="true" :close-on-click-modal="false" :before-close="cancleDialog" title="编辑用户信息" width="900px">
      <!-- 导航 -->
      <el-row :gutter="24">
        <el-col :span="3">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              应用平台
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="业务应用">业务应用</el-dropdown-item>
              <el-dropdown-item command="协作组件">协作组件</el-dropdown-item>
              <el-dropdown-item command="数据组件">数据组件</el-dropdown-item>
              <el-dropdown-item command="监控组件">监控组件</el-dropdown-item>
              <el-dropdown-item command="管理组件">管理组件</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="3">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              数据平台
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="数据目录">数据目录</el-dropdown-item>
              <el-dropdown-item command="数据管理">数据管理</el-dropdown-item>
              <el-dropdown-item command="数据共享">数据共享</el-dropdown-item>
              <el-dropdown-item command="数据分析">数据分析</el-dropdown-item>
              <el-dropdown-item command="配置管理">配置管理</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="3">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              服务平台
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="API服务中心">API服务中心</el-dropdown-item>
              <el-dropdown-item command="应用开放平台">应用开放平台</el-dropdown-item>
              <el-dropdown-item command="开发者中心">开发者中心</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="3">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              运维平台
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="资源管理">资源管理</el-dropdown-item>
              <el-dropdown-item command="配置管理">配置管理</el-dropdown-item>
              <el-dropdown-item command="部署管理">部署管理</el-dropdown-item>
              <el-dropdown-item command="监控中心">监控中心</el-dropdown-item>
              <el-dropdown-item command="告警中心">告警中心</el-dropdown-item>
              <el-dropdown-item command="私有云管理">私有云管理</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="4" :offset="2" style="margin-right:-50px">
          <i class="el-icon-check"></i>
          <span>当前选择：</span>
        </el-col>
        <el-col :span="6">
          <strong>{{ level1 }}</strong>
          <i class="el-icon-arrow-right"></i>
          <strong>{{ level2 }}</strong>
        </el-col>
      </el-row>
      <div style="margin-top:20px"></div>
      <el-row :gutter="24">
        <!-- 树结构 -->
        <el-col :span="6">
          <el-tree :data="treeData" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps" show-checkbox node-key="id"></el-tree>
        </el-col>
        <el-col :span="18">
          <!-- 搜索 -->
          <el-row :gutter="24">
            <el-col :span="6">
              <span class="roleText">已分配的角色矩阵：</span>
            </el-col>
            <el-col :span="6" class="roleconfig">
              <el-input v-model="roleMatrix" placeholder="请输入角色或应用名称" clearable size="small" style="width:150px"></el-input>
            </el-col>
            <el-col :span="7">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="searchData">查询</el-button>
              <el-button icon="el-icon-refresh" size="mini" type="success" @click="clearSearchData">重置</el-button>
            </el-col>
          </el-row>
          <!-- 表格 -->
          <el-table :data="roleTableData" border size="small" style="width: 100%;margin-top:20px">
            <el-table-column prop="name" label="角色名称" sortable align="center" width="200"></el-table-column>
            <el-table-column prop="config" label="应用系统" sortable align="center" width="350"></el-table-column>
            <el-table-column label="操作" sortable align="center">
              <template slot-scope="scope">
                <span v-html="formatIcon(scope.row.icon)"></span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 底部 -->
          <el-row :gutter="24" style="margin-top:10px">
            <el-col :span="3">
              <i class="el-icon-refresh" style="margin:10px;color:green"></i>
            </el-col>
            <el-col :span="21">
              <!-- 分页 -->
              <el-pagination :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" class="content-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancleDialog()">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'RoleConfig',
  props: {
    // 是否显示角色配置组件
    showRoleConfigCom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: [
        {
          id: 1,
          label: '审管信息互动',
          children: [
            {
              id: 1,
              label: '审批局管理员'
            },
            { id: 2, label: '审批局用户' },
            { id: 4, label: '监管部门用户' },
            { id: 5, label: '系统管理员' },
            { id: 6, label: '区划管理员' },
            { id: 7, label: '部门管理员' },
            { id: 8, label: '普通用户' }
          ]
        },
        {
          id: 9,
          label: '通用审批平台',
          children: [
            { id: 10, label: '审批局管理员' },
            { id: 11, label: '审批局用户' },
            { id: 12, label: '监管部门用户' },
            {
              id: 13,
              label: '系统管理员'
            },
            {
              id: 14,
              label: '区划管理员'
            },
            {
              id: 15,
              label: '部门管理员'
            },
            {
              id: 16,
              label: '普通用户'
            }
          ]
        },
        {
          label: '通用审批平台',
          children: [
            {
              id: 17,
              label: '收件人员'
            },
            {
              id: 18,
              label: '空白用户'
            },
            {
              id: 19,
              label: '股室管理员'
            },
            {
              id: 20,
              label: '中间环节业务人员'
            },
            {
              id: 21,
              label: '区划管理员'
            },
            {
              id: 22,
              label: '部门管理员'
            },
            {
              id: 23,
              label: '业务人员'
            },
            {
              id: 24,
              label: '普通用户'
            },
            { id: 25, label: '查询统计管理员' }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 角色表格数据
      roleTableData: [
        {
          name: '系统管理员',
          config: '事项管理系统'
        }
      ],
      roleMatrix: '',
      pageSize: 20,
      total: 20,
      currentPage: 1,
      // 当前选择
      level1: '应用平台',
      level2: '业务应用'
    }
  },
  mounted() {},
  methods: {
    // 取消按钮
    cancleDialog() {
      this.$emit('closeDialog', this.showRoleConfigCom)
    },
    // 确定按钮
    submitForm() {
      this.$emit('closeDialog', this.showRoleConfigCom)

      // 发请求
    },
    // 下拉菜单选择时触发
    handleCommand(val) {
      console.log(val)
      if (
        val === '业务应用' ||
        val === '协作组件' ||
        val === '数据组件' ||
        val === '监控组件' ||
        val === '管理组件'
      ) {
        this.level1 = '应用平台'
      }
      if (
        val === '数据目录' ||
        val === '数据管理' ||
        val === '数据共享' ||
        val === '数据分析' ||
        val === '配置管理'
      ) {
        this.level1 = '数据平台'
      }
      if (
        val === 'API服务中心' ||
        val === '应用开放平台' ||
        val === '开发者中心'
      ) {
        this.level1 = '服务平台'
      }

      if (
        val === '资源管理' ||
        val === '配置管理' ||
        val === '部署管理' ||
        val === '监控中心' ||
        val === '告警中心' ||
        val === '私有云管理'
      ) {
        this.level1 = '运维平台'
      }

      // 赋值当前选择
      this.level2 = val
      // 点击下拉菜单的时候，同步更新表格数据
    },
    // 搜索
    searchData() {},
    // 分页
    handleSizeChange() {},
    // 分页
    handleCurrentChange() {},
    // 清空搜索
    clearSearchData() {},
    formatIcon(icon) {
      return '<i class="el-icon-delete" style="color:red"></i>'
    }
  }
}
</script>

<style scoped>
.roleText {
  position: relative;
  top: 8px;
}
.roleconfig {
  margin-left: -40px;
}
</style>
