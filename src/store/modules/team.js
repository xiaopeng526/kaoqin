const team = {
  state: {
    // 添加人员页面的obj
    addPerson: {
      show: false, // 弹出框
      type: "" // 弹出类型
    },
    addResource: {
      show: false,
      type: ""
    }
  },
  mutations: {
    // 添加人员页面的store
    SHOW_HIDE_ADD_PERSON(state, bool) {
      state.addPerson.show = bool;
    },
    SWITCH_PERSON_TYPE(state, type) {
      state.addPerson.type = type;
    },

    // 添加资源组页面的store
    SHOW_HIDE_ADD_RESOURCE(state, bool) {
      state.addResource.show = bool;
    },
    SWITCH_RESOURCE_TYPE(state, type) {
      state.addResource.type = type;
    }
  },
  actions: {
    showHideAddPerson({ commit }, bool) {
      commit("SHOW_HIDE_ADD_PERSON", bool);
    },
    switchPersonType({ commit }, type) {
      commit("SWITCH_PERSON_TYPE", type);
    },

    showHideAddResource({ commit }, bool) {
      commit("SHOW_HIDE_ADD_RESOURCE", bool);
    },
    switchResourceType({ commit }, type) {
      commit("SWITCH_RESOURCE_TYPE", type);
    }
  }
};

export default team;
