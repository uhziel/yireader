import {graphql} from "../../api.js"

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
    const query = `
      query BookSources {
        bookSources {
          id name url enableSearch
        } 
      }`;
    graphql(query).then(res => {
      commit('setBookSources', res.data.data.bookSources);
    }).catch(e => console.error(e));
  },
  addBooksource({commit, dispatch}, payload) {
    const query = `
      mutation CreateBookSource($downloadUrl: String!) {
        createBookSource(downloadUrl: $downloadUrl) {
          id name url version enableSearch
        }
      }`;
    graphql(query, payload).then(res => {
      if (!res.data.errors) {
        dispatch('fetchBookSources');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  deleteBooksource({commit, dispatch}, payload) {
    const query = `
      mutation DeleteBookSource($id: ID!) {
        deleteBookSource(id: $id)
      }`;
    graphql(query, payload).then(res => {
      if (!res.data.errors) {
        dispatch('fetchBookSources');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  moveUpBooksource({commit, dispatch}, payload) {
    const query = `
      mutation MoveUpBookSource($id: ID!) {
        moveUpBookSource(id: $id)
      }`;
    graphql(query, payload).then(res => {
      if (!res.data.errors) {
        dispatch('fetchBookSources');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  moveDownBooksource({commit, dispatch}, payload) {
    const query = `
      mutation MoveDownBookSource($id: ID!) {
        moveDownBookSource(id: $id)
      }`;
    graphql(query, payload).then(res => {
      if (!res.data.errors) {
        dispatch('fetchBookSources');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  enableBooksource({commit, dispatch}, payload) {
    const query = `
      mutation EnableBookSource($id: ID!, $value: Boolean) {
        enableSearchBookSource(id: $id, value: $value)  
      }`;
    graphql(query, payload).then(res => {
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
