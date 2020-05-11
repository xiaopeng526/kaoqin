<template>
  <div>
    <el-row v-for="(item,index) in cardArr" v-bind:key="index">
      <el-card class="box-card" v-if="index+1 && flag!=(index+1)">
        <p>
          <span class="font-h3">{{ item.projectName }}</span>
          <span class="font-edit" @click="edit(index+1,item)">
            <i class="el-icon-edit-outline" />&nbsp;编辑
          </span>
        </p>
        <p>
          <span class="font-label">项目时间：</span>
          <span class="font-label">{{ item.startDate }} / {{ item.endDate }}</span>
        </p>
        <p>
          <span class="font-label">项目描述：</span>
        </p>
        <p>
          <span class="font-area">{{ item.projectDesc }}</span>
        </p>
      </el-card>
      <FormProject v-else :form-rule="item2" @upup="upFormProject"></FormProject>
    </el-row>
  </div>
</template>

<script>
import FormProject from './FormProject.vue'

export default {
  name: 'card-project',
  data () {
    return {
      flag: ''
    }
  },
  components: {
    'FormProject': FormProject
  },
  created () {

  },
  methods: {
    edit (index, item) {
      this.flag = index
      this.$emit('upup', 'project', index)
      item.dateTime = []
      item.dateTime[0] = item.startDate
      item.dateTime[1] = item.endDate
      this.item2 = item
    },
    upFormProject () {
      this.flag = ''
      this.$emit('upup', 'project')
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
