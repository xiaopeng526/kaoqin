<template>
  <div class="app-container">
    <div class="resume-info">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-arrow-left"
        @click="revertIndex"
        style="margin-bottom: 20px;font-size: 14px;"
        round
      >返回</el-button>

      <el-row v-loading="loadingInfo">
        <!-- 简历-个人信息-空-->
        <el-card
          v-if="!resumeData.info.briefId && flagArr.info"
          class="box-card"
          align="center"
          style="padding:50px 0;"
          @click.native="resumeAdd('info')"
        >
          <i class="el-icon-edit-outline" /> 填写个人信息
        </el-card>
        <!-- 简历-个人信息-编辑-->
        <CardInfo
          v-if="resumeData.info.briefId && flagArr.info"
          :form-rule="resumeData.info"
          @upup="upCardInfo"
        />
        <!-- 简历-个人信息-新增-->
        <FormInfo
          v-if="!flagArr.info"
          ref="formInfo"
          :form-rule="resumeData.info"
          @upup="upFormInfo"
        />
        <el-divider v-if="resumeData.info.briefId"></el-divider>
      </el-row>

      <el-row v-loading="loadingWork" v-if="resumeData.info.briefId">
        <p class="font-h2">工作经验</p>
        <!-- 简历-工作经验-编辑-->
        <CardWork ref="work" :card-arr="resumeData.listWork" @upup="upFlagArr" />
        <!-- 简历-工作经验-空-->
        <el-card
          v-if="flagArr.work"
          class="box-card"
          align="center"
          @click.native="resumeAdd('work')"
          style="margin-top: 20px;"
        >
          <i class="el-icon-plus" /> 添加工作经验
        </el-card>
        <!-- 简历-工作经验-新增-->
        <FormWork v-else :form-rule="resumeWork" @upup="upFlagArr" />
        <el-divider></el-divider>
      </el-row>

      <el-row v-loading="loadingPro" v-if="resumeData.info.briefId">
        <p class="font-h2">项目经验</p>
        <!-- 简历-项目经验-编辑-->
        <CardProject ref="project" :card-arr="resumeData.listProject" @upup="upFlagArr" />
        <!-- 简历-项目经验-空-->
        <el-card
          v-if="flagArr.project"
          class="box-card"
          align="center"
          @click.native="resumeAdd('project')"
          style="margin-top: 20px;"
        >
          <i class="el-icon-plus" /> 添加项目经验
        </el-card>
        <!-- 简历-项目经验-新增-->
        <FormProject v-else :form-rule="resumeProject" @upup="upFlagArr" />
        <el-divider></el-divider>
      </el-row>

      <el-row v-loading="loadingEdu" v-if="resumeData.info.briefId">
        <p class="font-h2">教育经历</p>
        <!-- 简历-教育经历-编辑-->
        <CardEducation ref="education" :card-arr="resumeData.listEducation" @upup="upFlagArr" />
        <!-- 简历-教育经历-空-->
        <el-card
          v-if="flagArr.education"
          class="box-card"
          align="center"
          @click.native="resumeAdd('education')"
          style="margin-top: 20px;"
        >
          <i class="el-icon-plus" /> 添加教育经历
        </el-card>
        <!-- 简历-教育经历-新增-->
        <FormEducation v-else :form-rule="resumeEducation" @upup="upFlagArr" />
        <el-divider></el-divider>
      </el-row>

      <el-row v-loading="loadingTra" v-if="resumeData.info.briefId">
        <p class="font-h2">培训经历</p>
        <!-- 简历-培训经历-编辑-->
        <CardTrain ref="train" :card-arr="resumeData.listTrain" @upup="upFlagArr" />
        <!-- 简历-培训经历-空-->
        <el-card
          v-if="flagArr.train"
          class="box-card"
          align="center"
          @click.native="resumeAdd('train')"
          style="margin-top: 20px;"
        >
          <i class="el-icon-plus" /> 添加培训经历
        </el-card>
        <!-- 简历-培训经历-新增-->
        <FormTrain v-else :form-rule="resumeTrain" @upup="upFlagArr" />
        <el-divider></el-divider>
      </el-row>

      <el-row v-loading="loadingSk" v-if="resumeData.info.briefId">
        <p class="font-h2">专业技能</p>
        <!-- 简历-专业技能-编辑-->
        <CardSkill ref="skill" :card-arr="resumeData.listSkill" @upup="upFlagArr" />
        <!-- 简历-专业技能-空-->
        <el-card
          v-if="flagArr.skill"
          class="box-card"
          align="center"
          @click.native="resumeAdd('skill')"
          style="margin-top: 20px;"
        >
          <i class="el-icon-plus" /> 添加专业技能
        </el-card>
        <!-- 简历-专业技能-新增-->
        <FormSkill v-else :form-rule="resumeSkill" @upup="upFlagArr" />
      </el-row>
    </div>
  </div>
</template>

