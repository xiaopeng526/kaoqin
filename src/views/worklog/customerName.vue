<template>
  <div class="app-container2">
    <p class="header"><span type="text" style="margin-right:30px">客户拜访</span></p>
    <!--编辑展示组件-->
    <el-card  v-if="index+1&&flag.index!=(index+1)"  shadow="always" style="margin-bottom:10px;" v-for="(item,index) in checked==1?Customer:customer"
             :key="index">
      <div >
        <div class="projectWork">
          <span class="iteamName">客户名称:<span class="iteam">{{item.customerName}}</span></span>
          <p>
            <span @click.stop="customerEdit(item,index+1)"><i class="el-icon-edit"></i></span>
            <span  @click="customerDelete(item)" style="margin:0 30px;"><i class="el-icon-delete"></i></span>
          </p>
        </div>
        <div class="projectWork">
          <div class="iteamName">
            <span>拜访内容:</span>
            <span  class="iteamContent">{{item.content}}</span >
          </div>
          <p style="visibility: hidden"><span><i class="el-icon-edit"></i></span>
            <span style="margin:0 30px;"><i class="el-icon-delete"></i></span></p>
        </div>
      </div>
    </el-card>
    <el-card shadow="always" style="margin:10px 0;" v-else>
      <div class="AdressForm">
        <el-form label-width="120px" :model="customerForm" :rules="customerFormRules" ref="customerForm">
          <el-form-item label="客户名称" prop="customerName" :clearable="false">
            <el-input v-model.trim="customerForm.customerName" placeholder="请输入客户名称" />
          </el-form-item>
          <el-form-item label="拜访内容" prop="content">
            <el-input type="textarea" :rows="4"
                      maxlength="2000"
                      show-word-limit
                      v-model="customerForm.content" placeholder="请输入客户拜访内容" />
          </el-form-item>
          <p class="kong"></p>
        </el-form>
        <div class="Address_footer">
          <div class="Btn">
            <el-button type="primary" @click="customerSave()" size="mini" round>确定</el-button>
            <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
          </div>
          <div></div>
        </div>
      </div>
    </el-card>
    <!--添加组件-->
    <el-card shadow="always" style="margin:10px 0;" v-if="flag.Address=='1'">
      <div class="AdressForm">
        <el-form label-width="120px" :model="customerForm" :rules="customerFormRules" ref="customerForm">
          <el-form-item label="客户名称" prop="customerName" :clearable="false">
            <el-input v-model.trim="customerForm.customerName" placeholder="请输入客户名称" />
          </el-form-item>
          <el-form-item label="拜访内容" prop="content">
            <el-input type="textarea" :rows="4"
                      maxlength="2000"
                      show-word-limit
                      v-model="customerForm.content" placeholder="请输入客户拜访内容" />
          </el-form-item>
          <p class="kong"></p>
        </el-form>
        <div class="Address_footer">
          <div class="Btn">
            <el-button type="primary" @click="customerSave()" size="mini" round>确定</el-button>
            <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
          </div>
          <div></div>
        </div>
      </div>
    </el-card>
    <el-card shadow="always" style="margin:10px 0;" v-else>
      <div class="Adr" @click="addCustomer()" >
        <span><i class="el-icon-plus"></i>请添加客户拜访信息</span>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {fetchCustomer,addCustomer,deleteCustomer} from '@/biz/worklog/worklog_biz'
  export default {
    data() {
      return {
        customerFormRules: {
          customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
          content:[{ required: true, message: '请输入拜访内容', trigger: 'blur' }],
        },
        flag: {
          Address: '',
          index: '',
        },
        checked:0,
        Customer:[],
        customerForm: {
          worklogId: '',
          customerName: '',
          content: '',
          worklogDate: '',
        },
      }
    },
    computed: {
      getWorkId(){
        return this.$store.state.work.worklogId
      }
    },
    props: {
      custom: {
        type: '',
      },
      customer: {
        type: '',
      },
    },
    methods: {
      //编辑弹框
      customerEdit(item,index) {
        //清除编辑未提交的内容和编辑时反显
        this.$nextTick(function(){
          this.customerForm = Object.assign({},item);
        })
        this.flag.index=index//隐藏当前反显块
        this.flag.Address = ''//显示表单
        this.$emit('upp','customer')//关闭其他模块
      },
      //关闭弹框
      handleClose() {
        this.flag.Address = ''
        this.flag.index=''
        this.$refs.customerForm.clearValidate();
      },
      handClose(){//父级调用关闭
        this.flag.Address = ''
        this.flag.index=''
      },
      //显示新增弹框
      addCustomer() {
        this.flag.Address = '1'
        this.flag.index=''
        this.$emit('upp','customer')
        this.customerForm={
          worklogId: this.custom.worklogId?this.custom.worklogId:this.getWorkId,
          customerName: '',
          content: '',
          worklogDate: this.custom.worklogDate?this.custom.worklogDate:this.customerForm.worklogDate
        }
      },
      //详情列表
      fentchCust(worklogId) {
        fetchCustomer(worklogId).then(res => {
          // console.log(res)
          this.checked = 1
          this.Customer = res
          console.log(this.Customer)
        }).catch(err => {
          this.$message.error('请求详情失败');
        })
      },
      //新增保存
      customerSave() {
        this.$refs['customerForm'].validate((valid) => {
          if (valid) {
            addCustomer(this.customerForm,this.customerForm.worklogDate).then(res => {
              console.log(res)
              this.$message.success('保存成功');
              this.customerForm.worklogId=res
              this.$store.dispatch('showWorkId',{worklogId:this.customerForm.worklogId})
              this.fentchCust(this.customerForm.worklogId)
              this.handClose()
            }).catch(err => {
              this.$message.error('保存失败');
            })
          }
        });
      },
      //删除
      customerDelete(row) {
        console.log(row)
        this.$confirm('是否确认删除', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCustomer(row.id).then(()=>{
            this.$message.success('删除成功');
            this.fentchCust(row.worklogId)
          })
        }).catch(err => {

        })
      },
    },
  }
</script>

<style scoped>
</style>
