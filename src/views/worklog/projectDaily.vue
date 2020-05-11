<template>
  <div class="app-container2">
    <p class="header"><span type="text" style="margin-right:30px">项目工作</span></p>
    <!--编辑展示组件-->
    <el-card v-if="index+1&&flag.index!=(index+1)"  shadow="always" style="margin-bottom:10px;" v-for="(item,index) in checked==1?Project:project"
             :key="index">
      <div>
        <div class="projectWork">
          <span class="iteamName">项目名称:<span class="iteam">{{item.iteamName}}</span></span>
          <p>
            <span @click.stop="projectEdit(item,index+1)"><i class="el-icon-edit"></i></span>
            <span @click="deleteIteam(item)" style="margin:0 30px;"><i class="el-icon-delete"></i></span>
          </p>
        </div>
        <div class="projectWork">
          <div class="iteamName">
            <span>项目内容:</span>
            <span class="iteamContent">{{item.content}}</span>
          </div>
          <p style="visibility: hidden"><span><i class="el-icon-edit"></i></span>
            <span style="margin:0 30px;"><i class="el-icon-delete"></i></span></p>
        </div>
      </div>
    </el-card>
    <el-card   shadow="always" style="margin:10px 0;" v-else>
      <div class="AdressForm">
        <el-form label-width="120px" :model="projectForm" :rules="projectFormRules" ref="proForm">
          <el-form-item label="项目名称" prop="iteamName" :clearable="false">
            <el-input v-model.trim="projectForm.iteamName" placeholder="请输入项目名称" />
          </el-form-item>
          <el-form-item label="项目内容" prop="content">
            <el-input type="textarea" :rows="4"
                      maxlength="2000"
                      show-word-limit
                      v-model="projectForm.content" placeholder="请输入项目内容"/>
          </el-form-item>
          <p class="kong"></p>
        </el-form>
        <div class="Address_footer">
          <div class="Btn">
            <el-button type="primary" @click="itemSave()" size="mini" round>确定</el-button>
            <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
          </div>
          <div></div>
        </div>
      </div>
    </el-card>
    <!--添加组件-->
    <el-card   shadow="always" style="margin:10px 0;" v-if="flag.Address=='1'">
      <div class="AdressForm">
        <el-form label-width="120px" :model="projectForm" :rules="projectFormRules" ref="proForm">
          <el-form-item label="项目名称" prop="iteamName" :clearable="false">
            <el-input v-model.trim="projectForm.iteamName" placeholder="请输入项目名称" />
          </el-form-item>
          <el-form-item label="项目内容" prop="content">
            <el-input type="textarea" :rows="4"
                      maxlength="2000"
                      show-word-limit
                      v-model="projectForm.content" placeholder="请输入项目内容"/>
          </el-form-item>
          <p class="kong"></p>
        </el-form>
        <div class="Address_footer">
          <div class="Btn">
            <el-button type="primary" @click="itemSave()" size="mini" round>确定</el-button>
            <el-button @click="handleClose()" size="mini" style="margin-left:30px;" round>取 消</el-button>
          </div>
          <div></div>
        </div>
      </div>
    </el-card>
    <el-card shadow="always" style="margin:10px 0;" v-else>
      <div class="Adr" @click="addProject()">
        <span><i class="el-icon-plus"></i>请添加项目信息</span>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {fetchProject, addItem, deleteProject} from '@/biz/worklog/worklog_biz'

  export default {
    data() {
      return {
        projectFormRules: {
          iteamName: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
          content: [{required: true, message: '请输入项目内容', trigger: 'blur'}],
        },
        flag: {
          Address: '',
          index:'',
        },
        checked: 0,
        Project: [],//项目数组
        projectForm: {
          worklogId: '',
          iteamName: '',//项目名称
          content: '',//内容
          worklogDate: ''//日期
        },
      }
    },
    computed: {
      getWorkId() {//获取vuex的worklogId
        return this.$store.state.work.worklogId
      }
    },
    //父组件传过来的值
    props: {
      prom: {
        type: '',
      },
      project: {
        type: '',
      },
    },
    methods: {
      //编辑弹框
      projectEdit(item,index) {
        //清除编辑未提交的内容和编辑时反显
        this.$nextTick(function(){
          this.projectForm = Object.assign({},item);
        })
        this.flag.index=index//隐藏当前反显块
         this.flag.Address=''
        this.$emit('upp', 'project')//关闭其他模块
      },
      //关闭弹框
      handleClose() {
        this.flag.index=''
         this.flag.Address = ''
        this.$refs['proForm'].clearValidate();
      },
      handClose() {//父级调用关闭
        this.flag.index=''
        this.flag.Address =''
      },
      //显示新增弹框
      addProject() {
        this.flag.index=''
        this.flag.Address = '1'
        this.$emit('upp', 'project')
        this.projectForm = {
          worklogId:this.prom.worklogId?this.prom.worklogId:this.getWorkId,
          iteamName: '',
          content: '',
          worklogDate: this.prom.worklogDate?this.prom.worklogDate:this.projectForm.worklogDate
        }
      },
      //详情列表
      fetchProject(worklogId) {
        fetchProject(worklogId).then(res => {
          console.log(res)
          this.checked = 1
          this.Project = res
          console.log(this.Project)
        }).catch(err => {
          this.$message.error('请求项目详情失败');
        })
      },
      //新增保存
      itemSave() {
        console.log(this.projectForm)
        this.$refs['proForm'].validate((valid) => {
          if (valid) {
            addItem(this.projectForm, this.projectForm.worklogDate).then(res => {
              // console.log(res)
              this.$message.success('保存成功');
              this.checked = 1
              this.projectForm.worklogId = res
              this.$store.dispatch('showWorkId', {worklogId: this.projectForm.worklogId})
              this.fetchProject(this.projectForm.worklogId)
              this.handClose()
            }).catch(err => {
              this.$message.error('保存失败');
            })
          }
        });
      },
      //删除
      deleteIteam(row) {
        // console.log(row)
        this.$confirm('是否确认删除', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProject(row.id).then(() => {
            this.$message.success('删除成功');
            this.fetchProject(row.worklogId)
          })
        }).catch(err => {

        })
      },
    },
  }
</script>

<style scoped>
</style>
