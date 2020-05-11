<template>
  <div class="content">
    <p class="content-tip">
      <i class="el-icon-s-flag"></i>
      请选中列表中的应用角色，并双击"勾选"应用菜单资源，拥有多重角色的用户取应用资源菜单的并集(不包含重复集合)。
      <span class="tip-right">{{ tableCol }}</span>
    </p>
    <el-row :gutter="24">
      <el-col :span="18">
        <!-- 左侧表格 -->
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :default-sort="{ prop: 'name', order: 'ascending' }" size="small" border style="width: 100%; margin-top: -10px;" @sort-change="sortChange" @row-dblclick="dblclickTable">
          <el-table-column prop="name" label="角色名称" sortable align="center"></el-table-column>
          <el-table-column prop="value" label="角色权值" sortable align="center"></el-table-column>
          <el-table-column prop="data" label="角色权重" sortable align="center"></el-table-column>
        </el-table>
        <!-- 底部 -->
        <el-row :gutter="24">
          <el-col :span="3">
            <i class="el-icon-refresh" style="margin:10px;color:green"></i>
          </el-col>
          <el-col :span="21">
            <!-- 分页 -->
            <el-pagination :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" class="content-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
          </el-col>
        </el-row>
      </el-col>
      <!-- 右侧树结构组件 -->
      <el-col :span="6">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">资源列表</span>
            <span class="tree-save">
              <i class="el-icon-document"></i>
              保存</span>
          </div>
          <!-- 树结构数据 -->
          <org-tree @treeSelector="treeSelectorHandle"></org-tree>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { queryUserInfo } from '@/api/usermgr'
export default {
  components: {
    orgTree: () => import('../../org/components/orgsTree.vue')
  },
  data() {
    return {
      // 表格数据
      tableData: [
        {
          name: '区划管理员',
          value: 'ROLE_AREA',
          data: '4'
        },
        {
          name: '业务人员',
          value: 'ROLE_BUSINESS',
          data: '6'
        },
        {
          name: '部门管理员',
          value: 'ROLE_ORGAN',
          data: '5'
        },
        {
          name: '系统管理员',
          value: 'ROLE_SYSTEM',
          data: '3'
        },
        {
          name: '普通用户',
          value: 'ROLE_USER',
          data: '65535'
        }
      ],
      // 排序方式
      sort: 'asc',
      // 排序字段
      sortName: '',
      // 分页--当前页数
      currentPage: 1,
      // 分页--每页显示条目个数
      pageSize: 10,
      // 分页--总条目数
      total: 10,
      loading: false,
      // 树是否可编辑
      isTreeOper: true,
      // 组织机构类型
      orgType: '',
      // 层级
      level: '',
      // 组织或地区编码
      orgCode: '',
      tableCol: ''
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 查询数据
    async getTableData() {
      // this.loading = true
      // const params = {
      //   code: this.orgCode,
      //   level: this.level,
      //   page: this.currentPage,
      //   rows: this.pageSize,
      //   sidx: this.sortName,
      //   sord: this.sort,
      //   type: this.orgType,
      //   user_account: this.resourceName
      // }
      // const res = await queryUserInfo(params)
      // console.log('查询数据', res)
      // const {
      //   data: { records, page, rows },
      //   status
      // } = res
      // if (status === '200') {
      //   this.loading = false
      //   this.tableData = rows
      //   this.total = records
      //   this.currentPage = page
      // }
    },
    // 分页pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getTableData()
    },
    // 分页currentPage 改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableData()
    },
    treeSelectorHandle() {},
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
    },
    // 表格双击行时触发
    dblclickTable(row, column, event) {
      console.log(row)
      console.log(column)
      console.log(event)
      this.tableCol = row.name
    }
  }
}
</script>

<style scoped>
.content {
  margin: 10px 20px 30px;
}
.content-tip {
  height: 40px;
  line-height: 40px;
  margin-bottom: 22px;
  margin-top: -13px;
  padding: 0 0 0 10px;
  background: #d9edf7;
}
.content-pagination {
  margin: 10px;
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
.tree-save {
  display: inline-block;
  width: 55px;
  padding: 3px;
  position: relative;
  left: 30px;
  color: #ffffff;
  background-color: #f9ba46;
}
.tip_info {
  font-size: 12px;
  margin: 0 30px;
}
.tip-right {
  margin-left: 115px;
  color: red;
  font-weight: bold;
}
</style>
