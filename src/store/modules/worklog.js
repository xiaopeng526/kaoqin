const work = {
  state: {
    worklogId:''
  },
  mutations: {
    SHOW_WORK_Id(state,payload) {
      state.worklogId= payload.worklogId;
    },
    SHOW_OUT(state) {
      state.worklogId=''
    }
  },
  actions: {
    showWorkId({ commit },data) {
      commit("SHOW_WORK_Id", data);
    },
    showOut({ commit }) {
      commit("SHOW_OUT");
    },
  },
};
export default work;
