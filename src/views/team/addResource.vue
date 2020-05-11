<template>
  <div class="add-resource">
    <el-dialog
      title="新增资源组"
      :visible.sync="showResourceDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules">
        <el-form-item label="团队名称" :label-width="formLabelWidth" prop="teamName">
          <el-input v-model="form.teamName" autocomplete="off"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组长编号" :label-width="formLabelWidth">
              <el-select
                v-model="form.teamLeaderNum"
                placeholder="请选择"
                @change="changTeamLeaderNum"
              >
                <el-option
                  v-for="item in nameData"
                  :key="item.value"
                  :label="item.num"
                  :value="item.num"
                >
                  <span style="float: left; width:30%">{{ item.num }}</span>
                  <span
                    style="float: right; color: #8492a6; margin-left:5%; width:60%"
                  >{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组长姓名" :label-width="formLabelWidth">
              <el-input
                v-model="form.teamLeaderName"
                autocomplete="off"
                :disabled="disabledLeaderName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="上级组" :label-width="formLabelWidth">
          <el-input v-model="form.superGroup" autocomplete="off" :disabled="disabledSuperGropu"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-input v-model="form.dept" autocomplete="off" :disabled="disabledDept"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.desc" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addResource">保存</el-button>
        <el-button @click="cancelAddResource">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'add-resource',
  props: {},
  data () {
    return {
      form: {
        teamName: '', //团队名称
        teamLeaderNum: '', //组长编号
        teamLeaderName: '', //组长姓名
        superGroup: '',  //上级组
        dept: '',   //所属部门
        desc: '',    //备注
      },
      disabledLeaderName: true, //禁止输入团队组长姓名
      disabledSuperGropu: true, // 禁止输入上级组
      disabledDept: true,       //禁止输入所属部门
      // 表单验证
      rules: {
        teamName: [
          { required: true, message: '请输入团队名称', trigger: 'blur' },
        ]
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

    }
  },
  computed: {
    showResourceDialog: {
      set () {
        this.$store.dispatch('showHideAddResource', false)
      },
      get () {
        return this.$store.state.team.addResource.show
      }
    }
  },
  created () { },
  mounted () { },
  methods: {
    // 保存
    addResource () {
      this.$store.dispatch('showHideAddResource', false)
    },
    // 取消
    cancelAddResource () {
      this.$store.dispatch('showHideAddResource', false)
    },
    // 选中组长编号的回调
    changTeamLeaderNum (val) {
      this.nameData.forEach((item, index) => {
        if (item.num == val) {
          this.form.teamLeaderName = item.label  // 自动带出组长姓名
        }
      })
    }
  }
}
</script>
<style lang="scss">
</style>
