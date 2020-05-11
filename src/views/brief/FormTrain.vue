<template>
  <div class="resume-form">
    <el-form :model="formRule" :rules="rules" ref="formRule" label-width="150px">
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="培训机构：" prop="trainAgency" required>
            <el-input v-model="formRule.trainAgency" clearable />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="培训课程：" prop="trainCourse">
            <el-input v-model="formRule.trainCourse" clearable />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="培训时间：" prop="dateTime">
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
import { apiUpdateTra, apiDelTra } from '@/biz/brief/brief_biz'

export default {
  name: 'form-train',
  data () {
    return {
      rules: {
        trainAgency: [
          { required: true, message: '请输入培训机构', trigger: 'blur' }
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
          apiUpdateTra(this.formRule).then(res => {
            this.$message.success("提交成功")
            this.$emit('upup', 'train')
          }).catch(err => {
            this.$message.error("请求失败")
          })
        }
      })
    },
    fnCancel () {
      this.$emit('upup', 'train')
    },
    fnDel () {
      this.$confirm('确定删除此条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        apiDelTra(this.formRule.id).then(res => {
          this.$message.success("删除成功")
          this.$emit('upup', 'train')
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
