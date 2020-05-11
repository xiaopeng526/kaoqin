<template>
  <div class="mapping_manage">
    <el-row>
      <el-col :span="6">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">行政组织机构树</span>
            <div v-if="isTreeOper" class="oper_icons">
              <span class="el-icon-plus" @click.stop="orgCorespondenceOperHandle('insert')"></span>
              <span class="el-icon-delete" @click.stop="treeDeleteHandle"></span>
            </div>
            <div v-else class="oper_icons forbidden_oper">
              <span class="el-icon-plus"></span>
              <span class="el-icon-delete"></span>
            </div>
          </div>
          <org-tree @treeSelector="treeSelectorHandle"></org-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="table_wrap">
          <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%" size="mini" @sort-change="sortChange">
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="REGION_NAME" label="行政区划" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="CODE" label="机构代码" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="NAME" label="机构全称" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="SHORT_NAME" label="机构简称" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="TYPE_NAME" label="机构类型" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="orgSetting" label="机构配置管理" width="150">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-view" @click.stop="orgCorespondenceOperHandle('view', scope.row)">视图</el-button>
                <el-button size="mini" type="text" icon="el-icon-setting" @click.stop="orgCorespondenceOperHandle('change', scope.row)">变更</el-button>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="orgCorespondenceOperHandle('edit', scope.row)">
                  编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination_wrap">
          <i class="el-icon-refresh" />
          <el-pagination :current-page="currentPage" :page-sizes="[12, 24, 36]" :page-size="pageSize" :total="totalPages" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="formOperType.dialogeTitle" :visible.sync="showDialog" :close-on-click-modal="false" :append-to-body="true" width="60%">
      <el-form v-if="formOperType.oper === 'change'" ref="changeForm" :model="changeForm" :rules="changeRules" size="mini" label-width="100px" class="table_form">
        <el-form-item label="变更类型" prop="type" style="margin-bottom: 0px; padding: 3px 0;">
          <el-radio-group v-model="changeForm.settingType">
            <el-radio label="0">机构撤销</el-radio>
            <el-radio label="1">机构合并</el-radio>
            <el-radio label="2">名称变更</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="机构代码" prop="code" style="margin-bottom: 0px; padding: 9px 0 6px;;">
          <el-input v-if="changeForm.settingType === '1'" v-model="changeForm.orgCode" style="width: 80%;" />
          <span v-else>{{ changeForm.orgCode }}</span>
        </el-form-item>
        <el-form-item label="机构全称" prop="codeAbbr" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-if="changeForm.settingType === '1'" v-model="changeForm.orgName" style="width: 80%;" />
          <span v-else>{{ changeForm.orgName }}</span>
        </el-form-item>
        <el-form-item label="机构简称" prop="name" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-if="changeForm.settingType === '1'" v-model="changeForm.orgNameAbbr" style="width: 80%;" />
          <span v-else>{{ changeForm.orgNameAbbr }}</span>
        </el-form-item>
        <el-form-item v-if="changeForm.settingType === '1'" prop="mergeDep" label="合并部门" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="changeForm.mergeDep" style="width: 80%;" readonly></el-input>
          <span class="el-icon-search" @click.stop="showMergeDeps = true"></span>
        </el-form-item>
        <el-form-item v-if="changeForm.settingType === '1'" label="合并资源" prop="mergeSource" style="margin-bottom: 0px; padding: 6px 0;">
          <el-checkbox-group v-model="changeForm.mergeSource">
            <el-checkbox label="用户"></el-checkbox>
            <el-checkbox label="岗位"></el-checkbox>
            <el-checkbox label="视图"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div v-else-if="formOperType.oper === 'view'" class="check_view">
        <div class="align_right">
          <el-button size="mini" type="success" icon="el-icon-plus" @click="viewItemInsert">
            添加
          </el-button>
        </div>
        <el-table ref="singleTable" :data="viewTableData" size="mini" style="width: 100%">
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column property="date" label="视图">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isOper" v-model="scope.row.viewType" size="mini" placeholder="请选择">
                <el-option label="居中视图" value="居中视图" />
                <el-option label="垂直视图" value="垂直视图" />
                <el-option label="水平视图" value="水平视图" />
              </el-select>
              <span v-else>{{ scope.row.viewType }}</span>
            </template>
          </el-table-column>
          <el-table-column property="name" label="上级机构（双击选择）">
            <template slot-scope="scope">
              <div v-if="scope.row.isOper" class="el-input--mini" @dblclick="alert('000')">
                <input v-model="scope.row.parentOrg" type="text" readonly="readonly" autocomplete="off" placeholder=" " class="el-input__inner">
              </div>
              <span v-else>{{ scope.row.parentOrg }}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isOper" type="danger" size="mini" icon="el-icon-delete" @click.stop="viewTableData.splice(scope.$index, 1)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <main v-else>
        <div class="basic_info">
          <h4>基本信息</h4>
          <el-form ref="operForm" :model="operForm" :rules="operRules" size="mini" label-width="130px" class="oper_form">
            <el-row>
              <el-col :span="24">
                <el-form-item label="统一社会信用代码" prop="name">
                  <el-input v-model="operForm.name" style="width: 95%"></el-input>
                  <i class="el-icon-question" title="规则：1位部门代码+1位类别代码+6位行政区划编码+9位主体标识码+1位校验码"></i>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="代码" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="简码" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="全称" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="简称" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类型" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="行政区划" prop="name">
                  <el-input v-model="operForm.name" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上级" prop="name">
                  <el-input v-model="operForm.name" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="系统排序" prop="name">
                  <el-input-number v-model="operForm.name" :min="0" controls-position="right"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="more_info">
          <h4>扩展信息</h4>
          <el-form ref="operForm" :model="operForm" :rules="operRules" size="mini" label-width="130px" class="oper_form">
            <el-row>
              <el-col :span="12">
                <el-form-item label="机构负责人" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="机构电话" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="机构邮箱" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮政编码" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否执法部门" prop="name">
                  <el-radio-group v-model="operForm.name">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否进驻大厅" prop="name">
                  <el-radio-group v-model="operForm.name">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否监察" prop="name">
                  <el-radio-group v-model="operForm.name">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否风险单位" prop="name">
                  <el-radio-group v-model="operForm.name">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否进驻中心" prop="name">
                  <el-radio-group v-model="operForm.name">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="窗口人数" prop="name">
                  <el-input v-model.number="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="机构地址" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="机构门户" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="注册日期" prop="name">
                  <el-date-picker v-model="operForm.name" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经营期限(始)" prop="name">
                  <el-date-picker v-model="operForm.name" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经营期限(止)" prop="name">
                  <el-date-picker v-model="operForm.name" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="行业" prop="name">
                  <el-input v-model="operForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="name">
                  <el-input v-model="operForm.name" type="textarea"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </main>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="orgRegionOperConfirmHandle">
          确定
        </el-button>
        <el-button size="mini" @click.stop="showDialog = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!-- 变更机构组件 -->
    <merge-deps v-if="showMergeDeps" @mergeDepSelector="mergeDepSelectorHandle"></merge-deps>
  </div>
