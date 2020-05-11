<template>
  <div class="app-container" v-show="show">
    <p class="magtext"><span type="text">日报信息</span><i class="el-icon-close" @click="close()"></i></p>
    <el-form>
      <el-form-item label="日期" prop="worklogDate">
        <el-date-picker v-model="worklogDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        :disabled="formFlag=='check'"
                        @change="getDate"
                        :clearable="false"/>
      </el-form-item>
    </el-form>
    <project :project="projectData" :prom="projectForm" ref="projectForm" @upp="dataClose"></project>
    <COE :coe="coeData" :com="coeForm" ref="coeForm" @upp="dataClose"></COE>
    <develop :develop="developData" :delpom="developForm" ref="developForm" @upp="dataClose"></develop>
    <customer :customer="customerData" :custom="customerForm" ref="customerForm" @upp="dataClose"></customer>
  </div>
</template>
<script>
  import develop from './developName'
  import customer from './customerName'
  import project from './projectDaily'
  import COE from './COE'
  import {fetchContent, DateExist, fetchInfo} from '@/biz/worklog/worklog_biz'

  export default {
    components: {COE, develop, customer, project},
    data() {
      return {
        formFlag: '',
        Trigger: 0,
        work: {},
        worklogDate: '',//日期
        //为所有子组件传递日期和worklogId
        projectForm: {
          worklogId: '',
          worklogDate: ''
        },
        coeForm: {
          worklogId: '',
          worklogDate: ''
        },
        developForm: {
          worklogId: '',
          worklogDate: ''
        },
        customerForm: {
          worklogId: '',
          worklogDate: '',
        },
        projectData: [],//项目数组
        coeData: [],//ceo数组
        developData: [],//研发数据
        customerData: []//客户数据
      }
    },
    methods: {
      //可选日期
      getDate() {
        //所有模块的数据初始化
        this.$refs.projectForm.checked = 0
        this.$refs.coeForm.checked = 0
        this.$refs.developForm.checked = 0
        this.$refs.customerForm.checked = 0
        //切换日期时关闭模块的弹框
        this.$refs.projectForm.handClose()
        this.$refs.coeForm.handClose()
        this.$refs.developForm.handClose()
        this.$refs.customerForm.handClose()
        this.$store.dispatch('showOut')//清除vuex的数据
        if (this.worklogDate) {
          this.findInfo(this.worklogDate)//根据日期查所有信息
        }
      },
      DateEst() {//获取当天日期
        DateExist().then(res => {
          this.worklogDate = res
          this.projectForm.worklogDate = this.worklogDate
          this.coeForm.worklogDate = this.worklogDate
          this.developForm.worklogDate = this.worklogDate
          this.customerForm.worklogDate = this.worklogDate
          this.findInfo(this.worklogDate)
        }).catch(err => {
          // this.$message.error('获取日期失败');
        })
      },
      //根据日期获取所有信息
      findInfo(worklogDate) {
        fetchInfo(worklogDate).then(res => {
          console.log(res)
          //为后面四个模块传递worklogDate
          this.projectForm.worklogDate = worklogDate
          this.coeForm.worklogDate = worklogDate
          this.developForm.worklogDate = worklogDate
          this.customerForm.worklogDate = worklogDate
          //为后面四个模块传递id
          this.projectForm.worklogId = res.worklogId
          this.coeForm.worklogId = res.worklogId
          this.developForm.worklogId = res.worklogId
          this.customerForm.worklogId = res.worklogId
          //为后面四个模块传递数组数据
          this.projectData = res.worklogIteamList
          this.developData = res.worklogDevelopList
          this.coeData = res.worklogCOEList
          this.customerData = res.worklogCustomerVisitList
        }).catch(err => {
          this.$message.error('获取模块信息失败');
        })
      },
      //查看与新增入口
      allSearch(row) {
        this.formFlag = ''
        if (row.isShow) {
          this.Trigger = 1
          this.DateEst()//获取当天日期
        } else {
          this.Trigger = 2
          this.formFlag = 'check'
          this.worklogDate = row.worklogDate
          this.fetchCont(row)//查所有模块信息
        }
      },
      //根据当前数据查所有模块信息
      fetchCont(row) {
        console.log(row)
        fetchContent(row).then(res => {
          console.log(res)
          //传给子组件的的日期
          this.work = row
          this.worklogDate = row.worklogDate
          this.projectForm.worklogDate = this.worklogDate
          this.coeForm.worklogDate = this.worklogDate
          this.developForm.worklogDate = this.worklogDate
          this.customerForm.worklogDate = this.worklogDate
          this.projectForm.worklogId = this.work.worklogId//为后面四个模块传递id
          this.coeForm.worklogId = this.work.worklogId
          this.developForm.worklogId = this.work.worklogId
          this.customerForm.worklogId = this.work.worklogId
          //初始化给子组件传递数据
          this.projectData = res.worklogIteamList
          this.developData = res.worklogDevelopList
          this.coeData = res.worklogCOEList
          this.customerData = res.worklogCustomerVisitList
        }).catch(err => {
          this.$message.error('刷新失败');
        })
      },
      //关闭
      close() {
        this.$emit("close", false)//组件的显示与隐藏
        this.$refs.projectForm.handClose()
        this.$refs.coeForm.handClose()
        this.$refs.developForm.handClose()
        this.$refs.customerForm.handClose()
        this.worklogDate = ''
        //关闭前清空所有模块的数据
        this.projectData = []
        this.developData = []
        this.coeData = []
        this.customerData = []
        //所有模块的数据初始化
        this.$refs.projectForm.checked = 0
        this.$refs.coeForm.checked = 0
        this.$refs.developForm.checked = 0
        this.$refs.customerForm.checked = 0
        this.$store.dispatch('showOut')//清除vuex的数据
      },
      //打开当前模块，关闭其他模块
      dataClose(val) {
        switch (val) {
          case 'project':
            this.$refs.coeForm.handClose()
            this.$refs.developForm.handClose()
            this.$refs.customerForm.handClose()
            break;
          case 'coe':
            this.$refs.projectForm.handClose()
            this.$refs.developForm.handClose()
            this.$refs.customerForm.handClose()
            break;
          case 'develop':
            this.$refs.projectForm.handClose()
            this.$refs.coeForm.handClose()
            this.$refs.customerForm.handClose()
            break;
          case 'customer':
            this.$refs.projectForm.handClose()
            this.$refs.coeForm.handClose()
            this.$refs.developForm.handClose()
            break;
        }
      },
    },
    props: {
      show: {
        type: Boolean,
        required: false
      },
    },
  }
</script>

<style scoped>

</style>
