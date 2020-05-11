<template>
  <div class="content">
    <!-- 搜索 -->
    <el-form :model="searchUserType" :inline="true">
      <el-form-item label="应用名称：">
        <el-input v-model="typeCode" size="small" placeholder="请输入应用名称"></el-input>
      </el-form-item>
      <el-form-item label="应用分类：">
        <el-select v-model="appName" placeholder="请选择" size="small">
          <el-option-group v-for="group in appNameOptions" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchUserTypeData">查询</el-button>
        <el-button type="warning" size="mini" icon="el-icon-refresh" @click="clearSearchData">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" :default-sort="{ prop: 'CODE', order: 'ascending' }" size="small" border style="width: 100%; margin-top: -10px;" @sort-change="sortChange">
      <el-table-column prop="type" label="应用类型" sortable width="100" align="center">
        <!-- <template slot-scope="scope">
          <span>内部</span>
          <span>外部</span>
        </template>-->
      </el-table-column>
      <el-table-column prop="code" label="应用编码" sortable width="150" header-align="center"></el-table-column>
      <el-table-column prop="name" label="应用名称" sortable width="250" header-align="center"></el-table-column>
      <el-table-column prop="url" label="应用地址" sortable width="250" header-align="center"></el-table-column>
      <el-table-column prop="classify" label="应用分类" sortable width="110" header-align="center"></el-table-column>
      <el-table-column prop="accessType" label="接入类型" sortable width="110" header-align="center"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部 -->
    <el-row :gutter="24">
      <el-col :span="3">
        <i class="el-icon-refresh" style="margin:10px;color:green"></i>
      </el-col>
      <el-col :span="21">
        <!-- 分页 -->
        <el-pagination :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" class="content-pagination" align="center" @size-change="handleSizeChange()" @current-change="handleCurrentChange()"></el-pagination>
      </el-col>
    </el-row>
    <!-- 编辑对话框 -->
    <el-dialog :append-to-body="true" :visible="showDialog" :close-on-click-modal="false" :before-close="cancleDialog" title="归档管理系统" width="80%">
      <el-tabs type="border-card">
        <el-tab-pane label="角色管理">
          <role-manager></role-manager>
        </el-tab-pane>
        <el-tab-pane label="部门管理">
          <department-manager></department-manager>
        </el-tab-pane>
        <el-tab-pane label="菜单管理">
          <menu-manager></menu-manager>
        </el-tab-pane>
        <el-tab-pane label="权限管理">
          <permission-manager></permission-manager>
        </el-tab-pane>
        <el-tab-pane label="字典管理">
          <dictionary-manager></dictionary-manager>
        </el-tab-pane>
        <el-tab-pane label="简易流程管理">
          <process-manager></process-manager>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" @click="cancleDialog()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   queryUserType,
