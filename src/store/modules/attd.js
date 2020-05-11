const attd = {
  state: {
    // 添加人员页面的obj
    addForm: {
      show: false, // 弹出框
      type: "" // 未审批，审批中，已批准，已退回 的类型
    },
    otherForm: {
      show: false
    }
  },
  mutations: {
    // 添加人员页面的store
    SHOW_HIDE_ADD_FORM(state, bool) {
      state.addForm.show = bool;
    },
    // 添加人员页面的store
    SWITCH_TYPE(state, type) {
      state.addForm.type = type;
    }
  },
  actions: {
    showHideAddForm({ commit }, bool) {
      commit("SHOW_HIDE_ADD_FORM", bool);
    },
    switchType({ commit }, type) {
      commit("SWITCH_TYPE", type);
    }
  }
};

export default attd;
