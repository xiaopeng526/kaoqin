<template>
  <div>
    <el-row v-for="(item,index) in cardArr" v-bind:key="index">
      <el-card class="box-card" v-if="index+1 && flag!=(index+1)">
        <p>
          <span class="font-h3">{{ item.companyName }}</span>
          <span class="font-edit" @click="edit(index+1,item)">
            <i class="el-icon-edit-outline" />&nbsp;编辑
          </span>
        </p>
        <p>
          <span class="font-label">
            {{ item.positionName }}&nbsp;&nbsp;|&nbsp;&nbsp;
            {{ item.salBeforeTax }}
          </span>
        </p>
        <el-row style="margin-bottom: 15px;">
          <el-col :span="8">
            <span class="font-label">职位名称：</span>
            <span class="resume-info-text">{{ item.positionName }}</span>
          </el-col>
          <el-col :span="8">
            <span class="font-label">所属行业：</span>
            <span class="resume-info-text">{{ item.industry }}</span>
          </el-col>
        </el-row>
        <p>
          <span class="font-label">工作描述：</span>
        </p>
        <p>
          <span class="font-area">{{ item.workDes }}</span>
        </p>
      </el-card>
      <FormWork v-else :form-rule="item2" @upup="upFormWork"></FormWork>
    </el-row>
  </div>
</template>

<script>
import FormWork from './FormWork.vue'

export default {
  name: 'card-work',
  data () {
    return {
      flag: '',

    }
  },
  components: {
    'FormWork': FormWork
  },
  created () {

  },
  methods: {
    edit (index, item) {
      this.flag = index
      this.$emit('upup', 'work', index)
      item.dateTime = []
      item.dateTime[0] = item.workStart
      item.dateTime[1] = item.workEnd
      this.item2 = item
    },
    upFormWork () {
      this.flag = ''
      this.$emit('upup', 'work')
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
