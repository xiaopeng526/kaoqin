<template>
  <div class="org_region">
    <div class="search_zone">
      <el-form :model="searchForm" :inline="true" size="mini" class="search_form">
        <el-form-item label="机构名称">
          <el-input v-model="searchForm.name" placeholder="请输入机构名称"></el-input>
        </el-form-item>
        <el-form-item label="机构类型">
          <el-select v-model="searchForm.grade" placeholder="请选择">
            <el-option :value="1" label="国家"></el-option>
            <el-option :value="2" label="省(直辖市)"></el-option>
            <el-option :value="3" label="市(州)"></el-option>
            <el-option :value="4" label="县(区)"></el-option>
            <el-option :value="5" label="镇(街道)"></el-option>
            <el-option :value="6" label="村(社区)"></el-option>
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
    </div>
    <el-row>
      <el-col :span="6">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">行政组织机构树</span>
            <div class="oper_icons">
              <span class="el-icon-delete" @click.stop="treeDeleteHandle"></span>
            </div>
          </div>
          <org-tree @treeSelector="treeSelectorHandle"></org-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="table_wrap">
          <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" size="mini" @sort-change="sortChange">
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="CODE" label="机构编码">
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="NAME" label="区划名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column :sortable="true" :sort-orders="['ascending', 'descending']" prop="TYPE" label="机构类型" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="orgRegionDeleteHandle( scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination_wrap">
          <i class="el-icon-refresh" @click="refreshHandle" />
          <el-pagination :total="totalItems" :current-page="searchForm.page" :page-sizes="[12, 24, 36]" :page-size="searchForm.rows" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { orgRegionQuery, orgRegionDelete } from '@/api/pbms_org.js'
export default {
  name: 'OrgRegion',
  components: {
    orgTree: () => import('../../org/components/orgsTree')
  },
  data() {
    return {
      treeSelected: {},
      // 查询表单对象初始模型
      searchInitForm: {
        code: '', // 机构数选中机构代码
        name: '', // 区划名称
        grade: '', // 行政级别
        page: 1, // 当前页
        rows: 12, // 请求数据量
        sidx: '', // 排序类型
        sord: 'asc' // 正反序
      },
      // 查询表单对象
      searchForm: {},
      // 表格数据
      tableData: [],
      // 表格总数据量
      totalItems: 10
    }
  },
  created() {
    this.searchForm = { ...this.searchInitForm }
    this.tableListHandler()
  },
  methods: {
    treeSelectorHandle(data) {
      this.treeSelected = data
    },
    treeDeleteHandle() {
      if (this.treeSelected.label) {
        this.$confirm(`是否要删除 ${this.treeSelected.label} ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$alert('请先选择要删除的数据！', '系统提示', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        })
      }
    },
    // 表格数据封装方法
    tableListHandler() {
      orgRegionQuery(this.searchForm).then(res => {
        console.log(res)
        this.tableData = res.data.rows
        this.totalItems = res.data.records
      })
    },
    // 查询表格方法
    searchHandler() {
      this.searchForm.page = 1
      this.tableListHandler()
    },
    // 重置表格查询条件方法
    resetSearch() {
      this.searchForm = { ...this.searchInitForm }
      this.tableListHandler()
    },
    refreshHandle() {
      this.tableListHandler()
    },
    // 表格请求数据量方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchForm.rows = val
      this.tableListHandler()
    },
    // 表格数据页码变换方法
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.searchForm.page = val
      this.tableListHandler()
    },
    // 表格排序变化方法
    sortChange(sortInfo) {
      console.log(sortInfo)
      this.searchForm.sidx = sortInfo.prop
      this.searchForm.sord = sortInfo.order === 'ascending' ? 'asc' : 'desc'
      this.searchForm.page = 1
      this.tableListHandler()
    },
    // 表格数据删除方法
    orgRegionDeleteHandle(deleteItem) {
      this.$confirm('是否要删除?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          orgRegionDelete(deleteItem.ID)
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
}
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
