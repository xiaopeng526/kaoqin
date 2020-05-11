<template>
  <div>
    <div class="Customer">
      <p style="margin:10px 0;">开户行信息</p>
      <!--编辑展示组件-->
        <el-card v-if="index+1&&flag.index!=(index+1)"  shadow="always" style="margin:10px 0;" v-for="(item,index) in checked==1?Bank:bank" :key="index">
          <div class="CustomerAdress" >
            <h3><span></span><span @click.stop="bankEdit(item,index+1)"><i class="el-icon-edit"></i>编辑</span></h3>
            <div class="Adress_Details">
              <p><span>开户行：{{item.taxBank}}</span><span> 账户:{{item.name}}</span><span class="Adress_Region">账号:{{item.taxAccount}} </span>
              </p>
              <p><span>创建人：{{item.createBy}}</span><span class="Adress_Region">创建时间:{{item.createTime}}</span></p>
              <p><span>修改人：{{item.updateBy}}</span><span class="Adress_Region">修改时间:{{item.updateTime}}</span></p>
            </div>
          </div>
        </el-card>
      <el-card shadow="always" style="margin:10px 0;" v-else>
        <div class="AdressForm">
          <el-form label-width="110px" :model="bankForm" :rules="BankFormRules" ref="bankForm">
            <el-form-item label-width="0px" style="margin-bottom: 0px;">
              <el-col :span="8">
                <el-form-item label="开户行" prop="taxBank">
                  <el-input v-model.trim="bankForm.taxBank" placeholder="请输入开户行" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="账户" prop="name">
                  <el-input v-model.trim="bankForm.name" placeholder="请输入账户姓名" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="账号" style="margin-bottom: 20px;" prop="taxAccount">
                  <el-input  class='taxAccount' v-model="bankForm.taxAccount" placeholder="请输入账号" clearable @keyup.native="inputCard"/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <p class="kong"></p>
          </el-form>
          <div class="Address_footer">
            <div class="Btn">
              <el-button type="primary" @click="bankSave('bankForm')" size="mini" round>确定</el-button>
              <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
              <el-button v-if="Hidd"  icon="el-icon-delete" round size="mini" @click="bankDelete(bankForm)"
                         style="margin:0 30px;"></el-button>
            </div>
            <div></div>
          </div>
        </div>
      </el-card>
      <!--添加组件-->
      <el-card shadow="always" style="margin:10px 0;" v-if="flag.Address=='1'">
        <div class="AdressForm">
          <el-form label-width="110px" :model="bankForm" :rules="BankFormRules" ref="bankForm">
            <el-form-item label-width="0px" style="margin-bottom: 0px;">
              <el-col :span="8">
                <el-form-item label="开户行" prop="taxBank">
                  <el-input v-model="bankForm.taxBank" placeholder="请输入开户行" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="账户" prop="name">
                  <el-input v-model="bankForm.name" placeholder="请输入账户姓名" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="账号" style="margin-bottom: 20px;" prop="taxAccount">
                  <el-input class='taxAccount' v-model="bankForm.taxAccount" placeholder="请输入账号" clearable @keyup.native="inputCard"/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <p class="kong"></p>
          </el-form>
          <div class="Address_footer">
            <div class="Btn">
              <el-button type="primary" @click="bankSave('bankForm')" size="mini" round>确定</el-button>
              <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
              <el-button v-if="Hidd"  icon="el-icon-delete" round size="mini" @click="bankDelete(bankForm)"
                         style="margin:0 30px;"></el-button>
            </div>
            <div></div>
          </div>
        </div>
      </el-card>
      <el-card shadow="always" style="margin:10px 0;" v-else>
        <div class="Adress" @click="bankAdd()">
          <span><i class="el-icon-plus"></i>添加客户开户行</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {bankSaveUpdata, deleteBank, fetchBank} from '@/biz/customer/customer_biz'
  export default {
    data() {
      return {
        Hidd:0,//删除按钮的隐藏与显现
        BankFormRules: {
          taxAccount: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {min:19,max:21,message: "请正确输入账号", trigger: "blur"}
          ],
          name: [
            {required: true, message: '请输入账户姓名', trigger: 'blur'},
          ],
          taxBank: [
            {required: true, message: '请输入开户行', trigger: 'blur'},
          ]
        },
        flag: {
          Address: '',
          index: ""
        },
        checked: 0,
        Bank: [],//开户行数据
        bankForm: {
          customerId: '',//客户id
          taxBank: '',//开户行
          taxAccount: '',//账号
          name: ''//开户姓名
        },
      }
    },
    computed: {//获取vuex的customerId
      getId() {
        return this.$store.state.customer.customerId
      }
    },
    props: {
      //父组件的传递的数据
      bank: {
        type: '',
      },
      bankCusterId: {
        type: '',
      },
    },
    methods: {
      inputCard(){
        this.bankForm.taxAccount = this.bankForm.taxAccount.replace(/\D/g, '') // 不允许输入非数字字符
        this.bankForm.taxAccount = this.bankForm.taxAccount.replace(/(\d{4})(?=\d)/g, '$1 ') // 4位一组，非获取匹配最后一组数字，避免删除到空格时会马上自动补齐
      },
      //显示开户行弹框
      bankAdd() {
        //新增时清空表单
        this.bankForm = {
          customerId: this.getId ? this.getId : this.bankCusterId.customerId,
          taxBank: '',
          taxAccount: '',
          bankId: '',
        },
          this.Hidd=0
        this.flag.Address = '1'
        this.flag.index=''
        this.$emit("upp", 'bank')
      },
      //显示编辑弹框
      bankEdit(item,index) {
        // this.bankForm = item
        // console.log(item)
        this.$nextTick(function(){
          this.bankForm = Object.assign({},item);
        })
        this.flag.index=index//隐藏当前反显块
        this.flag.Address = ''
        this.Hidd=1
        this.$emit("upp", 'bank')
      },
      //关闭
      handleClose() {
        this.flag.index=''
        this.flag.Address = ''
        this.$refs.bankForm.resetFields();
      },
      //父组件调用关闭
      handClose() {
        this.flag.index=''
        this.flag.Address = ''
      },

      //新增保存开户行
      bankSave(bankForm) {
        console.log(this.bankForm)
        this.$refs[bankForm].validate((valid) => {
          if (valid) {
            bankSaveUpdata(this.bankForm).then(res => {
              // console.log(res)
              this.$message.success('保存成功');
              this.handClose()
              this.fetchBank(this.bankForm.customerId)
            }).catch(err => {
              this.$message.error('保存失败');
            })
          }
        })
      },
      //开户行详情列表
      fetchBank(customerId) {
        fetchBank(customerId).then(res => {
          // console.log(res)
          this.checked = 1
          this.Bank = res
        }).catch(err => {
          this.$message.error('请求地址详情失败');
        })
      },
      //删除开户行
      bankDelete(row) {
        // console.log(row)
        this.$confirm('是否确认删除', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBank(row.id).then(() => {
            this.$message.success('删除成功');
            this.handClose()
            this.fetchBank(this.bankForm.customerId)
          })
        }).catch(err => {

        })
      },
    },
    created() {
    }
  }
</script>

<style scoped>
  .AdressForm {
    height: 100%;
    width: 100%;
  }

  .kong {
    height: 2px;
  }

  .Customer {
    margin-top: 20px;
  }
  .taxAccount {width:100%;}
</style>
