import {apiQueryBookSources, apiCreateBookSource, apiDeleteBookSource, apiMoveUpBookSource,
  apiMoveDownBookSource, apiEnableBookSource} from "../../api.js"

const state = () => ({
  all: [],
  error: "",
});

const getters = {
};

const mutations = {
  setBookSources(state, bookSources) {
    state.all = bookSources;
  },
  setError(state, error) {
    state.error = error;
  },
};

const actions = {
  fetchBookSources({commit}) {
    apiQueryBookSources().then(res => {
      commit('setBookSources', res.data.data.bookSources);
    }).catch(e => console.error(e));
  },
  addBooksource({commit, dispatch}, payload) {
    apiCreateBookSource(payload).then(res => {
      if (!res.data.errors) {
        dispatch('fetchBookSources');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  deleteBooksource({commit, dispatch}, payload) {
    apiDeleteBookSource(payload).then(res => {
      if (!res.data.errors) {
        dispatch('fetchBookSources');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  moveUpBooksource({commit, dispatch}, payload) {
    apiMoveUpBookSource(payload).then(res => {
      if (!res.data.errors) {
        dispatch('fetchBookSources');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  moveDownBooksource({commit, dispatch}, payload) {
    apiMoveDownBookSource(payload).then(res => {
      if (!res.data.errors) {
        dispatch('fetchBookSources');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  enableBooksource({commit, dispatch}, payload) {
    apiEnableBookSource(payload).then(res => {
      if (!res.data.errors) {
        dispatch('fetchBookSources');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));    
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};
