<template>
  <div class="content">
    <!-- 搜索开始 -->
    <el-form :model="searchUserInfo" :inline="true">
      <el-form-item label="用户账号：">
        <el-input v-model="userAccount" size="small" placeholder="请输入用户账号"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名：">
        <el-input v-model="userName" size="small" placeholder="请输入用户姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchData">查询</el-button>
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="clearSearchData">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索结束 -->
    <el-row :gutter="24">
      <!-- 左侧树结构组件 -->
      <el-col :span="6">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">行政组织机构树</span>
            <div v-if="isTreeOper" class="oper_icons">
              <span class="el-icon-plus" @click.stop="treeInsertHandle"></span>
              <span class="el-icon-delete tree-delete" @click.stop="treeDeleteHandle"></span>
            </div>
            <div v-else class="oper_icons forbidden_oper">
              <span class="el-icon-plus"></span>
              <span class="el-icon-delete tree-delete"></span>
            </div>
          </div>
          <!-- 树结构数据 -->
          <org-tree @treeSelector="treeSelectorHandle"></org-tree>
        </div>
      </el-col>
      <!-- 右侧表格 -->
      <el-col :span="18">
        <el-table v-loading="loading" ref="multipleTable" :data="UserInfoTableData" :default-sort="{prop: 'typeCode', order: 'ascending'}" size="small" border style="width: 100%; margin-top: -10px;" @selection-change="handleSelectionChange" @sort-change="sortChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="ACCOUNT" label="用户账号" sortable width="120" align="center"></el-table-column>
          <el-table-column prop="NAME" label="用户姓名" sortable width="120"></el-table-column>
          <el-table-column :formatter="formatGender" prop="GENDER" label="性别" sortable width="70" align="center"></el-table-column>
          <el-table-column prop="REGION_NAME" label="所属区划" sortable width="150" align="center"></el-table-column>
          <el-table-column prop="ORG_NAME" label="所属机构" sortable width="140" align="center"></el-table-column>
          <el-table-column :formatter="formatDate" prop="BIRTHDAY" label="出生日期" sortable width="120" align="center"></el-table-column>
          <el-table-column label="操作" width="295" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="warning" icon="el-icon-lock" @click="resetPassword(scope.row)">重置密码</el-button>
              <el-button v-if="scope.row.STATUS==='0'" size="mini" type="success" icon="el-icon-delete" @click="handleDelete(scope.row)">启用</el-button>
              <el-button v-else size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">停用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部 -->
        <el-row :gutter="24">
          <el-col :span="3">
            <i class="el-icon-delete" style="margin:10px;color:red"></i>
            <i class="el-icon-refresh" style="color:green"></i>
          </el-col>
          <el-col :span="21">
            <!-- 分页 -->
            <el-pagination :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" class="content-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 编辑对话框组件 -->
    <edit-user-info v-if="showEditDialog" :show-edit-dialog="showEditDialog" :edit-form="editForm" @closeDialog="closeDialog"></edit-user-info>
  </div>
</template>

