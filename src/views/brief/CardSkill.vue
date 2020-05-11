<template>
  <div>
    <el-row v-for="(item,index) in cardArr" v-bind:key="index">
      <el-card class="box-card" v-if="index+1 && flag!=(index+1)">
        <el-row>
          <el-col :span="8" show-overflow-tooltip>
            <span class="resume-info-text">{{ item.skillName }}</span>
          </el-col>
          <el-col :span="8">
            <span class="font-label">{{ item.duration }} 个月</span>
          </el-col>
          <el-col :span="4">
            <span class="font-label">{{ item.masteryLevel }}</span>
          </el-col>
          <el-col :span="4">
            <span class="font-edit" @click="edit(index+1)">
              <i class="el-icon-edit-outline" />&nbsp;编辑
            </span>
          </el-col>
        </el-row>
      </el-card>
      <FormSkill v-else :form-rule="item" @upup="upFormSkill"></FormSkill>
    </el-row>
  </div>
</template>

<script>
import FormSkill from './FormSkill.vue'

export default {
  name: 'card-skill',
  data () {
    return {
      flag: ''
    }
  },
  components: {
    'FormSkill': FormSkill
  },
  created () {

  },
  methods: {
    edit (index) {
      this.flag = index
      this.$emit('upup', 'skill', index)
    },
    upFormSkill () {
      this.flag = ''
      this.$emit('upup', 'skill')
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
