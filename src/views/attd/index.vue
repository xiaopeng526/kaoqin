<template>
  <div>
    <el-row>
      <el-col>
        <el-date-picker
          v-model="months"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择 年/月"
          :clearable="false"
          @change="monthRequestListClick"
        ></el-date-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <Calendar
          class="calendar"
          :calendarDataList="calendarDataList"
          :potsTermList="potsTermList"
          :stripPotsList="stripPotsList"
          :yearMonth="months"
          @sendSelectDate="getSelectDate"
        ></Calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import Calendar from "./calendar";
import dateDemo from "./date";
import { findMonthList } from '../../biz/attd/attd_biz'
export default {
  name: "attd",
  components: {
    Calendar
  },
  data () {
    return {
      // 顶部时间
      months: "",
      today: "",
      empId: 'P111111',
      projectId: 'project-110',
      // 日历
      calendarDataList: [],
      selectDate: "",
      potsTermList: [
        {
          color: "green",
          term: "已批准"
        },
        {
          color: "red",
          term: "被拒绝"
        },
        {
          color: "blue",
          term: "审批中"
        },
        {
          color: "purple",
          term: "未审批"
        }
      ],
      stripPotsList: [
        {
          color: "purple",
          term: "未审批工时",
          timeSts: "TS00"
        },
        {
          color: "blue",
          term: "审批中工时",
          timeSts: "TS01"
        },
        {
          color: "red",
          term: "被拒绝工时",
          timeSts: "TS02"
        },
        {
          color: "green",
          term: "已批准工时",
          timeSts: "TS03"
        }
      ]
    };
  },
  created () {
    // this.calendarDataList = dateDemo.data;

  },
  mounted () {
    // 初始化顶部month
    this.months = this.setOneDate(new Date()).yM;
    // 获取当前日期
    this.today = this.setOneDate(new Date()).yMd;
    this.getCalenderData();
  },
  methods: {
    // 获取日历数据
    getCalenderData () {
      let obj = {
        userId: this.empId,
        projectId: this.projectId,
        month: this.months
      };
      findMonthList(obj).then(res => {
        console.log('------->getCalender', res);
        this.calendarDataList = res;
        // console.log('------准备往子组件传的日历数据', this.calendarDataList);
      }).catch(err => {
        console.log(err)
      });
      // this.calendarDataList = dateDemo.data; // 给日历复制1-30天
    },
    //获取选中的时间
    getSelectDate (data) {
      // console.log('----------从子组件传来的选中的日期', data);
      this.selectDate = data;
    },
    // element年月组件change触发
    monthRequestListClick () {

    },
    // 获取年月日
    setOneDate (date) {
      // 分别获取年月日
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      // 补零
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      // console.log('---------TDM年月日', year+'-'+month+'-'+day);
      return {
        yMd: year + "-" + month + "-" + day,
        yM: year + "-" + month,
        d: day
      };
    }
  },
  watch: {
    months (newVal, oldVal) {
      // console.log('----newDate', newVal, '-----oldDate', oldVal);
      //根据月份渲染日历
      try {
        this.getCalenderData();
      } catch (error) {
        console.log("========日历渲染失败报错", error);
      }
    }
  }
};
</script>

<style lang="scss"></style>
