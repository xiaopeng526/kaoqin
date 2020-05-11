<template>
  <div class="content">
    <!-- 搜索 -->
    <el-form :model="searchAppData" :inline="true">
      <el-form-item label="反馈主题：">
        <el-input v-model="account" size="small" placeholder="请输入反馈主题"></el-input>
      </el-form-item>
      <el-form-item label="反馈时间：">
        <el-date-picker v-model="operateTime" start-placeholder="请选择反馈时间" end-placeholder="请选择反馈时间" size="small" type="daterange" value-format="yyyy-MM-dd" range-separator="至" style="width:100%"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchData">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="clearSearchData">重置</el-button>
        <el-button icon="el-icon-plus" size="mini" type="success" @click="addData">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 选择框 -->
    <el-select v-model="selectTable" placeholder="请选择" size="small" style="position: relative;top: -12px;">
      <el-option v-for="item in selectTableOptions" :key="item" :label="item" :value="item"></el-option>
    </el-select>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" :default-sort="{prop: 'isReply', order: 'ascending'}" border size="small" style="width: 100%;" @sort-change="sortChange()">
      <el-table-column type="selection" align="center" label width="80"></el-table-column>
      <el-table-column header-align="center" prop="isReply" label="是否回复" sortable width="100">
        <template slot-scope="scope">
          <div v-html="formatApply(scope.row.isReply)"></div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" prop="type" label="类型" sortable width="120"></el-table-column>
      <el-table-column header-align="center" prop="theme" label="反馈主题" sortable width="250"></el-table-column>
      <el-table-column align="center" prop="system" label="应用系统" sortable width="150"></el-table-column>
      <el-table-column align="center" prop="time" label="反馈时间" sortable width="150"></el-table-column>
      <el-table-column prop="STATUS" label="操作" align="center" fixed="right" class-name="contentTableCol">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
          <el-button size="mini" type="warning" icon="el-icon-s-promotion" @click="handleReply(scope.row)">回复</el-button>
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
        <el-pagination :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" class="content-pagination" align="center" @size-change="handleSizeChange()" @current-change="handleCurrentChange()"></el-pagination>
      </el-col>
    </el-row>
    <!-- 添加对话框 -->
    <el-dialog :append-to-body="true" :visible="showAddDialog" :close-on-click-modal="false" :before-close="cancleDialog" title="添加应用反馈" width="60%">
      <el-form ref="editForm" :model="addForm" :rules="formRules" width="80px" label-position="right" size="small">
        <el-form-item label="反馈主题：" label-width="120px" prop="theme">
          <el-input v-model="addForm.theme" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="反馈类型：" label-width="120px" prop="type">
              <el-select v-model="addForm.type" placeholder="请选择" size="small" style="width:250px" @input="forceWrite($event)">
                <el-option v-for="item in addFormType" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用系统：" label-width="120px" prop="system">
              <el-select v-model="addForm.system" placeholder="请选择" size="small" style="width:250px" @input="forceWrite($event)">
                <el-option v-for="item in selectTableOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="行政区划：" label-width="120px" prop="area">
              <el-input v-model="addForm.area" autocomplete="off" style="width:200px" @input="forceWrite($event)"></el-input>
              <el-button type="default" class="el-icon-folder-opened" size="small"></el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织机构：" label-width="120px" prop="organization">
              <el-input v-model="addForm.organization" autocomplete="off" style="width:200px" @input="forceWrite($event)"></el-input>
              <el-button type="default" class="el-icon-folder-opened" size="small"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="联系人：" label-width="120px" prop="contacts">
              <el-input v-model="addForm.contacts" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：" label-width="120px" prop="phone">
              <el-input v-model="addForm.phone" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="反馈内容：" label-width="120px" prop="remark">
          <el-input :rows="4" v-model="addForm.remark" type="textarea" placeholder="请输入内容" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input-number :min="1" v-model="addForm.sortOrder" controls-position="right" size="small"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" @click="cancleDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看对话框 -->
    <el-dialog :append-to-body="true" :visible="showViewDialog" :close-on-click-modal="false" :before-close="cancleViewDialog" :title="viewTitle" width="60%">
      <span class="dialog-font-size">
        <i class="el-icon-edit-outline"></i>
        反馈内容
      </span>
      <el-divider></el-divider>
      <el-row :gutter="24">
        <el-col :span="6">{{ viewContent.theme }}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6" :offset="18">反馈人：{{ viewContent }}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6" :offset="18">{{ viewContent.system }}</el-col>
      </el-row>
      <span class="dialog-font-size">
        <i class="el-icon-edit-outline"></i>
        反馈回复
      </span>
      <el-divider></el-divider>
      <div v-if="isReply">
        <el-input :rows="4" v-model="viewContent.reply" type="textarea" placeholder="请输入内容"></el-input>
      </div>
      <div v-else>
        <el-row :gutter="24">
          <el-col :span="6">{{ viewContent.theme }}</el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6" :offset="18">回复：{{ viewContent }}</el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isReply" size="small" type="primary" @click="submitViewForm">确 定</el-button>
        <el-button size="small" @click="cancleViewDialog">取 消</el-button>
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
          isReply: 'true',
          type: '报告错误',
          theme: '11',
          system: '基础平台BSP',
          time: '2019-11-10'
        }
      ],
      // 搜索数据
      searchAppData: {},
      // 搜索--操作人
      account: '',
      // 搜索--操作时间
      operateTime: ['', ''],
      // 选中的表格选项
      selectTable: '全部',
      selectTableOptions: [
        '全部',
        '云调度',
        '审管信息互动',
        '云报表',
        '网办管理',
        '基础平台BSP',
        '云表单设计器',
        '事项管理系统',
        '工作流BPM',
        '通用审批平台',
        '消息中心',
        '网盘应用',
        '并联审批',
        '开放平台',
        '归档管理系统',
        '大厅管理',
        '电子证照',
        '通用云门户',
        '自助终端系统'
      ],
      // 排序方式
      sort: 'asc',
      // 排序字段
      sortName: 'ACCOUNT',
      // 分页--当前页数
      currentPage: 1,
      // 分页--每页显示条目个数
      pageSize: 10,
      // 分页--总条目数
      total: 10,
      loading: false,
      // 添加弹框是否显示
      showAddDialog: false,
      // 添加表单数据
      addForm: {},
      // 表单验证规则
      formRules: {
        theme: [{ required: true, message: '请输入反馈主题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择反馈类型', trigger: 'blur' }],
        system: [
          { required: true, message: '请选择应用系统', trigger: 'blur' }
        ],
        area: [{ required: true, message: '请选择行政区划', trigger: 'blur' }],
        organization: [
          { required: true, message: '请选择组织机构', trigger: 'blur' }
        ],
        contacts: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入反馈内容', trigger: 'blur' }]
      },
      addFormType: [
        '报告错误',
        '建议改进',
        '咨询问题',
        '个人意见',
        '赞美表扬',
        '其他'
      ],
      // 查看对话框是否显示
      showViewDialog: false,
      // 是否是回复操作
      isReply: true,
      // 查看对话框的title
      viewTitle: '',
      // 查看对话框内容
      viewContent: {}
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 查询数据
    getTableData() {
      //   this.loading = true;
      //   const params = {
      //     account: this.account,
      //     end: this.operateTime[1],
      //     page: this.currentPage,
      //     rows: this.pageSize,
      //     sidx: this.sortName,
      //     sord: this.sort,
      //     start: this.operateTime[0]
      //   };
      //   const res = await querySafeLog(params);
      //   console.log("查询数据", res);
      //   const {
      //     data: { records, page, rows },
      //     status
      //   } = res;
      //   if (status === "200") {
      //     this.loading = false;
      //     this.tableData = rows;
      //     this.total = records;
      //     this.currentPage = page;
      //   }
    },
    // 搜索查询
    searchData() {
      // this.getTableData();
    },
    // 重置
    clearSearchData() {
      this.account = ''
      this.$set(this.operateTime, 0, '')
      this.$set(this.operateTime, 1, '')
      // this.getTableData();
    },
    // 点击删除
    deleteType(userType) {
      console.log(userType)
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // const res = await deleteUserTypeById({
          //   id: userType.ID
          // });
          // console.log(res);
          // const { status } = res;
          // if (status === "200") {
          //   // 把页码重置为第一页
          //   this.currentPage = 1;
          //   this.getTableData();
          //   this.$message.success("删除成功!");
          // }
        })
        .catch(() => {
          this.$message.warning('取消删除!')
        })
    },
    // 添加弹框的确定按钮
    submitForm(data) {
      this.showAddDialog = false
      // 查重接口
      // const checkRes = await checkUserType({
      //   param: this.editForm.code
      // });
      // console.log("查重", checkRes);
      // const { data, status } = checkRes;
      // if (status === "200") {
      //   if (data.status !== "y") {
      //     this.$message.warning("类型编码重复");
      //   } else {
      //     // 添加接口
      //     const res = await addUserType(
      //       {
      //         sortOrder: this.editForm.sortOrder
      //       },
      //       this.editForm
      //     );
      //     console.log("添加", res);
      //     const { status } = res;
      //     if (status === "200") {
      //       this.showAddDialog = false;
      //       this.getTableData();
      //       this.$message.success("添加成功!");
      //     }
      //   }
      // }
    },
    // 添加弹框的取消按钮
    cancleDialog() {
      this.showAddDialog = false
    },
    // 点击添加
    addData() {
      this.showAddDialog = true
      this.addForm.sort = 1
      this.addForm.type = '报告错误'
      this.addForm.system = '云调度'
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
      // this.getTableData();
    },
    // 分页pageSize 改变时会触发
    handleSizeChange(val) {
      console.log(val)
      this.pageSize = val
      this.currentPage = 1
      // this.getTableData();
    },
    // 分页currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      // this.getTableData();
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
    },
    forceWrite(e) {
      this.$forceUpdate()
    },
    // 查看弹框的取消按钮
    cancleViewDialog() {
      this.showViewDialog = false
    },
    // 点击查看
    handleView(feedback) {
      console.log(feedback)
      this.isReply = false
      this.showViewDialog = true
      this.viewTitle = '[' + feedback.time + ']　' + feedback.theme
      this.viewContent.theme = feedback.theme
      this.viewContent.system = feedback.system
    },
    // 点击回复
    handleReply() {
      this.isReply = true
      this.showViewDialog = true
    },
    // 回复对话框的确定按钮
    submitViewForm() {
      this.showViewDialog = false
    },
    handleDelete() {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // const res = await deleteUserTypeById({
          //   id: userType.ID
          // });
          // console.log(res);
          // const { status } = res;
          // if (status === "200") {
          // 把页码重置为第一页
          this.currentPage = 1
          this.getTableData()
          this.$message.success('删除成功!')
          // }
        })
        .catch(() => {
          this.$message.warning('取消删除!')
        })
    },
    formatApply(row) {
      console.log(row)
      const apply = '<span style="color:green;">已回复</span>'
      if (row) {
        return apply
      }
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
.refresh {
  line-height: 20px;
  position: absolute;
  left: 20px;
  top: 15px;
}
.dialog-font-size {
  font-size: 18px;
  font-weight: 800;
}
</style>
