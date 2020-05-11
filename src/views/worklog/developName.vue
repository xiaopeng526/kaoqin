<template>
  <div class="app-container2">
    <p class="header"><span type="text" style="margin-right:30px">研发项目</span></p>
    <!--编辑展示组件-->
    <el-card  v-if="index+1&&flag.index!=(index+1)"  shadow="always" style="margin-bottom:10px;" v-for="(item,index) in checked==1?Develop:develop"
             :key="index">
      <div >
        <div class="projectWork">
          <span class="iteamName">研发项目名称:<span class="iteam">{{item.developName}}</span></span>
          <p>
            <span @click.stop="developEdit(item,index+1)"><i class="el-icon-edit"></i></span>
            <span  @click="developDelete(item)" style="margin:0 30px;"><i class="el-icon-delete"></i></span>
          </p>
        </div>
        <div class="projectWork">
          <div class="iteamName">
            <span>研发项目内容:</span>
            <span  class="iteamContent">{{item.content}}</span >
          </div>
          <p style="visibility: hidden"><span><i class="el-icon-edit"></i></span>
            <span style="margin:0 30px;"><i class="el-icon-delete"></i></span></p>
        </div>
      </div>
    </el-card>
    <el-card shadow="always" style="margin:10px 0;" v-else>
      <div class="AdressForm">
        <el-form label-width="120px" :model="developForm" :rules="developFormRules" ref="developForm">
          <el-form-item label="研发项目名称" prop="developName" :clearable="false">
            <el-input v-model.trim="developForm.developName" placeholder="请输入研发项目名称" />
          </el-form-item>
          <el-form-item label="研发项目内容" prop="content">
            <el-input type="textarea" :rows="4"
                      maxlength="2000"
                      show-word-limit
                      v-model="developForm.content" placeholder="请输入研发项目内容" />
          </el-form-item>
          <p class="kong"></p>
        </el-form>
        <div class="Address_footer">
          <div class="Btn">
            <el-button type="primary" @click="developSave()" size="mini" round>确定</el-button>
            <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
          </div>
          <div></div>
        </div>
      </div>
    </el-card>
    <!--添加组件-->
    <el-card shadow="always" style="margin:10px 0;" v-if="flag.Address=='1'">
      <div class="AdressForm">
        <el-form label-width="120px" :model="developForm" :rules="developFormRules" ref="developForm">
          <el-form-item label="研发项目名称" prop="developName" :clearable="false">
            <el-input v-model.trim="developForm.developName" placeholder="请输入研发项目名称" />
          </el-form-item>
          <el-form-item label="研发项目内容" prop="content">
            <el-input type="textarea" :rows="4"
                      maxlength="2000"
                      show-word-limit
                      v-model="developForm.content" placeholder="请输入研发项目内容" />
          </el-form-item>
          <p class="kong"></p>
        </el-form>
        <div class="Address_footer">
          <div class="Btn">
            <el-button type="primary" @click="developSave()" size="mini" round>确定</el-button>
            <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
          </div>
          <div></div>
        </div>
      </div>
    </el-card>
    <el-card shadow="always" style="margin:10px 0;" v-else>
      <div class="Adr" @click="addDevelop()" >
        <span><i class="el-icon-plus"></i>请添加研发项目信息</span>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {fetchDevelop,addDevelop,deleteDevelop} from '@/biz/worklog/worklog_biz'
  export default {
    data() {
      return {
        developFormRules: {
          developName: [{ required: true, message: '请输入研发名称', trigger: 'blur' }],
          content:[{ required: true, message: '请输入研发内容', trigger: 'blur' }],
        },
        flag: {
          Address: '',
          index: "",
        },
        checked: '',
        Develop:[],//研发数组
        developForm: {
          worklogId: '',
          developName: '',//研发名称
          content: '',//研发内容
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
    //父级传来的日期
    props: {
      delpom: {
        type: '',
      },
      develop: {
        type: '',
      },
    },
    methods: {
      //编辑弹框
      developEdit(item,index) {
        //清除编辑未提交的内容和编辑时反显
        this.$nextTick(function(){
          this.developForm = Object.assign({},item);
        })
        this.flag.index=index//隐藏当前反显块
        this.flag.Address = ''
        this.$emit('upp','develop')//关闭其他模块
      },
      //取消按钮
      handleClose() {
        this.flag.index=''
        this.flag.Address = ''
        this.$refs.developForm.clearValidate();

      },
      handClose(){//父级调用关闭
        this.flag.Address = ''
        this.flag.index=''
      },
      //显示新增弹框
      addDevelop() {
        this.flag.index=''
        this.flag.Address = '1'
        this.$emit('upp','develop')
        this.developForm={
             worklogId: this.delpom.worklogId?this.delpom.worklogId:this.getWorkId,
            developName: '',
            content: '',
            worklogDate: this.delpom.worklogDate?this.delpom.worklogDate:this.developForm.worklogDate
        }
      },
      //详情列表
      fetchDevelop(worklogId) {
        fetchDevelop(worklogId).then(res => {
          // console.log(res)
          this.checked = 1
          this.Develop = res
        }).catch(err => {
          this.$message.error('请求详情失败');
        })
      },
      //新增保存
      developSave() {
        this.$refs['developForm'].validate((valid) => {
          if (valid) {
            addDevelop(this.developForm,this.developForm.worklogDate).then(res => {
              this.$message.success('保存成功');
              this.developForm.worklogId=res
              this.$store.dispatch('showWorkId',{worklogId:this.developForm.worklogId})
              this.fetchDevelop(this.developForm.worklogId)
              this.handClose()
            }).catch(err => {
              this.$message.error('保存失败');
            })
          }
        });
      },
      //删除
      developDelete(row) {
        console.log(row)
        this.$confirm('是否确认删除', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDevelop(row.id).then(()=>{
            this.fetchDevelop(row.worklogId)
            this.$message.success('删除成功');
          })
        }).catch(err => {
        })
      }
    },
  }
</script>

<style scoped>
</style>
