<template>
  <div class="content">
    <!-- 搜索开始 -->
    <el-form :model="searchIcon" :inline="true">
      <el-form-item label="图标名称：">
        <el-input v-model="iconName" size="small" placeholder="请输入图标名称"></el-input>
      </el-form-item>
      <el-form-item label="图标分类：">
        <el-select v-model="iconClassify" placeholder="请选择" size="small">
          <el-option v-for="item in iconClassifyOption" :key="item" :label="item" :value="item"></el-option>
        </el-select>
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
      <el-table-column prop="icon" label="图标" sortable width="120" align="center">
        <template slot-scope="scope">
          <span v-html="formatIcon(scope.row.icon)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="图标名称" sortable width="300" header-align="center"></el-table-column>
      <el-table-column prop="style" label="样式" sortable width="200" align="center"></el-table-column>
      <el-table-column prop="type" label="图标类型" sortable width="180" align="center"></el-table-column>
      <el-table-column label="操作" width="250" align="center" fixed="right">
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
    <el-dialog :append-to-body="true" :visible="showEditDialog" :close-on-click-modal="false" :before-close="cancleDialog" :title="isAdd ? '添加图标信息' : '编辑图标信息'" width="60%">
      <el-form ref="editForm" :model="editForm" :rules="formRules" width="80px" label-position="right" size="small">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="图标名称：" label-width="120px" prop="name">
              <el-input v-model="editForm.name" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标样式：" label-width="120px" prop="style">
              <el-input v-model="editForm.style" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="图标类型：" label-width="120px" prop="type">
              <el-select v-model="editForm.type" placeholder="请选择" size="small">
                <el-option v-for="item in iconType" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标值：" label-width="120px" prop="number">
              <el-input v-model="editForm.number" autocomplete="off" placeholder="请输入MATERIAL-DESIGN图标值" style="width:250px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 如果是添加操作 -->
        <el-row v-if="isAdd" :gutter="24">
          <el-col :span="12">
            <el-form-item label="所属类别：" label-width="120px" prop="iconClassify">
              <el-select v-model="editForm.iconClassify" placeholder="请选择" size="small">
                <el-option v-for="item in iconClassifyOption" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序：" label-width="120px" prop="sort">
              <el-input-number :min="1" v-model="editForm.sort" controls-position="right" size="small"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 如果是编辑操作 -->
        <el-form-item label="备注信息：" label-width="120px">
          <el-input :rows="2" v-model="editForm.tip" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-row v-if="!isAdd" :gutter="24">
          <el-col :span="12">
            <el-form-item label="排序：" label-width="120px">
              <el-input-number :min="1" v-model="editForm.sort" controls-position="right" size="small"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态：" label-width="120px">
              <el-switch v-model="editForm.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
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
      // 搜索--图标名称
      iconName: '',
      // 搜索--图标分类
      iconClassify: '常用图标',
      iconClassifyOption: [
        '常用图标',
        'Web图标',
        '文件图标',
        '旋转图标',
        '表单图标',
        '支付图标',
        '图表图标',
        '货币图标',
        '方向图标',
        '媒体图标',
        '标志图标',
        '医疗图标'
      ],
      iconType: ['BOOTSTRAP', 'MATERIAL-DESIGN', 'ECGAP3.5'],
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
      this.iconName = ''
      this.iconClassify = ''
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
      this.editForm.iconClassify = '常用图标'
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
