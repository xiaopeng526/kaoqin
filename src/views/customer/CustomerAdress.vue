<template>
  <div>
    <div class="Customer" style="height:100%;">
      <p style="margin:10px 0;">地址信息</p>
    </div>
      <!--编辑展示组件-->
      <el-card  v-if="index+1&&flag.index!=(index+1)"  shadow="always" style="margin:10px 0;" v-for="(item,index) in checked==1?Adress:adress"
               :key="index">
        <div class="CustomerAdress" >
          <h3><span></span><span @click.stop="AddressEdit(item,'edit',index+1)"><i class="el-icon-edit"></i>编辑</span></h3>
          <div class="Adress_Details">
            <p><span>所在区域：{{item.area}}</span><span class="Adress_Region">地址类型：{{item.addressType}}</span></p>
            <p><span>地址：{{item.taxAddress}}</span><span class="Adress_Region">邮编：{{item.postcode}}</span></p>
            <p><span> 网址：{{item.website}}</span></p>
            <p><span>创建人：{{item.createBy}}</span><span class="Adress_Region">创建时间：{{item.createTime}}</span></p>
            <p><span>修改人：{{item.updateBy}}</span><span class="Adress_Region">修改时间：{{item.updateTime}}</span></p>
          </div>
        </div>
      </el-card>
      <el-card shadow="always" style="margin:10px 0;" v-else>
        <div class="AdressForm">
          <el-form label-width="120px" :model="adressForm" :rules="AdressFormRules" ref="adressForm">
            <el-form-item label-width="0px" style="margin-bottom: 0px;">
              <el-col :span="12">
                <el-form-item label="所在区域" style="margin-bottom: 20px;" prop="area">
                  <el-input v-model.trim="adressForm.area" placeholder="请输入客户所在区域" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地址类型" prop="addressType">
                  <el-input v-model.trim="adressForm.addressType" placeholder="请输入地址类型" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label-width="0px" style="margin-bottom: 0px;">
              <el-col :span="12">
                <el-form-item label="地址" prop="taxAddress">
                  <el-input v-model.trim="adressForm.taxAddress" placeholder="请输入公司地址" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮编" style="margin-bottom: 20px;" prop="postcode">
                  <el-input v-model="adressForm.postcode" placeholder="请输入邮编" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label-width="0px" style="margin-bottom: 0px;">
              <el-col :span="12">
                <el-form-item label="网址" style="margin-bottom: 20px;" prop="website">
                  <el-input v-model="adressForm.website" placeholder="请输入网址" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="Address_footer">
            <div class="Btn">
              <el-button type="primary" @click="addressSave('adressForm')" size="mini" round>确定</el-button>
              <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
              <el-button v-if="Hidd" icon="el-icon-delete" round size="mini" @click="addressDelete(adressForm)"
                         style="margin:0 30px;"></el-button>
            </div>
          </div>
        </div>
      </el-card>

    <!--添加组件-->
    <el-card shadow="always" style="margin:10px 0;" v-if="flag.Address=='1'">
      <div class="AdressForm">
        <el-form label-width="120px" :model="adressForm" :rules="AdressFormRules" ref="adressForm">
          <el-form-item label-width="0px" style="margin-bottom: 0px;">
            <el-col :span="12">
              <el-form-item label="所在区域" style="margin-bottom: 20px;" prop="area">
                <el-input v-model.trim="adressForm.area" placeholder="请输入客户所在区域" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址类型" prop="addressType">
                <el-input v-model.trim="adressForm.addressType" placeholder="请输入地址类型" clearable/>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label-width="0px" style="margin-bottom: 0px;">
            <el-col :span="12">
              <el-form-item label="地址" prop="taxAddress">
                <el-input v-model.trim="adressForm.taxAddress" placeholder="请输入公司地址" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮编" style="margin-bottom: 20px;" prop="postcode">
                <el-input v-model="adressForm.postcode" placeholder="请输入邮编" clearable/>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label-width="0px" style="margin-bottom: 0px;">
            <el-col :span="12">
              <el-form-item label="网址" style="margin-bottom: 20px;" prop="website">
                <el-input v-model="adressForm.website" placeholder="请输入网址" clearable/>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="Address_footer">
          <div class="Btn">
            <el-button type="primary" @click="addressSave('adressForm')" size="mini" round>确定</el-button>
            <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
            <el-button v-if="Hidd" icon="el-icon-delete" round size="mini" @click="addressDelete(adressForm)"
                       style="margin:0 30px;"></el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card shadow="always" style="margin:10px 0;" v-else>
      <div class="Adress" @click="AddressEdit()">
        <span><i class="el-icon-plus"></i>添加客户地址</span>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {adressSaveUpdata, deleteAdress, fentchAdress} from '@/biz/customer/customer_biz'
