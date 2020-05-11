<template>
  <div class="app-container2" v-show="show">
    <p><span type="text">基本信息</span><i class="el-icon-close" @click="close()"></i></p>
    <div class="Customer">
      <div class="customerForm">
        <el-card shadow="always" style="margin:10px 0;" v-if="!customerData.customerId&&flag">
          <div class="Adress" @click="customerAdd()" style="height:100px;">
            <span><i class="el-icon-edit"></i>请添加客户信息</span>
          </div>
        </el-card>
        <el-card shadow="always" v-if="customerData.customerId&&flag">
          <div class="CustomerAdress">
            <h3><span></span><span @click="customerInfo()"><i class="el-icon-edit"></i>编辑</span></h3>
            <div class="Adress_Details">
              <p><span>客户名称：{{customerData.customerName}}</span><span class="Adress_Region">客户简称：{{customerData.customerShortName}}</span>
              </p>
              <p><span>客户级别：{{customerData.customerLevel2}}</span><span class="Adress_Region">客户类型：{{customerData.customerType2}}</span>
              </p>
              <p><span>组织机构代码：{{customerData.orgCd}}</span><span class="Adress_Region">法定代表人：{{customerData.legalPerson}}</span>
              </p>
              <p><span>备注：{{customerData.remark}}</span></p>
              <p><span>创建人：{{customerData.createBy}}</span><span
                class="Adress_Region">创建时间：{{customerData.createTime}}</span></p>
              <p><span>修改人：{{customerData.updateBy}}</span><span
                class="Adress_Region">修改时间：{{customerData.updateTime}}</span></p>
            </div>
          </div>
        </el-card>
        <el-card shadow="always" v-if="!flag">
          <el-form label-width="120px" :model="customerForm" :rules="customerRules" ref="customerForm">
            <el-form-item label-width="0px">
              <el-col :span="12">
                <el-form-item label="客户名称" prop="customerName">
                  <el-input v-model.trim="customerForm.customerName" placeholder="请输入客户名称" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户简称" prop="customerShortName">
                  <el-input v-model.trim="customerForm.customerShortName" placeholder="请输入客户简称" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label-width="0px">
              <el-col :span="12">
                <el-form-item label="客户级别" prop="customerLevel">
                  <el-select v-model="customerForm.customerLevel" clearable placeholder="客户级别" style="width:100%">
                    <el-option
                      v-for="item in customerLevels"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户类型" prop="customerType">
                  <el-select v-model="customerForm.customerType" clearable placeholder="请输入客户类型" style="width:100%">
                    <el-option
                      v-for="item in customerTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label-width="0px">
              <el-col :span="12">
                <el-form-item label="组织机构代码" prop="orgCd">
                  <el-input v-model="customerForm.orgCd" placeholder="请输入组织机构代码" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="法定代表人" prop="legalPerson">
                  <el-input v-model.trim="customerForm.legalPerson" placeholder="请输入法定代表人" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label-width="0px">
              <el-col :span="12">
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" :rows="2"
                            maxlength="80"
                            show-word-limit
                            v-model="customerForm.remark" placeholder="请输入备注信息" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label-width="0px" style="margin-bottom: 20px;float:right">
              <el-button type="primary" @click="CustomerSave('customerForm')" round size="mini">确定</el-button>
              <el-button @click="CloseCustomer()" size="mini" round style="margin-left:30px;">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    <div v-if="customerData.customerId">
      <CustomerAdress :adress="adressData" :adressCusterId="AdressForm" ref="CustomerAdress" @upp=" dataClose"/>
      <BankDeposit :bank="bankDate" :bankCusterId="BankForm" ref="BankDeposit" @upp="dataClose"/>
      <CustomerContact :contact="contactData" :conCusterId="ContactForm" ref="CustomerContact" @upp="dataClose"/>
    </div>
  </div>
</template>

