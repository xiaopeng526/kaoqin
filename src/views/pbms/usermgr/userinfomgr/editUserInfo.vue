/* eslint-disable vue/require-default-prop */
/* eslint-disable vue/require-default-prop */
<template>
  <div>
    <!-- 编辑对话框 -->
    <el-dialog :append-to-body="true" :visible="showEditDialog" :close-on-click-modal="false" :before-close="cancleDialog" title="编辑用户信息" width="900px">
      <!-- 选项卡 -->
      <el-tabs type="border-card">
        <el-tab-pane label="基本信息">
          <el-form ref="ruleForm" :model="editForm" :rules="formRules" label-width="100px">
            <el-form-item label="账号：" prop="userAccount">
              <el-input v-model="editForm.userAccount" size="small" style="width:250px"></el-input>
            </el-form-item>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="用户姓名：" prop="userName">
                  <el-input v-model="editForm.userName" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号码：" prop="idCard">
                  <el-input v-model="editForm.idCard" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="电子邮箱：" prop="email">
                  <el-input v-model="editForm.email" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="移动手机：" prop="mobilePhone">
                  <el-input v-model="editForm.mobilePhone" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="性别：" prop="gender">
                  <el-radio v-model="editForm.gender" label="男">男</el-radio>
                  <el-radio v-model="editForm.gender" label="女">女</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职务：" prop="post">
                  <el-select v-model="editForm.post" clearable placeholder="请选择" size="small" style="width:250px" @change="postChange">
                    <el-option v-for="item in editFormPost" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="联系电话：" prop="phone">
                  <el-input v-model="editForm.phone" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户类型：" prop="userType">
                  <el-select v-model="editForm.userType" clearable placeholder="请选择" size="small" style="width:250px" @change="userTypeChange">
                    <el-option v-for="item in userType" :value="item" :label="item" :key="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="所属机构：" prop="affiliate">
                  <el-input v-model="editForm.affiliate" style="width:210px" size="small"></el-input>
                  <el-button size="small">
                    <i class="el-icon-folder-opened" @click="showAffiliateCom"></i>
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="生日：" prop="birthday">
                  <el-date-picker v-model="editForm.birthday" type="date" placeholder="选择日期" size="small" style="width:250px"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="工号：" prop="number">
                  <el-input v-model="editForm.number" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上级领导：" prop="leader">
                  <el-input v-model="editForm.leader" style="width:210px" size="small"></el-input>
                  <el-button size="small">
                    <i class="el-icon-folder-opened" @click="showAffiliateCom"></i>
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="系统排序：">
              <el-input-number v-model="editForm.sort" :min="1" controls-position="right" style="width:100px" size="small" @change="handleSortChange"></el-input-number>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 岗位配置 -->
        <el-tab-pane label="岗位配置">
          <el-row :gutter="24">
            <el-col :span="6">
              <!-- 左侧树 -->
              <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </el-col>
            <el-col :span="18">
              <!-- 右侧表格 -->
              <el-table :data="postConfigTableData" style="width: 100%">
                <el-table-column prop="date" label="岗位名称" align="center"></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- 角色分配 -->
        <el-tab-pane label="角色分配">
          <el-row :gutter="24">
            <el-col :span="5">
              <span class="roleText">已分配的角色矩阵：</span>
            </el-col>
            <el-col :span="6" class="roleconfig">
              <el-input v-model="roleMatrix" placeholder="请输入角色或应用名称" clearable size="small" style="width:240px"></el-input>
            </el-col>
            <el-col :span="6" :offset="1">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="searchData">查询</el-button>
              <el-button icon="el-icon-refresh" size="mini" type="success" @click="clearSearchData">重置</el-button>
            </el-col>
            <el-col :span="3" :offset="3">
              <el-button icon="el-icon-refresh" size="mini" type="success" @click="roleConfigBtn">配置角色</el-button>
            </el-col>
          </el-row>
          <el-table :data="roleTableData" border size="small" style="width: 100%;margin-top:20px">
            <el-table-column prop="name" label="角色名称" sortable align="center" width="200"></el-table-column>
            <el-table-column prop="config" label="应用系统" sortable align="center" width="350"></el-table-column>
            <el-table-column label="操作" sortable align="center">
              <template slot-scope="scope">
                <span v-html="formatIcon(scope.row.icon)"></span>
              </template>
            </el-table-column>
          </el-table>
          <el-row :gutter="24">
            <el-col :span="3">
              <i class="el-icon-refresh" style="margin:15px;color:green"></i>
            </el-col>
            <el-col :span="21">
              <!-- 分页 -->
              <el-pagination :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" class="content-pagination" align="center" style="margin-top:10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label=" 扩展信息(非必填项)">
          <el-form :model="editForm" label-position="right" label-width="120px">
            <el-form-item label="是否执法人员：">
              <el-radio v-model="editForm.isLawEnforcement" label="1">是</el-radio>
              <el-radio v-model="editForm.isLawEnforcement" label="2">否</el-radio>
            </el-form-item>
            <el-form-item label="是否实名：">
              <el-radio v-model="editForm.region" label="1">是</el-radio>
              <el-radio v-model="editForm.region" label="2">否</el-radio>
            </el-form-item>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="实名日期：" prop="name">
                  <el-date-picker v-model="editForm.birthday" type="date" placeholder="选择日期" size="small" style="width:250px"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实名等级：" prop="name">
                  <el-select v-model="editForm.post" clearable placeholder="请选择" size="small" style="width:250px">
                    <el-option v-for="item in nameLevel" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="用户昵称：" prop="name">
                  <el-input v-model="editForm.nickName" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作单位：" prop="name">
                  <el-input v-model="editForm.company" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="网页地址：" prop="name">
                  <el-input v-model="editForm.url" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="图像地址：" prop="name">
                  <el-input v-model="editForm.imageUrl" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="样式设置：" prop="name">
                  <el-input v-model="editForm.styleConfig" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="提醒方式：" prop="name">
                  <el-input v-model="editForm.tip" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="固话虚拟网：" prop="name">
                  <el-input v-model="editForm.virtualNetwork" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="移动虚拟网：" prop="name">
                  <el-input v-model="editForm.mobileVirtualNetwork" style="width:250px" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm()">确 定</el-button>
        <el-button size="small" @click="cancleDialog()">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 基本信息所属机构组件 -->
    <el-dialog :visible="affiliateComIsShow" :append-to-body="true" :close-on-click-modal="false" :before-close="cancleAffiliateDialog" title="选择单位">
      <div style="height:300px;overflow:auto">
        <org-tree @treeSelector="treeSelectorHandle"></org-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmAffiliateInfo">确 定</el-button>
        <el-button size="small" @click="cancleAffiliateDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 配置角色组件 -->
    <role-config :show-role-config-com="showRoleConfigCom" @closeDialog="closeDialog()"></role-config>
  </div>
