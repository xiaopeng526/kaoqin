import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import api from "./modules/api";
import user from "./modules/user";
import tagsView from "./modules/tagsView";
import permission from "./modules/permission";
import settings from "./modules/settings";
import getters from "./getters";

import team from "./modules/team"; // 团队管理的数据
import attd from "./modules/attd"; // 考勤填报的数据
import entry from "./modules/entry"; // 考勤填报的数据
import customer from "./modules/customer";
import work from "./modules/worklog"; // 日报
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    api,
    user,
    tagsView,
    permission,
    settings,
    team, // 团队管理
    attd, // 考勤填报
    entry, // 入职管理
    work,
    customer
  },
  getters
});

export default store;
