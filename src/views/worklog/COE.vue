<template>
  <div class="app-container2">
    <p class="header"><span type="text" style="margin-right:30px">COE信息</span></p>
    <!--编辑展示组件-->
    <el-card v-if="index+1&&flag.index!=(index+1)" shadow="always" style="margin-bottom:10px;" v-for="(item,index) in checked==1?Coe:coe"
             :key="index">
      <div>
        <div class="projectWork">
          <span class="iteamName">COE名称:<span class="iteam">{{item.coeName}}</span></span>
          <p>
            <span @click.stop="coeEdit(item,index+1)"><i class="el-icon-edit"></i></span>
            <span  @click="coeDelete(item)" style="margin:0 30px;"><i class="el-icon-delete"></i></span>
          </p>
        </div>
        <div class="projectWork">
          <div class="iteamName">
            <span>COE内容:</span>
            <span  class="iteamContent">{{item.content}}</span >
          </div>
          <p style="visibility: hidden"><span><i class="el-icon-edit"></i></span>
            <span style="margin:0 30px;"><i class="el-icon-delete"></i></span></p>
        </div>
      </div>
    </el-card>
    <el-card shadow="always" style="margin:10px 0;" v-else>
      <div class="AdressForm">
        <el-form label-width="120px" :model="coeForm" :rules="coeFormRules" ref="coeForm">
          <el-form-item label="COE名称" prop="coeName" :clearable="false">
            <el-input v-model.trim="coeForm.coeName" placeholder="请输入COE名称" />
          </el-form-item>
          <el-form-item label="COE内容" prop="content">
            <el-input type="textarea" :rows="4"
                      maxlength="2000"
                      show-word-limit
                      v-model="coeForm.content" placeholder="请输入COE内容" />
          </el-form-item>
          <p class="kong"></p>
        </el-form>
        <div class="Address_footer">
          <div class="Btn">
            <el-button type="primary" @click="addressSave()" size="mini" round>确定</el-button>
            <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
          </div>
          <div></div>
        </div>
      </div>
    </el-card>
    <!--添加组件-->
    <el-card shadow="always" style="margin:10px 0;" v-if="flag.Address=='1'">
      <div class="AdressForm">
        <el-form label-width="120px" :model="coeForm" :rules="coeFormRules" ref="coeForm">
          <el-form-item label="COE名称" prop="coeName" :clearable="false">
            <el-input v-model.trim="coeForm.coeName" placeholder="请输入COE名称" />
          </el-form-item>
          <el-form-item label="COE内容" prop="content">
            <el-input type="textarea" :rows="4"
                      maxlength="2000"
                      show-word-limit
                      v-model="coeForm.content" placeholder="请输入COE内容" />
          </el-form-item>
          <p class="kong"></p>
        </el-form>
        <div class="Address_footer">
          <div class="Btn">
            <el-button type="primary" @click="addressSave()" size="mini" round>确定</el-button>
            <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
          </div>
          <div></div>
        </div>
      </div>
    </el-card>
    <el-card shadow="always" style="margin:10px 0;" v-else>
      <div class="Adr" @click="addcoe()">
        <span><i class="el-icon-plus"></i>请添加coe信息</span>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {fetchCoe,addCOE,deleteCEO} from '@/biz/worklog/worklog_biz'
  export default {
    data() {
      return {
        coeFormRules: {
          coeName: [{ required: true, message: '请输入coe名称', trigger: 'blur' }],
          content:[{ required: true, message: '请输入coe内容', trigger: 'blur' }],
        },
        flag: {
          Address: '',
          index: "",
        },
        checked:0,
        Coe:[],
        coeForm: {
          worklogId: '',
          coeName: '',//coe名称
          content: '',//ceo内容
          worklogDate: ''//日期
        },
      }
    },
    computed: {
      //获取vuex的worklogId
      getWorkId(){
        return this.$store.state.work.worklogId
      }
    },
    //父级传来的值
    props: {
      com: {
        type: '',
      },
      coe: {
        type: '',
      },
    },
    methods: {
      //编辑弹框
      coeEdit(item,index) {
        //清除编辑未提交的内容和编辑时反显
        this.$nextTick(function(){
          this.coeForm = Object.assign({},item);
        })
        this.flag.index=index//隐藏当前反显块
        this.flag.Address = ''
        this.$emit('upp','coe')//关闭其他模块
      },
      //取消按钮
      handleClose() {
        this.flag.index=''
        this.flag.Address = ''
        this.$refs.coeForm.clearValidate();

      },
      handClose(){//父级调用关闭
        this.flag.index=''
        this.flag.Address = ''
      },
      //显示新增弹框
      addcoe(){
        this.flag.index = ''
        this.flag.Address = '1'
        this.$emit('upp','coe')
        this.coeForm={
           worklogId: this.com.worklogId?this.com.worklogId:this.getWorkId,
            coeName: '',
            content: '',
            worklogDate: this.com.worklogDate?this.com.worklogDate:this.coeForm.worklogDate
        }
      },
      //详情列表
      fentchCoe(worklogId) {
        fetchCoe(worklogId).then(res => {
          console.log(res)
          this.checked = 1
          this.Coe = res
        }).catch(err => {
          this.$message.error('请求详情失败');
        })
      },
      //新增保存
      addressSave() {
        this.$refs['coeForm'].validate((valid) => {
          if (valid) {
            addCOE(this.coeForm,this.coeForm.worklogDate).then(res => {
              // console.log(res)
              this.$message.success('保存成功');
              this.coeForm.worklogId=res
              this.$store.dispatch('showWorkId',{worklogId:this.coeForm.worklogId})
              this.fentchCoe(this.coeForm.worklogId)
              this.handClose()
            }).catch(err => {
              this.$message.error('保存失败');
            })
          }
        })

      },

      //删除
      coeDelete(row) {
        console.log(row)
        this.$confirm('是否确认删除', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCEO(row.id).then(()=>{
            this.$message.success('删除成功');
            this.fentchCoe(row.worklogId)
          })
        }).catch(err => {})
      }
      },

  }
</script>

<style scoped>
</style>
