<template>
  <div>
    <el-row>
      <span class="font-edit" @click="edit">
        <i class="el-icon-edit-outline" />&nbsp;编辑
      </span>
      <el-image :src="formRule.headPortrait" fit="cover"></el-image>
      <div class="resume-info-head">
        <p>
          <span class="font-h1">{{ formRule.name }}</span>
        </p>
        <p>
          <span class="font-text">{{ formRule.sex }}</span>
          <span class="font-text">{{ formRule.birthday }}</span>
          <span class="font-text">{{ formRule.currentCitys }}</span>
          <span class="font-text">{{ formRule.workTime }}</span>
        </p>
        <p>
          <span class="font-text">
            <i class="el-icon-mobile" />
            {{ formRule.phone }}
          </span>
          <span class="font-text" style="min-width: 15px;" />
          <span class="font-text">
            <i class="el-icon-message" />
            {{ formRule.email }}
          </span>
        </p>
      </div>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'card-info',
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    edit () {
      this.$emit('upup')
    }
  },
  props: {
    formRule: {
      type: ''
    }
  }
}
</script>

<style scoped>
</style>
