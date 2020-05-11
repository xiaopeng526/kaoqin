<template>
  <div class="app-container">
    <el-collapse>
      <el-collapse-item>
        <template slot="title">
          <el-button-group>
            <el-button type="primary" size="small" @click.stop.prevent="openAddWin">添加</el-button>
            <el-button type="primary" size="small" @click.stop.prevent="openEditWin">编辑</el-button>
            <el-button type="primary" size="small" icon="el-icon-delete" @click.stop.prevent="delBatch">删除</el-button>
          </el-button-group>
        </template>
        <el-divider style="margin-top: 0;margin-bottom: 1px;!important"></el-divider>
        <!-- 查询条件 -->
        <el-form ref="queryConditionForm" :inline="true" :model="queryConditionModel" label-width="80px">
          <el-form-item label="应用名称">
            <el-input v-model="queryConditionModel.appName" placeholder="请输入应用名称"></el-input>
          </el-form-item>
          <el-form-item label="应用分类">
            <el-select v-model="queryConditionModel.appClassfy" placeholder="请选择应用分类">
              <el-option-group v-for="group in appClassfyOptions" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="queryListByBtn">查询</el-button>
            <el-button type="warning" size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <template>
      <el-table ref="appTable" :data="tableData" border style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="appCode" label="应用编码" width="180">
        </el-table-column>
        <el-table-column prop="appName" label="应用名称" width="180">
        </el-table-column>
        <el-table-column prop="appShortName" label="应用简称">
        </el-table-column>
        <el-table-column :formatter="formatAppType" prop="appType" label="应用类型" width="80">
        </el-table-column>
        <el-table-column prop="appUrl" label="应用地址" width="260">
        </el-table-column>
        <el-table-column :formatter="formatAppClassfy" prop="appClassfy" label="应用分类">
        </el-table-column>
        <el-table-column :formatter="formatAppJoinType" prop="appJoinType" label="接入类型">
        </el-table-column>
      </el-table>
      <el-pagination :current-page="queryConditionModel.page" :page-size="queryConditionModel.rows" :total="tableDataTotal" align="center" background layout="prev, pager, next" @current-change="queryListByPagination">
      </el-pagination>
    </template>
    <!-- 新增或编辑窗口 -->
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" :append-to-body="true" :close-on-click-modal="true" width="70%">
      <el-divider style="margin-top: 0;margin-bottom: 1px;!important"></el-divider>
      <el-form ref="appInfoForm" :inline-message="true" :model="appInfoFormDataModel" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用编码" prop="appCode">
              <el-input v-model.trim="appInfoFormDataModel.appCode" size="medium" placeholder="请输入应用编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用名称" prop="appName">
              <el-input v-model.trim="appInfoFormDataModel.appName" size="medium" placeholder="请输入应用名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用类型" prop="appType">
              <el-select v-model="appInfoFormDataModel.appType" size="medium" placeholder="请选择应用类型" class="el-select-width">
                <el-option v-for="item in appTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用简称" prop="appShortName">
              <el-input v-model.trim="appInfoFormDataModel.appShortName" size="medium" placeholder="请输入应用简称(5汉字以内)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用地址" prop="appUrl">
              <el-input v-model="appInfoFormDataModel.appUrl" placeholder="请写主机域名或IP地址" class="input-with-select">
                <el-select slot="prepend" v-model="appInfoFormDataModel.appUrlType" placeholder="请选择">
                  <el-option label="http" value="1"></el-option>
                  <el-option label="https" value="2"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用分类" prop="appClassfy">
              <el-select v-model="appInfoFormDataModel.appClassfy" placeholder="请选择应用分类" class="el-select-width">
                <el-option-group v-for="group in appClassfyOptions" :key="group.label" :label="group.label">
                  <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="编辑语言" prop="language">
              <el-select v-model="appInfoFormDataModel.language" size="medium" placeholder="请选择编辑语言" class="el-select-width">
                <el-option v-for="item in languageOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接入类型" prop="language">
              <el-select v-model="appInfoFormDataModel.appJoinType" size="medium" placeholder="请选择接入类型" class="el-select-width">
                <el-option v-for="item in appJoinTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用主题" prop="color">
              <el-select v-model="appInfoFormDataModel.color" size="medium" placeholder="请选择应用主题" class="el-select-width">
                <el-option v-for="item in colorOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sortOrder">
              <el-input-number v-model="appInfoFormDataModel.sortOrder" :min="1" size="medium"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remark">
              <el-input :rows="2" v-model="appInfoFormDataModel.remark" type="textarea" placeholder="请输入内容">
              </el-input>
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
    <!-- <h1>应用信息管理</h1>
    <h3>应用信息管理是对平台内部应用和平台接入的外部应用的基本信息管理，主要包含应用的标识码、应用名称、应用LOGO等信息进行管理。</h3> -->

  </div>