import {checkNumber,validateCompareWebsite} from './Check'
  export default {
    data() {
      return {
        Hidd:0,//删除按钮的隐藏与显现
        AdressFormRules: {
          postcode: [
            { required:false, message: '请输入邮编', trigger: 'blur' },
            {min:6,max:6, message: "邮编格式错误，请重新输入", trigger: "blur", validator: checkNumber}
              ],
          website: [
            { required: false, message: '请输入网址', trigger: 'blur' },
            { min:13,max:20,message: "网址格式错误，请重新输入", trigger: "blur", validator: validateCompareWebsite}
          ],
          area:[
            { required:true, message: '请输入所在区域', trigger: 'blur' },]
        },
        checked:0,
        flag: {
          Address: '',
          index: "",

        },
        Adress: [],//地址数据
        adressForm:{
          customerId:'',//客户id
          addressType:'',//地址类型
          area:'',//所在区域
          taxAddress:'',//公司地址
          postcode:'',//邮编
          website:'',//网址
          addressId:''//地址id
        },
      }
    },
    computed:{//获取vuex的id
      getId(){
        return this.$store.state.customer.customerId
      }
    },
    props: {
      //父组件传来的值
      adress: {
        type: '',
      },
      adressCusterId: {
        type: '',
      },
    },
    methods: {
      //新增、编辑弹框
      AddressEdit(item,type,index) {
        if(type=='edit'){
          // this.adressForm=item
          this.$nextTick(function(){
            this.adressForm = Object.assign({},item);
          })
          this.flag.index=index//隐藏当前反显块
          this.flag.Address = ''//显示表单
          this.Hidd=1
        }else{
          //新增前清空表单
          this.adressForm={
            customerId:this.getId?this.getId:this.adressCusterId.customerId,
            addressType:'',
            area:'',
            taxAddress:'',
            postcode:'',
            website:'',
            addressId:''
          }
          this.Hidd=0
          this.flag.Address = '1'//显示表单
          this.flag.index=''
        }
        this.$emit("upp", 'adress')
      },
      //取消按钮
      handleClose() {
        this.flag.index=''
        this.flag.Address = ''
        this.$refs['adressForm'].clearValidate();
      },
      //父组件调用关闭
      handClose() {
        this.flag.Address = ''
        this.flag.index=''
      },

      //地址详情列表
      fentchAdress(customerId) {
        fentchAdress(customerId).then(res => {
          // console.log(res)
          this.checked = 1
          this.Adress = res
        }).catch(err => {
          this.$message.error('请求地址详情失败');
        })
      },
      //保存
      addressSave(adressForm) {
        this.$refs[adressForm].validate((valid) => {
            if (valid) {
              adressSaveUpdata(this.adressForm).then(res => {
                this.$message.success('保存成功');
                this.fentchAdress(this.adressForm.customerId)
                this.handClose()
              }).catch(err => {
                this.$message.error('保存失败');
              })
            }
        })
      },
      //删除地址
      addressDelete(row) {
        // console.log(row.id)
        this.$confirm('是否确认删除', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAdress(row.id).then(()=>{
            this.$message.success('删除成功');
            this.fentchAdress(this.adressForm.customerId)
            this.handClose()
          })
        }).catch(err => {

        })
      },
    },
    created() {
        console.log(222,this.address);
        console.log(221112,this.adress);

    },
  }
</script>

<style scoped>
  .AdressForm {
    height: 100%;
    width: 100%;
  }
  .Customer {
    height:100%;
    margin-top: 20px;
  }
</style>
