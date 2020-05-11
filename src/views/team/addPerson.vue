<template>
  <!-- <div class="add-person"> -->
  <el-dialog
    :title="formTitle"
    :visible.sync="showPersonDialog"
    :append-to-body="true"
    :close-on-click-modal="false"
    @open="openDialog"
  >
    <el-form :model="form">
      <el-form-item label="员工姓名" :label-width="formLabelWidth">
        <el-select
          v-model="form.name"
          placeholder="请选择"
          style="width:100%"
          :disabled="disabledName"
        >
          <el-option
            v-for="item in nameData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left; width:30%">{{ item.num }}</span>
            <span style="float: left; color: #8492a6; margin-left:5%; width:30%">{{ item.value }}</span>
            <span style="float: left; color: #8492a6; margin-left:5%; width:30%">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工编号" :label-width="formLabelWidth">
        <el-input v-model="form.num" autocomplete="off" :disabled="disabledNum"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" :label-width="formLabelWidth">
        <el-input v-model="form.dept" autocomplete="off" :disabled="disabledDept"></el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model="form.desc" type="textarea" :rows="4" :disabled="disabledDesc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveForm" v-if="initType !='look'">{{btnValue}}</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
  </el-dialog>
  <!-- </div> -->
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'add-person',
  data () {
    return {
      form: {
        name: '',   //员工姓名
        num: '',    //员工编号
        dept: '',   //所属部门
        desc: ''    //备注
      },
      // 员工姓名的数据
      nameData: [{
        value: 'Beijing',
        label: '北京',
        num: 10010
      }, {
        value: 'Shanghai',
        label: '上海',
        num: 10012
      }, {
        value: 'Nanjing',
        label: '南京',
        num: 10011
      }],
      formLabelWidth: '120px',
      disabledNum: true,     //是否禁止输入员工编号
      disabledName: false,   //是否禁止输入员工姓名
      disabledDept: false,   //是否禁止输入所属部门
      disabledDesc: false,    //是否禁止输入备注
      btnValue: '',            // 保存修改按钮
      formTitle: ''          // 表单的title
    }
  },
  computed: {
    // 取 是否显示弹框的值
    showPersonDialog: {
      set () {
        this.$store.dispatch('showHideAddPerson', false)
      },
      get () {
        return this.$store.state.team.addPerson.show
      }
    },
    // 取 是编辑，查看，还是新增的type
    initType () {
      return this.$store.state.team.addPerson.type
    }
  },
  created () { },
  mounted () { },
  methods: {
    // 关闭dialog
    closeDialog () {
      // this.$store.dispatch("showAddPerson", false);
    },
    // 弹框打开时的回调
    openDialog () {
      console.log(this.initType)
      if (this.initType == 'add') {
        this.disabledNum = true
        this.disabledDept = false
        this.disabledName = false
        this.disabledDesc = false
        this.btnValue = '保存'
        this.formTitle = '新增'
        console.log(this.disabledDept)
      } else if (this.initType == 'edit') {
        this.disabledNum = true
        this.disabledDept = true
        this.disabledName = true
        this.disabledDesc = false
        this.btnValue = '修改'
        this.formTitle = '编辑'
      } else {
        this.disabledNum = true
        this.disabledDept = true
        this.disabledName = true
        this.disabledDesc = true
        this.formTitle = '查看'
      }
    },
    // 取消dialog
    cancelForm () {
      this.$store.dispatch('showHideAddPerson', false) // 隐藏dialog
    },
    // 确定，保存 dialog Form
    saveForm () {
      this.$store.dispatch('showHideAddPerson', false)
    }
  }
}
</script>

<style lang="scss">
</style>
