<template>
  <div class="permission_role">
    <div class="search_zone">
      <div class="align_right" style="margin-bottom: 18px;">
        <el-button size="mini" icon="el-icon-search" @click.stop="searchItemShowHandle">
        </el-button>
        <el-button size="mini" type="success" icon="el-icon-plus" @click.stop="permissionRoleOperHandle('insert')">
          添加
        </el-button>
      </div>
      <el-form v-if="showSearch" :model="searchForm" :inline="true" size="mini" class="search_form">
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.user" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色类型">
          <el-select v-model="searchForm.region" placeholder="请选择" style="width: 100px;">
            <el-option label="请选择" value=""></el-option>
            <el-option label="类型" value="0"></el-option>
            <el-option label="角色" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色值">
          <el-input v-model="searchForm.user" placeholder="请输入角色值"></el-input>
        </el-form-item>
        <el-form-item label="角色状态">
          <el-select v-model="searchForm.region" placeholder="请选择" style="width: 100px;">
            <el-option label="请选择" value=""></el-option>
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">
            查询
          </el-button>
          <el-button icon="el-icon-refresh">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_wrap">
      <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%" size="mini" @sort-change="sortChange">
        <el-table-column prop="viewCode" label="角色名称"></el-table-column>
        <el-table-column prop="viewName" label="角色值"></el-table-column>
        <el-table-column prop="applyName" label="角色类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="父级角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button plain type="primary" size="mini" icon="el-icon-edit" @click="permissionRoleOperHandle('edit', scope.row)">
              编辑
            </el-button>
            <el-button plain type="danger" size="mini" icon="el-icon-error" @click="peimissionRoleStopController(scope.row)">
              停用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_wrap">
      <i class="el-icon-refresh"></i>
      <el-pagination :current-page="currentPage" :page-sizes="[12, 24, 36]" :page-size="pageSize" :total="totalPages" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog :append-to-body="true" :title="alertTitle" :visible.sync="showDialog" :close-on-click-modal="false">
      <el-form v-if="showDialog" ref="editForm" :model="editForm" :rules="rules" size="mini" label-width="100px" class="table_form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="viewCode" style="margin-bottom: 0px; padding: 6px 0;">
              <el-input v-model="editForm.viewCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色类型" prop="viewName" style="margin-bottom: 0px; padding: 6px 0;">
              <el-select v-model="searchForm.viewName" placeholder="请选择" style="width: 100%;">
                <el-option label="类型" value="0"></el-option>
                <el-option label="角色" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色值" prop="applyName" style="margin-bottom: 0px; padding: 6px 0;">
              <el-input v-model="editForm.applyName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色权重" prop="applyName" style="margin-bottom: 0px; padding: 6px 0;">
              <el-input v-model="editForm.applyName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级角色" style="margin-bottom: 0px; padding: 6px 0;">
              <el-input v-model="editForm.applyName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统排序" prop="systemOrder" style="margin-bottom: 0px; padding: 6px 0;">
              <el-input-number v-model="editForm.systemOrder" :min="0" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remark" style="margin-bottom: 0px; padding: 6px 0;">
              <el-input v-model="editForm.remark" type="textarea" placeholder="请输入备注信息"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="tableEditConfirm('ruleForm')">
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
export default {
  name: 'HelloWorld',
  data() {
    return {
      showSearch: false,
      alertTitle: '',
      searchForm: {},
      tableData: [
        {
          viewCode: 'ORG_HORIZONTAL_VIEW',
          viewName: '水平视图',
          applyName: '基础平台BSP',
          createTime: '2016-04-05',
          systemOrder: 1,
          isOper: false
        },
        {
          viewCode: 'ORG_VERTICAL_VIEW',
          viewName: '垂直视图',
          applyName: '基础平台BSP',
          createTime: '2016-04-05',
          systemOrder: 1,
          isOper: false
        },
        {
          viewCode: '1',
          viewName: '居中视图',
          applyName: '审管信息互动',
          createTime: '2019-12-25',
          systemOrder: 1,
          isOper: true
        }
      ],
      totalPages: 10,
      pageSize: 12,
      currentPage: 1,
      showDialog: false,
      editForm: {},
      editIndex: null,
      rules: {
        viewCode: [
          { required: true, message: '视图编码不能为空！', trigger: 'blur' }
        ],
        viewName: [
          { required: true, message: '视图名称不能为空！', trigger: 'change' }
        ],
        applyName: [
          { required: true, message: '应用名称不能为空！', trigger: 'change' }
        ],
        systemOrder: [
          { required: true, message: '应用名称不能为空！', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    searchItemShowHandle() {
      this.showSearch = !this.showSearch
    },
    permissionRoleOperHandle(operType, operItem) {
      if (operType === 'edit') {
        this.editForm = operItem
        this.alertTitle = '编辑角色信息'
      } else if (operType === 'insert') {
        this.editForm = {}
        this.alertTitle = '添加角色信息'
      }
      this.showDialog = true
    },
    peimissionRoleStopController(stopItem) {
      this.$confirm(
        '停用角色，应用系统中正在使用的角色将不能使用，是否要停用?',
        '系统提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    // 排序方法
    sortChange(sortInfo) {
      console.log(sortInfo)
      this.searchForm.sidx = sortInfo.prop
      this.searchForm.sord = sortInfo.order === 'ascending' ? 'asc' : 'desc'
      this.searchForm.page = 1
      this.tableListHandler()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    },
    tableEditConfirm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // alert('编辑!');
          this.$set(this.tableData, this.editIndex, this.editForm)
          this.showDialog = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.permission_role {
  padding: 20px;
}
.el-table--border {
  margin-left: 0;
}
.pagination_wrap {
  position: relative;
  text-align: center;
}
.pagination_wrap .el-icon-refresh {
  position: absolute;
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
  top: 10%;
  left: 30%;
  bottom: 10%;
  right: 30%;
  min-height: 350px;
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
</style>