</template>

<script>
import { getAppInfoList } from '../../../../api/pbms/appmgr/appinfomgr'
import { validateUrlAll } from '../../../../utils/validate'
export default {
  data() {
    return {
      // 字典数据
      appTypeOptions: [
        { value: '1', label: '内部应用' },
        { value: '2', label: '外部应用' }
      ],
      appClassfyOptions: [
        {
          label: '应用平台',
          options: [
            {
              value: '1',
              label: '业务应用'
            },
            {
              value: '2',
              label: '协作组件'
            }
          ]
        },
        {
          label: '数据平台',
          options: [
            {
              value: '3',
              label: '数据目录'
            },
            {
              value: '4',
              label: '数据管理'
            }
          ]
        }
      ],
      appJoinTypeOptions: [
        { value: '1', label: '站内应用' },
        { value: '2', label: 'WEB接入' }
      ],
      languageOptions: [
        { value: 'JAVA', label: 'JAVA' },
        { value: 'PHP', label: 'PHP' }
      ],
      colorOptions: [
        { value: '1', label: '1111' },
        { value: '2', label: '2222' }
      ],

      // 查询条件初始化
      queryConditionInitModel: {
        appName: '',
        appClassfy: '',
        page: 1,
        rows: 2
      },

      // 查询条件绑定
      queryConditionModel: {},

      // 表格数据
      tableData: [
        {
          id: '1',
          appCode: 'INSPUR-DZZW-ARCH',
          appName: '归档管理系统',
          appShortName: '归档管理',
          appType: '1',
          appUrl: 'http://10.189.82.130:8098/Archive',
          appUrlType: '1',
          language: 'JAVA',
          color: '1',
          sortOrder: 1,
          appClassfy: '4',
          appJoinType: '1',
          remark: '111'
        },
        {
          id: '2',
          appCode: 'INSPUR-DZZW-ARCH',
          appName: '归档管理系统',
          appShortName: '归档管理',
          appType: '1',
          appUrl: 'http://10.189.82.130:8098/Archive',
          appClassfy: '4',
          appJoinType: '1'
        },
        {
          id: '3',
          appCode: 'INSPUR-DZZW-ARCH',
          appName: '归档管理系统',
          appShortName: '归档管理',
          appType: '1',
          appUrl: 'http://10.189.82.130:8098/Archive',
          appClassfy: '4',
          appJoinType: '1'
        },
        {
          id: '4',
          appCode: 'INSPUR-DZZW-ARCH',
          appName: '归档管理系统',
          appShortName: '归档管理',
          appType: '1',
          appUrl: 'http://10.189.82.130:8098/Archive',
          appClassfy: '4',
          appJoinType: '1'
        },
        {
          id: '5',
          appCode: 'INSPUR-DZZW-ARCH',
          appName: '归档管理系统',
          appShortName: '归档管理',
          appType: '1',
          appUrl: 'http://10.189.82.130:8098/Archive',
          appClassfy: '4',
          appJoinType: '1'
        }
      ],

      tableDataTotal: 5, // 表格数据总条数

      dialogFormVisible: false, // 控制弹出表单的显示与隐藏

      isEdit: false, // 弹出表单是否为编辑状态，
      formTitle: '',
      // 弹出表单初始化
      appInfoFormDataInitModel: {
        appCode: '',
        appName: '',
        appShortName: '',
        appType: '1',
        appUrl: '',
        appUrlType: '1',
        language: 'JAVA',
        color: '1',
        sortOrder: 1,
        appClassfy: '4',
        appJoinType: '1',
        remark: ''
      },
      // 弹出表单数据绑定
      appInfoFormDataModel: {},
      rules: {
        appCode: [
          { required: true, message: '请输入应用编码', trigger: 'blur' }
        ],
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        appType: [
          { required: true, message: '请选择应用类型', trigger: 'change' }
        ],
        appShortName: [
          { required: true, message: '请输入应用简称', trigger: 'blur' },
          { min: 1, max: 5, message: '不能超过5个汉字', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]{0,}$/, message: '请输入汉字' }
        ],
        appUrl: [
          { required: true, message: '请输入应用地址', trigger: 'blur' },
          { validator: validateUrlAll, trigger: 'blur' }
        ],
        appClassfy: [
          { required: true, message: '请选择应用分类', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.resetQuery()
  },

  methods: {
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

      getAppInfoList(this.queryConditionModel)
        .then(res => {
          console.log('------->getAppInfoList', res)
          // this.tableData = res.rows;
          // this.tableDataTotal = res.records;
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 查询条件重置
    resetQuery() {
      this.queryConditionModel = { ...this.queryConditionInitModel }
    },

    // 打开添加窗口
    openAddWin() {
      console.log('openAddWin')
      this.formTitle = '添加应用信息'
      this.appInfoFormDataModel = { ...this.appInfoFormDataInitModel }
      this.isEdit = false
      this.dialogFormVisible = true
      if (this.$refs.appInfoForm) {
        this.$refs.appInfoForm.resetFields()
      }
    },

    // 打开编辑窗口
    openEditWin() {
      console.log('openEditWin')
      this.formTitle = '编辑应用信息'
      const selectData = this.$refs.appTable.selection
      if (selectData.length !== 1) {
        this.$message({
          title: '提示',
          message: '请选中一条',
          type: 'warning',
          duration: 2500
        })
      } else {
        this.isEdit = true
        this.appInfoFormDataModel = { ...selectData[0] }
        this.dialogFormVisible = true
        if (this.$refs.appInfoForm) {
          this.$refs.appInfoForm.resetFields()
        }
      }
    },

    // 批量删除
    delBatch() {
      console.log('del')
      const selectData = this.$refs.appTable.selection
      console.log(selectData.length)
      if (selectData.length === 0) {
        this.$message({
          title: '提示',
          message: '请至少选中一条',
          type: 'warning',
          duration: 2500
        })
      } else {
        console.log('111')
      }
    },

    /**
     * 保存或更新提交表单数据
     */
    saveOrUpdateForm() {
      this.$refs.appInfoForm.validate(valid => {
        if (valid) {
          this.dialogFormVisible = false

          this.$message({
            title: '提示',
            message: '保存成功',
            type: 'success',
            duration: 2500
          })
        } else {
          this.$message({
            title: '提示',
            message: '请输入正确数据',
            type: 'error',
            duration: 2500
          })
          return false
        }
      })
    },

    // 表格数据中应用类型格式化
    formatAppType(row, column) {
      let text = '未知'
      this.appTypeOptions.forEach(function(key, v) {
        if (key.value === row[column.property]) {
          text = key.label
        }
      })
      return text
    },

    // 表格数据中应用分类格式化
    formatAppClassfy(row, column) {
      console.log(row, column)
      console.log(row[column.property])
      let text = '未知'
      const curVal = row[column.property]
      this.appClassfyOptions.forEach(function(key) {
        key.options.forEach(function(childkey) {
          console.log(childkey.value)
          if (childkey.value === curVal) {
            text = childkey.label
          }
        })
      })
      return text
    },
    // 表格数据中接入类型格式化
    formatAppJoinType(row, column) {
      console.log(row, column)
      console.log(row[column.property])
      let text = '未知'
      this.appJoinTypeOptions.forEach(function(key) {
        console.log(key.value)
        if (key.value === row[column.property]) {
          text = key.label
        }
      })
      return text
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
