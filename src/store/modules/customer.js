const customer = {
  state: {
    customerId:''
  },
  mutations: {
    SHOW_CUSTOMER_ID(state,payload) {
      state.customerId= payload.customerId;
      // console.log(payload.customerId)
    },
    OUT_CUSTOMER(state) {
      state.customerId=''
    }
  },
  actions: {
    showCustomerId({ commit },data) {
      commit("SHOW_CUSTOMER_ID", data);
    },
    outCustomer({ commit }) {
      commit("OUT_CUSTOMER");
    },
  },
};
export default customer;
