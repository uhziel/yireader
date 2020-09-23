import Vue from 'vue'
import Vuex from 'vuex'
import api from "@/api.js";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    books: {}, //<name-author, { bookDetail: {lastChapter: ""}, bookCatalog: [], bookInfo: {} }>
    userData: { 
      bookshelf: [], //"name-author"...
    }
  },
  getters: {
    getBookByFullName (state) {
      return function (fullName) {
        return state.books[fullName];
      };
    }
  },
  mutations: {
    initStore (state) {
      let userDataStr = localStorage.getItem("userData");
      if (userDataStr) {
        try {
          state.userData = JSON.parse(userDataStr);
        } catch (e) {
          console.error(e);
          localStorage.removeItem("userData");
        }
      }
      for (let i = 0; i < localStorage.length; i++) {
        let bookFullName = localStorage.key(i);
        if (bookFullName.indexOf("-") === -1 || bookFullName === "loglevel:webpack-dev-server") {
          continue;
        }
        let bookStr = localStorage.getItem(bookFullName);
        if (bookStr) {
          try {
            let book = JSON.parse(bookStr);
            Vue.set(state.books, bookFullName, book);
          } catch (e) {
            console.error(e);
            localStorage.removeItem(bookFullName);
          }
        }
      }
    },
    updateBook (state, book) {
      console.log("updateBook ", book);
      let fullName = book.bookInfo.name + "-" + book.bookInfo.author;
      Vue.set(state, fullName, book);
      localStorage.setItem(fullName, JSON.stringify(book));
    },
    addToBookshelf (state, bookFullName) {
      Vue.set(state.userData.bookshelf, state.userData.bookshelf.length, bookFullName);
      localStorage.setItem("userData", JSON.stringify(state.userData));
    }
  },
  actions: {
    async fetchBook ({commit}, bookInfo) {
      try {
        let bookDetail = (await api.detail(bookInfo)).data;
        let bookCatalog = (await api.catalog(bookDetail)).data;
        let book = {
          bookDetail, bookCatalog, bookInfo
        };
        commit("updateBook", book);
      } catch (e) {
        console.error(e);
      }
    }
  },
  modules: {
  }
})