<script>
import CardInfo from './CardInfo.vue'
import FormInfo from './FormInfo.vue'
import CardWork from './CardWork.vue'
import FormWork from './FormWork.vue'
import CardProject from './CardProject.vue'
import FormProject from './FormProject.vue'
import CardEducation from './CardEducation.vue'
import FormEducation from './FormEducation.vue'
import CardTrain from './CardTrain.vue'
import FormTrain from './FormTrain.vue'
import CardSkill from './CardSkill.vue'
import FormSkill from './FormSkill.vue'
import './resume_common.css'
import { apiQueryAll, apiQueryInfo, apiQueryWork, apiQueryPro, apiQueryEdu, apiQueryTra, apiQuerySk } from '@/biz/brief/brief_biz'


export default {
  name: 'resume-info',
  data () {
    return {
      loadingInfo: false,
      loadingWork: false,
      loadingPro: false,
      loadingEdu: false,
      loadingTra: false,
      loadingSk: false,
      flagArr: {
        info: 1,
        work: 1,
        project: 1,
        education: 1,
        train: 1,
        skill: 1
      },
      resumeWork: { // 工作经验的表单
        briefId: '',
        companyName: '',
        positionName: '',
        workStart: '',
        workEnd: '',
        workId: '',
        industry: '',
        salBeforeTax: '',
        workDes: ''
      },
      resumeProject: {  // 项目经验的表单
        briefId: '',
        projectId: '',
        projectName: '',
        startDate: '',
        endDate: '',
        companyName: '',
        projectDesc: '',
        responsibility: ''
      },
      resumeEducation: {  // 教育经历的表单
        briefId: '',
        eduId: '',
        schoolName: '',
        startDate: '',
        endDate: '',
        major: '',
        unifiedStrategy: '',
        education: ''
      },
      resumeTrain: {  // 培训经历的表单
        briefId: '',
        trainId: '',
        trainAgency: '',
        trainCourse: '',
        startDate: '',
        endDate: ''
      },
      resumeSkill: {  // 专业技能的表单
        briefId: '',
        skillId: '',
        skillName: '',
        duration: '',
        masteryLevel: ''
      },
      resumeData: {
        info: {       // 简历的新增和查看表单的数据
          briefId: '',
          name: '',
          sex: '',
          birthday: '',
          workTime: '',
          registeredResidence: '',
          currentCity: '',
          phone: '',
          email: '',
          headPortrait: '',
          maritalStatus: '',
          politics: ''
        },
        listWork: [],       // 工作经验的数组
        listProject: [],    // 项目经验的数组
        listEducation: [],  // 教育经历的数组
        listTrain: [],      // 培训经历的数组
        listSkill: []       // 专业技能的数组
      }
    }
  },
  components: {
    'CardInfo': CardInfo,
    'FormInfo': FormInfo,
    'CardWork': CardWork,
    'FormWork': FormWork,
    'CardProject': CardProject,
    'FormProject': FormProject,
    'CardEducation': CardEducation,
    'FormEducation': FormEducation,
    'CardTrain': CardTrain,
    'FormTrain': FormTrain,
    'CardSkill': CardSkill,
    'FormSkill': FormSkill
  },
  methods: {
    queryResume (item) { // 查看简历所有信息
      if (item) {
        this.resumeWork.briefId = item.briefId
        this.resumeProject.briefId = item.briefId
        this.resumeEducation.briefId = item.briefId
        this.resumeTrain.briefId = item.briefId
        this.resumeSkill.briefId = item.briefId
        this.resumeData.info = item
        this.queryAll(item.briefId)
        return
        //this.queryInfo(item.briefId)
        this.queryWork(item.briefId)
        this.queryProject(item.briefId)
        this.queryEducation(item.briefId)
        this.queryTrain(item.briefId)
        this.querySkill(item.briefId)
      } else {
        this.resumeData = {
          info: {
            briefId: '',
            name: '',
            sex: '男',
            birthday: '',
            workTime: '',
            registeredResidence: '',
            currentCity: '',
            phone: '',
            email: '',
            headPortrait: '',
            maritalStatus: '',
            politics: ''
          },
          listWork: [],
          listProject: [],
          listEducation: [],
          listTrain: [],
          listSkill: []
        }
      }
    },
    queryAll (briefId) {
      apiQueryAll({ 'briefId': briefId }).then(res => {
        console.log(res)
        this.resumeData.listWork = res.workExperienceList
        this.resumeData.listProject = res.projectExperienceList
        this.resumeData.listEducation = res.eduExperienceList
        this.resumeData.listTrain = res.trainExperienceList
        this.resumeData.listSkill = res.proSkillList
      }).catch(err => {
        this.loadingInfo = false
        this.$message.error("请求失败")
      })
    },
    queryInfo (briefId) { // 个人信息-查看
      this.loadingInfo = true
      apiQueryInfo(briefId).then(res => {
        this.loadingInfo = false
        this.resumeData.info = res
      }).catch(err => {
        this.loadingInfo = false
        this.$message.error("请求失败")
      })
    },
    queryWork (briefId) { // 工作经验-查看
      this.loadingWork = true
      apiQueryWork(briefId).then(res => {
        this.loadingWork = false
        this.resumeData.listWork = res
      }).catch(err => {
        this.loadingWork = false
        this.$message.error("请求失败")
      })
    },
    queryProject (briefId) { // 项目经验-查看
      this.loadingPro = true
      apiQueryPro(briefId).then(res => {
        this.loadingPro = false
        this.resumeData.listProject = res
      }).catch(err => {
        this.loadingPro = false
        this.$message.error("请求失败")
      })
    },
    queryEducation (briefId) { // 教育经历-查看
      this.loadingEdu = true
      apiQueryEdu(briefId).then(res => {
        this.loadingEdu = false
        this.resumeData.listEducation = res
      }).catch(err => {
        this.loadingEdu = false
        this.$message.error("请求失败")
      })
    },
    queryTrain (briefId) { // 培训经历-查看
      this.loadingTra = true
      apiQueryTra(briefId).then(res => {
        this.loadingTra = false
        this.resumeData.listTrain = res
      }).catch(err => {
        this.loadingTra = false
        this.$message.error("请求失败")
      })
    },
    querySkill (briefId) { // 专业技能-查看
      this.loadingSk = true
      apiQuerySk(briefId).then(res => {
        this.loadingSk = false
        this.resumeData.listSkill = res
      }).catch(err => {
        this.loadingSk = false
        this.$message.error("请求失败")
      })
    },


    revertIndex () { // 返回主页
      this.$emit('upup')
      // 所有模块新增关闭
      this.flagArr = {
        info: 1,
        work: 1,
        project: 1,
        education: 1,
        train: 1,
        skill: 1
      }
      // 所有模块卡片关闭
      // this.$refs.work.flag = ''
      // this.$refs.project.flag = ''
      // this.$refs.education.flag = ''
      // this.$refs.train.flag = ''
      // this.$refs.skill.flag = ''
    },


    resumeInfoAdd () { // 个人信息新增
      this.flagArr.info = 0
    },
    upCardInfo () { // 个人信息卡片回调
      this.flagArr.info = 0
    },
    upFormInfo (data) { // 个人信息表单回调
      this.flagArr.info = 1
      this.queryResume(data)
      // this.queryInfo(data.briefId)
    },


    resumeAdd (msg) { // 模块新增
      // 其他模块新增关闭
      this.flagArr = {
        info: 1,
        work: 1,
        project: 1,
        education: 1,
        train: 1,
        skill: 1
      }
      // 当前模块新增打开
      this.flagArr[msg] = 0
      // 其他模块卡片关闭
      // this.$refs.work.flag = ''
      // this.$refs.project.flag = ''
      // this.$refs.education.flag = ''
      // this.$refs.train.flag = ''
      // this.$refs.skill.flag = ''
    },

    upFlagArr (msg, index) { // 新增/卡片回调
      // 所有模块新增关闭
      this.flagArr = {
        info: 1,
        work: 1,
        project: 1,
        education: 1,
        train: 1,
        skill: 1
      }
      // 其他模块卡片关闭
      this.$refs.work.flag = ''
      this.$refs.project.flag = ''
      this.$refs.education.flag = ''
      this.$refs.train.flag = ''
      this.$refs.skill.flag = ''
      // 当前模块卡片打开
      if (index) {
        this.$refs[msg].flag = index
      }
      // 清空所有新增表单
      switch (msg) {
        case 'work':
          this.resumeWork = {
            briefId: this.resumeWork.briefId,
            companyName: '',
            positionName: '',
            workStart: '',
            workEnd: '',
            industry: '',
            salBeforeTax: '',
            workDes: ''
          }
          this.queryWork(this.resumeWork.briefId)
          break
        case 'project':
          this.resumeProject = {
            briefId: this.resumeProject.briefId,
            projectName: '',
            startDate: '',
            endDate: '',
            companyName: '',
            projectDesc: '',
            responsibility: ''
          }
          this.queryProject(this.resumeProject.briefId)
          break
        case 'education':
          this.resumeEducation = {
            briefId: this.resumeEducation.briefId,
            schoolName: '',
            startDate: '',
            endDate: '',
            major: '',
            unifiedStrategy: '',
            education: ''
          }
          this.queryEducation(this.resumeEducation.briefId)
          break
        case 'train':
          this.resumeTrain = {
            briefId: this.resumeTrain.briefId,
            trainAgency: '',
            trainCourse: '',
            startTime: '',
            endTime: ''
          }
          this.queryTrain(this.resumeTrain.briefId)
          break
        case 'skill':
          this.resumeSkill = {
            briefId: this.resumeSkill.briefId,
            skillName: '',
            duration: '',
            masteryLevel: ''
          }
          this.querySkill(this.resumeSkill.briefId)
          break
      }
    }
  }
}
</script>

<style scoped>
</style>
