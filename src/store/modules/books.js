import {apiQueryBooks, apiDeleteBook, apiMoveUpBook, apiMoveDownBook} from "../../api.js"

const state = () => ({
  all: [],
  error: "",
});

const getters = {
};

const mutations = {
  setSimpleBookInfos(state, simpleBookInfos) {
    state.all = simpleBookInfos;
  },
  setError(state, error) {
    state.error = error;
  },
};

const actions = {
  books({commit}) {
    apiQueryBooks().then(res => {
      if (res.data.data && res.data.data.books) {
        commit('setSimpleBookInfos', res.data.data.books);
      }
    }).catch(e => console.error(e));
  },
  deleteBook({commit, dispatch}, bookSourceId) {
    apiDeleteBook(bookSourceId).then(res => {
      if (!res.data.errors) {
        dispatch('books');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  moveUpBook({commit, dispatch}, bookId) {
    apiMoveUpBook(bookId).then(res => {
      if (!res.data.errors) {
        dispatch('books');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  moveDownBook({commit, dispatch}, bookId) {
    apiMoveDownBook(bookId).then(res => {
      if (!res.data.errors) {
        dispatch('books');
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
