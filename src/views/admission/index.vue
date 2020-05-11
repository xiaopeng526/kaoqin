
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
          <span class="title">1.填写项目信息</span>
          <el-divider>
            <i class="el-icon-mobile-phone"></i>
          </el-divider>
        </div>
        <el-col :offset="4" :span="16">
          <el-row>
            <el-col :span="11">
              <el-form-item label="员工姓名" prop="userName">
                <el-select style="width:100%">
                  <el-option>

                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="项目名称" prop="projectName">
                <el-select v-model="ruleForm.projectName" placeholder="请输入项目名称">
                  <el-option>

                  </el-option>
                </el-select>
                
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="项目单价" prop="position">
                <el-select v-model="ruleForm.position" placeholder="待定">
                  <el-option>

                  </el-option>
                </el-select>
              
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
             <el-form-item label="开始时间" prop="startDate">
                <el-date-picker
                  style="width:100%;"
                  type="date"
                  placeholder="选择日期"
                  v-model="ruleForm.startDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="11">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="电话" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="请输入员工电话"></el-input>
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
              <el-form-item label="入职时间" prop="startDate">
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
                <el-select v-model="ruleForm.managerId" placeholder="请选择直线经理" style="width:100%">
                  <el-option
                    v-for="item in nameData"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  >
                    <span style="float: left; width:30%">{{ item.num }}</span>
                    <span
                      style="float: left; color: #8492a6; margin-left:5%; width:30%"
                    >{{ item.value }}</span>
                    <span
                      style="float: left; color: #8492a6; margin-left:5%; width:30%"
                    >{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>-->
          <el-row>
            <el-col :span="23">
              <el-form-item label="备注" prop="remark">
                <el-input rows="4" type="textarea" v-model="ruleForm.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-form :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="110px"
      class="demo-ruleForm" size="medium">
        <el-row>
        <div>
          <span class="title">2.填写资源组信息</span>
          <el-divider>
            <i class="el-icon-mobile-phone"></i>
          </el-divider>
        </div>
        <el-col :offset="4" :span="16">
          <el-row>
            <el-col :span="11">
              <el-form-item label="资源组名称" prop="userId">
                <el-select v-model="ruleForm.userId" placeholder="请输入待定">
                  <el-option>

                  </el-option>
                </el-select>
         
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="备注" prop="userName">
                <el-input v-model="ruleForm.userName" placeholder="请输入待定"></el-input>
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
   
  </div>
</template>

<script>

export default {
  name: "admission",
 
  data() {
    return {
      ruleForm: {
        userName: "", //员工编号
        projectName:"",//项目名称
        startDate:"",//开始时间
        remark:"",//备注
        startDate: "" //入职日期
      },
    
      rules: {
        userId: [
          { required: true, message: "请输入员工编号", trigger: "blur" }
          // { min: 6, max: 11, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: "请输入员工姓名", trigger: "blur" }
        ],
        position: [{ required: true, message: "请输入职位", trigger: "blur" }],
        rank: [{ required: true, message: "请输入职级", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        deptName: [
          { required: true, message: "请选择所属部门", trigger: "change" }
        ],
        managerId: [
          { required: true, message: "请选择直线经理", trigger: "change" }
        ],
        startDate: [
          {
            type: "date",
            required: true,
            message: "请选择入职时间",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // selectDept() {
    //   this.$store.dispatch("showHideDialog", true);
    // },
    // 获取所属部门
    getDeptInfo(params) {
      console.log(params);
      this.ruleForm.deptName = params;
    }
  }
};
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
