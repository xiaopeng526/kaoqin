<template>
  <div class="merge_deps">
    <el-dialog :visible.sync="showDialog" :close-on-click-modal="false" :append-to-body="true" width="30%" title="选择合并机构" @close="$emit('mergeDepSelector', 'cancel')">
      <el-radio-group v-model="mergeDep">
        <el-col :span="24">
          <el-radio :label="3">备选项</el-radio>
        </el-col>
        <el-col :span="24">
          <el-radio :label="6">备选项</el-radio>
        </el-col>
        <el-col :span="24">
          <el-radio :label="9">备选项</el-radio>
        </el-col>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="$emit('mergeDepSelector', 'confirm', mergeDep)">
          确定
        </el-button>
        <el-button size="mini" @click.stop="$emit('mergeDepSelector', 'cancel')">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MergeDepartments',
  data() {
    return {
      mergeDep: '',
      showDialog: true
    }
  },
  methods: {
    dialogCloseHandle() {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.alert_bg {
  position: fixed;
  top: 84px;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: auto;
}
.alert_box {
  position: absolute;
  top: 10%;
  left: 40%;
  bottom: 10%;
  right: 40%;
  height: 350px;
  background: #fff;
  border-radius: 5px;
}
.alert_header {
  position: relative;
  width: 100%;
  height: 30px;
  background: #1989fa;
  border-radius: 5px 5px 0 0;
  color: #fff;
  font-weight: bold;
  line-height: 30px;
}
.alert_title {
  padding: 0 10px;
  font-size: 14px;
}
.close_btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
}
.alert_main {
  width: 100%;
  height: 270px;
  padding: 10px;
  overflow: auto;
}
.alert_footer {
  width: 100%;
  height: 50px;
}

.align-right {
  padding: 10px;
  text-align: right;
}
</style>