</template>

<script>
import {
  organQuery,
  organInsert,
  organUpdate,
  organDelete,
  organSettingChange
} from "@/api/pbms_org.js";
export default {
  name: "HelloWorld",
  components: {
    orgTree: () => import("../components/orgsTree"),
    mergeDeps: () => import("./components/mergeDeps")
  },
  data() {
    var checkMergeDepMust = (rule, value, callback) => {
      console.log(this.changeForm.settingType);
      if (this.changeForm.settingType === "1" && value === "") {
        return callback(new Error("合并机构不能为空"));
      } else {
        return callback();
      }
    };
    var checkMergeSourceMust = (rule, value, callback) => {
      console.log(this.changeForm.settingType);
      console.log(value);
      if (this.changeForm.settingType === "1" && value.length === 0) {
        return callback(new Error("合并资源不能为空"));
      } else {
        return callback();
      }
    };
    return {
      searchInitForm: {
        page: 1,
        rows: 12
      },
      searchForm: {},
      treeSelected: {},
      isTreeOper: false,
      isEdit: false,
      isInsert: false,
      isView: false,
      isSettingChange: false,
      tableData: [
        {
          region: "祁屯村委会",
          orgCode: "131028008",
          codeAbbr: "1310",
          orgName: "大厂回族自治县农业农村局",
          orgType: "机关",
          orgNameAbbr: "县农业农村局"
        },
        {
          region: "八百户村委会	",
          orgCode: "131028008",
          codeAbbr: "1310",
          orgName: "",
          orgType: "机关",
          orgNameAbbr: ""
        },
        {
          region: "大厂回族自治县",
          orgCode: "131028008",
          codeAbbr: "1310",
          orgName: "大厂回族自治县农业农村局",
          orgType: "机关",
          orgNameAbbr: "县农业农村局"
        },
        {
          region: "半边店村委会",
          orgCode: "131028008",
          codeAbbr: "1310",
          orgName: "大厂回族自治县农业农村局",
          orgType: "机关",
          orgNameAbbr: "县农业农村局"
        },
        {
          region: "北辰街道人民政府",
          orgCode: "1310280003",
          codeAbbr: "1310",
          orgName: "大厂回族自治县农业农村局",
          orgType: "机关",
          orgNameAbbr: "县农业农村局"
        },
        {
          region: "北贾各庄村委会",
          orgCode: "131028003",
          codeAbbr: "1310",
          orgName: "大厂回族自治县农业农村局",
          orgType: "机关",
          orgNameAbbr: "县农业农村局"
        },
        {
          region: "北太平庄村委会",
          orgCode: "131028008",
          codeAbbr: "1310",
          orgName: "大厂回族自治县农业农村局",
          orgType: "机关",
          orgNameAbbr: "县农业农村局"
        }
      ],
      totalPages: 10,
      pageSize: 12,
      currentPage: 1,
      changeForm: {},
      editForm: {},
      editIndex: null,
      changeRules: {
        mergeDep: [{ validator: checkMergeDepMust, trigger: "blur" }],
        mergeSource: [{ validator: checkMergeSourceMust, trigger: "blur" }]
      },
      showMergeDeps: false,
      viewTableData: [
        {
          viewType: "垂直视图",
          parentOrg: "jsjdsjkdks"
        }
      ],
      operForm: {},
      operRules: {
        name: [{}]
      },
      formOperType: {
        oper: "",
        dialogeTitle: ""
      },
      showDialog: false
    };
  },
  created() {
    this.resetSearch();
  },
  methods: {
    // 表格数据封装方法
    tableListHandler() {
      // eslint-disable-next-line no-undef
      organQuery(this.searchForm).then(res => {
        console.log(res);
        this.tableData = res.data.rows;
        this.totalItems = res.data.records;
      });
    },
    // 查询表格方法
    searchHandler() {
      this.searchForm.page = 1;
      this.tableListHandler();
    },
    // 重置表格查询条件方法
    resetSearch() {
      this.searchForm = { ...this.searchInitForm };
      this.tableListHandler();
    },
    refreshHandle() {
      this.tableListHandler();
    },
    // 表格请求数据量方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.searchForm.rows = val;
      this.tableListHandler();
    },
    // 表格数据页码变换方法
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.searchForm.page = val;
      this.tableListHandler();
    },
    // 表格排序变化方法
    sortChange(sortInfo) {
      console.log(sortInfo);
      this.searchForm.sidx = sortInfo.prop;
      this.searchForm.sord = sortInfo.order === "ascending" ? "asc" : "desc";
      this.searchForm.page = 1;
      this.tableListHandler();
    },
    treeSelectorHandle(data) {
      this.treeSelected = data;
      this.isTreeOper = data.isOper;
    },
    mergeDepSelectorHandle(operType, data) {
      console.log(operType, data);
      if (operType === "confirm") {
        this.changeForm.mergeDep = data;
      }
      this.showMergeDeps = false;
    },
    viewItemInsert() {
      const viewItem = {
        viewType: "居中视图",
        parentOrg: "",
        isOper: true
      };
      this.viewTableData.push(viewItem);
    },
    orgCorespondenceOperHandle(operType, operItem) {
      console.log(operItem);
      if (operType === "change") {
        this.changeForm = {
          settingType: "0",
          orgCode: operItem.CODE,
          orgName: operItem.NAME,
          orgNameAbbr: operItem.SHORT_NAME,
          mergeDep: "",
          mergeSource: []
        };
        this.formOperType.dialogeTitle = "组织机构变更";
      } else if (operType === "view") {
        this.formOperType.dialogeTitle = "组织机构视图";
      } else if (operType === "edit") {
        this.formOperType.dialogeTitle = "编辑组织机构";
      } else if (operType === "insert") {
        this.formOperType.dialogeTitle = "添加组织机构";
      }
      this.showDialog = true;
      this.formOperType.oper = operType;
    },
    orgRegionOperConfirmHandle() {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  left: 25%;
  bottom: 10%;
  right: 25%;
  background: #fff;
  border-radius: 5px;
}
.change_alert {
  top: 5%;
  bottom: 5%;
  left: 30%;
  right: 30%;
  min-height: 450px;
}
.view_alert,
.insert_edit_alert {
  top: 5%;
  bottom: 5%;
  left: 20%;
  right: 20%;
}

.alert_footer {
  position: absolute;
  right: 10px;
  bottom: 10px;
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
  position: absolute;
  top: 40px;
  bottom: 50px;
  left: 10px;
  right: 10px;
  overflow: auto;
}
.align_right {
  text-align: right;
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
.forbidden_oper {
  opacity: 0.6;
}
.el-icon-plus,
.el-icon-delete {
  padding: 3px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
.el-icon-plus {
  background: green;
}
.el-icon-delete {
  background: #f35958;
}

.color_red {
  color: red;
}
.tip_info {
  font-size: 12px;
  margin: 0 30px;
}

.el-icon-search {
  padding: 7px;
  /* border: 1px solid red; */
  background: #dcdcdc;
  margin-left: -6px;
  border-radius: 0 3px 3px 0;
  cursor: pointer;
}
</style>
