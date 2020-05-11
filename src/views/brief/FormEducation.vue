<template>
  <div class="resume-form">
    <el-form :model="formRule" :rules="rules" ref="formRule" label-width="150px">
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="学校名称：" prop="schoolName" required>
            <el-input v-model="formRule.schoolName" clearable />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="就读时间：" prop="dateTime">
        <el-col :span="10">
          <el-date-picker
            type="monthrange"
            v-model="formRule.dateTime"
            value-format="yyyy-MM"
            start-placeholder="开始日期"
            range-separator="-"
            end-placeholder="结束日期"
            clearable
          />
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="所学专业：" prop="major">
            <el-input v-model="formRule.major" clearable />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="学历：" prop="education">
            <el-select v-model="formRule.education" clearable>
              <el-option label="大专" value="大专" />
              <el-option label="本科" value="本科" />
              <el-option label="硕士" value="硕士" />
              <el-option label="MBA" value="MBA" />
              <el-option label="EMBA" value="EMBA" />
              <el-option label="博士" value="博士" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="是否统招：" prop="unifiedStrategy">
            <el-radio v-model="formRule.unifiedStrategy" label="1">是</el-radio>
            <el-radio v-model="formRule.unifiedStrategy" label="0">否</el-radio>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-check" @click="fnSubmit" round>保存</el-button>
        <el-button size="small" icon="el-icon-close" @click="fnCancel" round>取消</el-button>
        <el-button
          v-if="formRule.id"
          style="float: right;"
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="fnDel"
          circle
        ></el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { apiUpdateEdu, apiDelEdu } from '@/biz/brief/brief_biz'

export default {
  name: 'form-education',
  data () {
    return {
      rules: {
        schoolName: [
          { required: true, message: '请输入学校名称', trigger: 'blur' }
        ],
      }
    }
  },
  created () { },
  methods: {
    fnSubmit () {
      this.$refs['formRule'].validate((valid) => {
        if (valid) {
          this.formRule.startDate = this.formRule.dateTime ? this.formRule.dateTime[0] : ''
          this.formRule.endDate = this.formRule.dateTime ? this.formRule.dateTime[1] : ''
          apiUpdateEdu(this.formRule).then(res => {
            this.$message.success("提交成功")
            this.$emit('upup', 'education')
          }).catch(err => {
            this.$message.error("请求失败")
          })
        }
      })
    },
    fnCancel () {
      this.$emit('upup', 'education')
    },
    fnDel () {
      this.$confirm('确定删除此条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        apiDelEdu(this.formRule.id).then(res => {
          this.$message.success("删除成功")
          this.$emit('upup', 'education')
        }).catch(err => {
          this.$message.error("请求失败")
        })
      })
    }
  },
  props: {
    formRule: {
      type: ''
    }
  }
}
</script>

<style scoped>
</style>
