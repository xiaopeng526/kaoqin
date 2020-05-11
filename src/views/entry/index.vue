<!-- 入职管理 -->
<template>
  <div class="entry-box">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="110px"
      class="demo-ruleForm"
    >
      <el-row>
        <div>
          <span class="title">填写员工信息</span>
          <el-divider>
            <i class="el-icon-mobile-phone"></i>
          </el-divider>
        </div>
        <el-col :offset="4" :span="16">
          <el-row>
            <el-col :span="11">
              <el-form-item label="员工编号" prop="userId">
                <el-input v-model.trim="ruleForm.userId" placeholder="请输入员工编号" @blur="blurVerify"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="员工姓名" prop="userName">
                <el-input v-model.trim="ruleForm.userName" placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="职位" prop="position">
                <el-input v-model.trim="ruleForm.position" placeholder="请输入职位"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="职级" prop="rank">
                <el-input v-model.trim="ruleForm.rank" placeholder="请输入员工职级"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model.trim="ruleForm.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="电话" prop="phone">
                <el-input v-model.trim="ruleForm.phone" placeholder="请输入员工电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="所属部门" prop="deptName">
                <el-input v-model="ruleForm.deptName" placeholder="请选择所属部门" @focus="selectDept"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="入职日期" prop="startDate">
                <el-date-picker
                  style="width:100%;"
                  type="date"
                  placeholder="选择日期"
                  v-model="ruleForm.startDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="直线经理" prop="managerId">
                <el-select
                  v-model="ruleForm.managerName"
                  placeholder="请选择直线经理"
                  style="width:100%"
                  @change="getManagerId($event)"
                >
                  <el-option
                    v-for="item in managerList"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  >
                    <span style="float: left; width:30%">{{ item.userId }}</span>
                    <span
                      style="float: left; color: #8492a6; margin-left:5%; width:20%"
                    >{{ item.userName }}</span>
                    <span
                      style="float: left; color: #8492a6; margin-left:5%; width:40%"
                    >{{ item.deptName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="备注" prop="name">
                <el-input rows="4" type="textarea" v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="6">
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">确认入职</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <tree-dialog @getDeptInfo="getDeptInfo"></tree-dialog>
  </div>
</template>

<script>
import TreeDialog from './dialog'
import { checkEmailNull, checkNumPhone, toUpperCase } from '@/utils/validate'
import { findUser, saveUser } from '@/biz/entry'
export default {
  name: 'Entry',
  components: {
    TreeDialog
  },
  data () {
    return {
      ruleForm: {
        userId: '',    //员工编号
        userName: '',  //员工姓名
        position: '',  //职位
        rank: '',      //职级
        email: '',     //邮箱
        phone: '',     //电话
        deptId: '',    //所属部门id
        deptName: '',   //所属部门
        managerName: '', //直线经理name
        managerId: '', //直线经理id
        startDate: ''  //入职日期
      },
      managerList: [],
      rules: {
        userId: [
          { required: true, message: '员工编号不能为空', trigger: 'blur' },
          // { min: 6, max: 11, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '员工姓名不能为空', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '职位不能为空', trigger: 'blur' }
        ],
        rank: [
          { required: true, message: '职级不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmailNull, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: checkNumPhone, trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '所属部门不能为空', trigger: 'change' }
        ],
        managerName: [
          { required: true, message: '直线经理不能为空', trigger: 'change' }
        ],
        startDate: [
          { type: 'date', required: true, message: '入职时间不能为空', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
  },
  created () {
    this.getManagerName()
  },
  methods: {
    // 小写字符转成大写
    blurVerify () {
      return this.ruleForm.userId = toUpperCase(this.ruleForm.userId)
    },
    // 获取直线经理的数组
    getManagerName () {
      findUser().then(res => {
        this.managerList = res
        console.log('直线经理', this.managerList)
      })
    },
    // 获取直线经理相对应的id
    getManagerId (id) {
      console.log(id)
      this.managerId = id
    },
    // 确定入职
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveUser(this.ruleForm).then(res => {
            // console.log(typeof (res))
            if (res != -1) {
              console.log('入职成功')
              this.resetForm(formName)
              this.ruleForm.managerName = ''
              this.open1()
            } else {
              console.log('员工编号已存在,请重新输入')
              this.open2()
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    // 显示tree
    selectDept () {
      this.$store.dispatch('showHideDialog', true)
    },
    // 获取所属部门
    getDeptInfo (params) {
      console.log(params)
      this.ruleForm.deptName = params
    },
    open1 () {
      this.$notify({
        title: '成功',
        message: '已成功入职',
        type: 'success'
      });
    },
    open2 () {
      this.$notify.error({
        title: '失败',
        message: '员工编号已存在,请重新输入'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.entry-box {
  padding: 10px;
  .title {
    color: #409eff;
  }
  .el-divider--horizontal {
    display: block;
    height: 2px;
    width: 100%;
    margin: 10px 0 20px 0;
    background: #409eff !important;
  }
}
</style>
