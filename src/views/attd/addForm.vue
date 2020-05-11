<template>
  <div>
    <el-dialog title="添加工时" :visible.sync="showHideForm" :append-to-body="true" @open="openForm">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="117px"
        class="demo-ruleForm"
        @open="openForm"
      >
        <el-row v-if="type=='add'">
          <el-col :span="12">
            <el-form-item label="填报日期" prop="date">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作状态" prop="state">
              <el-select v-model="ruleForm.state" placeholder="请选择活动区域" style="100%">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="工作状态" prop="state" v-if="type!='add'">
          <el-select v-model="ruleForm.state" placeholder="请选择活动区域" style="width:100%">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="正常工时" prop="hours">
          <el-input v-model="ruleForm.hours"></el-input>
        </el-form-item>
        <el-form-item label="工作内容" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "attd-from",
  props: {

  },
  data () {
    return {
      ruleForm: {
        hours: '',
        state: '',
        date: '',
        desc: ''
      },
      rules: {
        hours: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
      }
    };
  },
  computed: {
    // 取 是否显示弹框的值
    showHideForm: {
      set () {
        this.$store.dispatch('showHideAddForm', false)
      },
      get () {
        return this.$store.state.attd.addForm.show
      }
    },
    type () {
      return this.$store.state.attd.addForm.type
    }
  },
  methods: {
    cancelForm (AddForm) {
      // 取消后隐藏 表单dialog
      this.hideAddForm()
      this.resetForm(AddForm)
    },
    closeForm () {

    },
    // 打开表单后的回调
    openForm () {
      if (this.type == 'add') {
      }
    },
    //隐藏 添加的Dialog
    hideAddForm () {
      this.$store.dispatch('showHideAddForm', false)
    },
    // 对表单进行重置，将所有字段值重置为初始值并移除校验结果
    resetForm (formName) {
      this.$refs[formName].resetFields();
      // 取消后隐藏 表单dialog
      this.hideAddForm()
    },
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      // 取消后隐藏 表单dialog
      this.hideAddForm()
      this.resetForm(formName)
    },
  }

};
</script>
<style lang="sass"></style>
