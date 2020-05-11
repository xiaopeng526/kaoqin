<template>
  <div class="resume-form">
    <p class="font-h2" style="margin: 0px 0px 30px;">个人信息</p>
    <el-form :model="formRule" :rules="rules" ref="formRule" label-width="150px">
      <el-form-item label-width="0px">
        <el-col :span="18">
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="formRule.name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px;">
            <el-form-item label="性别：" prop="sex">
              <el-radio v-model="formRule.sex" label="男">男</el-radio>
              <el-radio v-model="formRule.sex" label="女">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="出生年月：" prop="birthday">
              <el-date-picker
                type="month"
                value-format="yyyy-MM"
                placeholder="请选择出生年月"
                v-model="formRule.birthday"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-form-item align="right">
            <el-image :src="formRule.headPortrait" fit="cover"></el-image>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label-width="0px">
        <el-col :span="8">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="formRule.name" clearable/>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="8">
          <el-form-item label="性别：" prop="sex">
            <el-radio v-model="formRule.sex" label="1">男</el-radio>
            <el-radio v-model="formRule.sex" label="0">女</el-radio>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="8">
          <el-form-item label="出生年月：" prop="birthday">
            <el-date-picker
              type="month" value-format="yyyy-MM" placeholder="请选择出生年月"
              v-model="formRule.birthday">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>-->
      <el-form-item label-width="0px">
        <el-col :span="8">
          <el-form-item label="参加工作时间：" prop="workTime">
            <el-date-picker
              type="month"
              value-format="yyyy-MM"
              placeholder="选择工作时间"
              v-model="formRule.workTime"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="户口所在地：" prop="registeredResidence">
        <el-col :span="8">
          <el-cascader
            size="large"
            :options="registeredOptions"
            style="width:100%;"
            v-model="formRule.registeredResidence"
            clearable
          ></el-cascader>
        </el-col>
      </el-form-item>
      <el-form-item label="现居住城市：" prop="currentCity">
        <el-col :span="8">
          <el-cascader
            size="large"
            :options="regionOptioins"
            style="width:100%;"
            v-model="formRule.currentCity"
            clearable
          ></el-cascader>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="联系方式：" prop="phone">
            <el-input v-model="formRule.phone" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="电子邮箱：" prop="email">
            <el-input v-model="formRule.email" clearable />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="婚姻状况：" prop="maritalStatus">
            <el-select v-model="formRule.maritalStatus" clearable>
              <el-option label="已婚" value="已婚" />
              <el-option label="未婚" value="未婚" />
              <el-option label="离异" value="离异" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="政治面貌：" prop="politics">
            <el-select v-model="formRule.politics" clearable>
              <el-option label="中共党员" value="中共党员" />
              <el-option label="团员" value="团员" />
              <el-option label="群众" value="群众" />
              <el-option label="民主党派" value="民主党派" />
              <el-option label="无党派人士" value="无党派人士" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-check" @click="fnSubmit" round>保存</el-button>
        <el-button size="small" icon="el-icon-close" @click="fnCancel" round>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { provinceAndCityData, regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { apiUpdateBrief } from '@/biz/brief/brief_biz'

export default {
  name: 'form-info',
  data () {
    return {
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请输入出生年月', trigger: 'blur' }
        ],
        workTime: [
          { required: true, message: '请输入参加工作时间', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' }
        ]
      },
      registeredOptions: provinceAndCityData,
      regionOptioins: regionData
    }
  },
  created () { },
  methods: {
    fnSubmit () {
      this.$refs['formRule'].validate((valid) => {
        if (valid) {
          if (this.formRule.registeredResidence) {
            this.formRule.regResProvince = this.formRule.registeredResidence[0]
            this.formRule.regResCity = this.formRule.registeredResidence[1]
          }
          if (this.formRule.currentCity) {
            this.formRule.curCityProvince = this.formRule.currentCity[0]
            this.formRule.curCityCity = this.formRule.currentCity[1]
            this.formRule.curCityArea = this.formRule.currentCity[2]
          }
          apiUpdateBrief(this.formRule).then(res => {
            this.$message.success("提交成功")
            if (res) {
              this.formRule.briefId = res
              this.$emit('upup', this.formRule)
            }
          }).catch(err => {
            this.$message.error("请求失败")
          })
        }
      })
      /*let str = CodeToText['110000']
      console.log(str)
      let code = TextToCode['北京市']
      console.log(code.code)*/
    },
    fnCancel () {
      this.$emit('upup')
    }
  },
  props: {
    formRule: {
      type: ''
    }
  },
  watch: {
    formRule: {
      handler () {
        if (this.formRule.regResProvince) {
          this.formRule.registeredResidence = [this.formRule.regResProvince, this.formRule.regResCity]
        }
        if (this.formRule.curCityProvince) {
          this.formRule.currentCity = [this.formRule.curCityProvince, this.formRule.curCityCity, this.formRule.curCityArea]
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style scoped>
</style>
