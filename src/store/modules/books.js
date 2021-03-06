import {graphql} from "../../api.js"

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
    const query = `
      query Books {
        books {
          id
          inBookshelf
          name
          authorName
          coverUrl
          summary
          contentChanged
          bookSource
          readingChapter {
            index
            name
          }
        }
      }`;
    graphql(query).then(res => {
      if (res.data.data && res.data.data.books) {
        commit('setSimpleBookInfos', res.data.data.books);
      }
    }).catch(e => console.error(e));
  },
  deleteBook({commit, dispatch}, bookSourceId) {
    const query = `
      mutation DeleteBook($id: ID!) {
        deleteBook(id: $id)
      }`;
    const variables = {
        id: bookSourceId,
    };
    graphql(query, variables).then(res => {
      if (!res.data.errors) {
        dispatch('books');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  moveUpBook({commit, dispatch}, bookId) {
    const query = `
      mutation MoveUpBook($id: ID!) {
        moveUpBook(id: $id)
      }`;
    const variables = {
        id: bookId,
    };
    graphql(query, variables).then(res => {
      if (!res.data.errors) {
        dispatch('books');
      } else {
        commit('setError', res.data.errors[0].message);
      }
    }).catch(e => console.error(e));
  },
  moveDownBook({commit, dispatch}, bookId) {
    const query = `
      mutation MoveDownBook($id: ID!) {
        moveDownBook(id: $id)
      }`;
    const variables = {
        id: bookId,
    };
    graphql(query, variables).then(res => {
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