//   queryUserTypeById,
//   addUserType,
//   deleteUserTypeById,
//   updateUserType,
//   checkUserType
// } from '@/api/usermgr'
export default {
  components: {
    RoleManager: () => import('./roleManager.vue'),
    DepartmentManager: () => import('./departmentManager.vue'),
    menuManager: () => import('./menuManager.vue'),
    PermissionManager: () => import('./permissionManager.vue'),
    DictionaryManager: () => import('./dictionaryManager.vue'),
    ProcessManager: () => import('./processManager.vue')
  },
  data() {
    return {
      // 表格数据
      tableData: [
        {
          type: '外部',
          code: 'INSPUR-DZZW-ARCH',
          name: '归档管理系统',
          url: 'http://10.189.82.130:8098/Archive',
          classify: '监控组件',
          accessType: '站内应用'
        },
        {
          type: '内部',
          code: 'INSPUR-DZZW-BLSP',
          name: '并联审批',
          url: 'http://10.189.82.130:8086	',
          classify: '业务应用',
          accessType: 'WEB接入'
        },
        {
          type: '内部',
          code: 'INSPUR-DZZW-BPM',
          name: '工作流BPM',
          url: 'http://10.189.82.130:8082',
          classify: '管理组件',
          accessType: 'WEB接入'
        },
        {
          type: '内部',
          code: 'INSPUR-DZZW-BSP',
          name: '基础平台BSP',
          url: 'http://10.189.82.130:8080	',
          classify: '管理组件',
          accessType: 'WEB接入'
        },
        {
          type: '内部',
          code: 'INSPUR-DZZW-DISK',
          name: '网盘应用',
          url: 'http://172.19.88.109:8084/WebDiskDemo',
          classify: '管理组件',
          accessType: 'WEB接入'
        },
        {
          type: '内部',
          code: 'INSPUR-DZZW-DTGL',
          name: '大厅管理',
          url: 'http://10.189.82.130:8089	',
          classify: '业务应用',
          accessType: '	WEB接入'
        },
        {
          type: '内部',
          code: 'INSPUR-DZZW-DZZZ',
          name: '电子证照',
          url: 'http://10.189.82.130:8091	',
          classify: '业务应用',
          accessType: '    // 内部				WEB接入'
        },
        {
          type: '内部',
          code: 'INSPUR-DZZW-FORM',
          name: '云表单设计器',
          url: 'http://10.189.82.130:8081	',
          classify: '管理组件',
          accessType: 'WEB接入'
        },
        {
          type: '内部',
          code: 'INSPUR-DZZW-MESSAGE',
          name: '消息中心',
          url: 'http://10.189.82.130:8095	',
          classify: '监控组件',
          accessType: 'WEB接入'
        },
        {
          type: '外部',
          code: 'INSPUR-DZZW-OPEN',
          name: '开放平台',
          url: 'http://10.89.88.66:8088/',
          classify: '监控组件',
          accessType: 'WEB接入'
        },
        {
          type: '内部',
          code: 'INSPUR-DZZW-PORTAL',
          name: '通用云门户',
          url: 'http://10.189.82.130:80	',
          classify: '数据共享',
          accessType: 'WEB接入'
        },
        {
          type: '内部',
          code: 'INSPUR-DZZW-REPORT',
          name: '云报表',
          url: 'http://192.168.2.201:8093/',
          classify: '管理组件',
          accessType: 'WEB接入'
        }
      ],
      // 搜索数据
      searchUserType: {},
      // 搜索--类型编码
      typeCode: '',
      // 搜索--应用名称
      appName: '',
      appNameOptions: [
        {
          label: '应用平台',
          options: [
            {
              value: '业务应用',
              label: '业务应用'
            },
            {
              value: '协作组件',
              label: '协作组件'
            },
            {
              value: '数据组件',
              label: '数据组件'
            },
            {
              value: '监控组件',
              label: '监控组件'
            },
            {
              value: '管理组件',
              label: '管理组件'
            }
          ]
        },
        {
          label: '数据平台',
          options: [
            {
              value: '数据目录',
              label: '数据目录'
            },
            {
              value: '数据管理',
              label: '数据管理'
            },
            {
              value: '数据共享',
              label: '数据共享'
            },
            {
              value: '数据分析',
              label: '数据分析'
            },
            {
              value: '配置管理',
              label: '配置管理'
            }
          ]
        }
      ],
      // 排序方式
      sort: 'asc',
      // 排序字段
      sortName: 'CODE',
      // 分页--当前页数
      currentPage: 1,
      // 分页--每页显示条目个数
      pageSize: 10,
      // 分页--总条目数
      total: 10,
      loading: false,
      // 编辑弹框是否显示
      showDialog: false,
      // 编辑表单数据
      editForm: {},
      // 表单验证规则
      formRules: {
        code: [{ required: true, message: '请输入类型编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
      },
      // 是否是添加对话框 true：添加操作，false：编辑操作
      isAdd: false
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 查询数据
    async getTableData() {
      // this.loading = true;
      // const params = {
      //   code: this.typeCode,
      //   name: this.typeName,
      //   page: this.currentPage,
      //   rows: this.pageSize,
      //   sidx: this.sortName,
      //   sord: this.sort
      // };
      // const res = await queryUserType(params);
      // console.log("查询数据", res);
      // const {
      //   data: { records, page, rows },
      //   status
      // } = res;
      // if (status === "200") {
      //   this.loading = false;
      //   this.tableData = rows;
      //   this.total = records;
      //   this.currentPage = page;
      // }
    },
    // 搜索查询
    searchUserTypeData() {
      this.currentPage = 1
      this.pageSize = 10
      this.getTableData()
    },
    // 重置
    clearSearchData() {
      this.typeCode = ''
      this.typeName = ''
      this.getTableData()
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
    // 点击编辑
    async handleEdit(userType) {
      this.isAdd = false
      this.showDialog = true
      // const res = await queryUserTypeById({
      //   id: userType.ID
      // });

      // console.log("编辑", res);
      // const { data, status } = res;
      // if (status === "200") {
      //   this.editForm = data;
      // }
    },

    // 编辑或添加弹框的确定按钮
    async submitForm(data) {
      this.showDialog = false
      // 如果是编辑操作
      // if (!this.isAdd) {
      //   // 更新接口
      //   const res = await updateUserType(
      //     {
      //       sortOrder: this.editForm.sortOrder
      //     },
      //     this.editForm
      //   );
      //   console.log("更新", res);
      //   this.showDialog = false;
      //   this.getTableData();
      // } else {
      //   // 查重接口
      //   const checkRes = await checkUserType({
      //     param: this.editForm.code
      //   });
      //   console.log("查重", checkRes);
      //   const { data, status } = checkRes;
      //   if (status === "200") {
      //     if (data.status !== "y") {
      //       this.$message.warning("类型编码重复");
      //     } else {
      //       // 添加接口
      //       const res = await addUserType(
      //         {
      //           sortOrder: this.editForm.sortOrder
      //         },
      //         this.editForm
      //       );
      //       console.log("添加", res);
      //       const { status } = res;
      //       if (status === "200") {
      //         this.showDialog = false;
      //         this.getTableData();
      //         this.$message.success("添加成功!");
      //       }
      //     }
      //   }
      // }
    },
    // 编辑弹框的取消按钮
    cancleDialog() {
      this.showDialog = false
    },
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
    // 用户编码改变
    forceWrite(event) {
      this.$forceUpdate()
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
