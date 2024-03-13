import { createStore } from "vuex";
// import router from '@/router/index';
import router from "@/router";
import axios from 'axios';

const state = {
  isUserLoggedIn: "",
  LoggedInUserId: "",
  numOfCategories: "",
  listOfCategories: [],
};

const getters = {};

const mutations = {
  redirectTo(state, payload) {
    router.push({ name: payload });
  },
  isLoggedInUser(state){
    let user = localStorage.getItem("user_info");
    if (user) {
      state.isUserLoggedIn = 'true';
      state.LoggedInUserId = JSON.parse(user).id;
    } else {
      state.isUserLoggedIn = 'false';
    }
  },
  async displayAllCategories(state, payload){
    let result = await axios.get(`http://localhost:3000/categories?userId=${payload.userIdIs}`);
    if (result.status == 200) {
      state.listOfCategories = result.data;
      state.numOfCategories = state.listOfCategories.length;
    }
  },
};

const actions = {
  redirectTo({ commit }, payload) {
    commit("redirectTo", payload.val);
  },
};

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {},
});
