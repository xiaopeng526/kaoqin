<template>
  <div class="content">
    <!-- 搜索开始 -->
    <el-form :model="searchInfo" :inline="true">
      <el-form-item label="资源名称：">
        <el-input v-model="resourceName" size="small" placeholder="请输入资源名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchData">查询</el-button>
        <el-button type="warning" size="mini" icon="el-icon-refresh" @click="clearSearchData">重置</el-button>
        <el-button type="success" size="mini" icon="el-icon-plus" @click="addData">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索结束 -->
    <el-row :gutter="24">
      <!-- 左侧树结构组件 -->
      <el-col :span="6">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">应用系统资源树</span>
          </div>
          <!-- 树结构数据 -->
          <org-tree @treeSelector="treeSelectorHandle"></org-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <!-- 右侧表格 -->
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :default-sort="{ prop: 'typeCode', order: 'ascending' }" size="small" border style="width: 100%; margin-top: -10px;" @selection-change="handleSelectionChange" @sort-change="sortChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="icon" label="资源图标" sortable width="100" align="center"></el-table-column>
          <el-table-column prop="name" label="资源名称" sortable width="110" align="center"></el-table-column>
          <el-table-column prop="url" label="资源路径" sortable width="120" align="center"></el-table-column>
          <el-table-column prop="data" label="资源数据" sortable width="140" align="center"></el-table-column>
          <el-table-column label="操作" width="190px" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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
    <el-dialog :append-to-body="true" :visible="showEditDialog" :close-on-click-modal="false" :before-close="cancleDialog" :title="isAdd ? '添加菜单' : '编辑菜单'" width="71%">
      <el-form ref="ruleForm" :model="editForm" :rules="formRules" width="60px" label-position="right" size="small">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="资源名称：" label-width="120px" prop="name">
              <el-input v-model="editForm.name" autocomplete="off" style="width:200px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源图标：" label-width="120px" prop="icon">
              <el-input v-model="editForm.icon" autocomplete="off" style="width:200px" @input="forceWrite($event)"></el-input>
              <el-button size="small" class="el-icon-folder-opened" @click="selectIcon"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="资源类型：" label-width="120px" prop="type">
              <el-radio v-model="editForm.type" label="目录" @input="forceWrite($event)">目录</el-radio>
              <el-radio v-model="editForm.type" label="菜单" @input="forceWrite($event)">菜单</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级资源：" label-width="120px" prop="parent">
              <el-input v-model="editForm.parent" autocomplete="off" style="width:200px" @input="forceWrite($event)"></el-input>
              <el-button size="small" class="el-icon-folder-opened" @click="selectData"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="资源路径：" label-width="120px" prop="url">
              <el-input v-model="editForm.url" autocomplete="off" placeholder="#" style="width:200px" @input="forceWrite($event)"></el-input>
              <span>（最顶层菜单为<span style="color:red">#</span>）</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源数据：" label-width="120px" prop="data">
              <el-input v-model="editForm.data" autocomplete="off" style="width:200px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="isAdd">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="打开方式：" label-width="120px" prop="openMode">
                <el-select v-model="editForm.openMode" placeholder="请选择">
                  <el-option v-for="item in openStyle" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序：" label-width="120px">
                <el-input-number :min="1" v-model="editForm.sort" controls-position="right" size="small"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="提示信息：" label-width="120px" prop="tip">
                <el-input :rows="3" v-model="editForm.tip" style="width:700px" type="textarea" placeholder="请输入内容" @input="forceWrite($event)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="提示信息：" label-width="120px" prop="tip">
                <el-input :rows="3" v-model="editForm.tip" style="width:200px" type="textarea" placeholder="请输入内容" @input="forceWrite($event)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="打开方式：" label-width="120px" prop="openMode">
                <el-select v-model="editForm.openMode" placeholder="请选择">
                  <el-option v-for="item in openStyle" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="排序：" label-width="120px">
                <el-input-number :min="1" v-model="editForm.sort" controls-position="right" size="small"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态：" label-width="120px" prop="remark">
                <el-switch v-model="editForm.status" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm()">确 定</el-button>
        <el-button size="small" @click="cancleDialog()">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 选择上级资源对话框 -->
    <el-dialog :append-to-body="true" :visible="showResourceDialog" :close-on-click-modal="false" :before-close="cancleResourceDialog" title="选择资源">
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmSelect()">确 定</el-button>
        <el-button size="small" @click="cancleResourceDialog()">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 选择资源图标对话框 -->
    <el-dialog :append-to-body="true" :visible="showIconDialog" :close-on-click-modal="false" :before-close="cancleIconDialog" title="选择资源图标" width="70%">
      图表类型：
      <el-select v-model="iconType" placeholder="请选择" size="small">
        <el-option v-for="item in iconTypeOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <div style="margin-top:10px"></div>
      <el-tabs type="border-card">
        <el-tab-pane label="常用">常用
        </el-tab-pane>
        <el-tab-pane label="web">web</el-tab-pane>
        <el-tab-pane label="文件">文件</el-tab-pane>
        <el-tab-pane label="旋转">旋转</el-tab-pane>
        <el-tab-pane label="表单">表单</el-tab-pane>
        <el-tab-pane label="支付">支付</el-tab-pane>
        <el-tab-pane label="图表">图表</el-tab-pane>
        <el-tab-pane label="货币">货币</el-tab-pane>
        <el-tab-pane label="文本">文本</el-tab-pane>
        <el-tab-pane label="方向">方向</el-tab-pane>
        <el-tab-pane label="媒体">媒体</el-tab-pane>
        <el-tab-pane label="标志">标志</el-tab-pane>
        <el-tab-pane label="医疗">医疗</el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmSelectIcon()">确 定</el-button>
        <el-button size="small" @click="cancleIconDialog()">取 消</el-button>
      </div>
    </el-dialog>
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
          icon: '',
          name: '统一归档',
          url: '#',
          data: 'jygl'
        },
        {
          icon: '',
          name: '借阅管理',
          url: '/archive/borrow/index',
          data: ''
        },
        {
          icon: '',
          name: '归档查询',
          url: '/archive/history/history',
          data: ''
        },
        {
          icon: '',
          name: '归档管理',
          url: '/archive/index',
          data: ''
        },
        {
          icon: '',
          name: '归档周期管理',
          url: '/archive/manage/index',
          data: ''
        },
        {
          icon: '',
          name: '位置管理',
          url: '/archive/path/index',
          data: ''
        }
      ],
      // 表格多选数据
      multipleSelection: [],
      // 搜索数据
      searchInfo: {},
      // 搜索--资源名称
      resourceName: '',
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
      orgCode: '',
      // 表单验证规则
      formRules: {
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入资源路径', trigger: 'blur' }]
      },
      openStyle: ['嵌入门户展现', '新标签'],
      // 选择资源对话框
      showResourceDialog: false,
      // 资源图标
      showIconDialog: false,
      iconType: 'ECGAP3.5',
      iconTypeOptions: ['BOOTSTRAP', 'MATERIAL-DESIGN', 'ECGAP3.5']
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
    // 搜索查询
    searchData() {
      this.getTableData()
    },
    // 重置
    clearSearchData() {
      this.resourceName = ''
      this.getTableData()
    },
    // 表格多选--当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 编辑按钮
    handleEdit(data) {
      console.log(data)
      this.isAdd = false
      this.showEditDialog = true
      this.editForm = data
      this.editForm.sort = 1
      this.editForm.type = '目录'
      this.editForm.openMode = '嵌入门户展现'
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
        .then(async() => {
          // const params = {
          //   id: data.ID,
          //   status: data.STATUS
          // }
          // const res = await useUserInfo(params)
          // console.log(res)
          // const { status } = res
          // if (status === '200') {
          //   // 把页码重置为第一页
          //   this.currentPage = 1
          //   this.getTableData()
          //   this.$message.success('修改成功!')
          // }
        })
        .catch(() => {
          this.$message.warning('取消修改!')
        })
    },

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
    },
    // 新增按钮
    addData() {
      this.isAdd = true
      this.showEditDialog = true
      this.editForm.name = ''
      this.editForm.type = '菜单'
      this.editForm.openMode = '嵌入门户展现'
      this.editForm.sort = 1
    },
    // 编辑弹框的确定按钮
    submitForm(data) {
      this.showEditDialog = false
      this.$set(this.tableData, this.editForm.index, this.editForm)
    },
    // 编辑弹框的取消按钮
    cancleDialog() {
      this.showEditDialog = false
    },
    forceWrite(e) {
      this.$forceUpdate()
    },
    // 选择资源对话框
    cancleResourceDialog() {
      this.showResourceDialog = false
    },
    selectData() {
      this.showResourceDialog = true
    },
    confirmSelect() {
      this.showResourceDialog = false
    },
    // 资源图标
    selectIcon() {
      this.showIconDialog = true
    },
    confirmSelectIcon() {
      this.showIconDialog = false
    },
    cancleIconDialog() {
      this.showIconDialog = false
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
</style>
