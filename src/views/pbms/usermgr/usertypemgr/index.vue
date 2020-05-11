<template>
  <div class="content">
    <!-- 搜索 -->
    <el-form :model="searchUserType" :inline="true">
      <el-form-item label="类型编码：">
        <el-input v-model="typeCode" size="small" placeholder="请输入类型编码"></el-input>
      </el-form-item>
      <el-form-item label="类型名称：">
        <el-input v-model="typeName" size="small" placeholder="请输入类型名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchUserTypeData">查询</el-button>
        <el-button type="warning" size="mini" icon="el-icon-refresh" @click="clearSearchData">重置</el-button>
        <el-button type="success" size="mini" icon="el-icon-plus" @click="addData">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" :default-sort="{prop: 'CODE', order: 'ascending'}" size="small" border style="width: 100%; margin-top: -10px;" @sort-change="sortChange">
      <el-table-column prop="CODE" label="类型编码" sortable width="180" align="center"></el-table-column>
      <el-table-column prop="NAME" label="类型名称" sortable width="240" header-align="center"></el-table-column>
      <el-table-column prop="REMARK" label="类型描述" sortable width="350" header-align="center"></el-table-column>
      <el-table-column :formatter="formatDate" prop="CREATE_TIME" label="发布时间" sortable width="150" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="deleteType(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" class="content-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    <!-- 编辑对话框 -->
    <el-dialog :append-to-body="true" :visible="showDialog" :close-on-click-modal="false" :before-close="cancleDialog" :title="isAdd ? '添加用户类型' : '编辑用户类型'">
      <el-form ref="editForm" :model="editForm" :rules="formRules" width="80px" label-position="right" size="small">
        <el-form-item label="类型编码：" label-width="120px" prop="code">
          <el-input v-model="editForm.code" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="类型名称：" label-width="120px" prop="name">
          <el-input v-model="editForm.name" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input-number :min="1" v-model="editForm.sortOrder" controls-position="right" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="类型描述：" label-width="120px" prop="remark">
          <el-input :rows="4" v-model="editForm.remark" type="textarea" placeholder="请输入内容" @input="forceWrite($event)"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancleDialog()">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryUserType,
  queryUserTypeById,
  addUserType,
  deleteUserTypeById,
  updateUserType,
  checkUserType
} from '@/api/usermgr'
export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      // 搜索数据
      searchUserType: {},
      // 搜索--类型编码
      typeCode: '',
      // 搜索--类型名称
      typeName: '',
      // 排序方式
      sort: 'asc',
      // 排序字段
      sortName: 'CODE',
      // 分页--当前页数
      currentPage: 1,
      // 分页--每页显示条目个数
      pageSize: 10,
      // 分页--总条目数
      total: 10,
      loading: true,
      // 编辑弹框是否显示
      showDialog: false,
      // 编辑表单数据
      editForm: {},
      // 表单验证规则
      formRules: {
        code: [{ required: true, message: '请输入类型编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
      },
      // 是否是添加对话框 true：添加操作，false：编辑操作
      isAdd: false
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
        code: this.typeCode,
        name: this.typeName,
        page: this.currentPage,
        rows: this.pageSize,
        sidx: this.sortName,
        sord: this.sort
      }
      const res = await queryUserType(params)
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
    searchUserTypeData() {
      this.getTableData()
    },
    // 重置
    clearSearchData() {
      this.typeCode = ''
      this.typeName = ''
      this.getTableData()
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
    // 点击编辑
    async handleEdit(userType) {
      this.isAdd = false
      this.showDialog = true
      const res = await queryUserTypeById({
        id: userType.ID
      })

      console.log('编辑', res)
      const { data, status } = res
      if (status === '200') {
        this.editForm = data
      }
    },
    // 点击删除
    deleteType(userType) {
      console.log(userType)
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await deleteUserTypeById({
            id: userType.ID
          })
          console.log(res)
          const { status } = res
          if (status === '200') {
            // 把页码重置为第一页
            this.currentPage = 1
            this.getTableData()
            this.$message.success('删除成功!')
          }
        })
        .catch(() => {
          this.$message.warning('取消删除!')
        })
    },
    // 编辑或添加弹框的确定按钮
    async submitForm(data) {
      // 如果是编辑操作
      if (!this.isAdd) {
        // 更新接口
        const res = await updateUserType(
          {
            sortOrder: this.editForm.sortOrder
          },
          this.editForm
        )
        console.log('更新', res)

        this.showDialog = false
        this.getTableData()
      } else {
        // 查重接口
        const checkRes = await checkUserType({
          param: this.editForm.code
        })
        console.log('查重', checkRes)
        const { data, status } = checkRes
        if (status === '200') {
          if (data.status !== 'y') {
            this.$message.warning('类型编码重复')
          } else {
            // 添加接口
            const res = await addUserType(
              {
                sortOrder: this.editForm.sortOrder
              },
              this.editForm
            )
            console.log('添加', res)
            const { status } = res
            if (status === '200') {
              this.showDialog = false
              this.getTableData()
              this.$message.success('添加成功!')
            }
          }
        }
      }
    },
    // 编辑弹框的取消按钮
    cancleDialog() {
      this.showDialog = false
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
    // 用户编码改变
    forceWrite(event) {
      this.$forceUpdate()
    },
    // 点击添加
    addData() {
      this.showDialog = true
      this.isAdd = true
      this.editForm.code = ''
      this.editForm.name = ''
      this.editForm.sortOrder = 1
      this.editForm.remark = ''
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
</style>
