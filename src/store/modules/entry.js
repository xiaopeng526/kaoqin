const entry = {
  state: {
    show: false
  },
  mutations: {
    SHOW_HIDE_DIALOG(state, bool) {
      state.show = bool;
    }
  },
  actions: {
    showHideDialog({ commit }, bool) {
      commit("SHOW_HIDE_DIALOG", bool);
    }
  }
};

export default entry;
