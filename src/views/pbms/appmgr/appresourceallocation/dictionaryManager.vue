<template>
  <div class="content">
    <!-- 搜索开始 -->
    <el-form :model="searchIcon" :inline="true">
      <el-form-item label="字典名称：">
        <el-input v-model="roleName" size="small" placeholder="请输入字典名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchData">查询</el-button>
        <el-button type="warning" size="mini" icon="el-icon-refresh" @click="clearSearchData">重置</el-button>
        <el-button type="success" size="mini" icon="el-icon-check" @click="selectData">选择</el-button>
        <el-button type="success" size="mini" icon="el-icon-plus" @click="addData">新增</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="24">
      <!-- 左侧树结构组件 -->
      <el-col :span="6">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">行政组织机构树</span>
            <div v-if="isTreeOper" class="oper_icons">
              <span class="el-icon-plus" @click.stop="treeInsertHandle"></span>
              <span class="el-icon-delete tree-delete" @click.stop="treeDeleteHandle"></span>
            </div>
            <div v-else class="oper_icons forbidden_oper">
              <span class="el-icon-plus"></span>
              <span class="el-icon-delete tree-delete"></span>
            </div>
          </div>
          <!-- 树结构数据 -->
          <org-tree @treeSelector="treeSelectorHandle"></org-tree>
        </div>
      </el-col>
      <!-- 右侧表格 -->
      <el-col :span="18">
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :default-sort="{ prop: 'typeCode', order: 'ascending' }" size="small" border style="width: 100%; margin-top: -10px;" @select="handleSelectChange" @sort-change="sortChange">
          <el-table-column type="selection" width="40" header-align="center"></el-table-column>
          <el-table-column prop="icon" label="字典名称" sortable width="120" align="center"></el-table-column>
          <el-table-column prop="name" label="字典编码" sortable width="120" header-align="center"></el-table-column>
          <el-table-column prop="style" label="字典类型" sortable width="120" align="center"></el-table-column>
          <el-table-column prop="style" label="字典类型编码" sortable width="120" align="center"></el-table-column>
          <el-table-column prop="style" label="字典属性" sortable width="120" align="center"></el-table-column>
          <el-table-column label="操作" width="250" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
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
            <el-pagination :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" class="content-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 编辑对话框 -->
    <el-dialog :append-to-body="true" :visible="showEditDialog" :close-on-click-modal="false" :before-close="cancleDialog" :title="isAdd ? '添加字典窗口' : '编辑字典'" width="60%">
      <el-form ref="editForm" :model="editForm" :rules="formRules" width="80px" label-position="right" size="small">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="字典类型：" label-width="120px" prop="name">
              <el-input v-model="editForm.name" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典编码：" label-width="120px" prop="style">
              <el-input v-model="editForm.type" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="字典名称：" label-width="120px" prop="type">
              <el-input v-model="editForm.number" autocomplete="off" style="width:250px" @input="forceWrite($event)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级字典：" label-width="120px" prop="number">
              <el-input v-model="editForm.weight" autocomplete="off" style="width:200px" @input="forceWrite($event)"></el-input>
              <el-button size="small" class="el-icon-folder-opened" @click="selectParentDictionary"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="字典描述：" label-width="120px">
          <el-input :rows="2" v-model="editForm.tip" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="系统排序：" label-width="120px">
          <el-input-number :min="1" v-model="editForm.sort" controls-position="right" size="small"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" @click="cancleDialog()">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 选择按钮对话框 -->
    <el-dialog :append-to-body="true" :visible="showSelectDialog" :close-on-click-modal="false" :before-close="cancleSelect" title="选择字典" width="60%">
      <!-- 搜索开始 -->
      <el-form :model="searchIcon" :inline="true">
        <el-form-item label="字典类型：">
          <el-select v-model="dictionaryName" placeholder="请选择" size="small">
            <el-option-group v-for="group in dictionaryNameOptions" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="字典名称：">
          <el-input v-model="selectRoleName" size="small" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="searchRoleData">查询</el-button>
          <el-button type="warning" size="mini" icon="el-icon-refresh" @click="clearSearchRoleData">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table v-loading="loading" ref="multipleTable" :data="dictionaryTableData" :default-sort="{ prop: 'typeCode', order: 'ascending' }" size="small" border style="width: 100%; margin-top: -10px;" @select="handleSelectChange" @sort-change="sortChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column prop="name" label="字典名称" sortable width="200" align="center"></el-table-column>
        <el-table-column prop="code" label="字典编码" sortable width="200" header-align="center"></el-table-column>
        <el-table-column prop="type" label="字典类型" sortable align="center"></el-table-column>
        <el-table-column prop="attr" label="字典属性" sortable align="center"></el-table-column>
      </el-table>
      <!-- 底部 -->
      <el-row :gutter="24">
        <el-col :span="3">
          <i class="el-icon-refresh" style="margin:10px;color:green"></i>
        </el-col>
        <el-col :span="21">
          <!-- 分页 -->
          <el-pagination :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" class="content-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmSelect">确 定</el-button>
        <el-button size="small" @click="cancleSelect()">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 父级字典对话框 -->
    <el-dialog :append-to-body="true" :visible="showSelectDialog" :close-on-click-modal="false" :before-close="cancleSelect" title="选择字典" width="60%">
      <!-- 搜索开始 -->
      <el-form :model="searchIcon" :inline="true">
        <el-form-item label="字典类型：">
          <el-select v-model="dictionaryName" placeholder="请选择" size="small">
            <el-option-group v-for="group in dictionaryNameOptions" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="字典名称：">
          <el-input v-model="selectRoleName" size="small" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="searchRoleData">查询</el-button>
          <el-button type="warning" size="mini" icon="el-icon-refresh" @click="clearSearchRoleData">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table v-loading="loading" ref="multipleTable" :data="dictionaryTableData" :default-sort="{ prop: 'typeCode', order: 'ascending' }" size="small" border style="width: 100%; margin-top: -10px;" @select="handleSelectChange" @sort-change="sortChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column prop="name" label="字典名称" sortable width="200" align="center"></el-table-column>
        <el-table-column prop="code" label="字典编码" sortable width="200" header-align="center"></el-table-column>
        <el-table-column prop="type" label="字典类型" sortable align="center"></el-table-column>
        <el-table-column prop="attr" label="字典属性" sortable align="center"></el-table-column>
      </el-table>
      <!-- 底部 -->
      <el-row :gutter="24">
        <el-col :span="3">
          <i class="el-icon-refresh" style="margin:10px;color:green"></i>
        </el-col>
        <el-col :span="21">
          <!-- 分页 -->
          <el-pagination :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" class="content-pagination" align="center" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmSelect">确 定</el-button>
        <el-button size="small" @click="cancleSelect()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {
    OrgTree: () => import('../../org/components/orgsTree.vue')
  },
  data() {
    return {
      // 表格数据
      tableData: [
        {
          sort: 1,
          name: 'fa  fa-ambulance',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 2,
          name: 'fa  fa-sort',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 3,
          name: 'fa fa-adjust',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 4,
          name: 'fa fa-adn',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 5,
          name: 'fa fa-align-center',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 6,
          name: 'fa fa-align-justify',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        },
        {
          sort: 7,
          name: 'fa fa-align-left',
          style: 'bigger100',
          type: 'BOOTSTRAP'
        }
      ],
      // 表格多选数据
      multipleSelection: [],
      // 搜索数据
      searchIcon: {},
      // 搜索--角色名称
      roleName: '',
      // 搜索--图标分类
      iconClassify: '常用图标',
      iconClassifyOption: [
        '常用图标',
        'Web图标',
        '文件图标',
        '旋转图标',
        '表单图标',
        '支付图标',
        '图表图标',
        '货币图标',
        '方向图标',
        '媒体图标',
        '标志图标',
        '医疗图标'
      ],
      iconType: ['BOOTSTRAP', 'MATERIAL-DESIGN', 'ECGAP3.5'],
      // 分页--当前页数
      currentPage: 1,
      // 分页--每页显示条目个数
      pageSize: 10,
      // 分页--总条目数
      total: 10,
      loading: false,
      // 编辑弹框是否显示
      showEditDialog: false,
      // 点击编辑传给子组件的用户信息
      editForm: {},
      // 表单验证规则
      formRules: {
        name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
        type: [{ required: true, message: '请输入字典类型', trigger: 'blur' }]
      },
      // 是否是添加操作
      isAdd: false,
      // 排序字段
      sortName: '',
      // 排序方式
      sort: 'asc',
      // 选择角色对话框是否显示
      showSelectDialog: false,
      // 选择角色
      selectRoleName: '',
      roleTableData: [],
      isTreeOper: false,
      dictionaryName: '',
      dictionaryNameOptions: [
        {
          label: '国家标准字典',
          options: [
            {
              value: '组织机构类型',
              label: '组织机构类型'
            },
            {
              value: '国民经济行业分类',
              label: '国民经济行业分类'
            },
            {
              value: '电子证照企业持有证类型',
              label: '电子证照企业持有证类型'
            },
            {
              value: '健康状况代码',
              label: '健康状况代码'
            },
            {
              value: '证件类型',
              label: '证件类型'
            },
            {
              value: '职务',
              label: '职务'
            },
            {
              value: '性别代码',
              label: '性别代码'
            },
            {
              value: '婚姻状态代码',
              label: '婚姻状态代码'
            },
            {
              value: '经济类型分类与代码',
              label: '经济类型分类与代码'
            },
            {
              value: '电子证照个人持有证类型',
              label: '电子证照个人持有证类型'
            },
            {
              value: '学历',
              label: '学历'
            },
            {
              value: '政治面貌',
              label: '政治面貌'
            }
          ]
        },
        {
          label: '地方标准字典',
          options: [
            {
              value: '山东省地方标准',
              label: '山东省地方标准'
            },
            {
              value: '湖北省地方标准',
              label: '湖北省地方标准'
            }
          ]
        },
        {
          label: '行业标准字典',
          options: [
            {
              value: '工商行业标准',
              label: '工商行业标准'
            },
            {
              value: '公安行业标准',
              label: '公安行业标准'
            }
          ]
        },
        {
          label: '自定义字典',
          options: [
            {
              value: '审批深度',
              label: '审批深度'
            },
            {
              value: '材料审核状态',
              label: '材料审核状态'
            },
            {
              value: '员工政治面貌',
              label: '员工政治面貌'
            },
            {
              value: '组织机构现状',
              label: '组织机构现状'
            },
            {
              value: '常用书签',
              label: '常用书签'
            },
            {
              value: '申请材料类型编码',
              label: '申请材料类型编码'
            },
            {
              value: '强制执行方式',
              label: '强制执行方式'
            }
          ]
        }
      ],
      dictionaryTableData: [
        {
          name: '项目类型',
          code: 'Project_Type',
          type: '常用书签',
          attr: '自定义字典'
        },
        {
          name: '税费类',
          code: 'SFL',
          type: '事项类型',
          attr: '自定义字典'
        },
        {
          name: '政府',
          code: '0',
          type: '投资来源',
          attr: '自定义字典'
        },
        {
          name: '企业法人',
          code: 'A05201',
          type: '投资审批项目法人证照类型',
          attr: '自定义字典'
        },
        {
          name: '股份合作',
          code: '13',
          type: '经济类型分类与代码',
          attr: '国家标准字典'
        },
        {
          name: '中国光大银行',
          code: 'ZGGDYH',
          type: '单位开户银行',
          attr: '自定义字典'
        },
        {
          name: '法人',
          code: 'Legal_Person',
          type: '法定代表人类型',
          attr: '自定义字典'
        },
        {
          name: '上报件',
          code: '3',
          type: '事项办件类型编码',
          attr: '自定义字典'
        },
        {
          name: '深圳发展银行',
          code: 'SZFZYH',
          type: '单位开户银行',
          attr: '自定义字典'
        },
        {
          name: '审批核准阶段',
          code: 'JD0001',
          type: '投资审批项目过程阶段',
          attr: '自定义字典'
        }
      ]
    }
  },
  mounted() {
    this.total = this.tableData.length
  },
  methods: {
    // 搜索查询
    searchData() {
      // 发请求
    },
    // 重置
    clearSearchData() {
      this.iconName = ''
      this.iconClassify = ''
    },
    // 表格多选--当用户手动勾选数据行的 Checkbox 时触发的事件
    /**
     * selection 当前选中的行数据，[{}]
     * row 当前选中的行数据， {}
     */
    handleSelectChange(selection, row) {
      console.log(selection)
      console.log(row)
      this.multipleSelection = row
    },
    // 编辑按钮
    handleEdit(data) {
      console.log(data)
      this.showEditDialog = true
      this.editForm = data
      this.isAdd = false
    },
    // 删除按钮
    handleDelete(data, index) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // const res = await deleteUserTypeById({
          //   id: userType.ID
          // });
          // console.log(res);
          // const { status } = res;
          // if (status === "200") {
          //   // 把页码重置为第一页
          //   this.currentPage = 1;
          //   this.getTableData();
          this.tableData.splice(index, 1)
          this.$message.success('删除成功!')
          // }
        })
        .catch(() => {
          this.$message.warning('取消删除!')
        })
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
    },
    // 分页pageSize 改变时会触发
    handleSizeChange(val) {
      console.log(val)
    },
    // 分页currentPage 改变时会触发
    handleCurrentChange(currentChange) {
      // currentChange当前页
      console.log(currentChange)
    },
    // 添加按钮
    addData() {
      this.isAdd = true
      this.showEditDialog = true
      this.editForm.name = ''
      this.editForm.style = 'bigger100'
      this.editForm.type = 'MATERIAL-DESIGN'
      this.editForm.iconClassify = '常用图标'
      this.editForm.sort = 1
    },
    // 编辑弹框的取消按钮
    cancleDialog() {
      this.showEditDialog = false
    },
    // 编辑或添加弹框的确定按钮
    submitForm() {
      this.showEditDialog = false
      if (this.isAdd) {
        this.editForm.createTime = '2019-12-31'
        this.tableData.unshift({
          sort: this.editForm.sort,
          name: this.editForm.name,
          createTime: this.editForm.createTime
        })
      }
    },
    forceWrite(e) {
      this.$forceUpdate()
    },
    selectData() {
      this.showSelectDialog = true
    },
    // 选择角色确定按钮
    confirmSelect() {
      this.showSelectDialog = false
    },

    cancleSelect() {
      this.showSelectDialog = false
    },
    searchRoleData() {},
    clearSearchRoleData() {
      this.selectRoleName = ''
    },
    formatIcon(icon) {
      return '<i class="el-icon-delete" style="color:red"></i>'
    },
    treeInsertHandle() {
      console.log('111')
    },
    treeDeleteHandle() {
      console.log('111')
    },
    treeSelectorHandle() {},
    // 选择父级字典
    selectParentDictionary() {
      console.log('111')
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
.org_tree {
  margin-top: -20px;
}
.org_tree,
.table_wrap {
  padding: 10px;
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
.el-icon-delete.tree-delete {
  padding: 3px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
.el-icon-plus {
  background: green;
}
.el-icon-delete.tree-delete {
  background: #f35958;
}
.color_red {
  color: red;
}
.tip_info {
  font-size: 12px;
  margin: 0 30px;
}
</style>
