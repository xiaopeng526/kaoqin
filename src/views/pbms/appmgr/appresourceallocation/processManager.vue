<template>
  <div class="content">
    <!-- 搜索开始 -->
    <el-form :model="searchIcon" :inline="true">
      <el-form-item label="流程名称：">
        <el-input v-model="processName" size="small" placeholder="请输入流程名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchData">查询</el-button>
        <el-button type="warning" size="mini" icon="el-icon-refresh" @click="clearSearchData">重置</el-button>
        <el-button type="success" size="mini" icon="el-icon-plus" @click="addData">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" ref="multipleTable" :data="tableData" :default-sort="{ prop: 'typeCode', order: 'ascending' }" size="small" border style="width: 100%; margin-top: -10px;" @select="handleSelectChange" @sort-change="sortChange">
      <el-table-column type="selection" width="40" header-align="center"></el-table-column>
      <el-table-column prop="icon" label="流程编码" sortable width="120" align="center"></el-table-column>
      <el-table-column prop="name" label="流程名称" sortable width="300" header-align="center"></el-table-column>
      <el-table-column prop="style" label="创建时间" sortable width="200" align="center"></el-table-column>
      <el-table-column label="操作" width="250" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
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
    <el-dialog :append-to-body="true" :visible="showEditDialog" :close-on-click-modal="false" :before-close="cancleDialog" :title="isAdd ? '添加简易流程' : '编辑流程'" width="70%">
      <el-form ref="editForm" :model="editForm" :rules="formRules" width="80px" label-position="right" size="small">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="流程编码：" label-width="100px" prop="name">
              <el-input v-model="editForm.name" autocomplete="off" style="width:150px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程名称：" label-width="100px" prop="style">
              <el-input v-model="editForm.type" autocomplete="off" style="width:150px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型：" label-width="100px" prop="style">
              <el-input v-model="editForm.type" autocomplete="off" style="width:150px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="success" size="small" @click="addProcess">新增</el-button>
      <div style="margin-top:20px"></div>
      <!-- 表格 -->
      <el-table v-loading="loading" :data="processTableData" :default-sort="{ prop: 'CODE', order: 'ascending' }" size="small" border style="width: 100%; margin-top: -10px;" @sort-change="sortChange">
        <el-table-column type="index" prop="type" label="序号" sortable width="80" align="center"></el-table-column>
        <el-table-column prop="code" label="环节名称" sortable width="150" header-align="center">
          <template slot-scope="scope">
            <el-input v-model="processName" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="环节类型" sortable width="100" header-align="center">
          <template slot-scope="scope">
            <span>普通环节</span>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="参与者类型" sortable width="130" header-align="center">
          <template slot-scope="scope">
            <el-select v-model="participantType" placeholder="请选择" size="small">
              <el-option v-for="item in participantTypeOptions" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="classify" label="参与者（双击选择）" sortable width="180" header-align="center">
          <template slot-scope="scope">
            <el-input v-model="processName" size="small" @focus="selectParticipant"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="accessType" label="环节时限（工作日）" sortable width="180" header-align="center">
          <template slot-scope="scope">
            <el-input v-model="processName" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteProcess(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" @click="cancleDialog()">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 选择参与者对话框 -->
    <el-dialog :append-to-body="true" :visible="showTreeDialog" :close-on-click-modal="false" :before-close="cancleTreeDialog" title="选择用户" width="30%">
      <el-tree ref="treeData" :data="treeData" :props="defaultProps" show-checkbox @check="handleNodeClick"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmTreeDialog">确 定</el-button>
        <el-button size="small" @click="cancleTreeDialog()">取 消</el-button>
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
          name: 'fa  fa-ambulance',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 2,
          name: 'fa  fa-sort',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 3,
          name: 'fa fa-adjust',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 4,
          name: 'fa fa-adn',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 5,
          name: 'fa fa-align-center',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 6,
          name: 'fa fa-align-justify',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 7,
          name: 'fa fa-align-left',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        }
      ],
      // 表格多选数据
      multipleSelection: [],
      // 搜索数据
      searchIcon: {},
      // 搜索--流程名称
      processName: '',
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
        name: [{ required: true, message: '请输入图标名称', trigger: 'blur' }],
        style: [{ required: true, message: '请输入图标样式', trigger: 'blur' }]
      },
      // 是否是添加操作
      isAdd: false,
      // 排序字段
      sortName: '',
      // 排序方式
      sort: 'asc',
      // 选择角色对话框是否显示
      showSelectDialog: false,
      processTableData: [],
      // 环节名称
      processNameDia: '',
      participantType: '用户',
      participantTypeOptions: ['用户', '岗位', '角色'],
      // 选择参与者
      treeData: [
        {
          label: '国税局',
          children: []
        },
        {
          label: '气象局',
          children: [
            {
              label: '张吉杰',
              children: []
            },
            {
              label: '王海平',
              children: []
            },
            {
              label: '韩庆超',
              children: []
            },
            {
              label: '张吉杰',
              children: []
            },
            {
              label: '张吉杰',
              children: []
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      showTreeDialog: false
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
      this.iconName = ''
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
      this.editForm.name = ''
      this.editForm.style = 'bigger100'
      this.editForm.type = 'MATERIAL-DESIGN'
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
      return '<i class="el-icon-delete" style="color:red"></i>'
    },
    // 删除流程
    deleteProcess() {},
    // 新增流程
    addProcess() {
      this.processTableData.push({})
    },
    // 选择参与者
    selectParticipant() {
      this.showTreeDialog = true
    },
    // 树组件
    handleNodeClick(data, checked) {
      console.log(data)
      console.log(checked)
      this.$refs.treeData.getCheckedNodes(false, false)
      console.log('选择的是', this.$refs.treeData.getCheckedNodes(false, false))
    },
    confirmTreeDialog() {
      this.showTreeDialog = false
    },
    cancleTreeDialog() {
      this.showTreeDialog = false
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
