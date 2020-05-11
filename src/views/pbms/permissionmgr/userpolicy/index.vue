<template>
  <div class="permission_renter_policy">
    <div class="search_zone">
      <el-form :model="searchForm" :inline="true" size="mini" class="search_form">
        <el-form-item label="登录账号">
          <el-input v-model="searchForm.user" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="searchForm.user" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="租户级别">
          <el-select v-model="searchForm.region" placeholder="请选择">
            <el-option label="国家级" value="1"></el-option>
            <el-option label="省级" value="2"></el-option>
            <el-option label="市(州)级" value="3"></el-option>
            <el-option label="县(区)级" value="4"></el-option>
            <el-option label="乡镇(街道)级" value="5"></el-option>
            <el-option label="行政村(社区)级" value="6"></el-option>
          </el-select>
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
            <el-table-column prop="BSPCode" label="登陆账号" />
            <el-table-column prop="BSPNameAbbr" label="用户姓名" />
            <el-table-column prop="BSPCode" label="租户区划" />
            <el-table-column prop="BSPNameAbbr" label="租户级别" />
            <el-table-column prop="BSPCode" label="级别参数" />
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
    <el-dialog :visible.sync="showDialog" :close-on-click-modal="false" :append-to-body="true" title="租户级别选择" width="25%">
      <el-row>
        <el-radio-group v-model="renterLevel">
          <el-col :span="24" class="radio_item">
            <el-radio :label="1">国家部委级管理员</el-radio>
          </el-col>
          <el-col :span="24" class="radio_item">
            <el-radio :label="2">省级区划管理员</el-radio>
          </el-col>
          <el-col :span="24" class="radio_item">
            <el-radio :label="3">市(州)级区划管理员</el-radio>
          </el-col>
          <el-col :span="24" class="radio_item">
            <el-radio :label="4">县(区)级区划管理员</el-radio>
          </el-col>
          <el-col :span="24" class="radio_item">
            <el-radio :label="5">乡镇(街道)级管理员</el-radio>
          </el-col>
          <el-col :span="24" class="radio_item">
            <el-radio :label="6">社区级管理员</el-radio>
          </el-col>
        </el-radio-group>
      </el-row>
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
  components: {
    orgTree: () => import('../../org/components/orgsTree'),
    RoleConfig: () => import('../../usermgr/userinfomgr/roleConfig')
  },
  data() {
    return {
      searchForm: {},
      // 显示租户级别选择对话框
      showDialog: false,
      renterLevel: '',
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
      this.showDialog = true
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
.permission_renter_policy {
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

.radio_item {
  margin-bottom: 20px;
}
</style>
