<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              <el-button-group>
                <el-button type="primary" size="small" @click.stop.prevent="openAddWin">添加</el-button>
              </el-button-group>
            </template>
            <el-divider style="margin-top: 0;margin-bottom: 1px;!important"></el-divider>
            <!-- 查询条件 -->
            <el-form ref="queryConditionForm" :inline="true" :model="queryConditionModel" label-width="80px">
              <el-form-item label="类型名称">
                <el-input v-model="queryConditionModel.name" placeholder="请输入类型名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="queryListByBtn">查询</el-button>
                <el-button type="warning" size="small" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>应用分类</span>
          </div>
          <el-tree :data="treeData" :render-content="renderContent" :props="defaultProps" node-key="ID" @node-click="handleNodeClick">

          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-table ref="appTypeTable" :data="appTypeTableData" border style="width: 100%">
          <el-table-column prop="CODE" label="类型编码" width="180">
          </el-table-column>
          <el-table-column prop="NAME" label="类型名称">
          </el-table-column>
          <el-table-column :formatter="formatterCREATE_TIME" prop="CREATE_TIME" label="创建时间">
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip align="center" width="130">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" type="primary" size="mini" @click="openEditWin(scope.$index, scope.row)"></el-button>
              <el-button icon="el-icon-delete" type="danger" size="mini" @click="delSingle(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="queryConditionModel.page" :page-sizes="[10, 20, 30, 40,50]" :page-size="queryConditionModel.rows" :total="appTypeTableDataTotal" align="center" background layout="sizes, prev, pager, next" @current-change="queryListByPagination">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 新增或编辑窗口 -->
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" :append-to-body="true" :close-on-click-modal="true" width="40%">
      <el-divider style="margin-top: 0;margin-bottom: 1px;!important"></el-divider>
      <el-form ref="appTypeForm" :inline-message="true" :model="appTypeFormDataModel" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型编码" prop="CODE">
              <el-input v-model="appTypeFormDataModel.CODE" placeholder="请输入类型编码">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型名称" prop="NAME">
              <el-input v-model="appTypeFormDataModel.NAME" placeholder="请输入类型名称">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="父级类型" prop="TYPE">
              <el-select ref="appTypeSelect" :disabled="isEdit" v-model="appTypeFormDataModel.TYPE" placeholder="请选择父级类型" style="width: 100%;">
                <el-option :value=" appTypeFormDataModel.TYPE" :label="appTypeFormDataModel.TYPENAME" style="width: 100%;height:200px;overflow: auto;background-color:#fff">
                  <el-tree :data="treeData" :props="defaultProps" @node-click="handleSelectNodeClick"></el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型描述" prop="REMARK">
              <el-input :rows="2" v-model="appTypeFormDataModel.REMARK" type="textarea" placeholder="请输入内容">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="系统排序" prop="ROWNUM_">
              <el-input-number v-model="appTypeFormDataModel.ROWNUM_" :min="1" size="medium"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider style="margin-top: 0;margin-bottom: 1px;!important"></el-divider>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveOrUpdateForm">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { parseTime } from '../../../../utils/index'
