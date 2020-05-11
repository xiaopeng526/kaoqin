<template>
  <div class="content">
    <!-- 搜索开始 -->
    <el-form :model="searchDictionaries" :inline="true">
      <el-row :gutter="24">
        <el-col :span="8" style="position:relative;left:27px">
          <el-form-item label="字典编码：">
            <el-input v-model="dictionaryCode" size="small" placeholder="请输入字典编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="字典名称：">
            <el-input v-model="dictionaryName" size="small" placeholder="请输入字典名称："></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" style="position:relative;top:-20px">
        <el-col :span="8">
          <el-form-item label="父级字典名称：">
            <el-input v-model="parentDictionaryName" size="small" placeholder="请输入字典名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="字典属性：">
            <el-select v-model="dictionaryAttributes" placeholder="请选择" size="small" style="width:185px">
              <el-option v-for="item in dictionaryAttributesOption" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="searchData">查询</el-button>
            <el-button type="warning" size="mini" icon="el-icon-refresh" @click="clearSearchData">重置</el-button>
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addData">添加</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 搜索结束 -->
    <el-row :gutter="24" style="position:relative;top:-20px">
      <!-- 左侧树结构组件 -->
      <el-col :span="6">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">数据字典类型树</span>
            <div v-if="isTreeOper" class="oper_icons">
              <span class="el-icon-plus" @click.stop="treeInsertHandle"></span>
              <span class="el-icon-edit" @click.stop="treeEditHandle"></span>
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
      <el-col :span="18">
        <!-- 右侧表格 -->
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :default-sort="{prop: 'CODE', order: 'ascending'}" size="small" border style="width: 100%; margin-top: -10px;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="CODE" label="字典编码" sortable width="100" align="center"></el-table-column>
          <el-table-column prop="NAME" label="字典名称" sortable width="120" align="center"></el-table-column>
          <el-table-column prop="LEIXING" label="字典类型" sortable width="120" align="center"></el-table-column>
          <el-table-column prop="typeCode" label="字典类型编码" sortable width="150" align="center"></el-table-column>
          <el-table-column prop="attribute" label="字典属性" sortable width="120" align="center"></el-table-column>
          <el-table-column prop="PARENT_NAME" label="父级字典" sortable width="120" align="center"></el-table-column>
          <el-table-column prop="CREATE_TIME" label="创建时间" sortable width="120" align="center"></el-table-column>
          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row,$scope,index)">编辑</el-button>
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
    <!-- 编辑对话框 -->
    <el-dialog :append-to-body="true" :visible="showEditDialog" :close-on-click-modal="false" :before-close="cancleDialog" :title="isAdd ? '添加字典' : '编辑字典'">
      <el-form ref="editForm" :model="editForm" :rules="formRules" width="80px" label-position="right" size="small">
        <el-form-item label="字典类型：" label-width="120px" prop="type">
          <el-input v-model="editForm.type" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="字典编码：" label-width="120px" prop="code">
          <el-input v-model="editForm.code" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="字典名称：" label-width="120px" prop="name">
          <el-input v-model="editForm.name" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="父级字典：" label-width="120px" prop="parent">
          <el-input v-model="editForm.parent" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
          <el-button class="el-icon-folder-opened" @click="selectParentDictionary"></el-button>
        </el-form-item>
        <el-form-item label="字典描述：" label-width="120px" prop="description">
          <el-input :rows="2" v-model="editForm.description" type="textarea" placeholder="请输入内容" @input="forceWrite($event)"></el-input>
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
    <!-- 左侧树结构编辑或添加对话框 -->
    <el-dialog :append-to-body="true" :visible="showTreeDialog" :close-on-click-modal="false" :before-close="cancleTreeDialog" :title="isTreeAdd ? '添加字典类型' : '编辑字典类型'" width="50%">
      <el-form ref="editForm" :model="treeForm" :rules="treeFormRules" width="80px" label-position="right" size="small">
        <el-form-item label="字典类型编码：" label-width="120px" prop="type">
          <el-input v-model="treeForm.type" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="字典类型名称：" label-width="120px" prop="code">
          <el-input v-model="treeForm.code" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="字典属性：" label-width="120px" prop="name">
          <el-input v-model="treeForm.name" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="系统排序：" label-width="120px">
          <el-input-number :min="1" v-model="treeForm.sort" controls-position="right" size="small"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="treeSubmitForm">确 定</el-button>
        <el-button size="small" @click="cancleTreeDialog()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { queryDataDictionary } from '@/api/paramset'
