<template>
  <div class="org_post">
    <div class="search_zone">
      <el-form :model="searchForm" :inline="true" size="mini" class="search_form">
        <el-form-item label="岗位名称">
          <el-input v-model="searchForm.name" placeholder="请输入岗位名称"></el-input>
        </el-form-item>
        <el-form-item label="岗位类型">
          <el-select v-model="searchForm.type" placeholder="请选择">
            <el-option label="公有" value="1"></el-option>
            <el-option label="私有" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位状态">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchHandler">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col :span="6">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">行政组织机构树</span>
            <div v-if="canInsert" class="oper_icons">
              <span class="el-icon-plus" @click.stop="orgPostOperHandler('insert')"></span>
            </div>
            <div v-else class="oper_icons forbidden_oper">
              <span class="el-icon-plus"></span>
            </div>
          </div>
          <org-tree @treeSelector="treeSelectorHandle"></org-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="table_wrap">
          <el-table v-loading="loading" :data="tableData" tooltip-effect="dark" style="width: 100%" size="mini" border @sort-change="sortChange">
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="ORG_NAME" label="所属机构" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="NAME" label="岗位名称" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" :formatter="TypeFormatHandler" prop="TYPE" label="岗位类型" show-overflow-tooltip></el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="REMARK" label="岗位描述" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.STATUS === '1'">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="orgPostOperHandler('edit', scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="mini" icon="el-icon-error" @click="orgPostIsStopHandler(scope.row)">
                    停用
                  </el-button>
                </div>
                <div v-else-if="scope.row.STATUS === '0'">
                  <el-button type="success" size="mini" icon="el-icon-caret-right" @click="orgPostIsStopHandler(scope.row)">
                    启用
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination_wrap">
          <i class="el-icon-refresh" @click="refreshHandle"></i>
          <el-pagination :current-page="searchForm.page" :page-sizes="[12, 24, 36]" :page-size="searchForm.rows" :total="totalPages" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="formOperType === 'insert' ? '添加组织岗位' : '编辑组织岗位'" :visible.sync="showDialog" :close-on-click-modal="false" :append-to-body="true">
      <el-form v-if="showDialog" ref="operForm" :model="operForm" :rules="rules" size="mini" label-width="100px" class="table_form">
        <el-form-item label="岗位名称" prop="name" style="margin-bottom: 0px; padding: 9px 0 6px;;">
          <el-input v-model="operForm.name" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="岗位类型" prop="type" style="margin-bottom: 0px; padding: 6px 0;">
          <div v-if="formOperType === 'edit'">
            <span v-if="operForm.type === '1'">公有</span>
            <span v-else-if="operForm.type === '0'">私有</span>
          </div>
          <div v-else-if="formOperType === 'insert'">
            <el-select v-model="operForm.type" placeholder="请选择">
              <el-option label="公有" value="1"></el-option>
              <el-option label="私有" value="0"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item v-if="operForm.type === '0'" label="所属机构" prop="org" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.org" style="width: 80%;" readonly></el-input>
        </el-form-item>
        <el-form-item label="父级岗位" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.parentPost" style="width: 80%;" readonly></el-input>
        </el-form-item>
        <el-form-item label="系统排序" prop="sort_order" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input-number v-model="operForm.sort_order" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="岗位描述" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.remark" type="textarea" placeholder="请输入描述信息..."></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="orgPostOperConfirmHandle">
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
  orgPostsQuery,
  orgPostInsert,
  orgPostUpdate,
  orgPostStop
} from "@/api/pbms_org.js";
export default {
  name: "HelloWorld",
  components: {
    orgTree: () => import("../components/orgsTree")
  },
  data() {
    return {
      loading: false,
      // 表格查询原始表单
      searchInitForm: {
        code: "", // 省份编码
        kind: "", // 所属机构
        name: "", // 岗位名称
        page: 1, // 页码
        rows: 12, // 每次请求数据条数
        sidx: "", // 排序类型
        sord: "asc", // 排序类型
        status: "", // 岗位状态
        type: "" // 岗位类型
      },
      // 表格查询表单
      searchForm: {},
      // 表格数据
      tableData: [],
      // 表格总数据量
      totalPages: 10,
      // 表格数据转换参考数据
      TypeFormat: [
        { value: "0", label: "私有" },
        { value: "1", label: "公有" }
      ],
      // 所选组织能否进行新增操作
      canInsert: false,
      // 是否展示表单对话框
      showDialog: false,
      formOperType: "",
      // 是否编辑数据
      isEdit: false,
      // 是否新增数据
      isInsert: false,
      // 操作表单
      operForm: {},
      // 操作表单校验规则
      rules: {
        name: [
          { required: true, message: "岗位名称不能为空", trigger: "blur" }
        ],
        type: [{ required: true, message: "岗位类型不能为空", trigger: "blur" }]
        // org: [
        //   { required: true, message: '岗所属机构不能为空', trigger: 'blur' }
        // ],
      },
      treeSelected: {}
    };
  },
  created() {
    this.resetSearch();
  },
  methods: {
    // 表格岗位类型转换方法
    TypeFormatHandler(row, column) {
      let text = "";
      this.TypeFormat.forEach(function(key, v) {
        if (key.value === row[column.property]) {
          text = key.label;
        }
      });
      return text;
    },
    // 表格数据封装方法
    tableListHandler() {
      this.loading = true;
      orgPostsQuery(this.searchForm)
        .then(res => {
          console.log(res);
          this.loading = false;
          this.tableData = res.data.rows;
          this.totalPages = res.data.records;
        })
        .catch(res => {
          this.loading = false;
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
    refreshHandle() {
      this.searchForm.page = 1;
      this.tableListHandler();
    },
    /**
     * 表单显示操作方法
     * 参数：operType: 操作类型，值有两种edit和insert。 edit表示当前操作为编辑，即要更新数据；insert表示当前操作为添加，即要新增数据
     *      iteminfo: 操作数据，非必传参，更新数据时必传
     * */
    orgPostOperHandler(operType, itemInfo) {
      console.log(itemInfo);
      if (operType === "edit") {
        this.operForm = {
          createTime: itemInfo.CREATE_TIME,
          id: itemInfo.ID,
          name: itemInfo.NAME,
          remark: itemInfo.REMARK,
          sort_order: itemInfo.SORT_ORDER,
          status: itemInfo.STATUS,
          type: itemInfo.TYPE,
          creator: "",
          lastTime: "",
          last_editor: "",
          org_code: "",
          parent_code: "",
          post_from: "",
          post_type: "",
          short_code: "",
          sys_code: ""
        };
        this.isEdit = true;
        this.showDialog = true;
      } else if (operType === "insert") {
        this.operForm = {
          createTime: "",
          name: "",
          remark: "",
          sort_order: 1,
          status: "",
          type: "0",
          creator: "",
          lastTime: "",
          last_editor: "",
          org_code: this.treeSelected.CODE,
          parent_code: "",
          post_from: "",
          post_type: "",
          short_code: "",
          sys_code: ""
        };
        this.isInsert = true;
        this.showDialog = true;
      }
      this.formOperType = operType;
    },
    orgPostOperConfirmHandle() {
      this.$refs.operForm.validate(valid => {
        if (valid) {
          if (this.formOperType === "insert") {
            orgPostInsert(this.operForm)
              .then(res => {
                console.log(res);
                this.$alert("添加成功", "系统提示", {
                  confirmButtonText: "确定",
                  center: true,
                  type: "success",
                  callback: () => {
                    this.isInsert = false;
                    this.showDialog = false;
                    this.tableListHandler();
                  }
                });
              })
              .catch(() => {
                this.loading = false;
              });
          } else if (this.formOperType === "edit") {
            orgPostUpdate(this.operForm)
              .then(res => {
                console.log(res);
                this.$alert("编辑成功", "系统提示", {
                  confirmButtonText: "确定",
                  center: true,
                  type: "success",
                  callback: () => {
                    this.isEdit = false;
                    this.showDialog = false;
                    this.tableListHandler();
                  }
                });
              })
              .catch(() => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    // 机构岗位停用交互方法
    orgPostIsStopHandler(itemInfo) {
      let stopItem = {};
      stopItem = {
        createTime: itemInfo.CREATE_TIME,
        id: itemInfo.ID,
        name: itemInfo.NAME,
        remark: itemInfo.REMARK,
        sort_order: itemInfo.SORT_ORDER,
        status: itemInfo.STATUS,
        type: itemInfo.TYPE,
        creator: "",
        lastTime: "",
        last_editor: "",
        org_code: "",
        parent_code: "",
        post_from: "",
        post_type: "",
        short_code: "",
        sys_code: ""
      };
      this.$confirm(
        itemInfo.STATUS === "1" ? "是否要停用?" : "是否要启用?",
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }
      ).then(() => {
        this.$message({
          message: itemInfo.STATUS === "1" ? "停用成功" : "启用成功",
          type: "success"
        });
        orgPostStop({
          flag: itemInfo.STATUS === "1" ? 0 : 1,
          postBean: stopItem
        }).then(res => {
          console.log(res);
          this.tableListHandler();
        });
      });
    },
    treeSelectorHandle(data) {
      console.log(data);
      if (data.TYPE === "organ") this.canInsert = true;
      if (this.treeSelected.CODE === data.CODE) return;
      this.treeSelected = data;
      this.searchForm.code = data.CODE;
      this.searchForm.page = 1;
      this.tableListHandler();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.org_post {
  padding: 20px;
}
/* .org_tree, .table_wrap {
  padding:10px;
} */
.org_tree .tree_title {
  font-size: 14px;
  line-height: 18px;
  font-weight: bold;
  border-left: 4px solid #f35958;
  margin: 10px;
  padding-left: 10px;
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
</style>