<script>
import { queryUserInfo, useUserInfo, resetUserInfoPwd } from '@/api/usermgr'
export default {
  components: {
    orgTree: () => import('../../org/components/orgsTree'),
    EditUserInfo: () => import('./editUserInfo')
  },
  data() {
    return {
      // 表格数据
      UserInfoTableData: [],
      // 表格多选数据
      multipleSelection: [],
      // 搜索数据
      searchUserInfo: {
        user: '那你'
      },
      // 搜索--类型编码
      userAccount: '',
      // 搜索--类型名称
      userName: '',
      // 排序方式
      sort: 'asc',
      // 排序字段
      sortName: 'ACCOUNT',
      // 分页--当前页数
      currentPage: 1,
      // 分页--每页显示条目个数
      pageSize: 10,
      // 分页--总条目数
      total: 10,
      loading: false,
      // 编辑弹框是否显示
      showEditDialog: false,
      // 树是否可编辑
      isTreeOper: true,
      // 点击编辑传给子组件的用户信息
      editForm: {},
      // 是否是添加操作
      isAdd: false,
      // 组织机构类型
      orgType: '',
      // 层级
      level: '',
      // 组织或地区编码
      orgCode: ''
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 查询数据
    async getTableData() {
      this.loading = true
      const params = {
        code: this.orgCode,
        level: this.level,
        page: this.currentPage,
        rows: this.pageSize,
        sidx: this.sortName,
        sord: this.sort,
        type: this.orgType,
        user_account: this.userAccount,
        user_name: this.userName
      }
      const res = await queryUserInfo(params)
      console.log('查询数据', res)
      const {
        data: { records, page, rows },
        status
      } = res
      if (status === '200') {
        this.loading = false
        this.UserInfoTableData = rows
        this.total = records
        this.currentPage = page
      }
    },
    // 搜索查询
    searchData() {
      this.getTableData()
    },
    // 重置
    clearSearchData() {
      this.userAccount = ''
      this.userName = ''
      this.getTableData()
    },
    // 表格多选--当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 编辑按钮
    handleEdit(data) {
      console.log(data)
      this.showEditDialog = true
      this.editForm = data
    },
    // 关闭对话框
    closeDialog() {
      this.showEditDialog = false
    },
    // 停用、启用按钮
    handleDelete(data) {
      console.log(data)
      this.$confirm('是否要停用？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const params = {
            account: this.userAccount,
            id: data.ID,
            status: data.STATUS
          }
          const res = await useUserInfo(params)
          console.log(res)
          const { status } = res
          if (status === '200') {
            // 把页码重置为第一页
            this.currentPage = 1
            this.getTableData()
            this.$message.success('修改成功!')
          }
        })
        .catch(() => {
          this.$message.warning('取消修改!')
        })
    },
    // 重置密码按钮
    resetPassword(data) {
      console.log(data)
      this.$confirm('	是否确定重置密码?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const params = {
            id: data.ID
          }
          const res = await resetUserInfoPwd(params)
          console.log(res)
          const { status } = res
          if (status === '200') {
            // 把页码重置为第一页
            this.currentPage = 1
            this.getTableData()
            this.$message.success('操作成功!')
          }
        })
        .catch(() => {
          this.$message.warning('取消操作!')
        })
    },
    // 排序数量改变时触发·
    handleSortChange() {},

    // 分页pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getTableData()
    },
    // 分页currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getTableData()
    },
    treeSelectorHandle() {},
    // 行政组织树添加按钮
    treeInsertHandle() {
      this.isAdd = true
      this.showEditDialog = true
    },
    // 行政组织树删除按钮
    treeDeleteHandle() {},
    // 表格格式化日期
    formatGender(row, column, cellValue, index) {
      let gender = '男'
      if (row.GENDER === '0') {
        gender = '男'
      } else {
        gender = '女'
      }
      return gender
    },
    // 表格格式化日期
    formatDate(row, column, cellValue, index) {
      const dateStr = new Date(cellValue).getTime() // 数字类型时间戳
      const year = new Date(dateStr).getFullYear() + '-'
      let month = new Date(dateStr).getMonth() + '-'
      let day = new Date(dateStr).getDate()
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
      return year + month + day
    },
    // 表头排序变化时触发
    sortChange(column, prop, order) {
      console.log(column)
      if (column.order === '"ascending"') {
        this.sort = 'asc'
      } else {
        this.sort = 'desc'
      }
      this.sortName = column.property
      this.getTableData()
    }
  }
}
</script>

<style scoped>
.content {
  margin: 10px 20px 30px;
}
.content-pagination {
  margin: 10px;
}
.safeLogTableCol .cell {
  color: #008000;
}
.org_tree {
  margin-top: -20px;
}
.org_tree,
.table_wrap {
  padding: 10px;
}
.org_tree .tree_title {
  font-size: 14px;
  line-height: 18px;
  font-weight: bold;
  border-left: 4px solid #f35958;
  margin: 10px;
  padding-left: 10px;
}
.province_info {
  min-height: 23px;
}
.tree_header {
  padding: 10px;
  background: lightblue;
  position: relative;
}
.tree_title {
  padding-left: 10px;
  font-size: 14px;
  font-weight: bold;
  border-left: 4px solid #f35958;
}
.oper_icons {
  position: absolute;
  top: 0;
  right: 0;
  padding: 7px;
}
.el-icon-plus,
.el-icon-delete.tree-delete {
  padding: 3px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
.el-icon-plus {
  background: green;
}
.el-icon-delete.tree-delete {
  background: #f35958;
}
.color_red {
  color: red;
}
.tip_info {
  font-size: 12px;
  margin: 0 30px;
}
</style>
