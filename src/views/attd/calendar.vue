<template>
  <div>
    <div class="calendar_box">
      <div class="week_box">
        <span class="week_day" :key="index" v-for="(item, index) in weeks">
          {{
          item
          }}
        </span>
      </div>
      <div class="day_box">
        <div class="days prev_month_day" v-for="(item, index) in weeksNum" :key="index"></div>
        <div
          class="days day_list"
          ref="nowTime"
          v-for="(item, idx) in calendarDataList"
          :key="item.id"
          :class="{
            weekend_style: item.dateType === 'DT01'||item.dateType === 'DT02'||item.dateType === 'DT03',
            now_day: item.holidayDate === today
          }"
          @click.stop="clickNowDate($event, item.timeSts)"
        >
          <span
            class="day_num"
            :data-index="idx"
            :data-holidayDate="item.holidayDate"
          >{{ parseInt(item.holidayDate.slice(-2)) }}</span>
          <ul>
            <li v-for="(strip, index) in stripPotsList" :key="index">
              <span
                :class="strip.color + '_spot'"
                class="spot_circle_day spot_circle"
                v-if="item.timeSts === strip.timeSts"
              ></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="pots">
      <ul>
        <li v-for="(item, index) in potsTermList" :key="index">
          <span :class="item.color + '_spot'" class="spot_circle"></span>
          <span>{{ item.term }}</span>
        </li>
      </ul>
    </div>
    <add-form ref="addForm"></add-form>
  </div>
</template>
<script>
import AddForm from "./addForm";
export default {
  components: {
    AddForm
  },
  props: {
    calendarDataList: {
      type: Array,
      default: () => []
    },
    potsTermList: {
      type: Array,
      required: true
    },
    stripPotsList: {
      type: Array,
      required: true
    },
    yearMonth: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      today: "", //今天
      dates: "", //选中的日期
      nowDay: "", //选中的“日”
      weeksNum: 0, //为上个月添加多少留白
      dateList: [], //当前月所有日期
      weeks: ["一", "二", "三", "四", "五", "六", "日"],
    };
  },
  watch: {
    calendarDataList (newVal, oldVal) {
      // console.log('----newVal', newVal, '-----oldVal', oldVal);
      try {
        this.LoadCalendars();
        this.calendarDataList = newVal;
      } catch (error) {
        console.log("========日历渲染失败报错", error);
      }
    }
  },

  created () {
    //初始化日期，默认选中 当前天
    this.LoadCalendars();
  },
  methods: {
    LoadCalendars () {
      this.renderCalendar("mm");
    },
    renderCalendar (el) {
      this.today = this.setOneDate(new Date()).yMd;
      let nowYear, nowMonth, nowDay, dates, aMonthDayNums, aMonthfirstDayIsWeek;
      if (el === "mm") {
        this.dates = this.yearMonth;
        let dates = this.yearMonth;
        nowYear = dates.slice(0, 4);
        nowMonth = dates.slice(5, 8);
      } else if (el === "dd") {
        this.dates === "" ? this.setOneDate(new Date()).yMd : this.dates;
        dates = this.dates;
        nowYear = dates.slice(0, 4);
        nowMonth = dates.slice(5, -3);
        nowDay = dates.slice(-2);
        this.nowDay = nowDay;
      }
      aMonthDayNums = new Date(nowYear, nowMonth, 0).getDate();
      aMonthfirstDayIsWeek = new Date(
        nowYear + "/" + nowMonth + "/" + 1
      ).getDay();
      if (aMonthfirstDayIsWeek === 0) aMonthfirstDayIsWeek = 7;
      this.weeksNum = aMonthfirstDayIsWeek === 0 ? 7 : aMonthfirstDayIsWeek - 1;
    },
    clickNowDate (e, type) {
      let indexs = e.target.dataset.index;
      this.dates = e.target.dataset.holidaydate;
      this.dateList = [...document.getElementsByClassName("day_list")];
      this.dateList.forEach((ele, index) => {
        if (indexs == index) {
          ele.classList.add("is_selected_day");
        } else {
          ele.classList.remove("is_selected_day");
          ele.classList.remove("now_day");
        }
      });
      this.renderCalendar("dd");
      this.$emit("sendSelectDate", this.dates);

      // 判断是 未审批， 审批中， 已批准， 已退回
      if (type == "TS00") {
        console.log(0);
        this.saveType(type)
      } else if (type == "TS01") {
        console.log(1);
        this.saveType(type)
      } else if (type == "TS02") {
        console.log(2);
        this.saveType(type)
      } else if (type == "TS03") {
        console.log(3);
        this.saveType(type)
      } else {
        console.log(5);
        this.saveType('add')
      }

      //调用显示添加的表单
      this.showAddForm()
    },
    // 保存 是审批，未审批，已批准的类型
    saveType (type) {
      this.$store.dispatch('switchType', type)
    },
    //显示 添加的Dialog
    showAddForm () {
      this.$store.dispatch('showHideAddForm', true)
    },
    setOneDate (date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      return {
        yMd: year + "-" + month + "-" + day,
        yM: year + "-" + month,
        d: day
      };
    }
  }
};
</script>
<style lang="scss" scoped>
@import './calendar.scss';
</style>
