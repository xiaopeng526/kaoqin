<template>
  <div class="resume-form">
    <el-form :model="formRule" :rules="rules" ref="formRule" label-width="150px">
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="项目名称：" prop="projectName" required>
            <el-input v-model="formRule.projectName" clearable />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="项目时间：" prop="dateTime">
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
          <el-form-item label="所属公司：" prop="companyName">
            <el-input v-model="formRule.companyName" clearable />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="20">
          <el-form-item label="项目描述：" prop="projectDesc">
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="formRule.projectDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="20">
          <el-form-item label="个人职责：" prop="responsibility">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="formRule.responsibility"
            ></el-input>
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
import { apiUpdatePro, apiDelPro } from '@/biz/brief/brief_biz'

export default {
  name: 'form-project',
  data () {
    return {
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
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
          apiUpdatePro(this.formRule).then(res => {
            this.$message.success("提交成功")
            this.$emit('upup', 'project')
          }).catch(err => {
            this.$message.error("请求失败")
          })
        }
      })
    },
    fnCancel () {
      this.$emit('upup', 'project')
    },
    fnDel () {
      this.$confirm('确定删除此条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        apiDelPro(this.formRule.id).then(res => {
          this.$message.success("删除成功")
          this.$emit('upup', 'project')
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
