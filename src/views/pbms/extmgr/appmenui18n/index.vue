<template>
  <div class="org_region">
    <el-row>
      <el-col :span="7">
        <div class="org_tree">
          <div class="tree_header">
            <span class="tree_title">资源菜单树</span>
            <el-select v-model="system" placeholder="请选择" size="mini">
              <el-option v-for="item in systemList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="tree_main">
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="internation_form_wrap">
          <div class="form_title">应用菜单国际化</div>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" size="mini">
            <el-form-item label="选择的菜单" prop="menu">
              <div class="color_red">
                <b v-if="ruleForm.menu">{{ ruleForm.menu }}</b>
                <b v-else>
                  请选择要配置的菜单
                </b>
              </div>
            </el-form-item>
            <el-form-item label="国际化语言" prop="region">
              <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国际化名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <div>
            <span class="color_red">
              注意：
            </span>
            <span>
              请根据左边的应用菜单，选择国际化语言，实现菜单的国际化。
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import {
//   orgRegionQuery,
//   orgRegionInsert,
//   orgRegionUpdate,
//   orgRegionStop
// } from '@/api/pbms_org.js'
export default {
  name: 'OrgRegion',
  components: {
    orgTree: () => import('../../org/components/orgsTree')
  },
  data() {
    return {
      treeSelected: {},
      system: '',
      systemList: [
        {
          value: 'INSPUR-DZZW-SGHD',
          label: '审管信息互动'
        },
        {
          value: 'INSPUR-DZZW-WEBSITE',
          label: '网办管理'
        },
        {
          value: 'INSPUR-DZZW-SXGL',
          label: '事项管理系统'
        },
        {
          value: 'INSPUR-DZZW-TYSP',
          label: '通用审批平台'
        },
        {
          value: 'INSPUR-DZZW-BLSP',
          label: '并联审批'
        },
        {
          value: 'INSPUR-DZZW-ARCH',
          label: '归档管理系统'
        },
        {
          value: 'INSPUR-DZZW-DTGL',
          label: '大厅管理'
        },
        {
          value: 'INSPUR-DZZW-DZZZ',
          label: '电子证照'
        },
        {
          value: 'INSPUR-DZZW-SelfService',
          label: '自助终端系统'
        }
      ],
      data: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1'
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
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        menu: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ]
      }
    }
  },
  created() {},
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
  margin: 5px;
  padding-left: 5px;
}

.internation_form_wrap {
  padding: 20px;
  border: 1px solid #dcdcdc;
  font-size: 14px;
}
.form_title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
.align_right {
  text-align: right;
}

.tree_header {
  padding: 10px;
  background: lightblue;
  position: relative;
  display: flex;
  justify-content: space-between;
}
.color_red {
  color: red;
}
</style>