<script>
  import CustomerAdress from './CustomerAdress'
  import BankDeposit from './BankDeposit'
  import CustomerContact from './CustomerContact'
  import {addCustomer, fetchForm, customerUpdata, fetchInfo} from '@/biz/customer/customer_biz'

  export default {
    data() {
      return {
        customerRules: {
          customerName: [
            {required: true, message: '请输入客户名称', trigger: 'blur'},
          ],
        },
        flag: 1,
        flagBy: 0,
        customerForm: {//个人信息相关字段
          customerLevel: '',//级别
          customerName: '',//简称
          orgCd: '',//组织机构代码
          customerType: '',//客户类型
          legalPerson: '',//法人代表
          remark: '',//备注
          customerShortName: ""//客户简称
        },
        customerData: {
          customerName: '',
          customerLevel: '',
          customerId: '',
          legalPerson: '',
          orgCd: '',
          customerType: '',
        },
        loading: false,
        //为后面三个模块传id
        AdressForm: {
          customerId: '',
        },
        ContactForm: {
          customerId: '',
        },
        BankForm: {
          customerId: '',
        },
        adressData: [],//地址
        bankDate: [],//开户行
        contactData: [],//联系方式
        customerTypes: [{
          value: '01',
          label: '金融类'
        }, {
          value: '02',
          label: '银行类'
        }, {
          value: '03',
          label: '普通类'
        }],
        customerLevels: [{
          value: '01',
          label: '一级'
        }, {
          value: '02',
          label: '二级'
        }, {
          value: '03',
          label: '三级'
        }],
      };
    },
    props: {
      show: {
        type: Boolean,
        required: false
      },
    },
    components: {
      CustomerAdress,
      BankDeposit,
      CustomerContact
    },
    methods: {
      //新增保存
      CustomerSave(customerForm) {
        this.$refs[customerForm].validate((valid) => {
          if (valid) {
            addCustomer(this.customerForm).then(res => {
              console.log(res)
              this.flag = 1
              this.customerForm.customerId = res
              //存id到vuex
              this.$store.dispatch('showCustomerId', {customerId: this.customerForm.customerId})
              this.fetchInfo(this.customerForm.customerId)
            }).catch(err => {
              this.$message.error('保存失败');
            })

          }
        });
      },
      //查客户信息详情
      fetchInfo(customerId) {
        fetchInfo(customerId).then(res => {
          // console.log(this.customerData)
          console.log(res)
          this.customerT(res)
          this.customerL(res)
          this.customerData = res
        }).catch(err => {
          // this.$message.error('请求列表失败23');
        })
      },
      customerT(row) {
        switch (row.customerType) {
          case '03':
            row.customerType2 = '普通类'
            break;
          case '02':
            row.customerType2 = '银行类'
            break;
          case '01':
            row.customerType2 = '金融类'
            break;
        }
      },
      customerL(row) {
        switch (row.customerLevel) {
          case '03':
            row.customerLevel2 = '三级'
            break;
          case '02':
            row.customerLevel2 = '二级'
            break;
          case '01':
            row.customerLevel2 = '一级'
            break;
        }
      },
      //显示编辑弹框
      customerInfo() {
        this.flag = 0
        this.flagBy = 1
        this.customerForm = this.customerData
        this.$refs.BankDeposit.handClose()
        this.$refs.CustomerContact.handClose()
        this.$refs.CustomerAdress.handClose()

      },
      customerAdd() {//点击添加，新增弹框
        this.flag = 0
        this.customerForm = {
          customerId: '',
          customerLevel: '',
          customerName: '',
          orgCd: '',
          customerType: '',
          legalPerson: '',
        }
      },
      //添加当前模块，关闭其他模块
      dataClose(data) {
        switch (data) {
          case 'adress':
            this.$refs.BankDeposit.handClose()
            this.$refs.CustomerContact.handClose()
            this.flag = 1
            break;
          case 'bank':
            this.$refs.CustomerAdress.handClose()
            this.$refs.CustomerContact.handClose()
            this.flag = 1
            break;
          case 'contact':
            this.$refs.CustomerAdress.handClose()
            this.$refs.BankDeposit.handClose()
            this.flag = 1
            break;
        }
      },
      //查找客户所有模块信息
      customerSearch(row) {
        console.log(row)
        this.customerData = row
        if(row.customerId){
          fetchForm(this.customerData).then(res => {
            console.log(res)
            this.AdressForm.customerId = this.customerData.customerId//点击编辑为后面三个模块传递id
            this.ContactForm.customerId = this.customerData.customerId
            this.BankForm.customerId = this.customerData.customerId
            this.adressData = res.customerAddressList
            this.bankDate = res.customerBankList
            this.contactData = res.customerContactList
          }).catch(err => {
            this.$message.error('刷新失败');
          })
        }
      },
      CloseCustomer() {//关闭个人信息弹框
        //编辑取消
        if (this.flagBy) {
          // this.fetchInfo(this.customerForm.customerId)
          this.flagBy = 0
          this.$refs.customerForm.resetFields();
        } else {
        }
        this.flag = 1
      },

      close() {//关闭整个页面
        this.$emit("close", false)//组件的显示与隐藏
        this.flag = 1
        this.adressData=[]
          this.bankDate=[]
          this.contactData=[]
        if (this.customerData.customerId) {
          this.$refs.CustomerAdress.checked = 0
          this.$refs.BankDeposit.checked = 0
          this.$refs.CustomerContact.checked = 0
          //只有新增个人信息的情况下，才能关其他模块
          this.$refs.BankDeposit.handClose()
          this.$refs.CustomerContact.handClose()
          this.$refs.CustomerAdress.handClose()
        }
        this.$store.dispatch('outCustomer')//清除vuex的数据
      },
    },
    created() {

    }
  }
</script>

<style scoped>
  .app-container2 {
    width: 100%;
    height: 100%;
    padding: 0 80px;
  }

  .app-container2 p {
    display: flex;
    justify-content: space-between;
  }
</style>
