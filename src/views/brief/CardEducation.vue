<template>
  <div>
    <el-row v-for="(item,index) in cardArr" v-bind:key="index">
      <el-card class="box-card" v-if="index+1 && flag!=(index+1)">
        <el-row>
          <el-col :span="8" show-overflow-tooltip>
            <span class="resume-info-text">{{ item.schoolName }}</span>
          </el-col>
          <el-col :span="6">
            <span class="font-label">{{ item.major }}</span>
          </el-col>
          <el-col :span="3">
            <span class="resume-info-text">{{ item.education }}</span>
          </el-col>
          <el-col :span="3">
            <span class="font-label">{{ item.startDate }} / {{ item.endDate }}</span>
          </el-col>
          <el-col :span="4">
            <span class="font-edit" @click="edit(index+1,item)">
              <i class="el-icon-edit-outline" />&nbsp;编辑
            </span>
          </el-col>
        </el-row>
      </el-card>
      <FormEducation v-else :form-rule="item2" @upup="upFormEducation"></FormEducation>
    </el-row>
  </div>
</template>

<script>
import FormEducation from './FormEducation.vue'

export default {
  name: 'card-education',
  data () {
    return {
      flag: ''
    }
  },
  components: {
    'FormEducation': FormEducation
  },
  created () {

  },
  methods: {
    edit (index, item) {
      this.flag = index
      this.$emit('upup', 'education', index)
      item.dateTime = []
      item.dateTime[0] = item.startDate
      item.dateTime[1] = item.endDate
      this.item2 = item
    },
    upFormEducation () {
      this.flag = ''
      this.$emit('upup', 'education')
    }
  },
  props: {
    cardArr: {
      type: ''
    }
  }
}
</script>

<style scoped>
</style>
