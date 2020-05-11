<template>
  <div class="app-container">
    <el-collapse>
      <el-collapse-item>
        <template slot="title">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click.stop.prevent="openAddWin">添加</el-button>
            <el-button type="primary" size="small" icon="el-icon-search"></el-button>
          </el-button-group>
        </template>
        <el-divider style="margin-top: 0;margin-bottom: 1px;!important"></el-divider>
        <!-- 查询条件 -->
        <el-form ref="queryConditionForm" :inline="true" :model="queryConditionModel" label-width="80px">
          <el-form-item label="公共主题">
            <el-input v-model="queryConditionModel.NAME" placeholder="请输入公告主题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="queryListByBtn">查询</el-button>
            <el-button type="warning" size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-table ref="appNoticeTable" :data="appNoticeTableData" border style="width: 100%">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column prop="ORG_NAME" label="发布机关" width="180">
      </el-table-column>
      <el-table-column prop="NAME" label="公告主题">
      </el-table-column>
      <el-table-column prop="TYPE" label="公告类型" width="180">
      </el-table-column>
      <el-table-column prop="PUBLIC_TIME" label="发布时间" width="180">
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip align="center" width="130">
        <template slot-scope="scope">
          <el-button icon="el-icon-view" type="primary" size="mini" @click="openViewWin(scope.$index, scope.row)"></el-button>
          <el-button icon="el-icon-delete" type="danger" size="mini" @click="delSingle(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="queryConditionModel.page" :page-sizes="[10,20,30,40,50]" :page-size="queryConditionModel.rows" :total="tableDataTotal" align="center" background layout="sizes ,prev, pager, next" @current-change="queryListByPagination">
    </el-pagination>
    <!-- 新增或编辑窗口 -->
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" :append-to-body="true" :close-on-click-modal="true" width="40%">
      <el-divider style="margin-top: 0;margin-bottom: 1px;!important"></el-divider>
      <el-form ref="appNoticeForm" :inline-message="true" :model="appNoticeFormDataModel" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="公告主题" prop="name">
              <el-input v-model="appNoticeFormDataModel.name" placeholder="请输入公告主题">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统名称" prop="appCode">
              <el-select v-model="appNoticeFormDataModel.appCode" placeholder="请选择系统名称" class="el-select-width">
                <el-option v-for="item in appCodeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="公告类型" prop="type">
              <el-select v-model="appNoticeFormDataModel.type" placeholder="请选择公告类型" class="el-select-width">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发布单位" prop="orgCode">
              <el-select ref="orgCodeSelect" v-model="appNoticeFormDataModel.orgCode" placeholder="请选择发布单位" class="el-select-width">
                <el-option :value="appNoticeFormDataModel.orgCode" :label="appNoticeFormDataModel.orgName" style="width: 100%;height:200px;overflow: auto;background-color:#fff">
                  <el-tree :data="orgTreeData" :props="defaultProps" @node-click="handleSelectOrgCodeNodeClick"></el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="接收单位" prop="receiveOrgan">
              <el-select ref="receiveOrganSelect" v-model="appNoticeFormDataModel.receiveOrgan" placeholder="请选择接收单位" class="el-select-width" @visible-change="receiveOrganSelectChange()">
                <el-option :value="appNoticeFormDataModel.receiveOrgan" :label="appNoticeFormDataModel.receiveOrganName" style="width: 100%;height:200px;overflow: auto;background-color:#fff">
                  <elTree2 ref="receiveOrganTree" :render-content="renderContentReceiveOrgan" :data="orgTreeData" :props="defaultProps" :check-strictly="true" node-key="id" show-checkbox>
                  </elTree2>
                </el-option>
              </el-select>
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
import Vue from 'vue'
import elTree2 from '../../cuscomponent/tree/src/tree.vue'
Vue.component('elTree2', elTree2)
export default {
  data() {
    return {
      appCodeOptions: [
        { label: '云调度', value: '1' },
        { label: '云报表', value: '2' }
      ],
      typeOptions: [
        { label: '系统通知', value: '1' },
        { label: '考试公告', value: '2' }
      ],
      orgTreeData: [
        {
          label: '河北省',
          children: [
            {
              label: '廊坊市',
              children: [
                {
                  label: '三河市',
                  children: [
                    {
                      label: '政府税务局',
                      isOper: true,
                      children: [
                        {
                          label: '三农办事处',
                          id: '001',
                          type: 'org'
                        },
                        {
                          label: '四农处',
                          id: '002',
                          type: 'org'
                        }
                      ]
                    },
                    {
                      label: '党委税务局'
                    },
                    {
                      label: '区划派驻机关税务局'
                    },
                    {
                      label: '燕郊镇'
                    },
                    {
                      label: '区划直属机关税务局'
                    },
                    {
                      label: '人大税务局'
                    }
                  ]
                },
                {
                  label: '大厂回族自治县',
                  children: [
                    {
                      label: '大厂镇'
                    },
                    {
                      label: '夏垫镇'
                    },
                    {
                      label: '祁各庄镇'
                    },
                    {
                      label: '北辰街道办事处'
                    },
                    {
                      label: '陈府镇'
                    },
                    {
                      label: '大厂工业园区'
                    },
                    {
                      label: '县直单位'
                    },
                    {
                      label: '邵府镇'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      // 查询条件初始化
      queryConditionInitModel: {
        NAME: '',
        page: 1,
        rows: 2
      },

      // 查询条件绑定
      queryConditionModel: {},

      appNoticeTableData: [
        {
          ID: '1',
          ORG_NAME: '三农办事处',
          NAME: '测试',
          TYPE: '系统通知',
          PUBLIC_TIME: '2019-12-31	'
        }
      ],
      tableDataTotal: 1,
      formTitle: '',
      isEdit: false,
      dialogFormVisible: false,
      appNoticeFormDataInitModel: {
        name: '',
        appCode: '',
        type: '',
        regionCode: '',
        regionName: '',
        orgCode: '',
        orgName: '',
        receiveOrgan: '',
        receiveOrganName: '',
        content: '',
        filename: '',
        url: ''
      },

      appNoticeFormDataModel: {},
      rules: {}
    }
  },
  methods: {
    // 表单中的发布单位树选择
    handleSelectOrgCodeNodeClick(node) {
      this.appNoticeFormDataModel.orgCode = node.id
      this.appNoticeFormDataModel.orgName = node.label
      this.$refs.orgCodeSelect.blur()
    },

    renderContentReceiveOrgan(h, { node, data, store }) {
      if (data.type !== 'org') {
        return (
          <span>
            <span> {data.label}</span>
          </span>
        )
      } else {
        return (
          <span>
            <span> {data.label}</span>
          </span>
        )
      }
    },

    receiveOrganSelectChange() {
      if (this.$refs.receiveOrganTree) {
        console.log(this.$refs.receiveOrganTree.getCheckedNodes())
        const value = []
        const text = []
        this.$refs.receiveOrganTree.getCheckedNodes().forEach(item => {
          value.push(item.id)
          text.push(item.label)
        })
        this.appNoticeFormDataModel.receiveOrgan = value.join(',')
        this.appNoticeFormDataModel.receiveOrganName = text.join(',')
      }
    },
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
      this.formTitle = '添加应用通知公告'
      this.isEdit = false
      this.appNoticeFormDataModel = { ...this.appNoticeFormDataInitModel }
      this.dialogFormVisible = true
      if (this.$refs.appNoticeForm) {
        this.$refs.appNoticeForm.resetFields()
      }
      if (this.$refs.receiveOrganTree) {
        this.$refs.receiveOrganTree.setCheckedKeys([])
      }
    },

    // 打开查看窗口
    openEditWin(index, row) {
      this.formTitle = '查看应用通知公告'
      this.isEdit = false
      this.appNoticeFormDataModel = { ...row }

      this.dialogFormVisible = true
      if (this.$refs.appNoticeForm) {
        this.$refs.appNoticeForm.resetFields()
      }
    },

    saveOrUpdateForm() {
      console.log(this.appNoticeFormDataModel)
      this.dialogFormVisible = false
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
    }
  }
}
</script>

<style>
.app-container {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}
.el-table--border {
  margin-left: 0;
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
  /* padding-bottom: 0; */
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
