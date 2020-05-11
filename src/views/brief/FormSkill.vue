<template>
  <div class="resume-form">
    <el-form :model="formRule" :rules="rules" ref="formRule" label-width="150px">
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="技能名称：" prop="skillName" required>
            <el-input v-model="formRule.skillName" clearable />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="实用时长：" prop="duration">
            <el-input-number
              v-model="formRule.duration"
              controls-position="right"
              size="small"
              :min="1"
              :max="999"
            ></el-input-number>&nbsp;月
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="24">
          <el-form-item label="掌握程度：" prop="masteryLevel">
            <el-radio v-model="formRule.masteryLevel" label="一般">一般</el-radio>
            <el-radio v-model="formRule.masteryLevel" label="良好">良好</el-radio>
            <el-radio v-model="formRule.masteryLevel" label="熟练">熟练</el-radio>
            <el-radio v-model="formRule.masteryLevel" label="精通">精通</el-radio>
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
import { apiUpdateSk, apiDelSk } from '@/biz/brief/brief_biz'

export default {
  name: 'form-skill',
  data () {
    return {
      rules: {
        skillName: [
          { required: true, message: '请输入技能名称', trigger: 'blur' }
        ],
      }
    }
  },
  created () { },
  methods: {
    fnSubmit () {
      this.$refs['formRule'].validate((valid) => {
        if (valid) {
          apiUpdateSk(this.formRule).then(res => {
            this.$message.success("提交成功")
            this.$emit('upup', 'skill')
          }).catch(err => {
            this.$message.error("请求失败")
          })
        }
      })
    },
    fnCancel () {
      this.$emit('upup', 'skill')
    },
    fnDel () {
      this.$confirm('确定删除此条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        apiDelSk(this.formRule.id).then(res => {
          this.$message.success("删除成功")
          this.$emit('upup', 'skill')
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
