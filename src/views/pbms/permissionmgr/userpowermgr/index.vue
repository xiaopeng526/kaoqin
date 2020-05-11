<template>
  <div class="peimission_user">
    <div class="search_zone">
      <el-form :model="searchForm" :inline="true" size="mini" class="search_form">
        <el-form-item label="用户账号">
          <el-input v-model="searchForm.user" placeholder="请输入用户账号"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="searchForm.user" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
          <el-button icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">行政组织机构树</span>
          </div>
          <org-tree @treeSelector="treeSelectorHandle"></org-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="table_wrap">
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" size="mini">
            <el-table-column prop="BSPCode" label="用户账号" width="120" />
            <el-table-column prop="BSPNameAbbr" label="用户姓名" width="120" />
            <el-table-column prop="BSPCode" label="性别" width="120" />
            <el-table-column prop="BSPNameAbbr" label="所属区划" width="120" />
            <el-table-column prop="BSPCode" label="所属机构" width="120" />
            <el-table-column prop="BSPNameAbbr" label="出生日期" width="120" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-setting" @click="editSetting(scope.row)">
                  配置
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
      </el-col>
    </el-row>
    <!-- 配置角色组件 -->
    <role-config :show-role-config-com="showRoleConfigCom" @closeDialog="closeDialog()"></role-config>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  components: {
    orgTree: () => import('../../org/components/orgsTree'),
    RoleConfig: () => import('../../usermgr/userinfomgr/roleConfig')
  },
  data() {
    return {
      searchForm: {},
      // 显示角色配置组件
      showRoleConfigCom: false,
      tableData: [
        {
          BSPCode: '131028A0101',
          BSPNameAbbr: '农业农村局',
          provinceCode: '131028022',
          provinceName: '大厂回族自治县农业农村局',
          provinceNameAbbr: '县农业农村局'
        },
        {
          BSPCode: '131028A0101',
          BSPNameAbbr: '农业农村局',
          provinceCode: '',
          provinceName: '',
          provinceNameAbbr: ''
        },
        {
          BSPCode: '131028A0101',
          BSPNameAbbr: '农业农村局',
          provinceCode: '131028022',
          provinceName: '大厂回族自治县农业农村局',
          provinceNameAbbr: '县农业农村局'
        },
        {
          BSPCode: '131028A0101',
          BSPNameAbbr: '农业农村局',
          provinceCode: '131028022',
          provinceName: '大厂回族自治县农业农村局',
          provinceNameAbbr: '县农业农村局'
        },
        {
          BSPCode: '131028A0101',
          BSPNameAbbr: '农业农村局',
          provinceCode: '131028022',
          provinceName: '大厂回族自治县农业农村局',
          provinceNameAbbr: '县农业农村局'
        },
        {
          BSPCode: '131028A0101',
          BSPNameAbbr: '农业农村局',
          provinceCode: '131028022',
          provinceName: '大厂回族自治县农业农村局',
          provinceNameAbbr: '县农业农村局'
        },
        {
          BSPCode: '131028A0101',
          BSPNameAbbr: '农业农村局',
          provinceCode: '131028022',
          provinceName: '大厂回族自治县农业农村局',
          provinceNameAbbr: '县农业农村局'
        }
      ],
      editItem: {},
      editOrginInfos: {},
      totalPages: 10,
      pageSize: 12,
      currentPage: 1
    }
  },
  methods: {
    // 关闭角色分配对话框
    closeDialog() {
      this.showRoleConfigCom = false
    },
    treeSelectorHandle(data) {
      this.treeSelected = data
    },
    switchToEdit(itemInfo, dataType, index) {
      this.editItem = {
        type: dataType,
        index: index
      }
      this.editOrginInfos[itemInfo.BSPCode] = JSON.parse(
        JSON.stringify(itemInfo)
      )
    },
    editSetting(itemInfo, index) {
      this.showRoleConfigCom = true
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.peimission_user {
  padding: 20px;
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
.pagination_wrap {
  position: relative;
  text-align: center;
}
.pagination_wrap .el-icon-refresh {
  position: absolute;
  left: 20px;
  line-height: 32px;
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
</style>