export default {
  components: {
    orgTree: () => import('../../org/components/orgsTree.vue')
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 表格多选数据
      multipleSelection: [],
      // 搜索数据
      searchDictionaries: {},
      // 搜索--字典编码
      dictionaryCode: '',
      // 搜索--字典名称
      dictionaryName: '',
      // 搜索--父级字典名称
      parentDictionaryName: '',
      // 搜索--字典属性
      dictionaryAttributes: '',
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
      // 表单验证规则
      formRules: {
        type: [{ required: true, message: '请输入字典类型', trigger: 'blur' }],
        code: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }]
      },
      // 是否是添加操作
      isAdd: false,
      // 是否是树结构数据添加
      isTreeAdd: false,
      // 是否显示树结构表单
      showTreeDialog: false,
      // 树结构数据表单
      treeForm: {},
      treeFormRules: {
        type: [{ required: true, message: '请输入字典类型', trigger: 'blur' }]
      },
      // 搜索字典属性
      dictionaryAttributesOption: [
        '国家标准字典',
        '地方标准字典',
        '行业标准字典',
        '自定义字典'
      ],
      // 排序字段
      sortName: '',
      // 排序方式
      sort: 'asc',
      // 树节点
      kind: ''
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
        code: this.dictionaryCode,
        kind: this.kind,
        name: this.dictionaryName,
        parent_name: this.parentDictionaryName,
        page: this.currentPage,
        rows: this.pageSize,
        sidx: this.sortName,
        sord: this.sort,
        type: this.dictionaryAttributes
      }
      const res = await queryDataDictionary(params)
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
    searchData() {
      this.getTableData()
    },
    // 重置
    clearSearchData() {
      this.dictionaryCode = ''
      this.dictionaryName = ''
      this.parentDictionaryName = ''
      this.dictionaryAttributes = ''
      this.getTableData()
    },
    // 表格多选--当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 表格编辑按钮
    handleEdit(data, index) {
      // 设置复选框选中
      // 清空所有选中项
      this.$refs.multipleTable.clearSelection()
      // 设置当前行选中
      this.$refs.multipleTable.toggleRowSelection(data, true)
      console.log(data)
      setTimeout(() => {
        this.showEditDialog = true
        this.isAdd = false
        this.editForm = data
      }, 500)
    },
    // 弹框的取消按钮
    cancleDialog() {
      this.showEditDialog = false
    },
    // 停用按钮
    handleDelete(data) {},
    // 重置密码按钮
    resetPassword(data) {},
    // 排序数量改变时触发·
    handleSortChange() {},
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
    treeSelectorHandle() {},
    // 数据字典类型树--添加按钮
    treeInsertHandle() {
      // 判断是否是树结构数据的添加操作
      this.isTreeAdd = true
      this.showTreeDialog = true
    },
    // 数据字典类型树--编辑按钮
    treeEditHandle() {
      this.showTreeDialog = true
    },
    // 数据字典类型树--删除按钮
    treeDeleteHandle() {
      this.$confirm('是否要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功!')
        })
        .catch(() => {
          this.$message.warning('取消删除!')
        })
    },
    // 表格--添加按钮
    addData() {
      this.isAdd = true
      this.showEditDialog = true
      this.editForm.type = ''
      this.editForm.code = ''
      this.editForm.name = ''
      this.editForm.parent = ''
      this.editForm.description = ''
      this.editForm.sort = 1
    },
    // 表格--编辑或添加弹框的确定按钮
    submitForm() {
      this.showEditDialog = false
      if (this.isAdd) {
        this.editForm.createTime = '2019-12-31'
        this.tableData.unshift({
          code: this.editForm.code,
          name: this.editForm.name,
          type: this.editForm.type,
          typeCode: this.editForm.typeCode,
          attribute: this.editForm.attribute,
          sort: this.editForm.sort,
          createTime: this.editForm.createTime,
          description: this.editForm.description
        })
      }
    },
    forceWrite(e) {
      this.$forceUpdate()
    },
    // 选择父级字典
    selectParentDictionary() {},
    // 树结构数据提交表单
    treeSubmitForm() {
      this.showTreeDialog = false
    },
    // 树结构数据表单取消
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
.el-icon-edit,
.el-icon-delete.tree-delete {
  padding: 3px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
.el-icon-plus {
  background: green;
}
.el-icon-edit {
  background: blue;
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
