<template>
  <div class="views_manage">
    <div class="search_zone">
      <el-row>
        <el-col :span="18">
          <el-form :model="searchForm" :inline="true" size="mini" class="search_form">
            <el-form-item label="类型代码">
              <el-input v-model="searchForm.code" placeholder="请输入类型代码"></el-input>
            </el-form-item>
            <el-form-item label="类型名称">
              <el-input v-model="searchForm.name" placeholder="请输入类型名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchHandler">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div class="align_right">
            <el-button size="mini" type="success" icon="el-icon-plus" @click="orgTypeOperHandle('insert')">
              添加
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table_wrap">
      <el-table v-loading="loading" ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" size="mini" @sort-change="sortChange" @select="tableSelectHandler">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="CODE" label="类型代码" width="150">
        </el-table-column>
        <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="NAME" label="类型名称" width="150">
        </el-table-column>
        <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="REMARK" label="类型描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="orgTypeOperHandle('edit', scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="orgTypeDeleteHandle('single', scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_wrap">
      <div class="table_icons">
        <i class="el-icon-delete color_red" @click="orgTypeDeleteHandle('multiple')"></i>
        <span>|</span>
        <i class="el-icon-refresh color_green" @click="refreshTableHandle"></i>
      </div>
      <el-pagination :current-page="searchForm.page" :page-sizes="[12, 24, 36]" :page-size="searchForm.rows" :total="totalPages" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog :title="formOperType === 'insert' ? '添加行政区划' : '编辑行政区划'" :visible.sync="showDialog" :close-on-click-modal="false" :append-to-body="true" width="40%">
      <el-form v-if="showDialog" ref="operForm" :model="operForm" :rules="rules" size="mini" label-width="100px" class="table_form">
        <el-form-item label="类型代码" prop="code" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.code"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" prop="name" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.name"></el-input>
        </el-form-item>
        <el-form-item label="系统排序" prop="sort_order" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input-number v-model="operForm.sort_order" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="类型描述" prop="remark" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="orgTypeOperConfirmHandle">
          确定
        </el-button>
        <el-button size="mini" @click.stop="showDialog = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  orgTypeQuery,
  orgTypeInsert,
  orgTypeUpdate,
  orgTypeDelete
} from '@/api/pbms_org.js'
export default {
  name: 'OrgType',
  data() {
    return {
      loading: false,
      // 表格查询表单
      searchInitForm: {
        code: '',
        name: '',
        page: 1,
        rows: 12,
        sidx: '',
        sord: 'asc'
      },
      // 表格查询表单
      searchForm: {
        code: '',
        name: '',
        page: 1,
        rows: 12,
        sidx: '',
        sord: 'asc'
      },
      // 表格数据
      tableData: [],
      // 总数据条数
      totalPages: 0,
      delList: [],
      // 是否展示表单对话框
      showDialog: false,
      // 表单操作类型 edit-更新 insert新增
      formOperType: '',
      // 新增/更新表单
      operForm: {},
      // 校验规则
      rules: {
        code: [
          { required: true, message: '类型代码不能为空！', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '类型名称不能为空！', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.tableListHandler()
  },
  methods: {
    // 表格数据方法
    tableListHandler() {
      this.loading = true
      orgTypeQuery(this.searchForm).then(res => {
        console.log(res)
        this.loading = false
        this.tableData = res.data.rows
        this.totalPages = res.data.records
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
    refreshTableHandle() {
      this.searchForm.page = 1
      this.tableListHandler()
    },
    // 展示操作表单方法
    orgTypeOperHandle(operType, itemInfo) {
      if (operType === 'edit') {
        this.operForm = {
          code: itemInfo.CODE,
          createTime: itemInfo.CREATE_TIME,
          creator: 'admin',
          id: itemInfo.ID,
          last_editor: 'admin',
          name: itemInfo.NAME,
          remark: itemInfo.REMARK,
          sort_order: itemInfo.SORT_ORDER,
          status: itemInfo.STATUS
        }
      } else if (operType === 'insert') {
        this.operForm = {
          sort_order: 1
        }
      }
      this.showDialog = true
      this.formOperType = operType
    },
    // 表格表格渲染条数变化方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchForm.rows = val
      this.searchForm.page = 1
      this.tableListHandler()
    },
    // 页码变化方法
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.searchForm.page = val
      this.tableListHandler()
    },
    orgTypeOperConfirmHandle() {
      this.$refs.operForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.formOperType === 'insert') {
            orgTypeInsert(this.operForm)
              .then(res => {
                console.log(res)
                this.loading = false
                this.$alert('添加成功', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  type: 'success',
                  callback: () => {
                    this.showDialog = false
                    this.tableListHandler()
                  }
                })
              })
              .catch(() => {
                this.loading = false
              })
          } else if (this.formOperType === 'edit') {
            orgTypeUpdate(this.operForm)
              .then(res => {
                console.log(res)
                this.loading = false
                this.$alert('编辑成功', '系统提示', {
                  confirmButtonText: '确定',
                  center: true,
                  type: 'success',
                  callback: () => {
                    this.showDialog = false
                    this.tableListHandler()
                  }
                })
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log(this.formOperType)
          }
        } else {
          return false
        }
      })
    },
    orgTypeDeleteHandle(deleteType, deleteItem) {
      console.log(deleteType)
      if (deleteType === 'single') {
        this.$confirm('是否要删除?', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.loading = true
            orgTypeDelete(deleteItem.ID)
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
      } else if (deleteType === 'multiple') {
        if (this.delList.length === 0) {
          this.$alert('请选择要删除的数据', '系统提示', {
            confirmButtonText: '确定',
            center: true,
            type: 'warning'
          })
        } else {
          this.$confirm('是否要删除?', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.loading = true
              orgTypeDelete(this.delList.join(','))
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
        }
      }
      console.log(deleteItem)
    },
    // 排序方法
    sortChange(sortInfo) {
      console.log(sortInfo)
      this.searchForm.sidx = sortInfo.prop
      this.searchForm.sord = sortInfo.order === 'ascending' ? 'asc' : 'desc'
      this.searchForm.page = 1
      this.tableListHandler()
    },
    tableSelectHandler(selectedList) {
      console.log(selectedList)
      this.delList = []
      selectedList.forEach(item => {
        this.delList.push(item.ID)
      })
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
.pagination_wrap .table_icons {
  position: absolute;
  width: 50px;
  left: 20px;
  line-height: 32px;
}
.alert_bg {
  position: fixed;
  top: 84px;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: auto;
}
.alert_box {
  position: absolute;
  top: 20%;
  left: 30%;
  bottom: 20%;
  right: 30%;
  min-height: 300px;
  background: #fff;
  border-radius: 5px;
}
.alert_topbar {
  position: relative;
  width: 100%;
  height: 30px;
  background: #1989fa;
  border-radius: 5px 5px 0 0;
  color: #fff;
  font-weight: bold;
  line-height: 30px;
}
.alert_title {
  padding: 0 10px;
  font-size: 14px;
}
.close_btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
}
.alert_main {
  width: 100%;
  height: 80%;
  padding: 10px;
}
.align_right {
  text-align: right;
}

.color_red {
  color: red;
  cursor: pointer;
}
.color_green {
  color: green;
  cursor: pointer;
}
</style>