</template>
<script>
export default {
  components: {
    orgTree: () => import('../../org/components/orgsTree'),
    RoleConfig: () => import('./roleConfig.vue')
  },
  props: {
    // 是否显示编辑组件
    showEditDialog: {
      type: Boolean,
      default: false
    },
    // 表单数据
    editForm: {
      type: Object,
      default: function() {
        return { sort: 1 }
      }
    }
  },
  data() {
    return {
      // 表单验证规则
      formRules: {
        userAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'blur' }
        ]
      },
      // 是否展示所属机构组件
      affiliateComIsShow: false,
      postConfigTableData: [],
      // 岗位配置树结构数据
      treeData: [
        {
          label: '办理岗位1',
          children: [
            {
              label: '办理岗位2',
              children: [
                {
                  label: '办理岗位3'
                }
              ]
            }
          ]
        },
        {
          label: '办理岗位4',
          children: [
            {
              label: '办理岗位5',
              children: [
                {
                  label: '办理岗位6'
                }
              ]
            },
            {
              label: '办理岗位7',
              children: [
                {
                  label: '办理岗位8'
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
      // 角色表格数据
      roleTableData: [
        {
          name: '系统管理员',
          config: '事项管理系统'
        },
        {
          name: '咨询回复人员',
          config: '通用云门户'
        },
        {
          name: '审批统计人员',
          config: '通用云门户'
        },
        {
          name: '部门管理员',
          config: '通用云门户'
        },
        {
          name: '归档人员',
          config: '通用云门户'
        },
        {
          name: '审批局部门用户',
          config: '通用云门户'
        },
        {
          name: '分发人员',
          config: '通用云门户'
        },
        {
          name: '信息发布人员',
          config: '通用云门户'
        },
        {
          name: '业务人员',
          config: '网盘应用'
        },
        {
          name: '普通用户',
          config: '网盘应用'
        }
      ],
      // 分页--当前页数
      currentPage: 1,
      // 分页--每页显示条目个数
      pageSize: 20,
      // 分页--总条目数
      total: 10,
      roleMatrix: '',
      // 显示角色配置组件
      showRoleConfigCom: false,
      // 职务
      editFormPost: [
        '局长',
        '雇员',
        '职员',
        '合同工',
        '副调研员',
        '科员',
        '科长',
        '党总支专职副书记'
      ],
      // 用户类型
      userType: [
        '公务员',
        '中介机构',
        '运营商',
        '服务提供商',
        '公民',
        '企业法人',
        '管理员'
      ],
      // 实名等级
      nameLevel: [
        '一级（匿名）',
        '二级（未实名）',
        '三级（初级实名）',
        '四级（中级实名）',
        '五级（高级实名）'
      ]
    }
  },
  methods: {
    // 查询
    searchData() {},
    // 重置
    clearSearchData() {},
    // 编辑弹框的确定按钮
    submitForm(data) {
      this.$emit('closeDialog', this.showEditDialog)
      // 发送请求
    },
    // 编辑弹框的取消按钮
    cancleDialog() {
      this.$emit('closeDialog', this.showEditDialog)
    },
    // 系统排序数量改变时触发
    handleSortChange() {},
    // 岗位配置树选择节点触发
    handleNodeClick() {},
    // 点击配置角色
    roleConfigBtn() {
      this.showRoleConfigCom = true
    },
    // 角色分配分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    // 关闭角色分配对话框
    closeDialog() {
      this.showRoleConfigCom = false
    },
    /** 基本信息 */
    // 选中的职务改变时触发
    postChange(val) {
      this.editForm.post = val
    },
    // 选中的用户类型改变时触发
    userTypeChange(val) {
      this.editForm.userType = val
    },
    // 基本信息所属机构组件
    treeSelectorHandle() {},
    // 基本信息所属机构组件
    showAffiliateCom() {
      this.affiliateComIsShow = true
    },
    // 基本信息所属机构组件--确定按钮
    confirmAffiliateInfo() {
      this.affiliateComIsShow = false
    },
    cancleAffiliateDialog() {
      this.affiliateComIsShow = false
    },
    formatIcon(icon) {
      return '<i class="el-icon-delete" style="color:red"></i>'
    }
  }
}
</script>

<style scoped>
.roleText {
  position: relative;
  top: 8px;
}
.roleconfig {
  margin-left: -50px;
}
</style>
