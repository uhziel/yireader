import {graphql} from "../../api.js"

const state = () => ({
  all: [],
});

const getters = {
};

const mutations = {
  setBookSources(state, bookSources) {
    state.all = bookSources;
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
  deleteBookSource({dispatch}, payload) {
    const query = `
      mutation DeleteBookSource($id: ID!) {
        deleteBookSource(id: $id)
      }`;
    graphql(query, payload).then(res => {
      if (res.data.data && res.data.data.deleteBookSource === true) {
        dispatch('fetchBookSources');
      } else {
        //TODO
      }
    }).catch(e => console.error(e));
  },
  moveUpBooksource({dispatch}, payload) {
    const query = `
      mutation MoveUpBookSource($id: ID!) {
        moveUpBookSource(id: $id)
      }`;
    graphql(query, payload).then(res => {
      if (res.data.data && res.data.data.moveUpBookSource === true) {
        dispatch('fetchBookSources');
      } else {
        //TODO
      }
    }).catch(e => console.error(e));
  },
  moveDownBooksource({dispatch}, payload) {
    const query = `
      mutation MoveDownBookSource($id: ID!) {
        moveDownBookSource(id: $id)
      }`;
    graphql(query, payload).then(res => {
      if (res.data.data && res.data.data.moveDownBookSource === true) {
        dispatch('fetchBookSources');
      } else {
        //TODO
      }
    }).catch(e => console.error(e));
  },
  enableBooksource({dispatch}, payload) {
    const query = `
      mutation EnableBookSource($id: ID!, $value: Boolean) {
        enableSearchBookSource(id: $id, value: $value)  
      }`;
    graphql(query, payload).then(res => {
      if (res.data.data && res.data.data.enableSearchBookSource === true) {
        dispatch('fetchBookSources');
      } else {
        //TODO
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
