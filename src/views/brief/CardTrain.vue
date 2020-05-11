<template>
  <div>
    <el-row v-for="(item,index) in cardArr" v-bind:key="index">
      <el-card class="box-card" v-if="index+1 && flag!=(index+1)">
        <el-row>
          <el-col :span="8" show-overflow-tooltip>
            <span class="resume-info-text">{{ item.trainAgency }}</span>
          </el-col>
          <el-col :span="8">
            <span class="font-label">{{ item.trainCourse }}</span>
          </el-col>
          <el-col :span="4">
            <span class="font-label">{{ item.startDate }} / {{ item.endDate }}</span>
          </el-col>
          <el-col :span="4">
            <span class="font-edit" @click="edit(index+1,item)">
              <i class="el-icon-edit-outline" />&nbsp;编辑
            </span>
          </el-col>
        </el-row>
      </el-card>
      <FormTrain v-else :form-rule="item2" @upup="upFormTrain"></FormTrain>
    </el-row>
  </div>
</template>

<script>
import FormTrain from './FormTrain.vue'

export default {
  name: 'card-train',
  data () {
    return {
      flag: ''
    }
  },
  components: {
    'FormTrain': FormTrain
  },
  created () {

  },
  methods: {
    edit (index, item) {
      this.flag = index
      this.$emit('upup', 'train', index)
      item.dateTime = []
      item.dateTime[0] = item.startDate
      item.dateTime[1] = item.endDate
      this.item2 = item

    },
    upFormTrain () {
      this.flag = ''
      this.$emit('upup', 'train')
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
