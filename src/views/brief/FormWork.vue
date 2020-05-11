<template>
  <div class="resume-form">
    <el-form :model="formRule" :rules="rules" ref="formRule" label-width="150px">
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="公司名称：" prop="companyName" required>
            <el-input v-model="formRule.companyName" clearable />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="所属行业：" prop="industry">
            <el-input v-model="formRule.industry" clearable />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="10">
          <el-form-item label="职位名称：" prop="positionName">
            <el-input v-model="formRule.positionName" clearable />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="在职时间：" prop="dateTime">
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
        <el-form-item label="税前月薪：" prop="salBeforeTax">
          <el-select v-model="formRule.salBeforeTax" clearable>
            <el-option label="4001-6000元/月" value="4001-6000元/月" />
            <el-option label="6001-8000元/月" value="6001-8000元/月" />
            <el-option label="8001-1000元/月" value="8001-1000元/月" />
            <el-option label="10001-15000元/月" value="10001-15000元/月" />
            <el-option label="15001-20000元/月" value="15001-20000元/月" />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-col :span="20">
          <el-form-item label="工作描述：" prop="workDes">
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="formRule.workDes"></el-input>
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
import { apiUpdateWork, apiDelWork } from '@/biz/brief/brief_biz'

export default {
  name: 'form-work',
  data () {
    return {
      DateTime: [],
      rules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
      },
    }
  },
  created () {
  },
  methods: {
    fnSubmit () {
      this.$refs['formRule'].validate((valid) => {
        if (valid) {
          this.formRule.workStart = this.formRule.dateTime ? this.formRule.dateTime[0] : ''
          this.formRule.workEnd = this.formRule.dateTime ? this.formRule.dateTime[1] : ''
          console.log(this.formRule)
          apiUpdateWork(this.formRule).then(res => {
            this.$message.success("提交成功")
            this.$emit('upup', 'work')
          }).catch(err => {
            this.$message.error("请求失败")
          })
        }
      })
    },
    fnCancel () {
      this.$emit('upup', 'work')
    },
    fnDel () {
      this.$confirm('确定删除此条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        apiDelWork(this.formRule.id).then(res => {
          this.$message.success("删除成功")
          this.$emit('upup', 'work')
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
  },
  watch: {
    formRule: {
      handler () {

      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style scoped>
</style>