export default {
  data() {
    return {
      // 左侧树数据绑定
      treeData: [
        {
          NAME: '应用平台',
          ID: '222222222222222222222222222222222222',
          isLeaf: false,
          children: [
            { NAME: '业务应用', ID: '4', isLeaf: true },
            { NAME: '协作组件', ID: '5', isLeaf: true }
          ]
        },
        {
          NAME: '数据平台',
          ID: '3',
          isLeaf: false,
          children: [
            { NAME: '数据目录', ID: '6', isLeaf: true },
            { NAME: '数据管理', ID: '7', isLeaf: true }
          ]
        }
      ],

      defaultProps: {
        children: 'children',
        label: 'NAME'
      },

      appTypeTableData: [
        {
          CODE: 'IGDP',
          CREATE_TIME: 1450143272000,
          CREATOR: '88888888888888888888888888888888',
          ID: '222222222222222222222222222222222222',
          NAME: '数据平台',
          ROWNUM_: 1,
          STATUS: 1,
          TYPE: '7'
        }
      ],

      appTypeTableDataTotal: 1,

      // 查询条件初始化
      queryConditionInitModel: {
        parent_id: '',
        name: '',
        page: 1,
        rows: 10
      },

      // 查询条件绑定
      queryConditionModel: {},

      formTitle: '', // 表单标题
      // 表单数据初始化model
      appTypeFormDataInitModel: {
        CODE: '',
        CREATE_TIME: '',
        CREATOR: '',
        ID: '',
        NAME: '',
        ROWNUM_: '',
        STATUS: '',
        TYPE: '',
        TYPENAME: ''
      },
      // 表单数据绑定
      appTypeFormDataModel: {},
      rules: {
        CODE: [{ required: true, message: '请输入类型编码', trigger: 'blur' }],
        NAME: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
        TYPE: [{ required: true, message: '请选择父级类型', trigger: 'change' }]
      },
      isEdit: false,
      dialogFormVisible: false
    }
  },

  created() {
    this.resetQuery()
  },

  methods: {
    // 左侧树图标渲染
    renderContent(h, { node, data, store }) {
      if (data.isLeaf === false) {
        return (
          <span>
            <i class='el-icon-folder' />
            <span> {data.NAME}</span>
          </span>
        )
      } else {
        return (
          <span>
            <i class='el-icon-document' />
            <span> {data.NAME}</span>
          </span>
        )
      }
    },

    // 左侧树点击节点处理
    handleNodeClick(data) {
      this.queryConditionModel = { ...this.queryConditionInitModel }
      this.queryConditionModel.parent_id = data.ID
      this.queryListByCondition()
    },

    // 获取左侧树数据
    getTreeData() {},

    // 由分页Pagination中触发查询
    queryListByPagination(val) {
      console.log('Pagination queryList!')
      this.queryConditionModel.page = val
      this.queryListByCondition()
    },

    // 由查询按纽触发查询
    queryListByBtn() {
      console.log('Btn queryList!')
      this.queryConditionModel.page = 1
      this.queryListByCondition()
    },

    // 根据查询条件查询
    queryListByCondition() {
      console.log(JSON.stringify(this.queryConditionInitModel))
      console.log(JSON.stringify(this.queryConditionModel))
    },

    // 查询条件重置
    resetQuery() {
      this.queryConditionModel = { ...this.queryConditionInitModel }
    },

    // 打开添加窗口
    openAddWin() {
      this.formTitle = '添加应用类型'
      this.isEdit = false
      this.appTypeFormDataModel = { ...this.appTypeFormDataInitModel }
      this.dialogFormVisible = true
      if (this.$refs.appTypeForm) {
        this.$refs.appTypeForm.resetFields()
      }
    },

    // 打开编辑窗口
    openEditWin(index, row) {
      this.formTitle = '编辑应用类型'
      this.isEdit = true
      this.appTypeFormDataModel = { ...row }

      const node = this.findPathByLeafId(row.TYPE, this.treeData)[0]
      this.appTypeFormDataModel.TYPE = node.ID
      this.appTypeFormDataModel.TYPENAME = node.NAME

      this.dialogFormVisible = true
      if (this.$refs.appTypeForm) {
        this.$refs.appTypeForm.resetFields()
      }
    },

    // 删除单个
    delSingle() {
      this.$confirm('确定删除吗?', '提示', {
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
    },

    // 保存或修改更新
    saveOrUpdateForm() {
      console.log(this.appTypeFormDataModel)
    },

    // 表单中的树选择
    handleSelectNodeClick(node) {
      this.appTypeFormDataModel.TYPE = node.ID
      this.appTypeFormDataModel.TYPENAME = node.NAME
      this.$refs.appTypeSelect.blur()
    },

    // 创建时间格式化
    formatterCREATE_TIME(row, column) {
      const text = parseTime(row[column.property])
      return text
    },

    // 递归树，编辑时反向查找
    findPathByLeafId(leafId, nodes, path) {
      if (path === undefined) {
        path = []
      }

      for (var i = 0; i < nodes.length; i++) {
        var tmpPath = path.concat()
        if (leafId === nodes[i].ID) {
          tmpPath.push(nodes[i])
          return tmpPath
        }
        if (nodes[i].children) {
          var findResult = this.findPathByLeafId(
            leafId,
            nodes[i].children,
            tmpPath
          )
          if (findResult) {
            return findResult
          }
        }
      }
    }
  }
}
</script>

<style scope>
.app-container {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}
.el-card__header {
  height: 48px;
}
.el-card__body {
  height: calc(100vh - 220px);
  overflow: auto;
}

.el-table--border {
  border-radius: 4px;
  margin-left: 20px;
}

.el-col-18 {
  padding-right: 20px;
}

.el-collapse-item__content {
  padding-bottom: 0px;
}
.el-divider--horizontal {
  margin: 1px 0;
}
.el-form-item {
  margin-bottom: 2px;
}
.el-dialog__body {
  padding-top: 0;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
  width: 80px;
}

.el-select-width {
  width: 100%;
}

.el-input-number--medium {
  width: 100%;
}
</style>
