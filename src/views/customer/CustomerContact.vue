<template>
  <div>
    <div class="Customer">
      <p style="margin:10px 0;">联系方式</p>
      <!--编辑展示组件-->
        <el-card v-if="index+1&&flag.index!=(index+1)"   shadow="always" style="margin:10px 0;" v-for="(item,index) in checked==1?Contact:contact"
                 :key="index">
          <div class="CustomerAdress" >
            <h3><span></span><span @click.stop=" contactEdit(item,index+1)"><i class="el-icon-edit"></i>编辑</span></h3>
            <div class="Adress_Details">
              <p><span> 姓名：{{item.name}}</span><span class="Adress_Region">手机：{{item.mobile}}</span></p>
              <p><span> 座机：{{item.tel}}</span><span class="Adress_Region">微信：{{item.weixin}}</span></p>
              <p><span> QQ：{{item.qq}}</span><span class="Adress_Region"> 邮箱：{{item.email}} </span></p>
              <p><span>创建人：{{item.createBy}}</span><span class="Adress_Region">创建时间：{{item.createTime}}</span></p>
            </div>
          </div>
        </el-card>
         <el-card shadow="always" style="margin:10px 0;" v-else>
        <div class="AdressForm">
          <el-form label-width="120px" :model=" contactForm" :rules="ContactFormRules" ref="contactForm">
            <el-form-item label-width="0px" style="margin-bottom: 20px;">
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model.trim="contactForm.name" placeholder="请输入联系人姓名" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model=" contactForm.mobile" placeholder="请输入手机号" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label-width="0px" style="margin-bottom: 0px;">
              <el-col :span="12">
                <el-form-item label="座机" style="margin-bottom: 20px;" prop="tel">
                  <el-input v-model=" contactForm.tel" placeholder="请输入座机电话" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="微信" prop="weixin">
                  <el-input v-model=" contactForm.weixin" placeholder="请输入微信" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label-width="0px" style="margin-bottom: 0px;">
              <el-col :span="12">
                <el-form-item label="QQ" prop="qq">
                  <el-input v-model=" contactForm.qq" placeholder="请输入qq" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model=" contactForm.email" placeholder="请输入客户邮箱" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <p class="kong"></p>
          </el-form>
          <div class="Address_footer">
            <div class="Btn">
              <el-button type="primary" @click="ContactSave('contactForm')" size="mini" round>确定</el-button>
              <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
              <el-button  v-if="Hidd" icon="el-icon-delete" round size="mini" @click="ContactDelete(contactForm)"
                          style="margin:0 30px;"></el-button>
            </div>
            <div></div>
          </div>
        </div>
      </el-card>
      <!--添加组件-->
      <el-card shadow="always" style="margin:10px 0;" v-if="flag.Address=='1'">
        <div class="AdressForm">
          <el-form label-width="120px" :model=" contactForm" :rules="ContactFormRules" ref="contactForm">
            <el-form-item label-width="0px" style="margin-bottom: 20px;">
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model.trim="contactForm.name" placeholder="请输入联系人姓名" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model=" contactForm.mobile" placeholder="请输入手机号" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label-width="0px" style="margin-bottom: 0px;">
              <el-col :span="12">
                <el-form-item label="座机" style="margin-bottom: 20px;" prop="tel">
                  <el-input v-model=" contactForm.tel" placeholder="请输入座机电话" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="微信" prop="weixin">
                  <el-input v-model=" contactForm.weixin" placeholder="请输入微信" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label-width="0px" style="margin-bottom: 0px;">
              <el-col :span="12">
                <el-form-item label="QQ" prop="qq">
                  <el-input v-model=" contactForm.qq" placeholder="请输入qq" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model=" contactForm.email" placeholder="请输入客户邮箱" clearable/>
                </el-form-item>
              </el-col>
            </el-form-item>
            <p class="kong"></p>
          </el-form>
          <div class="Address_footer">
            <div class="Btn">
              <el-button type="primary" @click="ContactSave('contactForm')" size="mini" round>确定</el-button>
              <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
              <el-button  v-if="Hidd" icon="el-icon-delete" round size="mini" @click="ContactDelete(contactForm)"
                         style="margin:0 30px;"></el-button>
            </div>
            <div></div>
          </div>
        </div>
      </el-card>
      <el-card shadow="always" style="margin:10px 0;" v-else>
        <div class="Adress" @click="ContactAdd()">
          <span><i class="el-icon-plus"></i>添加客户联系</span>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
  import {contactSaveUpdata, deleteContact, fentchContact} from '@/biz/customer/customer_biz'
  import {validateTelphone, validateMobile, checkEmail} from './Check'

  export default {
    data() {
      return {
        Hidd:0,//删除按钮的隐藏与显现
        ContactFormRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {max: 11, message: "手机号错误，请重新输入", trigger: "blur", validator: validateMobile}
          ],
          tel: [
            {required: true, message: '请输入座机号', trigger: 'blur'},
            {min: 11, message: "座机号不少于11位,请重新输入", trigger: "blur",},
            {max: 11, message: "座机号不能多于11位,请重新输入", trigger: "blur"},
            { message: "请正确输入座机号", trigger: "blur", validator: validateTelphone}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {message: "邮箱格式错误，请重新输入", trigger: "blur", validator: checkEmail}
          ],
        },
        flag: {
          Address: '',
          index: ""
        },
        checked:0,
        Contact: [],//联系方式数据
        contactForm: {
          customerId: '',//客户id
          mobeile: '',//电话号
          qq: '',//qq号
          email: '',//邮箱
          weixin: '',//微信
          tel: ''//座机号
        }
      }
    },
    computed: {
     //获取vuex的customerId
      getId() {
        return this.$store.state.customer.customerId
      }
    },
    props: { //父组件传来的值
      contact: {
        type: '',
      },
      conCusterId: {
        type: '',
      }
    },

    methods: {
     //显示编辑弹框
      contactEdit(item,index) {
        // this.contactForm = item
        this.$nextTick(function(){
          this.contactForm = Object.assign({},item);
        })
        this.flag.index=index//隐藏当前反显块
        this.flag.Address = ''
        this.Hidd=1
        this.$emit("upp", 'contact')
      },
    //关闭弹框
      handleClose() {
        this.flag.index=''
        this.flag.Address = ''
        this.$refs.contactForm.resetFields();
      },
      //父组件调用关闭
      handClose() {
        this.flag.index=''
        this.flag.Address = ''
      },
    //显示联系方式弹框
      ContactAdd() {
        //清空表单
        this.contactForm = {
          customerId: this.getId ? this.getId : this.conCusterId.customerId,
          mobeile: '',
          qq: '',
          email: '',
          weixin: '',
          tel: ''
        }
        this.flag.index=''
        this.flag.Address = '1'
        this.Hidd=0
        this.$emit("upp", 'contact')
      },
//联系方式详情列表
      fentchContact(customerId) {
        fentchContact(customerId).then(res => {
          this.checked = 1
          this.Contact = res
        }).catch(err => {
          this.$message.error('请求联系方式失败');
        })
      },
//保存、编辑
      ContactSave(contactForm) {
        this.$refs[contactForm].validate((valid) => {
          if (valid) {
            contactSaveUpdata(this.contactForm).then(res => {
              // console.log(res + "=====" + '新增')
              this.$message.success('保存成功');
              this.handClose()
              this.fentchContact(this.contactForm.customerId)
            }).catch(err => {
              this.$message.error('保存失败');
            })
          }
        })
      },
//删除联系方式
      ContactDelete(row) {
// console.log(row)
        this.$confirm('是否确认删除', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteContact(row.id).then(() => {
            this.$message.success('删除成功');
            this.handClose()
            this.fentchContact(this.contactForm.customerId)
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
</style>
