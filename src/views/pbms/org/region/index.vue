<template>
  <div class="org_region">
    <el-row :gutter="10">
      <el-col :span="18">
        <el-form :model="searchForm" :inline="true" size="mini" class="search_form">
          <el-form-item label="区划名称">
            <el-input v-model="searchForm.name" placeholder="请输入区划名称"></el-input>
          </el-form-item>
          <el-form-item label="行政级别">
            <el-select v-model="searchForm.grade" placeholder="请选择">
              <el-option v-for="gradeInfo in gradeList" :key="gradeInfo.value" :label="gradeInfo.label" :value="gradeInfo.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchHandler">
              查询
            </el-button>
            <el-button icon="el-icon-refresh" @click="resetSearch">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <div class="align_right">
          <a href="http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm" target="_blank">
            <el-button size="mini" type="primary" icon="el-icon-s-promotion" plain>
              国家统计局行政区划代码
            </el-button>
          </a>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">行政区划</span>
            <div class="oper_icons">
              <span class="el-icon-plus" @click.stop="orgRegionOperHandle('insert')"></span>
              <span class="el-icon-delete" @click.stop="treeDeleteHandle"></span>
            </div>
          </div>
          <org-tree :search-area="'region'" @treeSelector="treeSelectorHandle"></org-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="table_wrap">
          <el-table v-loading="loading" ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" size="mini" @sort-change="sortChange">
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="CODE" label="区划编码" width="120">
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="SHORT_CODE" label="区划简码" width="100">
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="NAME" label="区划名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" :formatter="gradeFormatterHandle" width="100" prop="GRADE" label="区划级别" show-overflow-tooltip>
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" :formatter="dateFormatterHandle" width="100" prop="CREATE_TIME" label="创建时间" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="orgRegionOperHandle('edit', scope.row)">
                  编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="orgRegionDeleteHandle( scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination_wrap">
          <i class="el-icon-refresh" @click="refreshHandle"></i>
          <el-pagination :current-page="searchForm.page" :page-sizes="[12, 24, 36]" :page-size="searchForm.rows" :total="totalItems" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="formOperType === 'insert' ? '添加行政区划' : '编辑行政区划'" :visible.sync="showDialog" :close-on-click-modal="false" :append-to-body="true" width="60%">
      <el-form ref="operForm" :model="operForm" :rules="rules" size="mini" label-width="100px" class="table_form">
        <el-form-item label="行政类别" prop="type" style="margin-bottom: 0px; padding: 3px 0;">
          <div v-if="formOperType === 'edit'">
            <span v-for="typeInfo in typeList" v-show="operForm.type === typeInfo.value" :key="typeInfo.value">
              {{ typeInfo.label }}
            </span>
          </div>
          <el-radio-group v-else-if="formOperType === 'insert'" v-model="operForm.type" style="width: 100%">
            <el-col :xs="6" :sm="5" :md="5" :lg="3" :xl="3">
              <el-radio label="1">区划</el-radio>
            </el-col>
            <el-col :xs="6" :sm="5" :md="5" :lg="3" :xl="3">
              <el-radio label="2">政府</el-radio>
            </el-col>
            <el-col :xs="6" :sm="5" :md="5" :lg="3" :xl="3">
              <el-radio label="3">党委</el-radio>
            </el-col>
            <el-col :xs="6" :sm="5" :md="5" :lg="3" :xl="3">
              <el-radio label="4">人大</el-radio>
            </el-col>
            <el-col :xs="6" :sm="10" :md="10" :lg="6" :xl="6">
              <el-radio label="0">机关（区划直属机关）</el-radio>
            </el-col>
            <el-col :xs="6" :sm="10" :md="10" :lg="6" :xl="6">
              <el-radio label="9">机关（区划派驻机关）</el-radio>
            </el-col>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="区划代码" prop="code" style="margin-bottom: 0px; padding: 9px 0 6px;;">
          <span v-if="formOperType === 'edit'">{{ operForm.code }}</span>
          <el-input v-else-if="formOperType === 'insert'" v-model="operForm.code" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="区划简码" prop="short_code" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.short_code" style="width: 80%;"></el-input>
          <i class="el-icon-question color_green" title="主要用于在业务系统中生成业务流水号"></i>
        </el-form-item>
        <el-form-item v-if="formOperType === 'insert'" label="区划名称" prop="name" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.name" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="上级区域" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="parentName" style="width: 80%;" readonly></el-input>
        </el-form-item>
        <el-form-item label="系统排序" prop="sort_order" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input-number v-model="operForm.sort_order" :min="1" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="描述信息" prop="remark" style="margin-bottom: 0px; padding: 6px 0;">
          <el-input v-model="operForm.remark" type="textarea" placeholder="请输入描述信息..."></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="orgRegionOperConfirmHandle">
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
  orgRegionQuery,
  orgRegionInsert,
  orgRegionUpdate,
  orgRegionDelete
} from "@/api/pbms_org.js";
export default {
  name: "OrgRegion",
  components: {
    orgTree: () => import("../components/orgsTree")
  },
  data() {
    return {
      loading: false,
      treeSelected: {},
      // 查询表单对象初始模型
      searchInitForm: {
        code: "", // 机构数选中机构代码
        name: "", // 区划名称
        grade: "", // 行政级别
        page: 1, // 当前页
        rows: 12, // 请求数据量
        sidx: "", // 排序类型
        sord: "asc" // 正反序
      },
      // 查询表单对象
      searchForm: {},
      // 表格数据
      tableData: [],
      // 表格总数据量
      totalItems: 10,
      // 是否展示表单对话框
      showDialog: false,
      // 表单操作 edit-编辑更新 insert-添加新增
      formOperType: "",
      parentName: "",
      // 表单绑定对象
      operForm: {},
      // 表单填写校验规则
      rules: {
        type: [
          { required: true, message: "行政类别不能为空！", trigger: "blur" }
        ],
        code: [
          { required: true, message: "区划代码不能为空！", trigger: "change" }
        ],
        short_code: [
          { required: true, message: "区划简码不能为空！", trigger: "change" }
        ],
        name: [
          { required: true, message: "区划名称不能为空！", trigger: "change" }
        ]
      },
      typeList: [
        {
          value: "1",
          label: "区划"
        },
        {
          value: "2",
          label: "政府"
        },
        {
          value: "3",
          label: "党委"
        },
        {
          value: "4",
          label: "人大"
        },
        {
          value: "0",
          label: "机关（区划直属机关）"
        },
        {
          value: "9",
          label: "机关（区划派驻机关）"
        }
      ],
      gradeList: [
        {
          value: "1",
          label: "国家"
        },
        {
          value: "2",
          label: "省(直辖市)"
        },
        {
          value: "3",
          label: "市(州)"
        },
        {
          value: "4",
          label: "县(区)"
        },
        {
          value: "5",
          label: "镇(街道)"
        },
        {
          value: "6",
          label: "村(社区)"
        }
      ]
    };
  },
  created() {
    this.searchForm = { ...this.searchInitForm };
    this.tableListHandler();
  },
  methods: {
    treeSelectorHandle(data) {
      console.log(data);
      if (this.treeSelected.CODE === data.CODE) return;
      this.treeSelected = data;
      this.parentName = data.PARENT_NAME;
      this.searchForm.code = data.CODE;
      this.searchForm.page = 1;
      this.tableListHandler();
    },
    treeDeleteHandle() {
      if (this.treeSelected.label) {
        this.$confirm(`是否要删除 ${this.treeSelected.label} ?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$alert("请先选择要删除的数据！", "系统提示", {
          confirmButtonText: "确定",
          type: "warning",
          center: true
        });
      }
    },
    gradeFormatterHandle(row, column) {
      let text = "";
      this.gradeList.forEach(function(key, v) {
        if (key.value === row[column.property]) {
          text = key.label;
        }
      });
      return text;
    },
    dateFormatterHandle(row, column) {
      const TransfetTime = new Date(row[column.property]);
      const y = TransfetTime.getFullYear();
      let m = TransfetTime.getMonth() + 1;
      let d = TransfetTime.getDate();
      if (m < 10) {
        m = "0" + m;
      }
      if (d < 10) {
        d = "0" + d;
      }
      return y + "-" + m + "-" + d;
    },
    // 表格数据封装方法
    tableListHandler() {
      this.loading = true;
      orgRegionQuery(this.searchForm)
        .then(res => {
          console.log(res);
          this.loading = false;
          this.tableData = res.data.rows;
          this.totalItems = res.data.records;
        })
        .catch(() => {
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
    // 表单操作控制方法
    orgRegionOperHandle(operType, operItem) {
      console.log(operItem);
      if (operType === "edit") {
        this.parentName = operItem.PARENT_NAME;
        this.operForm = {
          childs: operItem.CHILDS,
          code: operItem.CODE,
          createTime: operItem.CREATE_TIME,
          creator: "",
          goord_x: "",
          goord_y: "",
          grade: operItem.GRADE,
          lastTime: "",
          last_editor: "",
          map: "",
          name: operItem.NAME,
          parent_code: operItem.PARENT_CODE,
          remark: "",
          short_code: operItem.SHORT_CODE,
          sort_order: operItem.SORT_ORDER,
          status: operItem.STATUS,
          type: operItem.TYPE
        };
        this.showDialog = true;
      } else if (operType === "insert") {
        if (this.treeSelected.CODE) {
          this.operForm = {
            childs: "",
            code: "",
            createTime: "",
            creator: "",
            goord_x: "",
            goord_y: "",
            grade: "",
            lastTime: "",
            last_editor: "",
            map: "",
            name: "",
            parent_code: this.treeSelected.CODE,
            remark: "",
            short_code: "",
            sort_order: "1",
            status: "1",
            type: "1"
          };
          this.showDialog = true;
        } else {
          this.$alert("您还没有选择区划!", "系统提示", {
            confirmButtonText: "确定",
            type: "warning",
            center: true
          });
        }
      }
      this.formOperType = operType;
    },
    // 表单交互方法
    orgRegionOperConfirmHandle() {
      this.$refs.operForm.validate(valid => {
        if (valid) {
          if (this.formOperType === "insert") {
            orgRegionInsert(this.operForm)
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
            orgRegionUpdate(this.operForm)
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
    // 表格数据删除方法
    orgRegionDeleteHandle(deleteItem) {
      this.$confirm("是否要删除?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        orgRegionDelete(deleteItem.ID)
          .then(res => {
            console.log(res);
            this.loading = false;
            this.tableListHandler();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.loading = false;
          });
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.org_region {
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
  cursor: pointer;
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
