<template>
  <div class="content">
    <!-- 搜索开始 -->
    <el-form :model="searchAppGroup" :inline="true">
      <el-form-item label="应用组名称：">
        <el-input v-model="groupName" size="small" placeholder="请输入应用组名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchData">查询</el-button>
        <el-button type="warning" size="mini" icon="el-icon-refresh" @click="clearSearchData">重置</el-button>
        <el-button type="success" size="mini" icon="el-icon-plus" @click="addData">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" ref="multipleTable" :data="tableData" :default-sort="{prop: 'typeCode', order: 'ascending'}" size="small" border style="width: 100%; margin-top: -10px;" @select="handleSelectChange" @sort-change="sortChange">
      <el-table-column type="selection" width="40" header-align="center"></el-table-column>
      <el-table-column prop="icon" label="应用组图标" sortable width="150" align="center">
        <template slot-scope="scope">
          <span v-html="formatIcon(scope.row.icon)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="应用组名称" sortable width="300" header-align="center"></el-table-column>
      <el-table-column prop="sort" label="系统排序" sortable width="150" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable width="180" align="center"></el-table-column>
      <el-table-column label="操作" width="295" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)">删除</el-button>
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
    <!-- 编辑对话框 -->
    <el-dialog :append-to-body="true" :visible="showEditDialog" :close-on-click-modal="false" :before-close="cancleDialog" :title="isAdd ? '添加应用组' : '编辑应用组'">
      <el-form ref="editForm" :model="editForm" :rules="formRules" width="80px" label-position="right" size="small">
        <el-form-item label="应用组图标：" label-width="120px" prop="icon">
          <el-input v-model="editForm.icon" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="应用组名称：" label-width="120px" prop="name">
          <el-input v-model="editForm.name" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="系统排序：" label-width="120px">
          <el-input-number :min="1" v-model="editForm.sort" controls-position="right" size="small"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" @click="cancleDialog()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表格数据
      tableData: [
        {
          sort: 1,
          name: '不动产',
          createTime: '2019-10-11'
        },
        {
          sort: 2,
          name: '羿平',
          createTime: '2017-10-18'
        },
        {
          sort: 3,
          name: '羿国伟',
          createTime: '2018-10-02'
        },
        {
          sort: 4,
          name: '覃韦芳',
          createTime: '2019-08-06'
        },
        {
          sort: 5,
          name: '褚各庄村',
          createTime: '2017-10-20'
        },
        {
          sort: 6,
          name: '芮屯村',
          createTime: '2017-10-20'
        },
        {
          sort: 7,
          name: '邳会楠',
          createTime: '2018-05-02'
        }
      ],
      // 表格多选数据
      multipleSelection: [],
      // 搜索数据
      searchAppGroup: {},
      // 搜索--应用组名称
      groupName: '',
      // 分页--当前页数
      currentPage: 1,
      // 分页--每页显示条目个数
      pageSize: 10,
      // 分页--总条目数
      total: 10,
      loading: false,
      // 编辑弹框是否显示
      showEditDialog: false,
      // 点击编辑传给子组件的用户信息
      editForm: {},
      // 表单验证规则
      formRules: {
        name: [{ required: true, message: '请输入应用组名称', trigger: 'blur' }]
      },
      // 是否是添加操作
      isAdd: false,
      // 排序字段
      sortName: '',
      // 排序方式
      sort: 'asc'
    }
  },
  mounted() {
    this.total = this.tableData.length
  },
  methods: {
    // 搜索查询
    searchData() {
      // 发请求
    },
    // 重置
    clearSearchData() {
      this.groupName = ''
    },
    // 表格多选--当用户手动勾选数据行的 Checkbox 时触发的事件
    /**
     * selection 当前选中的行数据，[{}]
     * row 当前选中的行数据， {}
     */
    handleSelectChange(selection, row) {
      console.log(selection)
      console.log(row)
      this.multipleSelection = row
    },
    // 编辑按钮
    handleEdit(data) {
      console.log(data)
      this.showEditDialog = true
      this.editForm = data
      this.isAdd = false
    },
    // 删除按钮
    handleDelete(data, index) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // const res = await deleteUserTypeById({
          //   id: userType.ID
          // });
          // console.log(res);
          // const { status } = res;
          // if (status === "200") {
          //   // 把页码重置为第一页
          //   this.currentPage = 1;
          //   this.getTableData();
          this.tableData.splice(index, 1)
          this.$message.success('删除成功!')
          // }
        })
        .catch(() => {
          this.$message.warning('取消删除!')
        })
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
    },
    // 分页pageSize 改变时会触发
    handleSizeChange(val) {
      console.log(val)
    },
    // 分页currentPage 改变时会触发
    handleCurrentChange(currentChange) {
      // currentChange当前页
      console.log(currentChange)
    },
    // 添加按钮
    addData() {
      this.isAdd = true
      this.showEditDialog = true
      this.editForm.icon = ''
      this.editForm.name = ''
      this.editForm.sort = 1
    },
    // 编辑弹框的取消按钮
    cancleDialog() {
      this.showEditDialog = false
    },
    // 编辑或添加弹框的确定按钮
    submitForm() {
      this.showEditDialog = false
      if (this.isAdd) {
        this.editForm.createTime = '2019-12-31'
        this.tableData.unshift({
          sort: this.editForm.sort,
          name: this.editForm.name,
          createTime: this.editForm.createTime
        })
      }
    },
    forceWrite(e) {
      this.$forceUpdate()
    },
    formatIcon(icon) {
      return '<i class="el-icon-edit"></i>'
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
