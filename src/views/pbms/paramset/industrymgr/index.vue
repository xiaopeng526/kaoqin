<template>
  <div class="content">
    <!-- 搜索开始 -->
    <el-form :model="searchResource" :inline="true">
      <el-form-item label="资源名称：">
        <el-input v-model="resourceName" size="small" placeholder="请输入资源名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchData">查询</el-button>
        <el-button type="warning" size="mini" icon="el-icon-refresh" @click="clearSearchData">重置</el-button>
        <el-button type="success" size="mini" icon="el-icon-plus" @click="addData">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索结束 -->
    <el-row :gutter="24">
      <!-- 左侧树结构组件 -->
      <el-col :span="6">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">数据资源</span>
            <div v-if="isTreeOper" class="oper_icons">
              <el-select v-model="resourceClassify" placeholder="请选择" class="resourceClassify" size="small">
                <el-option v-for="item in resourceClassifyOption" :key="item" :label="item" :value="item"></el-option>
              </el-select>
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
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :default-sort="{prop: 'typeCode', order: 'ascending'}" size="small" border style="width: 100%; margin-top: -10px;" @selection-change="handleSelectionChange" @sort-change="sortChange">
          <el-table-column prop="name" label="资源名称" sortable width="220" align="center"></el-table-column>
          <el-table-column prop="type" label="资源类型" sortable width="250" header-align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable width="180" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部 -->
        <el-row :gutter="24">
          <el-col :span="3">
            <i class="el-icon-search" style="margin:10px;color:red"></i>
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
    <el-dialog :append-to-body="true" :visible="showEditDialog" :close-on-click-modal="false" :before-close="cancleDialog" :title="isAdd ? '添加资源' : '编辑资源'">
      <el-form ref="editForm" :model="editForm" :rules="formRules" width="80px" label-position="right" size="small">
        <el-form-item label="资源名称：" label-width="120px" prop="name">
          <el-input v-model="editForm.name" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="资源编码：" label-width="120px" prop="code">
          <el-input v-model="editForm.code" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="资源类型：" label-width="120px" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择" class="resourceClassify" size="small" style="width:250px;margin-left:-3px">
            <el-option v-for="item in resourceClassifyOption" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级资源：" label-width="120px" prop="parent">
          <el-input v-model="editForm.parent" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
          <el-button size="small" class="el-icon-folder-opened"></el-button>
        </el-form-item>
        <el-form-item label="备注：" label-width="120px" prop="tip">
          <el-input :rows="2" v-model="editForm.tip" type="textarea" placeholder="请输入内容" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
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
  components: {
    orgTree: () => import('../../org/components/orgsTree')
  },
  data() {
    return {
      // 表格数据
      tableData: [
        {
          name: 'quchunyue',
          code: '12312',
          type: '行业分类',
          createTime: '2019-08-06',
          tip: 'wwwww',
          sort: 1
        },
        {
          name: 'yiping',
          code: '12312',
          type: '服务分类',
          createTime: '2017-10-18',
          tip: 'wwwww',
          sort: 2
        },
        {
          name: 'yiguowei',
          code: '12312',
          type: '主题分类',
          createTime: '2018-10-02',
          tip: 'wwwww',
          sort: 3
        }
      ],
      // 表格多选数据
      multipleSelection: [],
      // 搜索数据
      searchResource: {},
      // 搜索--资源名称
      resourceName: '',
      // 排序字段
      sortName: '',
      // 排序方式
      sort: 'asc',
      // 分页--当前页数
      currentPage: 1,
      // 分页--每页显示条目个数
      pageSize: 20,
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
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入资源编码', trigger: 'blur' }],
        type: [{ required: true, message: '请选择资源类型', trigger: 'blur' }]
      },
      // 是否是添加操作
      isAdd: false,
      // 数据资源分类
      resourceClassify: '主题分类',
      resourceClassifyOption: ['主题分类', '行业分类', '服务分类', '资源形态']
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
      this.resourceName = ''
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
      this.isAdd = false
    },
    // 关闭对话框
    cancleDialog() {
      this.showEditDialog = false
    },
    // 停用按钮
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
    // 排序数量改变时触发·
    handleSortChange() {},
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
      this.editForm.code = ''
      this.editForm.type = '主题分类'
      this.editForm.parent = ''
      this.editForm.tip = ''
      this.editForm.sort = 1
    },
    treeSelectorHandle() {},
    // 行政组织树添加按钮
    treeInsertHandle() {
      this.isAdd = true
      this.showEditDialog = true
    },
    // 行政组织树删除按钮
    treeDeleteHandle() {},
    // 编辑或添加弹框的确定按钮
    submitForm() {
      this.showEditDialog = false
      if (this.isAdd) {
        this.editForm.createTime = '2019-12-31'
        this.tableData.unshift({
          sort: this.editForm.sort,
          name: this.editForm.name,
          type: this.editForm.type,
          tip: this.editForm.tip,
          createTime: this.editForm.createTime
        })
      }
    },
    forceWrite(e) {
      this.$forceUpdate()
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
.resourceClassify {
  width: 126px;
  position: relative;
  top: -4px;
  right: -3px;
}
</style>
