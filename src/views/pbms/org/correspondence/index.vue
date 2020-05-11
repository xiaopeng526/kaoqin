<template>
  <div class="org_correspodence">
    <div class="search_zone">
      <el-form :model="searchForm" :inline="true" size="mini" class="search_form">
        <el-form-item label="BSP机构简称">
          <el-input v-model="searchForm.pbms_name" placeholder="请输入BSP机构简称"></el-input>
        </el-form-item>
        <el-form-item label="省机构编码">
          <el-input v-model="searchForm.org_code" placeholder="请输入省机构编码"></el-input>
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
    </div>
    <el-row>
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
          <el-table ref="multipleTable" v-loading="loading" :data="tableData" border tooltip-effect="dark" style="width: 100%" size="mini" @sort-change="sortChange">
            <!-- <el-table-column type="selection" width="55">
            </el-table-column> -->
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="CODE" label="BSP机构编码" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="SHORT_NAME" label="BSP机构简称" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="ORGCODE" label="省机构编码" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="province_info" @click.stop="switchToEdit(scope.row, 'ORGCODE', scope.$index)">
                  <el-input v-if="editItem.type === 'ORGCODE' && editItem.index === scope.$index" v-model="scope.row.ORGCODE" size="mini" clearable placeholder="" @blur="editItem = {}" />
                  <span v-else>{{ scope.row.ORGCODE }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="ORGNAME" label="省机构全称" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="province_info" @click.stop="switchToEdit(scope.row, 'ORGNAME', scope.$index)">
                  <el-input v-if="editItem.type === 'ORGNAME' && editItem.index === scope.$index" v-model="scope.row.ORGNAME" size="mini" placeholder=" " clearable @blur="editItem = {}" />
                  <span v-else>{{ scope.row.ORGNAME }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="ORGNAME" label="省机构简称" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="province_info" @click.stop="switchToEdit(scope.row, 'NORMNAME', scope.$index)">
                  <el-input v-if="editItem.type === 'NORMNAME' && editItem.index === scope.$index" v-model="scope.row.NORMNAME" size="mini" placeholder=" " clearable @blur="editItem = {}" />
                  <span v-else>{{ scope.row.NORMNAME }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-folder" @click="orgCorrespondenceEditHandle(scope.row, scope.$index)">
                  保存
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="orgCorrespondenceDeleteHandle(scope.row.CODE)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination_wrap">
          <i class="el-icon-refresh" @click="refreshHandle"></i>
          <el-pagination :current-page="searchForm.page" :page-sizes="[12, 24, 36]" :page-size="searchForm.rows" :total="totalPages" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  orgCorrespondenceQuery,
  orgCorrespondenceSave,
  orgCorrespondenceDelete
} from "@/api/pbms_org.js";
export default {
  name: "OrgCorrespondence",
  components: {
    orgTree: () => import("../components/orgsTree")
  },
  data() {
    return {
      loading: false,
      // 查询表单对象初始模型
      searchInitForm: {
        code: "", //
        nodeType: "", //
        region_code: "", // 区域代码
        pbms_name: "", // BSP机构简称
        org_code: "", // 省机构编码
        page: 1, // 当前页
        rows: 12, // 请求数据量
        sidx: "", // 排序类型
        sord: "asc" // 正反序
      },
      // 查询表单对象
      searchForm: {},
      tableData: [],
      totalPages: 10,
      editItem: {},
      editOrginInfos: {},
      treeSelected: {}
    };
  },
  created() {
    this.resetSearch();
  },
  methods: {
    treeSelectorHandle(data) {
      console.log(data);
      if (this.treeSelected.CODE === data.CODE) return;
      this.treeSelected = data;
      this.searchForm.code = data.CODE;
      this.searchForm.page = 1;
      this.tableListHandler();
    },
    // 表格数据封装方法
    tableListHandler() {
      this.loading = true;
      orgCorrespondenceQuery(this.searchForm)
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
    switchToEdit(itemInfo, dataType, index) {
      this.editItem = {
        type: dataType,
        index: index
      };
      if (itemInfo.ORGCODE && itemInfo.ORGNAME && itemInfo.NORMNAME) {
        this.editOrginInfos[itemInfo.BSPCode] = {
          type: dataType,
          index: index,
          updateForbidden: true
        };
      } else {
        this.editOrginInfos[itemInfo.BSPCode] = {
          type: dataType,
          index: index,
          updateForbidden: false
        };
      }
    },
    orgCorrespondenceEditHandle(itemInfo, index) {
      if (!this.editOrginInfos[itemInfo.BSPCode]) {
        if (itemInfo.ORGCODE && itemInfo.ORGNAME && itemInfo.NORMNAME) {
          this.editOrginInfos[itemInfo.BSPCode] = {
            type: null,
            index: index,
            updateForbidden: true
          };
        } else {
          this.editOrginInfos[itemInfo.BSPCode] = {
            type: null,
            index: index,
            updateForbidden: false
          };
        }
      }
      console.log(this.editOrginInfos[itemInfo.BSPCode]);
      if (
        itemInfo.ORGCODE === "" ||
        itemInfo.ORGNAME === "" ||
        itemInfo.NORMNAME === ""
      ) {
        this.$alert("省机构编码、名称、简称没有填写全!", "系统提示", {
          confirmButtonText: "确定",
          type: "error",
          center: true
        });
      } else if (this.editOrginInfos[itemInfo.BSPCode].updateForbidden) {
        this.$alert("填写的省机构编码已存在对应关系！", "系统提示", {
          confirmButtonText: "确定",
          type: "error",
          center: true
        });
      } else {
        const saveItem = {
          normname: itemInfo.NORMNAME,
          orgcode: itemInfo.ORGCODE,
          orgname: itemInfo.ORGNAME,
          pbms_code: itemInfo.CODE,
          pbms_name: itemInfo.SHORT_NAME
        };
        this.loading = true;
        orgCorrespondenceSave(saveItem)
          .then(res => {
            console.log(res);
            this.searchForm.page = 1;
            this.tableListHandler();
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    orgCorrespondenceDeleteHandle(code) {
      this.$confirm("是否要删除?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        orgCorrespondenceDelete({ code: code })
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
.org_correspodence {
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
.align_right {
  text-align: right;
}
</style>
