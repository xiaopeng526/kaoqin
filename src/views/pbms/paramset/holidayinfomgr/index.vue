<template>
  <div>
    <el-row :gutter="24">
      <!-- 左侧日历 -->
      <el-col :span="18">
        <el-calendar ref="calendar" v-model="currentMonth">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template slot="dateCell" slot-scope="{date, data}">
            <div ref="dayCell" class="holiday-left" @click="addMatter(data)">
              <span :class="data.isSelected ? 'is-selected' : ''">{{ data.day }}</span>
              <p></p>
            </div>
          </template>
        </el-calendar>
      </el-col>
      <!-- 右侧说明 -->
      <el-col :span="6">
        <div class="holiday-right">
          <el-row :gutter="24">
            <el-col :span="14">
              <span class="el-icon-date"></span>
              国家法定假日
            </el-col>
            <el-col :span="6" :offset="2">
              <el-button type="success" size="mini">初始化</el-button>
            </el-col>
          </el-row>
          <div class="margin-botton-5" style="background-color:#82AF6F;margin-top:5px">
            <span class="el-icon-rank"></span>
            假日
          </div>
          <div class="margin-botton-5" style="background:#D15B47">
            <span class="el-icon-rank"></span>
            春节
          </div>
          <div class="margin-botton-5" style="background:#9585BF">
            <span class="el-icon-rank"></span>
            清明节
          </div>
          <div class="margin-botton-5" style="background:#FEE188">
            <span class="el-icon-rank"></span>
            劳动节
          </div>
          <div class="margin-botton-5" style="background:#D6487E">
            <span class="el-icon-rank"></span>
            端午节
          </div>
          <div class="margin-botton-5" style="background:#3A87AD">
            <span class="el-icon-rank"></span>
            中秋节
          </div>
          <div class="margin-botton-5" style="background:#0000FF">
            <span class="el-icon-rank"></span>
            国庆节
          </div>
          <div class="margin-botton-5" style="background:#D15B47">
            <span class="el-icon-rank"></span>
            元旦节
          </div>
          <span style="font-size:14px">节假日图表说明：图表有颜色区域表示该日期是节假日，无颜色区域表示该日期是工作日！</span>
        </div>
      </el-col>
    </el-row>
    <!-- 添加对话框 -->
    <el-dialog :append-to-body="true" :visible="showDialog" :close-on-click-modal="false" :before-close="cancleDialog" :title="formTitle">
      <el-form ref="editForm" :model="editForm" :rules="formRules" width="80px" label-position="right" size="small">
        <el-form-item label="节假日：" label-width="120px" prop="holiday">
          <el-input :rows="2" v-model="editForm.holiday" type="textarea" placeholder="请输入内容" @input="forceWrite($event)"></el-input>
        </el-form-item>
        <el-form-item label="设置颜色：" label-width="120px" prop="color">
          <el-color-picker v-model="editForm.color" @change="colorChange" @active-change="numberColorChange"></el-color-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="dialogButtonDisabled" size="small" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" @click="cancleDialog()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const checkHolidayContent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('此项不能为空'))
      } else {
        const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('只能输入中文和英文'))
          this.dialogButtonDisabled = true
        }
      }
    }
    return {
      // 当前月份
      currentMonth: new Date(),
      currentDay: '',
      // 是否显示添加安排对话框
      showDialog: false,
      formTitle: '',
      editForm: {
        color: 'red',
        holiday: ''
      },
      formRules: {
        holiday: [{ validator: checkHolidayContent, trigger: 'blur' }]
      },
      dialogButtonDisabled: false
    }
  },
  mounted() {
    console.log(this.$refs.calendar)
    this.currentDay = this.$refs.calendar
  },
  methods: {
    // 添加安排
    addMatter(data) {
      console.log(data) // 2020-01-05
      this.showDialog = true
      const year = data.day.slice(0, 4)
      let month = data.day.slice(5, 7)
      if (month < 10) month = month.slice(1)
      let day = data.day.slice(8)
      if (day < 10) day = day.slice(1)
      console.log(year)
      console.log(month)
      console.log(day)
      this.formTitle = year + '年' + month + '月' + day + '日' + '安排'
    },
    // 提交表单
    submitForm() {
      this.showDialog = false
      console.log(this.$refs.dayCell)
      console.log(this.editForm.color)
      const div = this.$refs.dayCell
      const p = document.createElement('p')
      p.innerHTML = this.editForm.holiday
      p.style.color = this.editForm.color
      div.appendChild(p)
      console.log('div', div)
    },
    cancleDialog() {
      this.showDialog = false
    },
    forceWrite(e) {
      this.$forceUpdate()
    },
    // 当绑定值变化时触发
    colorChange(val) {
      console.log(val)
      this.editForm.color = val
    },
    // 选择的颜色改变时触发
    numberColorChange(val) {
      // 当前显示的颜色值
      console.log('当前显示的颜色值', val)
    }
  }
}
</script>

<style scoped>
.is-selected {
  color: #1989fa;
}
.holiday-left {
  width: 114%;
  height: 123%;
  position: relative;
  top: -24px;
  left: -8px;
}
.holiday-left span {
  position: absolute;
  right: 10px;
  top: 10px;
}
.holiday-right {
  padding: 10px;
  margin-top: 5px;
}
.margin-botton-5 {
  margin-bottom: 5px;
  height: 30px;
  line-height: 22px;
  padding: 5px;
  background-color: red;
}
</style>

