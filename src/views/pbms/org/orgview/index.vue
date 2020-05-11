<template>
  <div class="views_manage">
    <!-- 查询区域BEGIN -->
    <div class="search_zone">
      <el-row>
        <el-col :span="18">
          <el-form :model="searchForm" :inline="true" size="mini" class="search_form">
            <el-form-item label="视图编码">
              <el-input v-model="searchForm.code" placeholder="请输入视图编码"></el-input>
            </el-form-item>
            <el-form-item label="视图名称">
              <el-input v-model="searchForm.name" placeholder="请输入视图名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchHandler">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div class="align_right">
            <el-button size="mini" type="success" icon="el-icon-plus" @click="orgViewOperHandle('insert')">
              添加
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- END -->
    <!-- 表格区域BEGIN -->
    <div class="table_wrap">
      <el-table v-loading="loading" :data="tableData" border tooltip-effect="dark" style="width: 100%" size="mini" @sort-change="sortChange">
        <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="CODE" label="视图编码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="NAME" label="视图名称" width="100">
        </el-table-column>
        <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="APP_NAME" label="应用名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" :formatter="dateTimeFormatter" prop="CREATE_TIME" label="创建时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="orgViewOperHandle('edit', scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click.stop="orgViewDeleteHandle(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- END -->
    <!-- 分页区域BEGIN -->
    <div class="pagination_wrap">
      <i class="el-icon-refresh" @click="refreshHandle"></i>
      <el-pagination :current-page="searchForm.page" :page-sizes="[12, 24, 36]" :page-size="searchForm.rows" :total="totalPages" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- END -->
    <!-- 表单对话框BEGIN -->
    <el-dialog :title="formOperType === 'insert' ? '添加组织视图' : '编辑组织视图'" :visible.sync="showDialog" :close-on-click-modal="false" :append-to-body="true" width="40%">
      <el-form v-if="showDialog" ref="operForm" :model="operForm" :rules="rules" size="mini" label-width="100px" class="table_form">
        <el-form-item label="视图编码" prop="code" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.code"></el-input>
        </el-form-item>
        <el-form-item label="视图名称" prop="name" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.name"></el-input>
        </el-form-item>
        <el-form-item label="应用名称" prop="appcode" style="margin-bottom: 0px; padding: 6px 0;">
          <el-select v-model="operForm.appcode" placeholder="请选择">
            <el-option v-for="item in appNameList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统排序" prop="sort_order" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input-number v-model="operForm.sort_order" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.remark" type="textarea" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="orgViewOperConfirmHandle">
          确定
        </el-button>
        <el-button size="mini" @click.stop="showDialog = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!-- END -->
  </div>
</template>

<script>
import {
  orgViewQuery,
  orgViewInsert,
  orgViewUpdate,
  orgViewDelete
} from '@/api/pbms_org.js'
export default {
  name: 'HelloWorld',
  data() {
    return {
      loading: true,
      // 查询表单原始模型
      searchInitForm: {
        code: '', // 视图编码
        name: '', // 视图名称
        page: 1, // 页码
        rows: 12, // 请求数据量
        sidx: '', // 排序类型
        sord: 'asc' // 正反序
      },
      // 查询数据表单
      searchForm: {},
      // 表格数据
      tableData: [],
      // 表格总数量
      totalPages: 10,
      // 是否展示表单对话框
      showDialog: false,
      // 表单操作类型 edit-编辑更新，insert-新增添加
      formOperType: '',
      // 表单对象
      operForm: {},
      // 表单填写校验规则
      rules: {
        // 视图编码规则
        code: [
          { required: true, message: '视图编码不能为空！', trigger: 'blur' }
        ],
        // 视图名称规则
        name: [
          { required: true, message: '视图名称不能为空！', trigger: 'change' }
        ],
        // 应用编码规则
        appcode: [
          { required: true, message: '应用名称不能为空！', trigger: 'change' }
        ]
      },
      // 应用列表
      appNameList: [
        {
          value: 'INSPUR-DZZW-TASK',
          label: '云调度'
        },
        {
          value: 'INSPUR-DZZW-SGHD',
          label: '审管信息互动'
        },
        {
          value: 'INSPUR-DZZW-REPORT',
          label: '云报表'
        },
        {
          value: 'INSPUR-DZZW-WEBSITE',
          label: '网办管理'
        },
        {
          value: 'INSPUR-DZZW-BSP',
          label: '基础平台BSP'
        },
        {
          value: 'INSPUR-DZZW-FORM',
          label: '云表单设计器'
        },
        {
          value: 'INSPUR-DZZW-SXGL',
          label: '事项管理系统'
        },
        {
          value: 'INSPUR-DZZW-BPM',
          label: '工作流BPM'
        },
        {
          value: 'INSPUR-DZZW-TYSP',
          label: '通用审批平台'
        },
        {
          value: 'INSPUR-DZZW-MESSAGE',
          label: '消息中心'
        },
        {
          value: 'INSPUR-DZZW-DISK',
          label: '网盘应用'
        },
        {
          value: 'INSPUR-DZZW-BLSP',
          label: '并联审批'
        },
        {
          value: 'INSPUR-DZZW-OPEN',
          label: '开放平台'
        },
        {
          value: 'INSPUR-DZZW-ARCH',
          label: '归档管理系统'
        },
        {
          value: 'INSPUR-DZZW-DTGL',
          label: '大厅管理'
        },
        {
          value: 'INSPUR-DZZW-DZZZ',
          label: '电子证照'
        },
        {
          value: 'INSPUR-DZZW-PORTAL',
          label: '通用云门户'
        },
        {
          value: 'INSPUR-DZZW-SelfService',
          label: '自助终端系统'
        }
      ]
    }
  },
  created() {
    this.searchForm = { ...this.searchInitForm }
    this.tableListHandler()
  },
  methods: {
    // 表格数据方法
    tableListHandler() {
      this.loading = true
      orgViewQuery(this.searchForm)
        .then(res => {
          console.log(res)
          this.loading = false
          this.tableData = res.data.rows
          this.totalPages = res.data.records
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 查询表格方法
    searchHandler() {
      this.searchForm.page = 1
      this.tableListHandler()
    },
    // 重置查询条件方法
    resetSearch() {
      this.searchForm = { ...this.searchInitForm }
      this.tableListHandler()
    },
    // 表格请求数据量变化方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchForm.page = 1
      this.searchForm.rows = val
      this.tableListHandler()
    },
    // 表格页码切换方法
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.searchForm.page = val
      this.tableListHandler()
    },
    // 表格排序方法
    sortChange(sortInfo) {
      console.log(sortInfo)
      this.searchForm.sidx = sortInfo.prop
      this.searchForm.sord = sortInfo.order === 'ascending' ? 'asc' : 'desc'
      this.searchForm.page = 1
      this.tableListHandler()
    },
    // 表单操作方法
    orgViewOperHandle(operType, itemInfo) {
      if (operType === 'edit') {
        this.operForm = {
          appcode: itemInfo.APP_CODE,
          code: itemInfo.CODE,
          createTime: itemInfo.CREATE_TIME,
          creator: itemInfo.CREATOR,
          id: itemInfo.ID,
          lastTime: '',
          last_editor: '',
          name: itemInfo.NAME,
          remark: '',
          sort_order: itemInfo.SORT_ORDER,
          status: itemInfo.STATUS
        }
      } else if (operType === 'insert') {
        this.operForm = {
          sort_order: 1,
          status: 1
        }
      }
      this.showDialog = true
      this.formOperType = operType
    },
    // 刷新数据
    refreshHandle() {
      this.tableListHandler()
    },
    // 表单交互方法
    orgViewOperConfirmHandle() {
      this.$refs.operForm.validate(valid => {
        if (valid) {
          if (this.formOperType === 'insert') {
            this.loading = true
            orgViewInsert(this.operForm)
              .then(res => {
                console.log(res)
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.showDialog = false
                this.tableListHandler()
              })
              .catch(() => {
                this.loading = false
              })
          } else if (this.formOperType === 'edit') {
            this.loading = true
            orgViewUpdate(this.operForm)
              .then(res => {
                console.log(res)
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.showDialog = false
                this.tableListHandler()
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            this.$message.error('操作出错')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 表格数据删除方法
    orgViewDeleteHandle(deleteItem) {
      this.$confirm('是否要删除?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          orgViewDelete(deleteItem.ID)
            .then(res => {
              console.log(res)
              this.loading = false
              this.tableListHandler()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '删除出错'
          })
        })
    },
    // 表格时间戳转为日期个时方法
    dateTimeFormatter(row, column) {
      const TransfetTime = new Date(row[column.property])
      const y = TransfetTime.getFullYear()
      let m = TransfetTime.getMonth() + 1
      let d = TransfetTime.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      return y + '-' + m + '-' + d
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.views_manage {
  padding: 20px;
}
.pagination_wrap {
  position: relative;
  text-align: center;
}
.pagination_wrap .el-icon-refresh {
  position: absolute;
  left: 20px;
  line-height: 32px;
  cursor: pointer;
}
.align_right {
  text-align: right;
}
</style>
