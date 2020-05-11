<template>
  <div class="content">
    <!-- 搜索 -->
    <el-form :model="searchUserType" :inline="true">
      <el-form-item label="用户账号：">
        <el-input v-model="userAccount" size="small" placeholder="请输入用户账号"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名：">
        <el-input v-model="userName" size="small" placeholder="请输入用户姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchUserData">查询</el-button>
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="clearSearchData">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" :default-sort="{prop: 'typeCode', order: 'ascending'}" size="small" border style="width: 100%; margin-top: -10px;" @sort-change="sortChange">
      <el-table-column prop="userAccount" label="用户账号" sortable width="150" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户姓名" sortable width="200" header-align="center"></el-table-column>
      <el-table-column prop="gender" label="性别" sortable width="80" align="center"></el-table-column>
      <el-table-column prop="regionalization" label="所属区划" sortable width="180" header-align="center"></el-table-column>
      <el-table-column prop="affiliate" label="所属机构" sortable width="180" header-align="center"></el-table-column>
      <el-table-column prop="lockTime" label="锁定时间" sortable width="150" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
          <el-button slot="reference" :disabled="scope.row.id === 1" type="danger" icon="el-icon-delete" size="mini" @click="deleteItem(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
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
    <!-- 编辑对话框 -->
    <el-dialog :append-to-body="true" :visible="showEditDia" :close-on-click-modal="false" :before-close="cancleDialog" title="编辑用户类型">
      <el-form ref="ruleForm" :model="editForm" :rules="formRules" width="80px" label-position="right" size="small">
        <el-form-item label="用户账号：" label-width="120px" prop="userAccount">
          <el-input v-model="editForm.userAccount" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名：" label-width="120px" prop="userName">
          <el-input v-model="editForm.userName" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="性别：" label-width="120px" prop="gender">
          <el-radio v-model="editForm.gender" label="男" @input="forceWrite($event)">男</el-radio>
          <el-radio v-model="editForm.gender" label="女" @input="forceWrite($event)">女</el-radio>
        </el-form-item>
        <el-form-item label="所属区划：" label-width="120px" prop="regionalization">
          <el-input v-model="editForm.regionalization" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="所属机构：" label-width="120px" prop="affiliate">
          <el-input v-model="editForm.affiliate" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="锁定时间：" label-width="120px" prop="lockTime">
          <el-input v-model="editForm.lockTime" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm()">确 定</el-button>
        <el-button size="small" @click="cancleDialog()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryUserUnlock } from '@/api/usermgr'
export default {
  data() {
    return {
      // 表格数据
      tableData: [
        {
          userAccount: 'FWS',
          userName: '服务提供商',
          gender: '男',
          regionalization: '河北',
          affiliate: '销售',
          lockTime: '2016-11-09'
        },
        {
          userAccount: 'FWS',
          userName: '服务提供商',
          gender: '男',
          regionalization: '河北',
          affiliate: '销售',
          lockTime: '2016-11-09'
        },
        {
          userAccount: 'FWS',
          userName: '服务提供商',
          gender: '男',
          regionalization: '河北',
          affiliate: '销售',
          lockTime: '2016-11-09'
        }
      ],
      // 搜索数据
      searchUserType: {},
      // 搜索--类型编码
      userAccount: '',
      // 搜索--类型名称
      userName: '',
      // 分页--当前页数
      currentPage: 1,
      // 分页--每页显示条目个数
      pageSize: 10,
      // 分页--总条目数
      total: 10,
      loading: true,
      // 编辑弹框数据
      // 编辑弹框是否显示
      showEditDia: false,
      // 编辑表单数据
      editForm: {},
      // 表单验证规则
      formRules: {
        userAccount: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ]
      },
      // 排序字段
      sortName: '',
      // 排序方式
      sort: 'asc'
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
        account: this.userAccount,
        name: this.userName,
        page: this.currentPage,
        rows: this.pageSize,
        sidx: this.sortName,
        sord: this.sort
      }
      const res = await queryUserUnlock(params)
      console.log('查询数据', res)
      const {
        data: { records, page, rows },
        status
      } = res
      if (status === '200') {
        this.loading = false
        this.tableData = rows
        this.total = records
        this.currentPage = page
      }
    },
    // 搜索查询
    searchUserData() {
      this.getTableData()
    },
    // 重置
    clearSearchData() {
      this.userAccount = ''
      this.userName = ''
      this.getTableData()
    },
    // 编辑
    handleEdit(data, index) {
      console.log('222', data)
      this.editForm.userAccount = data.userAccount
      this.editForm.userName = data.userName
      this.editForm.gender = data.gender
      this.editForm.regionalization = data.regionalization
      this.editForm.affiliate = data.affiliate
      this.editForm.lockTime = data.lockTime
      this.editForm.index = index
      this.showEditDia = true
    },
    // 编辑弹框的确定按钮
    submitForm(data) {
      this.showEditDia = false
      this.$set(this.tableData, this.editForm.index, this.editForm)
      // 发送请求
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
    },
    // 编辑弹框的取消按钮
    cancleDialog() {
      this.showEditDia = false
    },
    // 分页pageSize 改变时会触发
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
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
    // 编辑更新
    forceWrite(event) {
      this.$forceUpdate()
    },
    // 删除
    deleteItem(info, index) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功!')

          // const res = await deleteUserTypeById({
          //   id: userType.ID
          // });
          // console.log(res);
          // const { status } = res;
          // if (status === "200") {
          //   // 把页码重置为第一页
          //   this.currentPage = 1;
          //   this.getTableData();
          //   this.$message.success("删除成功!");
          // }
        })
        .catch(() => {
          this.$message.warning('取消删除!')
        })
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
</style>
